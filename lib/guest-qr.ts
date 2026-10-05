import type {VenueWifi} from './domain/model';

export type GuestQrRoute=
 |{kind:'wifi';wifi:VenueWifi}
 |{kind:'table';venueId:string;tableId:number;token:string}
 |{kind:'powerbank';terminalId:string}
 |{kind:'invalid'};

const unescapeWifi=(value:string)=>value.replace(/\\([\\;,:])/g,'$1');

function wifiFields(payload:string){
 const body=payload.slice(5);
 const chunks:string[]=[];
 let current='';
 let escaped=false;
 for(const character of body){
  if(escaped){current+=`\\${character}`;escaped=false;continue}
  if(character==='\\'){escaped=true;continue}
  if(character===';'){chunks.push(current);current='';continue}
  current+=character;
 }
 if(current)chunks.push(current);
 return Object.fromEntries(chunks.flatMap(chunk=>{
  const separator=chunk.indexOf(':');
  return separator<0?[]:[[chunk.slice(0,separator).toUpperCase(),unescapeWifi(chunk.slice(separator+1))]];
 }));
}

export function parseWifiQrPayload(payload:string):VenueWifi|null{
 if(!payload.trim().toUpperCase().startsWith('WIFI:'))return null;
 const fields=wifiFields(payload.trim());
 const ssid=fields.S?.trim();
 if(!ssid)return null;
 const rawSecurity=(fields.T||'nopass').toUpperCase();
 const security:VenueWifi['security']=rawSecurity==='WEP'?'WEP':rawSecurity==='NOPASS'?'nopass':rawSecurity==='WPA2'?'WPA2':'WPA';
 return {ssid,password:fields.P??'',security,hidden:/^(true|1|yes)$/i.test(fields.H??'')};
}

export function classifyGuestQrPayload(payload:string):GuestQrRoute{
 const value=payload.trim();
 const wifi=parseWifiQrPayload(value);
 if(wifi)return {kind:'wifi',wifi};
 if(/^MIRA:(POWERBANK|TERMINAL):/i.test(value))return {kind:'powerbank',terminalId:value.split(':').slice(2).join(':')||'demo-terminal'};
 try{
  const url=new URL(value,value.startsWith('/')?'https://mira-link.local':undefined);
  const isMiraRoute=url.protocol==='mira:'||url.pathname.startsWith('/demo/guest');
  if(!isMiraRoute)return {kind:'invalid'};
  const venueId=url.searchParams.get('venueId')?.trim()??'';
  const tableValue=url.searchParams.get('tableId')??'';
  const tableId=/^\d+$/.test(tableValue)?Number(tableValue):0;
  if(venueId&&tableId)return {kind:'table',venueId,tableId,token:url.searchParams.get('token')?.trim()||`mira-table-${tableId}`};
  const terminalId=url.searchParams.get('terminalId')?.trim()??'';
  if(url.searchParams.get('entry')==='terminal'||terminalId)return {kind:'powerbank',terminalId:terminalId||'demo-terminal'};
 }catch{/* Unsupported payload remains invalid. */}
 return {kind:'invalid'};
}
