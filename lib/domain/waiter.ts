import type {Employee,EmployeeAuthContext,EmployeeRole,OperationalActorContext,Order,Payment,Shift,ShiftAssignment,StaffCall,State,Table,Zone} from './model';

const ensure:(value:unknown,message:string)=>asserts value=(value,message)=>{if(!value)throw new Error(message)};

export const hasEmployeeRole=(employee:Employee,role:EmployeeRole)=>employee.roles.includes(role);
export const hasVenueAccess=(employee:Employee,venueId:string)=>employee.venueAccess.some(access=>access.venueId===venueId);

export const getEmployeeAuthContext=(state:State,id:string)=>state.employeeAuthContexts.find(context=>context.id===id&&context.status==='authenticated');
export const getActiveShift=(state:State,employeeId:string,venueId:string)=>state.shifts.find(shift=>shift.employeeId===employeeId&&shift.venueId===venueId&&shift.status==='open');
export const getShiftAssignment=(state:State,shiftId:string)=>state.shiftAssignments.find(assignment=>assignment.shiftId===shiftId);

export function getActionableTableIds(state:State,shiftId:string){
 const shift=state.shifts.find(item=>item.id===shiftId);
 ensure(shift,'Смена не найдена');
 const assignment=getShiftAssignment(state,shift.id)??{shiftId:shift.id,zoneIds:[],tableIds:[]};
 const ids=new Set<number>(assignment.tableIds);
 for(const table of state.tables)if(assignment.zoneIds.includes(table.zoneId))ids.add(table.id);
 return ids;
}

const tableForOrder=(state:State,order:Order)=>state.sessions.find(session=>session.id===order.sessionId)?.tableId;
const tableForPayment=(state:State,payment:Payment)=>state.sessions.find(session=>session.id===payment.sessionId)?.tableId;
const terminalOrder=(order:Order)=>['served','completed','cancelled'].includes(order.executionStatus);

export type ShiftBlockingObligations={
 canEndShift:boolean;
 orderIds:string[];
 callIds:string[];
 cashPaymentIds:string[];
};

export function getShiftBlockingObligations(state:State,shiftId:string):ShiftBlockingObligations{
 const shift=state.shifts.find(item=>item.id===shiftId);
 ensure(shift,'Смена не найдена');
 const actionable=getActionableTableIds(state,shift.id);
 const orderIds=state.orders.filter(order=>{
  const tableId=tableForOrder(state,order);
  return !terminalOrder(order)&&(order.placedByWaiterId===shift.employeeId||(tableId!==undefined&&actionable.has(tableId)));
 }).map(order=>order.id);
 const callIds=state.calls.filter(call=>call.type==='waiter'&&call.status!=='completed'&&actionable.has(call.tableId)).map(call=>call.id);
 const cashPaymentIds=state.payments.filter(payment=>{
  const tableId=tableForPayment(state,payment);
  return payment.method==='cash'&&payment.status==='pending'&&(payment.waiterId===shift.employeeId||(tableId!==undefined&&actionable.has(tableId)));
 }).map(payment=>payment.id);
 return {canEndShift:orderIds.length===0&&callIds.length===0&&cashPaymentIds.length===0,orderIds,callIds,cashPaymentIds};
}

export type WaiterWorkspace={
 authContext:EmployeeAuthContext;
 employee:Employee;
 venue:State['venue'];
 shift:Shift;
 assignment:ShiftAssignment;
 assignedZones:Zone[];
 assignedTables:Table[];
 actionableTables:Table[];
 readOnlyTables:Table[];
 orders:Order[];
 calls:StaffCall[];
 pendingCashPayments:Payment[];
 obligations:ShiftBlockingObligations;
};

