import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {EnergoPowerbankProviderAdapter,sessionSchema,type EnergoSession} from '../../lib/powerbank/energo.server';
import {SqliteEnergoJournal} from '../../lib/powerbank/sqlite-journal.server';
import {createDemoPowerbankService,resolvePowerbankTerminal} from '../../lib/powerbank';
const station={stationId:'S1',stationShortCode:'SHORT1',stationQr:'https://qr.example/S1',active:true,stationOnline:true,visible:true,
 emptySlotsCount:2,availableDevicesCount:3,locationName:'Venue',locationAddress:'Address',latitude:42,longitude:48};
const session:EnergoSession={sessionId:1042,deviceId:null,status:'Preparation',statusCode:0,createdDate:'2026-05-05T10:05:00Z',startDate:null,endDate:null,startStationId:'S1',endStationId:null};
const active:EnergoSession={...session,status:'Active',statusCode:1,deviceId:'P1',startDate:'2026-05-05T10:05:10Z'};
const returned:EnergoSession={...active,status:'Closed',statusCode:2,endDate:'2026-05-05T11:05:00Z',endStationId:'S2'};
const config={baseUrl:'https://sandbox.example',token:'secret',callbackToken:'callback',contractConfirmed:true,mode:'sandbox' as const,sandboxDispatchEnabled:true,readRetries:0};
const request={stationId:'S1',guestReference:'guest1',idempotencyKey:'activity1'};
function setup(t:{after:(fn:()=>void)=>void},handler?:(path:string,init:RequestInit)=>Response|Promise<Response>){
 const journal=new SqliteEnergoJournal(':memory:');t.after(()=>journal.close());
 const calls:{path:string;init:RequestInit}[]=[];
 const transport=(async(url,init={})=>{const path=new URL(String(url)).pathname;calls.push({path,init});
  return handler?handler(path,init):Response.json(path==='/v1/public/map'?[station]:path.includes('/map/')?station:session);
 }) as typeof fetch;
 return {adapter:new EnergoPowerbankProviderAdapter(config,journal,transport),journal,calls,transport};
}
test('map/availability, explicit venue binding, opaque QR, no fabricated price',async t=>{
 const x=setup(t);const stations=await x.adapter.getStations({nearby:true});
 assert.equal(stations[0].availableUnits,3);assert.equal(stations[0].tariff,undefined);assert.equal(await x.adapter.getTariff('S1'),undefined);
 assert.equal((await x.adapter.getStations({venueId:'unknown'})).length,0);
 assert.equal((await x.adapter.resolveTerminal(station.stationQr)).id,'S1');
 await assert.rejects(x.adapter.resolveTerminal('https://evil.example'),/TERMINAL_NOT_FOUND/);
 assert.ok(x.calls.every(c=>c.path==='/v1/public/map'));assert.equal((await x.adapter.getAvailability('S1'))?.returnSlots,2);
});
test('unknown/ambiguous QR, hidden and offline stations fail closed',async t=>{
 const x=setup(t,()=>Response.json([station,{...station,stationId:'S2'}]));
 await assert.rejects(x.adapter.resolveTerminal(station.stationQr),/AMBIGUOUS_TERMINAL/);
 const y=setup(t,()=>Response.json([{...station,visible:false}]));assert.deepEqual(await y.adapter.getStations({nearby:true}),[]);
 const z=setup(t,()=>Response.json({...station,stationOnline:false}));await assert.rejects(z.adapter.startRental(request),/STATION_UNAVAILABLE/);
 assert.equal(z.calls.filter(c=>c.init.method==='POST').length,0);
});
test('dispatch uses short code and activityId, never auto-retries or duplicates concurrent calls',async t=>{
 const x=setup(t);const results=await Promise.allSettled([x.adapter.startRental(request),x.adapter.startRental(request)]);
 assert.equal(results.filter(r=>r.status==='fulfilled').length,1);
 assert.equal((await x.adapter.startRental(request)).status,'preparing');
 const posts=x.calls.filter(c=>c.init.method==='POST');assert.equal(posts.length,1);
 assert.deepEqual(JSON.parse(String(posts[0].init.body)),{stationShortCode:'SHORT1',activityId:'activity1'});
 assert.equal((posts[0].init.headers as Record<string,string>).Authorization,'secret');assert.equal(posts[0].init.redirect,'error');
 await assert.rejects(x.adapter.startRental({...request,stationId:'S2'}),/IDEMPOTENCY_CONFLICT/);
 await assert.rejects(x.adapter.startRental({...request,idempotencyKey:'another'}),/GUEST_RENTAL_UNRESOLVED/);
});
test('network failure after dispatch is unknown, blocked for same and new key',async t=>{
 const x=setup(t,(path,init)=>{if(init.method==='POST')throw Error('secret network details');return Response.json(station)});
 await assert.rejects(x.adapter.startRental(request),/RECONCILIATION_REQUIRED/);
 await assert.rejects(x.adapter.startRental(request),/RECONCILIATION_REQUIRED/);
 await assert.rejects(x.adapter.startRental({...request,idempotencyKey:'another'}),/GUEST_RENTAL_UNRESOLVED/);
 assert.equal(x.calls.filter(c=>c.init.method==='POST').length,1);
});
test('production and default sandbox dispatch disabled before network calls',async t=>{
 const x=setup(t);
 for(const cfg of [{...config,mode:'production' as const},{...config,sandboxDispatchEnabled:false}]){
  const adapter=new EnergoPowerbankProviderAdapter(cfg,x.journal,x.transport);
  await assert.rejects(adapter.startRental(request),/DISPATCH_DISABLED/);
 }
 assert.equal(x.calls.length,0);
 assert.throws(()=>new EnergoPowerbankProviderAdapter({...config,contractConfirmed:false},x.journal),/CONNECTION_NOT_APPROVED/);
 assert.throws(()=>new EnergoPowerbankProviderAdapter({...config,baseUrl:'http://example.com'},x.journal),/INVALID_BASE_URL/);
});
test('callback authenticates, persists, deduplicates and ignores regressive status; never charges',async t=>{
 const x=setup(t);await x.adapter.startRental(request);
 await assert.rejects(x.adapter.handleCallback('wrong',active),/INVALID_CALLBACK_TOKEN/);
 assert.equal((await x.adapter.handleCallback('callback',active)).status,'active');
 assert.equal((await x.adapter.handleCallback('callback',returned)).status,'returned');
 assert.equal((await x.adapter.handleCallback('callback',returned)).status,'returned');
 assert.equal((await x.adapter.handleCallback('callback',active)).status,'returned');
 assert.equal((await x.adapter.getRental('1042'))?.status,'returned');
 assert.equal(x.calls.filter(c=>c.init.method==='POST').length,1);assert.ok(x.calls.every(c=>!c.path.includes('withdraw')));
 await assert.rejects(x.adapter.handleCallback('callback',{...returned,statusCode:4}),/TERMINAL_STATE_CONFLICT/);
});
test('callback arriving before start response is not silently accepted',async t=>{
 const x=setup(t);await assert.rejects(x.adapter.handleCallback('callback',active),/UNKNOWN_SESSION_RETRY_REQUIRED/);
 assert.equal(await x.adapter.getRental('1042'),undefined);
});
test('statusCode is a reason, not status enum: failed issue and partner closure are not physical return',async t=>{
 for(const [code,expected] of [[3,'failed'],[4,'closed']] as const){
  const x=setup(t);await x.adapter.startRental(request);
  assert.equal((await x.adapter.handleCallback('callback',{...session,status:'Closed',statusCode:code,endDate:'2026-05-05T11:05:00Z'})).status,expected);
 }
 assert.equal(sessionSchema.safeParse({...session,status:'Active',statusCode:2}).success,false);
});
test('polling confirms session identity and treats 409 as unresolved',async t=>{
 const x=setup(t,(path,init)=>Response.json(init.method==='POST'?session:path.includes('/map/')?station:active));
 await x.adapter.startRental(request);assert.equal((await x.adapter.getRental('1042'))?.status,'active');
 const y=setup(t,(path,init)=>path.endsWith('/1042')?new Response(null,{status:409}):Response.json(init.method==='POST'?session:station));
 await y.adapter.startRental(request);await assert.rejects(y.adapter.getRental('1042'),/RECONCILIATION_REQUIRED/);
});
test('rejects malformed counts and station/session identity mismatch',async t=>{
 const x=setup(t,()=>Response.json([{...station,availableDevicesCount:-1}]));await assert.rejects(x.adapter.getStations({}),/INVALID_PROVIDER_RESPONSE/);
 const y=setup(t,()=>Response.json({...station,stationId:'S2'}));await assert.rejects(y.adapter.getStation('S1'),/STATION_MISMATCH/);
});
test('return stations include empty dispensers with free slots, exclude closed/offline/incompatible',async t=>{
 const x=setup(t,()=>Response.json([station,{...station,stationId:'S2',availableDevicesCount:0},{...station,stationId:'S3',active:false},{...station,stationId:'S4',stationOnline:false}]));
 const rental={id:'1',stationId:'S1',providerId:'energo',status:'active' as const,compatibleProviderIds:['energo']};
 assert.deepEqual((await x.adapter.getReturnStations(rental)).map(s=>s.id),['S1','S2']);
 assert.deepEqual(await x.adapter.getReturnStations({...rental,providerId:'another'}),[]);
});
test('durable claim survives restart and is shared across two journal connections',async()=>{
 const dir=mkdtempSync(join(tmpdir(),'energo-'));const file=join(dir,'journal.db');
 const a=new SqliteEnergoJournal(file),b=new SqliteEnergoJournal(file);
 try{
  assert.equal((await a.claim({key:'k',guest:'g',station:'S1'})).created,true);
  assert.equal((await b.claim({key:'k',guest:'g',station:'S1'})).created,false);
  await assert.rejects(b.claim({key:'other',guest:'g',station:'S1'}),/GUEST_RENTAL_UNRESOLVED/);
  await a.save('k',session);await b.save('k',returned);
 }finally{a.close();b.close()}
 const c=new SqliteEnergoJournal(file);
 try{assert.equal((await c.findSession(1042))?.session?.status,'Closed');assert.equal((await c.claim({key:'k',guest:'g',station:'S1'})).created,false)}
 finally{c.close();rmSync(dir,{recursive:true,force:true})}
});
test('demo QR is explicitly bound and never picks first venue station',async()=>{
 const service=createDemoPowerbankService(),stations=await service.getStations({nearby:true});
 assert.equal(resolvePowerbankTerminal(stations,'demo-terminal')?.id,'energo-mira-entry');
 assert.equal(resolvePowerbankTerminal(stations,'wrong'),undefined);
 assert.equal(resolvePowerbankTerminal(stations,'energo-garden-return')?.id,'energo-garden-return');
});

