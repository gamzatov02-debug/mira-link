/** Server-side, opt-in implementation of the supplied Urent v1 contract.
 * This is NOT evidence that EnerGO exposes this contract to MIRA LINK.
 * No payment/withdraw/forced-close commands are implemented.
 */
import {z} from 'zod';
import {timingSafeEqual} from 'node:crypto';
import type {PowerbankProviderAdapter,PowerbankRental,PowerbankStation,PowerbankStationQuery,StartPowerbankRentalRequest} from '../powerbank';

const text=z.string().min(1).max(2048);
const count=z.number().int().nonnegative();
const date=z.string().datetime();
export const stationSchema=z.object({
 stationId:text,stationShortCode:text,stationQr:text,active:z.boolean(),stationOnline:z.boolean(),visible:z.boolean(),
 emptySlotsCount:count,availableDevicesCount:count,locationName:text,locationAddress:text,
 guide:z.string().optional(),latitude:z.number().min(-90).max(90),longitude:z.number().min(-180).max(180),
});
export const sessionSchema=z.object({
 sessionId:z.number().int().positive().safe(),deviceId:text.nullable(),
 status:z.enum(['Preparation','Active','Preclosed','Closed']),statusCode:z.number().int().min(0).max(4),
 createdDate:date,startDate:date.nullable(),endDate:date.nullable(),startStationId:text,endStationId:text.nullable(),
}).superRefine((s,ctx)=>{
 const valid=s.status==='Preparation'?s.statusCode===0:s.status==='Active'?s.statusCode===1:
  s.status==='Closed'?[2,3,4].includes(s.statusCode):[1,2,4].includes(s.statusCode);
 if(!valid||(s.status==='Active'&&(!s.startDate||!s.deviceId))||(s.status==='Closed'&&!s.endDate)||
  (s.statusCode===2&&!s.endStationId))ctx.addIssue({code:'custom',message:'Inconsistent session state'});
});
export type EnergoSession=z.infer<typeof sessionSchema>;
type Station=z.infer<typeof stationSchema>;
export class EnergoError extends Error{
 constructor(readonly code:string,readonly httpStatus?:number){super(code);this.name='EnergoError'}
}
export type Operation={key:string;guest:string;station:string;session?:EnergoSession};
/** Implementations must persist claims BEFORE dispatch, atomically enforce key payload
 * identity and one unfinished operation per guest, and merge sessions monotonically.
 * An unresolved claim must NEVER be deleted/expired automatically or redispatched.
 */
