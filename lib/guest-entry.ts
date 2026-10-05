export type GuestEntryContext=
 |{kind:'table';venueId:string;tableId:number;token:string}
 |{kind:'terminal';terminalId:string}
 |{kind:'venue';venueId:string}
 |{kind:'route';page:string}
 |{kind:'default'};

export function resolveGuestEntry(initialPage:string,search:string):GuestEntryContext{
 const params=new URLSearchParams(search);
 const entryType=params.get('entry')??params.get('type');
 const venueId=params.get('venueId')?.trim()??'';
 const tableValue=params.get('tableId');
 const tableId=tableValue&&/^\d+$/.test(tableValue)?Number(tableValue):0;
 if(venueId&&tableId&&(entryType==='table'||params.has('tableId'))){
  return {kind:'table',venueId,tableId,token:params.get('token')?.trim()||`mira-table-${tableId}`};
 }
 const terminalId=params.get('terminalId')?.trim()??'';
 if(entryType==='terminal'||terminalId)return {kind:'terminal',terminalId:terminalId||'demo-terminal'};
 if(venueId)return {kind:'venue',venueId};
 if(initialPage&&initialPage!=='welcome')return {kind:'route',page:initialPage};
 return {kind:'default'};
}
