import type {State,CartItem,Payment,Allocation,ExecutionStatus,OperationalActorContext} from './model';
import {seed} from './seed';
import {calculateBill,calculateCommonOrder,calculatePaymentQuote,remainingItem} from './selectors';
import {getActiveShift,getShiftBlockingObligations,hasEmployeeRole,hasVenueAccess,validateOperationalActor,validateWaiterActor} from './waiter';
function check(ok:unknown,message:string):asserts ok{if(!ok)throw new Error(message)}
const money=(n:number)=>{check(Number.isSafeInteger(n)&&n>=0,'Некорректная сумма');return n};
const id=(s:State,prefix:string)=>`${prefix}-${++s.seq}`;
const event=(s:State,type:string,detail='')=>s.events.push({id:id(s,'ev'),type,detail,at:new Date().toISOString()});
const guest=(s:State,gid:string)=>{const g=s.guests.find(g=>g.id===gid);check(g,'Сначала присоединитесь к столу');return g};
const session=(s:State,gid:string,active=true)=>{const g=guest(s,gid);const x=s.sessions.find(x=>x.id===g.sessionId);check(x&&(!active||!x.closed),'Посещение завершено. Отсканируйте стол заново');return x};
const service=(s:State,gid:string,message:string)=>s.notifications.push({id:id(s,'notification'),guestId:gid,type:'service',message});
export function assertSingleActiveSessionPerTable(s:State){const ids=s.sessions.filter(x=>!x.closed).map(x=>x.tableId);check(new Set(ids).size===ids.length,'За столом уже есть активное посещение')}
export function assertInvariants(s:State){
 assertSingleActiveSessionPerTable(s);
 check(s.version===2,'Неподдерживаемая версия состояния');
 check(new Set(s.organizations.map(item=>item.id)).size===s.organizations.length,'Организация продублирована');
 check(s.organizations.some(item=>item.id===s.venue.organizationId),'Организация заведения не найдена');
 check(s.venue.bonusLimit>=0&&s.venue.bonusLimit<=.5,'Максимум списания бонусов — 50%');
 check(s.venue.cashbackRate>=.05&&s.venue.cashbackRate<=1,'Кешбэк от 5 до 100%');
 check(s.config.commissionRate>=0&&s.config.commissionRate<=1&&s.config.tipCommissionRate>=0&&s.config.tipCommissionRate<=1,'Ставка комиссии от 0 до 100%');
 check(new Set(s.venueEvents.map(item=>item.id)).size===s.venueEvents.length,'Мероприятие продублировано');
 for(const item of s.venueEvents){check(typeof item.venueId==='string'&&typeof item.title==='string'&&typeof item.description==='string'&&typeof item.category==='string','Мероприятие некорректно');check(Number.isFinite(Date.parse(item.startsAt)),'Дата мероприятия некорректна')}
 check(new Set(s.zones.map(item=>item.id)).size===s.zones.length,'Зона продублирована');
 for(const zone of s.zones)check(zone.venueId===s.venue.id,'Зона относится к другому заведению');
 for(const table of s.tables)check(s.zones.some(zone=>zone.id===table.zoneId),'Зона стола не найдена');
 for(const employee of s.employees){
  check(s.organizations.some(item=>item.id===employee.organizationId),'Организация сотрудника не найдена');
  check(employee.roles.length>0&&new Set(employee.roles).size===employee.roles.length,'Роли сотрудника некорректны');
  check(employee.venueAccess.length>0&&employee.venueAccess.every(access=>typeof access.venueId==='string'&&access.venueId.length>0),'Доступ сотрудника к заведению некорректен');
 }
 for(const context of s.employeeAuthContexts){const employee=s.employees.find(item=>item.id===context.employeeId);check(employee&&employee.status==='active'&&hasVenueAccess(employee,context.activeVenueId),'Контекст сотрудника некорректен')}
 const openKeys=s.shifts.filter(shift=>shift.status==='open').map(shift=>`${shift.employeeId}:${shift.venueId}`);
 check(new Set(openKeys).size===openKeys.length,'У сотрудника уже есть активная смена');
 for(const shift of s.shifts){check(s.employees.some(item=>item.id===shift.employeeId),'Сотрудник смены не найден');check(shift.venueId===s.venue.id,'Заведение смены не найдено');check(shift.status==='open'?!shift.endedAt:!!shift.endedAt,'Границы смены некорректны')}
 check(new Set(s.shiftAssignments.map(item=>item.shiftId)).size===s.shiftAssignments.length,'Назначение смены продублировано');
 for(const assignment of s.shiftAssignments){const shift=s.shifts.find(item=>item.id===assignment.shiftId);check(shift,'Смена назначения не найдена');check(new Set(assignment.zoneIds).size===assignment.zoneIds.length&&new Set(assignment.tableIds).size===assignment.tableIds.length,'Назначения продублированы');check(assignment.zoneIds.every(zoneId=>s.zones.some(zone=>zone.id===zoneId&&zone.venueId===shift.venueId)),'Зона назначения некорректна');check(assignment.tableIds.every(tableId=>s.tables.some(table=>table.id===tableId&&s.zones.some(zone=>zone.id===table.zoneId&&zone.venueId===shift.venueId))),'Стол назначения некорректен')}
 s.users.forEach(u=>money(u.bonusBalance));
 for(const x of s.sessions){const b=calculateBill(s,x.id);check(b.paid<=b.total,'Сумма оплат превышает счёт');const reserved=s.parts.filter(p=>p.sessionId===x.id&&p.status==='reserved').reduce((n,p)=>n+p.amount,0);check(reserved<=b.unpaidBalance,'Остаток уже выбран другим участником')}
 for(const o of s.orders){
  if(o.placedByShiftId){const shift=s.shifts.find(item=>item.id===o.placedByShiftId);check(shift&&shift.employeeId===o.placedByWaiterId&&shift.venueId===o.placedByVenueId,'Attribution заказа некорректен')}
  if(o.posEmployeeId||o.posShiftId){const shift=s.shifts.find(item=>item.id===o.posShiftId);check(shift&&shift.employeeId===o.posEmployeeId,'POS attribution некорректен')}
  for(const i of o.items)check(remainingItem(s,i,true)>=0,'Позиция уже выбрана другим участником');
 }
 for(const call of s.calls){
  if(call.acceptedByEmployeeId||call.acceptedByShiftId){const shift=s.shifts.find(item=>item.id===call.acceptedByShiftId);check(shift&&shift.employeeId===call.acceptedByEmployeeId,'Attribution принятия вызова некорректен')}
  if(call.completedByEmployeeId||call.completedByShiftId){const shift=s.shifts.find(item=>item.id===call.completedByShiftId);check(shift&&shift.employeeId===call.completedByEmployeeId,'Attribution завершения вызова некорректен')}
  check(call.status==='cancelled'?!!call.cancelledAt:!call.cancelledAt,'Статус отмены вызова некорректен');
 }
 for(const payment of s.payments)if(payment.cashConfirmedByEmployeeId||payment.cashConfirmedByShiftId){const shift=s.shifts.find(item=>item.id===payment.cashConfirmedByShiftId);check(shift&&shift.employeeId===payment.cashConfirmedByEmployeeId,'Attribution наличной оплаты некорректен')}
}
export type Command={type:string;[key:string]:any};
export function execute(previous:State,c:Command):{state:State;result:any}{
 if(c.type==='reset')return {state:seed(),result:null};
 const s=structuredClone(previous);let result:any=null;
 switch(c.type){
 case 'authenticateEmployee':{
  const employee=s.employees.find(item=>item.id===c.employeeId);
  check(employee&&employee.status==='active','Сотрудник не найден или недоступен');
  check(hasEmployeeRole(employee,'waiter'),'Необходима роль официанта');
  check(typeof c.venueId==='string'&&s.venue.id===c.venueId&&hasVenueAccess(employee,c.venueId),'Нет доступа к заведению');
  const contextId=typeof c.contextId==='string'&&c.contextId?c.contextId:id(s,'employee-auth');
  const existing=s.employeeAuthContexts.find(item=>item.id===contextId);
  check(!existing||existing.employeeId===employee.id,'Контекст уже принадлежит другому сотруднику');
  const context={id:contextId,employeeId:employee.id,activeVenueId:c.venueId,status:'authenticated' as const,createdAt:existing?.createdAt??String(c.at??new Date().toISOString())};
  if(existing)Object.assign(existing,context);else s.employeeAuthContexts.push(context);
  event(s,'EMPLOYEE_AUTHENTICATED',employee.id);result=contextId;break;
 }
 case 'logoutEmployee':{
  const context=s.employeeAuthContexts.find(item=>item.id===c.authContextId);
  if(!context){result={loggedOut:true};break}
  const openShift=getActiveShift(s,context.employeeId,context.activeVenueId);
  if(openShift&&!c.confirm)return {state:previous,result:{requiresConfirmation:true,shiftId:openShift.id}};
  s.employeeAuthContexts=s.employeeAuthContexts.filter(item=>item.id!==context.id);
  event(s,'EMPLOYEE_LOGGED_OUT',context.employeeId);result={loggedOut:true,openShiftId:openShift?.id};break;
 }
 case 'selectEmployeeVenue':{
  const context=s.employeeAuthContexts.find(item=>item.id===c.authContextId);
  check(context,'Сотрудник не авторизован');
  const employee=s.employees.find(item=>item.id===context.employeeId)!;
  check(typeof c.venueId==='string'&&s.venue.id===c.venueId&&hasVenueAccess(employee,c.venueId),'Нет доступа к заведению');
  context.activeVenueId=c.venueId;event(s,'EMPLOYEE_VENUE_SELECTED',`${employee.id} · ${c.venueId}`);break;
 }
 case 'startShift':{
  const context=s.employeeAuthContexts.find(item=>item.id===c.authContextId);
  check(context,'Сотрудник не авторизован');
  const employee=s.employees.find(item=>item.id===context.employeeId);
  check(employee&&employee.status==='active'&&hasEmployeeRole(employee,'waiter'),'Необходима роль официанта');
  check(context.activeVenueId===s.venue.id&&hasVenueAccess(employee,context.activeVenueId),'Нет доступа к заведению');
  check(!getActiveShift(s,employee.id,context.activeVenueId),'Смена уже открыта');
  const shift={id:id(s,'shift'),employeeId:employee.id,venueId:context.activeVenueId,startedAt:String(c.at??new Date().toISOString()),status:'open' as const};
  s.shifts.push(shift);
  const legacyTables=new Set(employee.tables);
  const zoneIds=s.zones.filter(zone=>{const tables=s.tables.filter(table=>table.zoneId===zone.id);return tables.length>0&&tables.every(table=>legacyTables.has(table.id))}).map(zone=>zone.id);
  const covered=new Set(s.tables.filter(table=>zoneIds.includes(table.zoneId)).map(table=>table.id));
  s.shiftAssignments.push({shiftId:shift.id,zoneIds,tableIds:[...legacyTables].filter(tableId=>!covered.has(tableId)&&s.tables.some(table=>table.id===tableId))});
  event(s,'SHIFT_STARTED',`${employee.id} · ${shift.id}`);result=shift.id;break;
 }
 case 'endShift':{
  const actor=validateWaiterActor(s,{authContextId:c.authContextId,shiftId:c.shiftId});
  const obligations=getShiftBlockingObligations(s,actor.shift.id);
  check(obligations.canEndShift,'Сначала завершите активные заказы, вызовы и наличные оплаты');
  actor.shift.status='closed';actor.shift.endedAt=String(c.at??new Date().toISOString());
  event(s,'SHIFT_ENDED',`${actor.employee.id} · ${actor.shift.id}`);result=actor.shift.id;break;
 }
 case 'assignShiftScope':{
  const actor=s.employees.find(item=>item.id===c.actorEmployeeId);
  check(actor&&actor.status==='active'&&hasEmployeeRole(actor,'admin'),'Назначения доступны администратору');
  const shift=s.shifts.find(item=>item.id===c.shiftId&&item.status==='open');
  check(shift&&hasVenueAccess(actor,shift.venueId),'Активная смена не найдена');
  const zoneIds=Array.isArray(c.zoneIds)?c.zoneIds:[];const tableIds=Array.isArray(c.tableIds)?c.tableIds:[];
  check(new Set(zoneIds).size===zoneIds.length&&zoneIds.every((zoneId:string)=>s.zones.some(zone=>zone.id===zoneId&&zone.venueId===shift.venueId)),'Проверьте зоны назначения');
  check(new Set(tableIds).size===tableIds.length&&tableIds.every((tableId:number)=>s.tables.some(table=>table.id===tableId&&s.zones.some(zone=>zone.id===table.zoneId&&zone.venueId===shift.venueId))),'Проверьте столы назначения');
  const existing=s.shiftAssignments.find(item=>item.shiftId===shift.id);const assignment={shiftId:shift.id,zoneIds:[...zoneIds],tableIds:[...tableIds]};
  if(existing)Object.assign(existing,assignment);else s.shiftAssignments.push(assignment);
  event(s,'SHIFT_ASSIGNMENT_UPDATED',`${actor.id} · ${shift.id}`);break;
 }
 case 'enterTableByToken':{check(c.token==='mira-table-12','QR-код не найден');const active=s.sessions.find(x=>x.tableId===12&&!x.closed);if(active&&!c.confirm)return {state:previous,result:{requiresJoin:true}};const x=active??{id:id(s,'session'),tableId:12,guestIds:[],closed:false,executionStatus:'created' as const,financialStatus:'unpaid' as const,createdAt:new Date().toISOString()};if(!active){s.sessions.push(x);event(s,'SESSION_CREATED',x.id)}const gid=id(s,'guest');const g={id:gid,guestSessionId:gid,sessionId:x.id,name:`Гость ${x.guestIds.length+1}`,userId:c.registered?'u1':undefined};s.guests.push(g);x.guestIds.push(gid);s.carts[gid]=[];event(s,'GUEST_JOINED',gid);result={guestId:gid};break}
 case 'legacyDemoStaffSubmitOrder':case 'staffSubmitOrder':{
  const legacyDemo=c.type==='legacyDemoStaffSubmitOrder';
  check(!legacyDemo||(s.config.demoMode&&c.source==='legacy-demo'),'Legacy waiter flow доступен только в демо');
  check(legacyDemo||c.actor,'Для действия нужен operational actor');
  const table=s.tables.find(t=>t.id===c.tableId);
  check(table,'Стол не найден');
  const operational=c.actor?validateOperationalActor(s,c.actor as OperationalActorContext,table.id):undefined;
  const employee=operational?.employee??s.employees.find(e=>e.id===c.waiterId&&hasEmployeeRole(e,'waiter'));
  check(employee&&(!c.waiterId||c.waiterId===employee.id),'Контекст принадлежит другому сотруднику');
  check(operational||table.waiterId===employee.id,'Стол не назначен этому официанту');
  check(typeof c.key==='string'&&c.key.length>0,'Не указан ключ заказа');
  const previousOrder=s.orders.find(o=>o.idempotencyKey===c.key);
  if(previousOrder){check(previousOrder.placedByWaiterId===employee.id&&s.sessions.find(x=>x.id===previousOrder.sessionId)?.tableId===table.id,'Ключ уже использован');return {state:previous,result:{orderId:previousOrder.id,guestId:previousOrder.guestId}}}
  const active=s.sessions.find(x=>x.tableId===table.id&&!x.closed);
  check((active?.id??null)===c.expectedSessionId,'Посещение стола изменилось. Проверьте стол и повторите заказ');
  let x=active;
  if(!x){x={id:id(s,'session'),tableId:table.id,guestIds:[],closed:false,executionStatus:'created',financialStatus:'unpaid',createdAt:new Date().toISOString()};s.sessions.push(x);event(s,'SESSION_CREATED',x.id)}
  let g=c.guestId?s.guests.find(g=>g.id===c.guestId&&g.sessionId===x!.id):undefined;
  check(!c.guestId||g,'Гость не относится к этому посещению');
  if(!g){const name=String(c.guestName??'').trim();check(name.length<=60,'Имя гостя — не более 60 символов');const gid=id(s,'guest');g={id:gid,guestSessionId:gid,sessionId:x.id,name:name||`Гость ${x.guestIds.length+1} · заказ у официанта`};s.guests.push(g);x.guestIds.push(gid);s.carts[gid]=[];event(s,'GUEST_JOINED',gid)}
  const savedCart=s.carts[g.id]??[];
  // Reuse cart/order validation and price snapshots; publish only the final transaction.
  const prepared=execute(s,{type:'setCart',guestId:g.id,items:c.items});
  const submitted=execute(prepared.state,{type:'submitOrder',guestId:g.id,key:c.key});
  submitted.state.carts[g.id]=savedCart;
  const order=submitted.state.orders.find(o=>o.id===submitted.result)!;
  order.placedByWaiterId=employee.id;
  if(operational){order.placedByShiftId=operational.shift.id;order.placedByVenueId=operational.shift.venueId}
  event(submitted.state,'STAFF_ORDER_CREATED',`${employee.id} · ${order.id}`);
  assertInvariants(submitted.state);
  return {state:submitted.state,result:{orderId:order.id,guestId:g.id}};
 }
 case 'setCart':{session(s,c.guestId);const items=c.items as CartItem[];for(const i of items){const p=s.products.find(p=>p.id===i.productId);check(p&&!p.stopped,'Блюдо недоступно');check(Number.isInteger(i.quantity)&&i.quantity>0&&i.quantity<=99,'Количество от 1 до 99');check(new Set(i.modifierIds).size===i.modifierIds.length&&i.modifierIds.every(m=>p.modifiers.some(x=>x.id===m)),'Проверьте дополнения');for(const group of new Set(p.modifiers.filter(m=>m.required).map(m=>m.group)))check(p.modifiers.filter(m=>m.group===group&&i.modifierIds.includes(m.id)).length===1,'Выберите обязательный вариант')}s.carts[c.guestId]=items;break}
 case 'submitOrder':{const x=session(s,c.guestId);const existing=s.orders.find(o=>o.idempotencyKey===c.key);if(existing){result=existing.id;break}const cart=s.carts[c.guestId];check(cart?.length,'Корзина пуста');const items=cart.map(i=>{const p=s.products.find(p=>p.id===i.productId)!;check(!p.stopped,'Блюдо попало в стоп-лист. Уберите его из корзины');const mods=p.modifiers.filter(m=>i.modifierIds.includes(m.id));return {id:id(s,'item'),guestId:c.guestId,productId:p.id,name:p.name,quantity:i.quantity,unitPriceSnapshot:p.price,modifierPriceSnapshot:mods.reduce((n,m)=>n+m.price,0),modifiers:mods.map(m=>m.name),comment:i.comment}});const o={id:id(s,'order'),sessionId:x.id,guestId:c.guestId,items,executionStatus:'submitted' as const,createdAt:new Date().toISOString(),idempotencyKey:c.key};s.orders.push(o);s.carts[c.guestId]=[];x.executionStatus='submitted';x.financialStatus=calculateBill(s,x.id).financialStatus;event(s,'ORDER_CREATED',o.id);event(s,'ORDER_SUBMITTED',o.id);service(s,c.guestId,'Заказ отправлен на кухню');result=o.id;break}
 case 'posStatus':{const o=s.orders.find(o=>o.id===c.orderId);check(o,'Заказ не найден');const orderSession=s.sessions.find(x=>x.id===o.sessionId);check(orderSession&&!orderSession.closed,'Посещение закрыто');const operational=c.actor?validateOperationalActor(s,c.actor as OperationalActorContext,orderSession.tableId):undefined;const next=c.status as ExecutionStatus;check(['accepted','in_progress','ready','served','completed','error','submitted'].includes(next),'Неизвестный статус');const rank:Record<string,number>={submitted:0,error:0,accepted:1,in_progress:2,ready:3,served:4,completed:5};if(o.executionStatus===next||rank[next]<rank[o.executionStatus]||(next==='error'&&rank[o.executionStatus]>0))break;o.executionStatus=next;if(operational){o.posEmployeeId=operational.employee.id;o.posShiftId=operational.shift.id}orderSession.executionStatus=s.orders.filter(order=>order.sessionId===orderSession.id).every(order=>['served','completed','cancelled'].includes(order.executionStatus))?'completed':next;event(s,next==='accepted'?'POS_ORDER_CONFIRMED':'POS_ORDER_STATUS',o.id);service(s,o.guestId,next==='error'?'Не удалось передать заказ. Повторите или позовите официанта.':'Статус заказа обновлён');break}
 case 'createStaffCall':{check(c.callType==='waiter'||c.callType==='admin','Неизвестный тип вызова');const x=c.guestId?session(s,c.guestId):s.sessions.find(x=>x.tableId===12&&!x.closed);check(x,'Сначала присоединитесь к столу');const duplicate=s.calls.find(call=>call.sessionId===x.id&&call.tableId===x.tableId&&call.type===c.callType&&call.guestId===c.guestId&&!['completed','cancelled'].includes(call.status));if(duplicate){result=duplicate.id;break}const call={id:id(s,'call'),sessionId:x.id,tableId:x.tableId,guestId:c.guestId,type:c.callType,status:'created' as const,createdAt:new Date().toISOString()};s.calls.push(call);event(s,'STAFF_CALL_CREATED',call.id);result=call.id;break}
 // Demo storage validates visit and guest ownership here; production transport must also authorize the actor server-side.
 case 'cancelStaffCall':{const x=session(s,c.guestId);const call=s.calls.find(item=>item.id===c.callId);check(call,'Вызов не найден');check(call.guestId===c.guestId&&call.sessionId===x.id&&call.tableId===x.tableId,'Нельзя отменить чужой вызов');if(call.status==='cancelled'){result=call.id;break}check(call.status==='created','Вызов уже принят или завершён');call.status='cancelled';call.cancelledAt=new Date().toISOString();event(s,'STAFF_CALL_CANCELLED',call.id);service(s,c.guestId,'Вызов отменён');result=call.id;break}
 case 'legacyDemoStaffCallStatus':case 'staffCallStatus':{const call=s.calls.find(x=>x.id===c.id);check(call,'Вызов не найден');check(c.role===call.type,'Этот вызов предназначен другому сотруднику');const legacyDemo=c.type==='legacyDemoStaffCallStatus';check(!legacyDemo||(s.config.demoMode&&c.source==='legacy-demo'),'Legacy waiter flow доступен только в демо');const operational=c.actor?validateOperationalActor(s,c.actor as OperationalActorContext,call.tableId):undefined;check(call.type!=='waiter'||operational||legacyDemo,'Для действия нужен operational actor');if(operational)check(call.type==='waiter','Этот вызов предназначен другому сотруднику');check(c.status==='accepted'||c.status==='completed','Некорректный статус');check(call.status!=='cancelled','Вызов отменён гостем');if(call.status==='completed'||call.status===c.status)break;check(c.status==='accepted'?call.status==='created':call.status==='accepted','Недопустимый переход статуса вызова');call.status=c.status;if(c.status==='accepted'){call.acceptedAt=new Date().toISOString();if(operational){call.acceptedByEmployeeId=operational.employee.id;call.acceptedByShiftId=operational.shift.id}}else if(operational){call.completedByEmployeeId=operational.employee.id;call.completedByShiftId=operational.shift.id}event(s,c.status==='accepted'?'STAFF_CALL_ACCEPTED':'STAFF_CALL_COMPLETED',call.id);if(call.guestId)service(s,call.guestId,c.status==='accepted'?'Запрос принят сотрудником':'Обращение выполнено');break}
 case 'createSplit':{const x=session(s,c.guestId);check(!s.payments.some(p=>p.guestId===c.guestId&&p.status==='pending'),'Дождитесь результата текущего платежа');for(const p of s.parts.filter(p=>p.guestId===c.guestId&&p.status==='reserved'))p.status='released';let items=calculateCommonOrder(s,x.id).items;check(['own','items','equal','custom','all'].includes(c.mode),'Неизвестный способ разделения');if(c.mode==='own')items=items.filter(i=>i.guestId===c.guestId);if(c.mode==='items'){check(Array.isArray(c.itemIds)&&c.itemIds.length,'Выберите блюда');items=items.filter(i=>c.itemIds.includes(i.id))}const available=items.reduce((n,i)=>n+remainingItem(s,i,true),0);let amount=c.mode==='custom'?money(c.amount):c.mode==='equal'?Math.min(available,Math.ceil(available/Math.max(1,x.guestIds.filter(gid=>!s.parts.some(p=>p.sessionId===x.id&&p.guestId===gid&&(p.status==='paid'||p.status==='reserved'))).length))):available;check(amount>0&&amount<=available,'Сумма недоступна или выбрана другим участником');const allocations:Allocation[]=[];let left=amount;for(const i of items){const a=Math.min(left,remainingItem(s,i,true));if(a>0)allocations.push({itemId:i.id,amount:a});left-=a}const part={id:id(s,'part'),sessionId:x.id,guestId:c.guestId,allocations,amount,status:'reserved' as const};s.parts.push(part);s.splits.push({id:id(s,'split'),sessionId:x.id,partIds:[part.id],mode:c.mode});event(s,'SPLIT_CREATED',part.id);result=part.id;break}
 case 'releasePart':{const p=s.parts.find(p=>p.id===c.partId&&p.guestId===c.guestId);check(p&&p.status==='reserved','Часть счёта недоступна');check(!s.payments.some(x=>x.partId===p.id&&x.status==='pending'),'Платёж ожидает подтверждения');p.status='released';break}
 case 'createPaymentIntent':{const x=session(s,c.guestId);const part=s.parts.find(p=>p.id===c.partId&&p.guestId===c.guestId);check(part?.status==='reserved','Сначала выберите часть счёта');const pending=s.payments.find(p=>p.partId===part.id&&p.status==='pending');if(pending){result=pending.id;break}check(['cash','online'].includes(c.method),'Выберите способ оплаты');const g=guest(s,c.guestId);const u=s.users.find(u=>u.id===g.userId);const bonuses=money(c.bonuses??0);const reservedBonus=s.payments.filter(p=>p.userId===u?.id&&p.status==='pending').reduce((n,p)=>n+p.bonuses,0);check(bonuses===0||!!u,'Бонусы доступны после входа');check(bonuses<=Math.min((u?.bonusBalance??0)-reservedBonus,Math.floor(part.amount*s.venue.bonusLimit)),'Превышен доступный лимит бонусов');const tips=money(c.tips??0);const commission=Math.round((part.amount-bonuses)*s.config.commissionRate);const guestPaysCommission=c.method==='online'&&!!c.guestPaysCommission;const quote=calculatePaymentQuote(s,{orderAmount:part.amount,tips,bonuses,guestPaysTipCommission:guestPaysCommission,tipCommissionApplies:c.method==='online'});const p:Payment={id:id(s,'payment'),partId:part.id,sessionId:x.id,guestId:g.id,userId:g.userId,method:c.method,status:'pending',base:part.amount,promotion:0,promoCode:0,bonuses,tips,commission,tipCommission:quote.tipCommission,guestPaysCommission,total:quote.guestPayable,cashback:u?Math.round((part.amount-bonuses)*s.venue.cashbackRate):0,waiterId:s.tables.find(t=>t.id===x.tableId)!.waiterId,createdAt:new Date().toISOString()};s.payments.push(p);event(s,c.method==='cash'?'CASH_PAYMENT_REQUESTED':'PAYMENT_PENDING',p.id);result=p.id;break}
 case 'confirmPayment':{const p=s.payments.find(p=>p.id===c.id);check(p,'Платёж не найден');const paymentSession=s.sessions.find(x=>x.id===p.sessionId);check(paymentSession,'Посещение не найдено');const operational=c.actor?validateOperationalActor(s,c.actor as OperationalActorContext,paymentSession.tableId):undefined;if(operational)check(p.method==='cash'&&c.source==='pos','Operational actor подтверждает только наличную оплату через POS');if(p.status==='succeeded')break;check(p.status==='pending','Создайте новый платёж после ошибки');check(p.method==='cash'?c.source==='pos':c.source==='payment','Неверный источник подтверждения');const part=s.parts.find(x=>x.id===p.partId)!;check(part.status==='reserved','Резерв освобождён');p.status='succeeded';part.status='paid';if(operational){p.cashConfirmedByEmployeeId=operational.employee.id;p.cashConfirmedByShiftId=operational.shift.id}s.financialSplits.push({paymentId:p.id,venueShare:p.base-p.bonuses,waiterTipShare:p.tips-(p.guestPaysCommission?0:p.tipCommission),tipCommissionShare:p.tipCommission,miraCommissionShare:p.commission+p.tipCommission,venueCommissionLiability:p.commission});const u=s.users.find(u=>u.id===p.userId);if(u){check(u.bonusBalance>=p.bonuses,'Недостаточно бонусов');u.bonusBalance-=p.bonuses;if(p.bonuses)s.bonusTransactions.push({id:id(s,'bonus'),userId:u.id,paymentId:p.id,amount:-p.bonuses,type:'redemption'});u.bonusBalance+=p.cashback;s.bonusTransactions.push({id:id(s,'bonus'),userId:u.id,paymentId:p.id,amount:p.cashback,type:'accrual'});event(s,'BONUS_ACCRUED',p.id)}paymentSession.financialStatus=calculateBill(s,paymentSession.id).financialStatus;event(s,p.method==='cash'?'CASH_PAYMENT_CONFIRMED':'PAYMENT_SUCCEEDED',p.id);service(s,p.guestId,'Оплата подтверждена');break}
 case 'failPayment':{const p=s.payments.find(p=>p.id===c.id);check(p,'Платёж не найден');if(p.status!=='pending')break;p.status='failed';event(s,'PAYMENT_FAILED',p.id);break}
 case 'closeSession':case 'forceCloseSession':{check(c.role==='admin','Необходимы права администратора');const x=s.sessions.find(x=>x.id===c.sessionId);check(x,'Посещение не найдено');if(x.closed)break;check(!s.payments.some(p=>p.sessionId===x.id&&p.status==='pending'),'Сначала завершите ожидающие платежи');const b=calculateBill(s,x.id);if(c.type==='closeSession'){check(b.unpaidBalance===0,'Сначала оплатите остаток');check(s.orders.filter(o=>o.sessionId===x.id).every(o=>['served','completed','cancelled'].includes(o.executionStatus)),'Сначала завершите обслуживание')}else{check(c.confirmed,'Подтвердите закрытие с задолженностью');x.forceClosedBalance=b.unpaidBalance;x.financialStatus='force_closed_with_balance'}x.closed=true;x.closedAt=new Date().toISOString();x.executionStatus='completed';for(const p of s.parts.filter(p=>p.sessionId===x.id&&p.status==='reserved'))p.status='released';event(s,c.type==='closeSession'?'SESSION_CLOSED':'SESSION_FORCE_CLOSED',x.id);break}
 case 'addAdditionalTip':{const g=guest(s,c.guestId);const exists=s.additionalTips.find(x=>x.key===c.key);if(exists){result=exists.id;break}const tip=money(c.tip);check(tip>0,'Введите сумму чаевых');check(s.employees.some(e=>e.id===c.waiterId&&e.role==='waiter'),'Выберите официанта');const commission=Math.round(tip*s.config.tipCommissionRate);const a={id:id(s,'additional-tip'),key:c.key,guestId:g.id,waiterId:c.waiterId,tip,commission,guestPaysCommission:!!c.guestPaysCommission,total:tip+(c.guestPaysCommission?commission:0),waiterShare:tip-(c.guestPaysCommission?0:commission)};s.additionalTips.push(a);event(s,'ADDITIONAL_TIP_SUCCEEDED',a.id);result=a.id;break}
 case 'setProductStopList':case 'updateProduct':{check(c.source==='pos','Меню управляется POS');const p=s.products.find(p=>p.id===c.id);check(p,'Блюдо не найдено');if(c.type==='setProductStopList')p.stopped=!!c.stopped;else{if(c.price!==undefined)p.price=money(c.price);if(c.description!==undefined)p.description=String(c.description)}event(s,'POS_MENU_SYNC',p.id);break}
 case 'setLoyalty':{check(Number.isFinite(c.cashbackRate)&&c.cashbackRate>=.05&&c.cashbackRate<=1,'Кешбэк должен быть от 5 до 100%');check(Number.isFinite(c.bonusLimit)&&c.bonusLimit>=0&&c.bonusLimit<=.5,'Списание бонусов — максимум 50%');s.venue.cashbackRate=c.cashbackRate;s.venue.bonusLimit=c.bonusLimit;event(s,'LOYALTY_UPDATED');break}
 case 'setCommission':{check(Number.isFinite(c.rate)&&c.rate>=0&&c.rate<=1,'Ставка от 0 до 100%');s.config.commissionRate=c.rate;event(s,'DEMO_COMMISSION_CONFIGURED');break}
 case 'setTipCommission':{check(Number.isFinite(c.rate)&&c.rate>=0&&c.rate<=1,'Ставка от 0 до 100%');s.config.tipCommissionRate=c.rate;s.config.additionalTipCommissionRate=c.rate;event(s,'DEMO_TIP_COMMISSION_CONFIGURED');break}
 case 'reassignWaiter':{const t=s.tables.find(t=>t.id===c.tableId);check(t&&s.employees.some(e=>e.id===c.waiterId&&hasEmployeeRole(e,'waiter')),'Сотрудник не найден');t.waiterId=c.waiterId;for(const e of s.employees)e.tables=s.tables.filter(t=>t.waiterId===e.id).map(t=>t.id);event(s,'WAITER_REASSIGNED');break}
 case 'createBooking':{check(/^\d{4}-\d{2}-\d{2}$/.test(c.date)&&/^\d{2}:\d{2}$/.test(c.time),'Укажите дату и время');check(Number.isInteger(c.guests)&&c.guests>=1&&c.guests<=20,'Количество гостей от 1 до 20');const b={id:id(s,'booking'),venueId:'mira',date:c.date,time:c.time,guests:c.guests,requirements:String(c.requirements??''),comment:String(c.comment??''),status:'confirmed' as const};s.bookings.push(b);if(c.guestId)service(s,c.guestId,'Бронирование подтверждено в демо');event(s,'BOOKING_CREATED',b.id);result=b.id;break}
 case 'cancelBooking':{const b=s.bookings.find(b=>b.id===c.id);check(b,'Бронирование не найдено');b.status='cancelled';event(s,'BOOKING_CANCELLED',b.id);break}
 case 'createReview':{const g=guest(s,c.guestId);check(g.userId,'Отзывы доступны зарегистрированным гостям');check(!s.reviews.some(r=>r.userId===g.userId&&r.sessionId===g.sessionId),'Вы уже оставили отзыв об этом посещении');check(Number.isInteger(c.rating)&&c.rating>=1&&c.rating<=5&&String(c.text).trim(),'Укажите оценку и текст');s.reviews.push({id:id(s,'review'),userId:g.userId,sessionId:g.sessionId,rating:c.rating,text:c.text});event(s,'REVIEW_CREATED');break}
 case 'setMarketing':{const u=s.users.find(u=>u.id===c.userId);check(u,'Требуется вход');u.marketing=!!c.enabled;break}
 case 'publishPromotion':{check(String(c.title??'').trim(),'Введите название акции');const p={id:id(s,'promotion'),title:c.title,description:c.description??'Условия уточняйте у ресторана',published:true};s.promotions.push(p);for(const u of s.users.filter(u=>u.marketing))s.notifications.push({id:id(s,'notification'),userId:u.id,type:'marketing',message:p.title});event(s,'PROMOTION_PUBLISHED',p.id);break}
 case 'requestRefund':{check(c.role==='admin','Необходимы права администратора');const p=s.payments.find(p=>p.id===c.id&&p.status==='succeeded');check(p,'Успешный платёж не найден');if(s.refunds.some(r=>r.paymentId===p.id))break;s.refunds.push({id:id(s,'refund'),paymentId:p.id,amount:p.base-p.bonuses,status:'pending'});s.sessions.find(x=>x.id===p.sessionId)!.financialStatus='refund_pending';event(s,'REFUND_REQUESTED',p.id);break}
 case 'confirmRefund':{const r=s.refunds.find(r=>r.id===c.id);check(r,'Возврат не найден');if(r.status==='completed')break;const p=s.payments.find(p=>p.id===r.paymentId)!;check(p.method==='cash'?c.source==='pos':c.source==='payment','Неверный источник подтверждения возврата');r.status='completed';const u=s.users.find(u=>u.id===p.userId);if(u){const correction=Math.min(u.bonusBalance,p.cashback);u.bonusBalance=u.bonusBalance-correction+p.bonuses;s.bonusTransactions.push({id:id(s,'bonus'),userId:u.id,paymentId:p.id,amount:p.bonuses-correction,type:'refund'})}const x=s.sessions.find(x=>x.id===p.sessionId)!;x.financialStatus=s.payments.filter(p=>p.sessionId===x.id&&p.status==='succeeded').every(p=>s.refunds.some(r=>r.paymentId===p.id&&r.status==='completed'))?'refunded':'partially_refunded';event(s,'REFUND_CONFIRMED',r.id);break}
 case 'rentPowerbank':{if(c.guestId)guest(s,c.guestId);const active=s.rentals.find(r=>r.guestId===c.guestId&&r.status==='active');if(active){result=active.id;break}const rental={id:id(s,'rental'),guestId:c.guestId,status:'active' as const};s.rentals.push(rental);event(s,'POWERBANK_RENTED',rental.id);result=rental.id;break}
 case 'returnPowerbank':{const r=s.rentals.find(r=>r.id===c.id);check(r,'Аренда не найдена');if(r.status==='returned')break;r.status='returned';event(s,'POWERBANK_RETURNED',r.id);break}
 case 'createDelivery':{check(String(c.address??'').trim()&&String(c.items??'').trim(),'Укажите адрес и блюда');const delivery={id:id(s,'delivery'),guestId:c.guestId,address:String(c.address),items:String(c.items),status:'created' as const};s.deliveries.push(delivery);event(s,'DELIVERY_CREATED',delivery.id);result=delivery.id;break}
 case 'favorite':{s.favorites=s.favorites.includes(c.id)?s.favorites.filter(x=>x!==c.id):[...s.favorites,c.id];break}
 case 'setSimulator':{check(Number.isFinite(c.delay)&&c.delay>=0&&c.delay<=5000,'Задержка от 0 до 5000 мс');s.simulator={delay:c.delay,posError:!!c.posError};break}
 default:throw new Error('Неизвестное действие');
 }
 s.revision++;assertInvariants(s);return {state:s,result};
}
export const calculatePaymentPart=(s:State,partId:string)=>s.parts.find(p=>p.id===partId);