export interface EnergoJournal{
 claim(operation:Operation):Promise<{created:boolean;operation:Operation}>;
 save(key:string,session:EnergoSession):Promise<EnergoSession>;
 findSession(id:number):Promise<Operation|undefined>;
}
export function mergeEnergoSession(previous:EnergoSession|undefined,next:EnergoSession){
 if(!previous)return next;
 if(previous.sessionId!==next.sessionId||previous.startStationId!==next.startStationId)throw new EnergoError('SESSION_MISMATCH');
 if(previous.status==='Closed'){
  if(next.status==='Closed'&&JSON.stringify(previous)!==JSON.stringify(next))throw new EnergoError('TERMINAL_STATE_CONFLICT');
  return previous;
 }
 const rank={Preparation:0,Active:1,Preclosed:2,Closed:3};
 return rank[next.status]<rank[previous.status]?previous:next;
}
export type EnergoConfig={
 baseUrl:string;token:string;callbackToken:string;
 /** No implicit production mode. Production dispatch remains disabled in this module. */
 mode:'sandbox'|'production';contractConfirmed:boolean;sandboxDispatchEnabled?:boolean;
 venueByStation?:Readonly<Record<string,string>>;
 timeoutMs?:number;readRetries?:number;
};
export class EnergoPowerbankProviderAdapter implements PowerbankProviderAdapter{
 readonly provider={id:'energo',name:'EnerGO',adapterType:'energo-urent-v1',status:'available' as const,enabled:true,demo:false};
 private readonly config:EnergoConfig;
 private readonly base:string;
 constructor(config:EnergoConfig,private readonly journal:EnergoJournal,private readonly transport:typeof fetch=fetch){
  if(typeof window!=='undefined')throw new EnergoError('SERVER_ONLY');
  const url=new URL(config.baseUrl);
  if(url.protocol!=='https:'||url.username||url.password||url.search||url.hash||url.pathname!=='/')throw new EnergoError('INVALID_BASE_URL');
  if(!config.contractConfirmed||!config.token||!config.callbackToken)throw new EnergoError('CONNECTION_NOT_APPROVED');
  this.config={...config,venueByStation:{...config.venueByStation}};this.base=url.origin;
 }
 private async request(path:string,method:'GET'|'POST'='GET',body?:unknown):Promise<unknown>{
  const retries=method==='GET'?Math.min(3,Math.max(0,this.config.readRetries??2)):0;
  for(let attempt=0;;attempt++){
   const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),this.config.timeoutMs??(method==='GET'?16000:45000));
   try{
    const response=await this.transport(this.base+path,{method,headers:{Authorization:this.config.token,'Content-Type':'application/json'},
     body:body===undefined?undefined:JSON.stringify(body),signal:controller.signal,redirect:'error',cache:'no-store'});
    if(!response.ok)throw new EnergoError('PROVIDER_HTTP_ERROR',response.status);
    try{return await response.json()}catch{throw new EnergoError('INVALID_PROVIDER_RESPONSE')}
   }catch(error){
    const retryable=!(error instanceof EnergoError)||[502,503,504].includes(error.httpStatus??0);
    if(attempt>=retries||!retryable)throw error instanceof EnergoError?error:new EnergoError('PROVIDER_NETWORK_ERROR');
   }finally{clearTimeout(timer)}
   await new Promise(resolve=>setTimeout(resolve,100*2**attempt));
  }
 }
 private parse<T>(schema:z.ZodType<T>,value:unknown):T{
  const parsed=schema.safeParse(value);if(!parsed.success)throw new EnergoError('INVALID_PROVIDER_RESPONSE');return parsed.data;
 }
 private station(s:Station):PowerbankStation{
  return {id:s.stationId,terminalQr:s.stationQr,providerId:'energo',venueId:this.config.venueByStation?.[s.stationId],
   venueName:s.locationName,title:s.locationName,locationLabel:s.guide||s.locationAddress,
   availableUnits:s.availableDevicesCount,returnSlots:s.emptySlotsCount,compatibleProviderIds:['energo'],
   status:!s.active?'closed':!s.stationOnline?'unavailable':s.availableDevicesCount>0?'available':'empty'};
 }
 private rental(s:EnergoSession):PowerbankRental{
  return {id:String(s.sessionId),providerId:'energo',stationId:s.startStationId,deviceDisplayNumber:s.deviceId??undefined,
   startedAt:s.startDate??undefined,status:s.status==='Closed'?(s.statusCode===2?'returned':s.statusCode===3?'failed':'closed'):
    s.status==='Preparation'?'preparing':s.status==='Preclosed'?'returning':'active',compatibleProviderIds:['energo']};
 }
 async getStations(query:PowerbankStationQuery){
  const stations=this.parse(z.array(stationSchema),await this.request('/v1/public/map'));
  if(new Set(stations.map(s=>s.stationId)).size!==stations.length)throw new EnergoError('DUPLICATE_STATION');
  return stations.filter(s=>s.visible).map(s=>this.station(s)).filter(s=>query.nearby||!query.venueId||s.venueId===query.venueId);
 }
 private async rawStation(id:string){
  try{
   const station=this.parse(stationSchema,await this.request('/v1/public/map/station/'+encodeURIComponent(id)));
   if(station.stationId!==id)throw new EnergoError('STATION_MISMATCH');return station;
  }catch(error){if(error instanceof EnergoError&&error.httpStatus===404)return undefined;throw error}
 }
 async getStation(id:string){const s=await this.rawStation(id);return s?.visible?this.station(s):undefined}
 async getAvailability(id:string){const s=await this.getStation(id);return s?{availableUnits:s.availableUnits,returnSlots:s.returnSlots,status:s.status}:undefined}
 // The supplied contract has no tariff endpoint. Never reuse demo prices.
 async getTariff(_id:string){void _id;return undefined}
 async resolveTerminal(qr:string){
  // Opaque exact comparison: never fetch the QR URL or guess a terminal from venue.
  const matches=(await this.getStations({nearby:true})).filter(s=>s.terminalQr===qr);
  if(matches.length!==1)throw new EnergoError(matches.length?'AMBIGUOUS_TERMINAL':'TERMINAL_NOT_FOUND');return matches[0];
 }
 async startRental(request:StartPowerbankRentalRequest){
  if(this.config.mode!=='sandbox'||!this.config.sandboxDispatchEnabled)throw new EnergoError('DISPATCH_DISABLED');
  const {stationId,guestReference,idempotencyKey}=request;
  if(!guestReference||!idempotencyKey||idempotencyKey.length>128)throw new EnergoError('REQUEST_IDENTITY_REQUIRED');
  // Claim first: replays must not depend on station availability after a successful dispatch.
  const claim=await this.journal.claim({key:idempotencyKey,guest:guestReference,station:stationId});
  if(!claim.created){if(claim.operation.session)return this.rental(claim.operation.session);throw new EnergoError('RECONCILIATION_REQUIRED')}
  const station=await this.rawStation(stationId);
  if(!station?.visible||!station.active||!station.stationOnline||station.availableDevicesCount===0)throw new EnergoError('STATION_UNAVAILABLE');
  // Exactly one attempt. activityId is correlation, NOT a documented idempotency guarantee.
  try{
   const s=this.parse(sessionSchema,await this.request('/v1/public/sessions','POST',{stationShortCode:station.stationShortCode,activityId:idempotencyKey}));
   if(s.startStationId!==stationId)throw new EnergoError('STATION_MISMATCH');
   return this.rental(await this.journal.save(idempotencyKey,s));
  }catch{throw new EnergoError('RECONCILIATION_REQUIRED')}
 }
 async getRental(id:string){
  const numeric=Number(id);if(!Number.isSafeInteger(numeric)||numeric<=0)throw new EnergoError('INVALID_SESSION_ID');
  const operation=await this.journal.findSession(numeric);
  if(!operation) return undefined; // Never import another client's rental through a guessed ID.
  if(operation.session?.status==='Closed')return this.rental(operation.session);
  let s:EnergoSession;
  try{s=this.parse(sessionSchema,await this.request('/v1/public/sessions/'+numeric))}
  catch(error){if(error instanceof EnergoError&&error.httpStatus===409)throw new EnergoError('RECONCILIATION_REQUIRED');throw error}
  if(s.sessionId!==numeric)throw new EnergoError('SESSION_MISMATCH');
  return this.rental(await this.journal.save(operation.key,s));
 }
 async getReturnStations(rental:PowerbankRental){
  if(rental.providerId!=='energo'||!rental.compatibleProviderIds.includes('energo'))return [];
  return (await this.getStations({nearby:true})).filter(s=>(s.returnSlots??0)>0&&(s.status==='available'||s.status==='empty'));
 }
 /** Call only from a server PUT endpoint; acknowledge 200 only after durable save.
  * Unknown sessions (including callback-before-start-response) must be retried/queued,
  * never associated by station or guest guessing. No billing is triggered here.
  */
 async handleCallback(authorization:string,body:unknown){
  const actual=Buffer.from(authorization),expected=Buffer.from(this.config.callbackToken);
  if(actual.length!==expected.length||!timingSafeEqual(actual,expected))throw new EnergoError('INVALID_CALLBACK_TOKEN');
  const s=this.parse(sessionSchema,body),operation=await this.journal.findSession(s.sessionId);
  if(!operation)throw new EnergoError('UNKNOWN_SESSION_RETRY_REQUIRED');
  return this.rental(await this.journal.save(operation.key,s));
 }
}
