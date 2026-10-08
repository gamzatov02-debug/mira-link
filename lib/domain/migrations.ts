import type {EmployeeRole,State,Zone} from './model';
import {createDemoVenueEvents} from '../events';

type MutableRecord=Record<string,any>;

const array=(value:unknown)=>Array.isArray(value)?value:[];
const role=(value:unknown):EmployeeRole=>value==='admin'?'admin':'waiter';

/**
 * The single persisted-state normalization path. It upgrades the Stage 6 v1
 * demo state and also fills optional collections introduced by later v2 code.
 */
export function normalizeState(input:unknown):State{
 if(!input||typeof input!=='object')throw new Error('Некорректное состояние демо');
 const source=structuredClone(input) as MutableRecord;
 if(source.version!==1&&source.version!==2)throw new Error('Неподдерживаемая версия состояния');
 if(!source.venue||typeof source.venue.id!=='string')throw new Error('Заведение не найдено');

 const venueId=source.venue.id as string;
 const organizationId=typeof source.venue.organizationId==='string'?source.venue.organizationId:'org-mira';
 source.organizations=array(source.organizations);
 if(!source.organizations.some((item:MutableRecord)=>item?.id===organizationId))source.organizations.push({id:organizationId,name:'MIRA LINK Demo Organization'});
 source.venue={
  ...source.venue,
  organizationId,
  timeZone:typeof source.venue.timeZone==='string'?source.venue.timeZone:'Europe/Moscow',
  wifi:source.venue.wifi&&typeof source.venue.wifi.ssid==='string'
   ?source.venue.wifi
   :{ssid:'MIRA_GUEST',password:'mira2026',security:'WPA'},
 };

 const defaultZones:Zone[]=[
  {id:'zone-main',venueId,name:'Основной зал'},
  {id:'zone-terrace',venueId,name:'Терраса'},
 ];
 source.zones=array(source.zones);
 if(!source.zones.length)source.zones=defaultZones;
 source.tables=array(source.tables).map((table:MutableRecord)=>({
  ...table,
  zoneId:typeof table.zoneId==='string'?table.zoneId:(Number(table.id)<=6?'zone-main':'zone-terrace'),
 }));

 source.employees=array(source.employees).map((employee:MutableRecord)=>{
  const legacyRole=role(employee.role);
  const roles=array(employee.roles).filter((item:unknown):item is EmployeeRole=>item==='waiter'||item==='admin');
  const canonicalRoles=roles.length?Array.from(new Set(roles)):[legacyRole];
  const tables=array(employee.tables).filter((item:unknown)=>Number.isInteger(item));
  const derivedTables=tables.length?tables:source.tables.filter((table:MutableRecord)=>table.waiterId===employee.id).map((table:MutableRecord)=>table.id);
  const venueAccess=array(employee.venueAccess).filter((item:MutableRecord)=>typeof item?.venueId==='string');
  return {
   ...employee,
   organizationId:typeof employee.organizationId==='string'?employee.organizationId:organizationId,
   venueAccess:venueAccess.length?venueAccess:[{venueId}],
   roles:canonicalRoles,
   status:employee.status==='inactive'?'inactive':'active',
   role:canonicalRoles[0],
   shift:typeof employee.shift==='string'?employee.shift:'',
   tables:derivedTables,
  };
 });

 source.employeeAuthContexts=array(source.employeeAuthContexts);
 source.shifts=array(source.shifts);
 source.shiftAssignments=array(source.shiftAssignments);
 source.config={
  ...source.config,
  commissionRate:Number.isFinite(source.config?.commissionRate)?source.config.commissionRate:0,
  tipCommissionRate:Number.isFinite(source.config?.tipCommissionRate)?source.config.tipCommissionRate:(Number.isFinite(source.config?.additionalTipCommissionRate)?source.config.additionalTipCommissionRate:0),
  additionalTipCommissionRate:Number.isFinite(source.config?.additionalTipCommissionRate)?source.config.additionalTipCommissionRate:0,
  demoMode:source.config?.demoMode!==false,
 };
 source.payments=array(source.payments).map((payment:MutableRecord)=>({...payment,tipCommission:Number.isSafeInteger(payment.tipCommission)?payment.tipCommission:0}));
 source.financialSplits=array(source.financialSplits).map((split:MutableRecord)=>({...split,tipCommissionShare:Number.isSafeInteger(split.tipCommissionShare)?split.tipCommissionShare:0}));
 source.rentals=array(source.rentals);
 source.deliveries=array(source.deliveries);
 source.favorites=array(source.favorites);
 const storedVenueEvents=Array.isArray(source.venueEvents)?source.venueEvents:null;
 const demoCatalogueExpired=Boolean(storedVenueEvents?.length&&storedVenueEvents.every((item:MutableRecord)=>item?.demo===true)&&storedVenueEvents.every((item:MutableRecord)=>Date.parse(item.startsAt)<=Date.now()));
 source.venueEvents=!storedVenueEvents||demoCatalogueExpired?createDemoVenueEvents(new Date(),venueId,source.venue.timeZone):storedVenueEvents;
 source.version=2;
 return source as State;
}