export function getWaiterWorkspace(state:State,authContextId:string):WaiterWorkspace{
 const authContext=getEmployeeAuthContext(state,authContextId);
 ensure(authContext,'Сотрудник не авторизован');
 const employee=state.employees.find(item=>item.id===authContext.employeeId);
 ensure(employee&&employee.status==='active','Сотрудник недоступен');
 ensure(hasEmployeeRole(employee,'waiter'),'Необходима роль официанта');
 ensure(hasVenueAccess(employee,authContext.activeVenueId),'Нет доступа к заведению');
 ensure(state.venue.id===authContext.activeVenueId,'Заведение не загружено');
 const shift=getActiveShift(state,employee.id,authContext.activeVenueId);
 ensure(shift,'Сначала откройте смену');
 const assignment=getShiftAssignment(state,shift.id)??{shiftId:shift.id,zoneIds:[],tableIds:[]};
 const venueZones=state.zones.filter(zone=>zone.venueId===state.venue.id);
 const venueZoneIds=new Set(venueZones.map(zone=>zone.id));
 const venueTables=state.tables.filter(table=>venueZoneIds.has(table.zoneId));
 const actionableIds=getActionableTableIds(state,shift.id);
 const actionableTables=venueTables.filter(table=>actionableIds.has(table.id));
 const readOnlyTables=venueTables.filter(table=>!actionableIds.has(table.id));
 const orders=state.orders.filter(order=>{const tableId=tableForOrder(state,order);return tableId!==undefined&&actionableIds.has(tableId)});
 const calls=state.calls.filter(call=>call.type==='waiter'&&call.status!=='completed'&&actionableIds.has(call.tableId));
 const pendingCashPayments=state.payments.filter(payment=>{const tableId=tableForPayment(state,payment);return payment.method==='cash'&&payment.status==='pending'&&tableId!==undefined&&actionableIds.has(tableId)});
 return {authContext,employee,venue:state.venue,shift,assignment,assignedZones:venueZones.filter(zone=>assignment.zoneIds.includes(zone.id)),assignedTables:venueTables.filter(table=>assignment.tableIds.includes(table.id)),actionableTables,readOnlyTables,orders,calls,pendingCashPayments,obligations:getShiftBlockingObligations(state,shift.id)};
}

export type WaiterActor={authContext:EmployeeAuthContext;employee:Employee;shift:Shift;assignment:ShiftAssignment;table?:Table};

export function validateWaiterActor(state:State,input:{authContextId:string;shiftId?:string;tableId?:number}):WaiterActor{
 const authContext=getEmployeeAuthContext(state,input.authContextId);
 ensure(authContext,'Сотрудник не авторизован');
 const employee=state.employees.find(item=>item.id===authContext.employeeId);
 ensure(employee&&employee.status==='active','Сотрудник недоступен');
 ensure(hasEmployeeRole(employee,'waiter'),'Необходима роль официанта');
 ensure(hasVenueAccess(employee,authContext.activeVenueId),'Нет доступа к заведению');
 ensure(state.venue.id===authContext.activeVenueId,'Заведение не загружено');
 const shift=getActiveShift(state,employee.id,authContext.activeVenueId);
 ensure(shift,'Для действия нужна активная смена');
 ensure(!input.shiftId||input.shiftId===shift.id,'Выбрана другая смена');
 const assignment=getShiftAssignment(state,shift.id)??{shiftId:shift.id,zoneIds:[],tableIds:[]};
 let table:Table|undefined;
 if(input.tableId!==undefined){
  table=state.tables.find(item=>item.id===input.tableId);
  ensure(table,'Стол не найден');
  const zone=state.zones.find(item=>item.id===table!.zoneId);
  ensure(zone?.venueId===authContext.activeVenueId,'Стол относится к другому заведению');
  ensure(getActionableTableIds(state,shift.id).has(table.id),'Стол доступен только для просмотра');
 }
 return {authContext,employee,shift,assignment,table};
}

export function validateOperationalActor(state:State,context:OperationalActorContext,tableId?:number):WaiterActor{
 ensure(context&&typeof context.authContextId==='string'&&typeof context.shiftId==='string'&&typeof context.employeeId==='string'&&typeof context.venueId==='string','Не указан operational actor');
 const actor=validateWaiterActor(state,{authContextId:context.authContextId,shiftId:context.shiftId,tableId});
 ensure(actor.employee.id===context.employeeId,'Контекст принадлежит другому сотруднику');
 ensure(actor.shift.venueId===context.venueId&&actor.authContext.activeVenueId===context.venueId,'Контекст относится к другому заведению');
 return actor;
}