test('read retry is bounded; auth errors are not retried',async t=>{
 let calls=0;const x=setup(t,()=>++calls<3?new Response(null,{status:503}):Response.json([station]));
 const adapter=new EnergoPowerbankProviderAdapter({...config,readRetries:2},x.journal,x.transport);
 assert.equal((await adapter.getStations({})).length,1);assert.equal(calls,3);
 const y=setup(t,()=>new Response(null,{status:401}));
 await assert.rejects(new EnergoPowerbankProviderAdapter({...config,readRetries:3},y.journal,y.transport).getStations({}),/PROVIDER_HTTP_ERROR/);
 assert.equal(y.calls.length,1);
});
test('dispatch timeout aborts request and keeps durable claim unresolved',async t=>{
 const x=setup(t,(_path,init)=>init.method==='POST'?new Promise((_resolve,reject)=>init.signal!.addEventListener('abort',()=>reject(Error('aborted')))):Response.json(station));
 const adapter=new EnergoPowerbankProviderAdapter({...config,timeoutMs:5},x.journal,x.transport);
 await assert.rejects(adapter.startRental(request),/RECONCILIATION_REQUIRED/);
 await assert.rejects(adapter.startRental(request),/RECONCILIATION_REQUIRED/);
 assert.equal(x.calls.filter(c=>c.init.method==='POST').length,1);
});
test('blank terminal identifiers never resolve to the demo terminal',async()=>{
 const {classifyGuestQrPayload}=await import('../../lib/guest-qr');
 const {resolveGuestEntry}=await import('../../lib/guest-entry');
 assert.equal(classifyGuestQrPayload('MIRA:TERMINAL:').kind,'invalid');
 assert.equal(classifyGuestQrPayload('/demo/guest/powerbank?entry=terminal').kind,'invalid');
 assert.deepEqual(resolveGuestEntry('powerbank','?entry=terminal'),{kind:'route',page:'powerbank'});
});
