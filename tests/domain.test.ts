import {test} from 'node:test';
import assert from 'node:assert/strict';
import {seed} from '../lib/domain/seed';
import {execute,assertInvariants} from '../lib/domain/engine';
import {normalizeState} from '../lib/domain/migrations';
import {getShiftBlockingObligations,getWaiterWorkspace,hasEmployeeRole,validateWaiterActor} from '../lib/domain/waiter';
import * as q from '../lib/domain/selectors';
function scenario(){let state=seed();let counter=0;const run=(c:any)=>{const next=execute(state,c);state=next.state;return next.result};const enter=(registered=false)=>run({type:'enterTableByToken',token:'mira-table-12',confirm:true,registered}).guestId;const order=(guestId:string,productId='p1')=>{run({type:'setCart',guestId,items:[{productId,quantity:1,modifierIds:[],comment:''}]});return run({type:'submitOrder',guestId,key:`order-${++counter}`})};const pay=(guestId:string,extra:any={})=>{const partId=run({type:'createSplit',guestId,mode:extra.mode??'own'});const id=run({type:'createPaymentIntent',guestId,partId,method:'online',guestPaysCommission:true,...extra});run({type:'confirmPayment',id,source:extra.method==='cash'?'pos':'payment'});return id};return {get s(){return state},run,enter,order,pay}}
test('active session protection and one session per table',()=>{const x=scenario();x.enter();const before=structuredClone(x.s);assert.deepEqual(x.run({type:'enterTableByToken',token:'mira-table-12'}),{requiresJoin:true});assert.deepEqual(x.s,before);x.enter();assert.equal(x.s.sessions.length,1);assert.equal(x.s.guests.length,2)});
test('price snapshot, stop list and ownership',()=>{const x=scenario(),g=x.enter();x.order(g);x.run({type:'updateProduct',source:'pos',id:'p1',price:99900});assert.equal(x.s.orders[0].items[0].unitPriceSnapshot,89000);assert.equal(x.s.orders[0].items[0].guestId,g);x.run({type:'setProductStopList',source:'pos',id:'p1',stopped:true});assert.throws(()=>x.order(g));assert.equal(x.s.orders.length,1);x.run({type:'setProductStopList',source:'pos',id:'p1',stopped:false});x.order(g);assert.equal(x.s.orders.length,2)});
test('full lifecycle, immediate cashback, immutable payment, reorder, close and additional tip',()=>{const x=scenario(),a=x.enter(true),b=x.enter();x.order(a);x.order(b);const id=x.pay(a,{bonuses:10000,tips:1000});const snapshot=structuredClone(x.s.payments.find(p=>p.id===id));assert.equal(x.s.users[0].bonusBalance,143950);assert.equal(x.s.sessions[0].closed,false);x.order(a,'p13');assert.deepEqual(x.s.payments.find(p=>p.id===id),snapshot);x.pay(b);x.pay(a);assert.equal(q.getUnpaidAmount(x.s),0);for(const o of x.s.orders)x.run({type:'posStatus',orderId:o.id,status:'served'});x.run({type:'closeSession',sessionId:x.s.sessions[0].id,role:'admin'});const avg=q.getAverageCheck(x.s),count=q.getSessionCount(x.s);x.run({type:'addAdditionalTip',guestId:a,waiterId:'w1',tip:30000,key:'tip',guestPaysCommission:true});assert.equal(x.s.sessions[0].closed,true);assert.equal(q.getAverageCheck(x.s),avg);assert.equal(q.getSessionCount(x.s),count);x.enter();assert.equal(x.s.sessions.length,2)});
test('cash stays pending until POS confirms, callback idempotency',()=>{const x=scenario(),g=x.enter(true);x.order(g);const partId=x.run({type:'createSplit',guestId:g,mode:'all'});const id=x.run({type:'createPaymentIntent',guestId:g,partId,method:'cash',guestPaysCommission:true});assert.equal(q.getRevenue(x.s),0);assert.equal(x.s.users[0].bonusBalance,150000);assert.throws(()=>x.run({type:'confirmPayment',id,source:'payment'}));x.run({type:'confirmPayment',id,source:'pos'});const balance=x.s.users[0].bonusBalance;x.run({type:'confirmPayment',id,source:'pos'});assert.equal(x.s.users[0].bonusBalance,balance);assert.equal(x.s.financialSplits.length,1)});
test('bonus max and anonymous permissions',()=>{const x=scenario(),g=x.enter();x.order(g);const partId=x.run({type:'createSplit',guestId:g,mode:'own'});assert.throws(()=>x.run({type:'createPaymentIntent',guestId:g,partId,method:'online',bonuses:1}));assert.throws(()=>x.run({type:'createReview',guestId:g,rating:5,text:'Хорошо'}));assert.throws(()=>x.run({type:'setLoyalty',cashbackRate:.05,bonusLimit:.51}));x.pay(g);assert.equal(x.s.payments[0].cashback,0);assert.equal(x.s.users[0].bonusBalance,150000)});
test('bonus balance never negative and pending reservations protect balance',()=>{const x=scenario(),a=x.enter(true),b=x.enter(true);for(let i=0;i<5;i++){x.order(a);x.order(b)}const p1=x.run({type:'createSplit',guestId:a,mode:'own'}),p2=x.run({type:'createSplit',guestId:b,mode:'own'});x.run({type:'createPaymentIntent',guestId:a,partId:p1,method:'online',bonuses:150000});assert.throws(()=>x.run({type:'createPaymentIntent',guestId:b,partId:p2,method:'online',bonuses:1}));assert.ok(x.s.users[0].bonusBalance>=0)});
test('main commission transferred to venue; additional tip withheld from waiter',()=>{const x=scenario(),g=x.enter();x.run({type:'setCommission',rate:.03});x.run({type:'setTipCommission',rate:.03});x.order(g);x.pay(g,{guestPaysCommission:false});assert.equal(x.s.financialSplits[0].venueCommissionLiability,2670);assert.equal(x.s.payments[0].total,89000);x.run({type:'addAdditionalTip',guestId:g,waiterId:'w1',tip:10000,key:'tip',guestPaysCommission:false});assert.equal(x.s.additionalTips[0].waiterShare,9700);assert.equal(x.s.additionalTips[0].total,10000);x.run({type:'addAdditionalTip',guestId:g,waiterId:'w1',tip:10000,key:'tip',guestPaysCommission:false});assert.equal(x.s.additionalTips.length,1)});
test('force close preserves debt, excludes revenue, frees table',()=>{const x=scenario(),g=x.enter();x.order(g);assert.throws(()=>x.run({type:'closeSession',sessionId:x.s.sessions[0].id,role:'admin'}));x.run({type:'forceCloseSession',sessionId:x.s.sessions[0].id,role:'admin',confirmed:true});assert.equal(q.getRevenue(x.s),0);assert.equal(q.getUnpaidAmount(x.s),89000);assert.equal(x.s.sessions[0].forceClosedBalance,89000);x.enter();assert.equal(q.calculateBill(x.s,x.s.sessions[1].id).unpaidBalance,0)});
test('marketing off preserves service notifications',()=>{const x=scenario(),g=x.enter(true);x.run({type:'setMarketing',userId:'u1',enabled:false});x.run({type:'publishPromotion',title:'Вечер'});x.order(g);assert.equal(x.s.notifications.filter(n=>n.type==='marketing').length,0);assert.ok(x.s.notifications.some(n=>n.type==='service'))});
test('POS errors, retry and order submission idempotency',()=>{const x=scenario(),g=x.enter(),id=x.order(g);x.run({type:'submitOrder',guestId:g,key:'order-1'});assert.equal(x.s.orders.length,1);x.run({type:'posStatus',orderId:id,status:'error'});x.run({type:'posStatus',orderId:id,status:'accepted'});x.run({type:'posStatus',orderId:id,status:'error'});assert.equal(x.s.orders[0].executionStatus,'accepted')});
test('failed payment can retry and cannot change successful payment',()=>{const x=scenario(),g=x.enter();x.order(g);const partId=x.run({type:'createSplit',guestId:g,mode:'all'}),id=x.run({type:'createPaymentIntent',guestId:g,partId,method:'online'});x.run({type:'failPayment',id});assert.equal(q.getRevenue(x.s),0);const retry=x.run({type:'createPaymentIntent',guestId:g,partId,method:'online'});x.run({type:'confirmPayment',id:retry,source:'payment'});const snap=structuredClone(x.s.payments[1]);x.run({type:'failPayment',id:retry});assert.deepEqual(x.s.payments[1],snap)});
test('equal splits conserve every kopeck across successive payments',()=>{const x=scenario(),guests=[x.enter(),x.enter(),x.enter()];x.run({type:'updateProduct',source:'pos',id:'p1',price:10001});x.order(guests[0]);for(const g of guests)x.pay(g,{mode:'equal'});assert.equal(q.getUnpaidAmount(x.s),0);assert.equal(x.s.payments.reduce((n,p)=>n+p.base,0),10001)});
test('one guest pays all, other owner has nothing to pay',()=>{const x=scenario(),a=x.enter(),b=x.enter();x.order(a);x.order(b);x.pay(a,{mode:'all'});assert.equal(q.getUnpaidAmount(x.s),0);assert.throws(()=>x.pay(b))});
test('staff call roles and callback deduplication',()=>{const x=scenario(),g=x.enter();const id=x.run({type:'createStaffCall',guestId:g,callType:'waiter'});x.run({type:'createStaffCall',guestId:g,callType:'waiter'});assert.equal(x.s.calls.length,1);assert.throws(()=>x.run({type:'staffCallStatus',id,role:'admin',status:'accepted'}));x.run({type:'legacyDemoStaffCallStatus',source:'legacy-demo',id,role:'waiter',status:'accepted'});assert.equal(x.s.notifications.at(-1)?.message,'Официант уже идёт')});
test('exact reset restores original seed',()=>{const x=scenario(),g=x.enter(true);x.order(g);x.pay(g);x.run({type:'reset'});assert.deepEqual(x.s,seed())});
test('concurrent equal reservations divide remainder evenly',()=>{const x=scenario(),guests=[x.enter(),x.enter(),x.enter()];x.run({type:'updateProduct',source:'pos',id:'p1',price:10001});x.order(guests[0]);for(const g of guests)x.run({type:'createSplit',guestId:g,mode:'equal'});assert.deepEqual(x.s.parts.map(p=>p.amount),[3334,3334,3333])});
test('partner service operations do not create or reopen restaurant sessions',()=>{const x=scenario();const rental=x.run({type:'rentPowerbank'});x.run({type:'returnPowerbank',id:rental});x.run({type:'createDelivery',address:'Демо-адрес',items:'Кофе'});assert.equal(x.s.sessions.length,0);assert.equal(x.s.orders.length,0);assert.equal(q.getRevenue(x.s),0);assert.equal(x.s.deliveries.length,1);assert.equal(x.s.rentals[0].status,'returned')});
test('tip commission and venue commission retain separate payer rules',()=>{const x=scenario(),g=x.enter();x.run({type:'setCommission',rate:.1});x.run({type:'setTipCommission',rate:.1});x.order(g);x.pay(g,{tips:10000});assert.equal(x.s.payments[0].total,100000);assert.equal(x.s.payments[0].commission,8900);assert.equal(x.s.payments[0].tipCommission,1000);assert.equal(x.s.financialSplits[0].miraCommissionShare,9900);assert.equal(x.s.financialSplits[0].venueCommissionLiability,8900);assert.equal(x.s.financialSplits[0].waiterTipShare,10000);x.order(g);x.pay(g,{method:'cash',guestPaysCommission:true,tips:10000});assert.equal(x.s.payments[1].guestPaysCommission,false);assert.equal(x.s.payments[1].total,99000);assert.equal(x.s.financialSplits[1].venueCommissionLiability,8900);assert.equal(x.s.financialSplits[1].waiterTipShare,9000);x.run({type:'addAdditionalTip',guestId:g,waiterId:'w1',tip:10000,key:'extra',guestPaysCommission:true});assert.equal(x.s.additionalTips[0].total,11000);assert.equal(x.s.additionalTips[0].waiterShare,10000)});

test('guest bill quote keeps tips, tip commission, bonuses and partial shares independent',()=>{
 const guestPays=scenario(),registered=guestPays.enter(true);guestPays.run({type:'setTipCommission',rate:.1});guestPays.order(registered);const paidId=guestPays.pay(registered,{tips:10000,bonuses:44500,guestPaysCommission:true});const paid=guestPays.s.payments.find(payment=>payment.id===paidId)!;assert.equal(paid.base,89000);assert.equal(paid.bonuses,44500);assert.equal(paid.tips,10000);assert.equal(paid.tipCommission,1000);assert.equal(paid.total,55500);assert.equal(guestPays.s.financialSplits[0].waiterTipShare,10000);
 const waiterPays=scenario(),guest=waiterPays.enter(true);waiterPays.run({type:'setTipCommission',rate:.1});waiterPays.order(guest);const partId=waiterPays.run({type:'createSplit',guestId:guest,mode:'custom',amount:10000});const paymentId=waiterPays.run({type:'createPaymentIntent',guestId:guest,partId,method:'online',tips:1000,guestPaysCommission:false});const payment=waiterPays.s.payments.find(item=>item.id===paymentId)!;assert.equal(payment.total,11000);assert.equal(payment.tipCommission,100);waiterPays.run({type:'confirmPayment',id:paymentId,source:'payment'});assert.equal(waiterPays.s.financialSplits[0].waiterTipShare,900);assert.equal(q.calculateBill(waiterPays.s,waiterPays.s.sessions[0].id).paid,10000);assert.equal(q.calculateBill(waiterPays.s,waiterPays.s.sessions[0].id).unpaidBalance,79000);const remainder=waiterPays.run({type:'createSplit',guestId:guest,mode:'all'});assert.equal(waiterPays.s.parts.find(item=>item.id===remainder)?.amount,79000);
 const maxBonus=scenario(),bonusGuest=maxBonus.enter(true);maxBonus.run({type:'setTipCommission',rate:.1});maxBonus.order(bonusGuest);const maxPart=maxBonus.run({type:'createSplit',guestId:bonusGuest,mode:'all'});assert.throws(()=>maxBonus.run({type:'createPaymentIntent',guestId:bonusGuest,partId:maxPart,method:'online',tips:100000,bonuses:44501,guestPaysCommission:true}),/лимит бонусов/);
});
test('custom and dish allocations exclude previously paid positions',()=>{const x=scenario(),a=x.enter(),b=x.enter();x.order(a);x.order(b);const partId=x.run({type:'createSplit',guestId:a,mode:'custom',amount:10000});const id=x.run({type:'createPaymentIntent',guestId:a,partId,method:'online'});x.run({type:'confirmPayment',id,source:'payment'});const itemId=x.s.orders[0].items[0].id;const own=x.run({type:'createSplit',guestId:b,mode:'items',itemIds:[itemId]});assert.equal(x.s.parts.find(p=>p.id===own)?.amount,79000);assert.equal(q.calculateBill(x.s,x.s.sessions[0].id).paid,10000)});

test('waiter creates an atomic order for an offline guest at an assigned table',()=>{
 const x=scenario();const command={type:'legacyDemoStaffSubmitOrder',source:'legacy-demo',waiterId:'w1',tableId:7,expectedSessionId:null,guestName:'Гость у окна',items:[{productId:'p11',quantity:2,modifierIds:['medium'],comment:'Без соли'}],key:'staff-1'};
 const result=x.run(command);assert.equal(x.s.sessions.length,1);assert.equal(x.s.sessions[0].tableId,7);assert.equal(x.s.guests[0].userId,undefined);assert.equal(x.s.orders[0].placedByWaiterId,'w1');assert.equal(x.s.orders[0].items[0].quantity,2);assert.equal(x.s.orders[0].items[0].comment,'Без соли');assert.equal(q.calculateBill(x.s,x.s.sessions[0].id).total,578000);
 assert.deepEqual(x.run(command),result);assert.equal(x.s.sessions.length,1);assert.equal(x.s.orders.length,1);assert.equal(x.s.guests.length,1);
 x.run({type:'posStatus',orderId:result.orderId,status:'accepted'});x.pay(result.guestId,{method:'cash'});assert.equal(q.getCashPaymentsTotal(x.s),578000);
});
test('waiter order preserves guest cart, prices and the existing session',()=>{
 const x=scenario(),g=x.enter(true);const ownCart=[{productId:'p13',quantity:1,modifierIds:[],comment:'Позже'}];x.run({type:'setCart',guestId:g,items:ownCart});
 x.run({type:'legacyDemoStaffSubmitOrder',source:'legacy-demo',waiterId:'w1',tableId:12,expectedSessionId:x.s.sessions[0].id,guestId:g,items:[{productId:'p1',quantity:2,modifierIds:['extra'],comment:''}],key:'staff-guest'});
 assert.equal(x.s.sessions.length,1);assert.equal(x.s.guests.length,1);assert.deepEqual(x.s.carts[g],ownCart);assert.equal(x.s.orders[0].guestId,g);assert.equal(q.calculateBill(x.s,x.s.sessions[0].id).total,196000);
 x.run({type:'updateProduct',source:'pos',id:'p1',price:100000});assert.equal(x.s.orders[0].items[0].unitPriceSnapshot,89000);
});
test('invalid waiter orders leave no session, guest or cart behind',()=>{
 const x=scenario();const base={type:'legacyDemoStaffSubmitOrder',source:'legacy-demo',waiterId:'w1',tableId:7,expectedSessionId:null,items:[{productId:'p1',quantity:1,modifierIds:[],comment:''}],key:'invalid'};
 for(const override of [{tableId:1},{waiterId:'a1'},{guestId:'missing'},{expectedSessionId:'stale'},{items:[]},{items:[{productId:'p11',quantity:1,modifierIds:[],comment:''}]},{items:[{productId:'p1',quantity:0,modifierIds:[],comment:''}]}]){const before=structuredClone(x.s);assert.throws(()=>x.run({...base,...override}));assert.deepEqual(x.s,before)}
 x.run({type:'setProductStopList',source:'pos',id:'p1',stopped:true});const before=structuredClone(x.s);assert.throws(()=>x.run(base));assert.deepEqual(x.s,before);
});
test('waiter cannot attach to a different or closed session; repeat orders share the table',()=>{
 const x=scenario(),g=x.enter();const sid=x.s.sessions[0].id;
 const cmd={type:'legacyDemoStaffSubmitOrder',source:'legacy-demo',waiterId:'w1',tableId:12,expectedSessionId:sid,items:[{productId:'p1',quantity:1,modifierIds:[],comment:''}],key:'one'};
 x.run(cmd);x.run({...cmd,key:'two',guestId:g});assert.equal(x.s.sessions.length,1);assert.equal(x.s.guests.length,2);assert.equal(x.s.orders.length,2);
 x.run({type:'forceCloseSession',sessionId:sid,role:'admin',confirmed:true});const before=structuredClone(x.s);assert.throws(()=>x.run({...cmd,key:'closed'}));assert.deepEqual(x.s,before);
});

test('stage 7 foundation models organization, venue access, roles, zones and tables',()=>{
 const s=seed();assert.equal(s.version,2);assert.equal(s.organizations.length,1);assert.equal(s.venue.organizationId,s.organizations[0].id);
 assert.ok(s.employees.every(employee=>employee.organizationId===s.organizations[0].id&&employee.venueAccess.some(access=>access.venueId===s.venue.id)));
 assert.equal(hasEmployeeRole(s.employees[0],'waiter'),true);assert.equal(hasEmployeeRole(s.employees[2],'waiter'),false);
 assert.ok(s.tables.every(table=>s.zones.some(zone=>zone.id===table.zoneId&&zone.venueId===s.venue.id)));assertInvariants(s);
});

test('employee authentication validates waiter role and venue access',()=>{
 const x=scenario();const contextId=x.run({type:'authenticateEmployee',employeeId:'w1',venueId:'mira',contextId:'device-1',at:'2026-10-01T09:00:00.000Z'});
 assert.equal(contextId,'device-1');assert.deepEqual(x.s.employeeAuthContexts[0],{id:'device-1',employeeId:'w1',activeVenueId:'mira',status:'authenticated',createdAt:'2026-10-01T09:00:00.000Z'});
 assert.throws(()=>x.run({type:'authenticateEmployee',employeeId:'a1',venueId:'mira'}),/роль официанта/);
 const unavailable=structuredClone(seed());unavailable.employees.find(employee=>employee.id==='w1')!.venueAccess=[];
 assert.throws(()=>execute(unavailable,{type:'authenticateEmployee',employeeId:'w1',venueId:'mira'}),/Нет доступа/);
 assert.throws(()=>x.run({type:'selectEmployeeVenue',authContextId:'device-1',venueId:'other'}),/Нет доступа/);
});

test('login, shift and logout have independent lifecycles',()=>{
 const x=scenario();const auth=x.run({type:'authenticateEmployee',employeeId:'w1',venueId:'mira',contextId:'device-logout'});const shift=x.run({type:'startShift',authContextId:auth,at:'2026-10-01T10:00:00.000Z'});
 const before=structuredClone(x.s);assert.deepEqual(x.run({type:'logoutEmployee',authContextId:auth}),{requiresConfirmation:true,shiftId:shift});assert.deepEqual(x.s,before);
 assert.deepEqual(x.run({type:'logoutEmployee',authContextId:auth,confirm:true}),{loggedOut:true,openShiftId:shift});assert.equal(x.s.employeeAuthContexts.length,0);assert.equal(x.s.shifts[0].status,'open');
});

test('shift supports sequential same-day records and rejects concurrent active shift',()=>{
 const x=scenario();const auth=x.run({type:'authenticateEmployee',employeeId:'w1',venueId:'mira',contextId:'device-shifts'});const first=x.run({type:'startShift',authContextId:auth,at:'2026-10-01T08:00:00.000Z'});
 assert.throws(()=>x.run({type:'startShift',authContextId:auth}),/уже открыта/);x.run({type:'endShift',authContextId:auth,shiftId:first,at:'2026-10-01T12:00:00.000Z'});
 const second=x.run({type:'startShift',authContextId:auth,at:'2026-10-01T13:00:00.000Z'});assert.notEqual(first,second);assert.equal(x.s.shifts.length,2);assert.equal(x.s.shifts[0].status,'closed');assert.equal(x.s.shifts[1].status,'open');
});

test('shift close is blocked by active order and succeeds after operational completion',()=>{
 const x=scenario();const auth=x.run({type:'authenticateEmployee',employeeId:'w1',venueId:'mira',contextId:'device-order-block'});const shift=x.run({type:'startShift',authContextId:auth});
 const order=x.run({type:'legacyDemoStaffSubmitOrder',source:'legacy-demo',waiterId:'w1',tableId:7,expectedSessionId:null,items:[{productId:'p1',quantity:1,modifierIds:[],comment:''}],key:'shift-block'}).orderId;
 const blockers=getShiftBlockingObligations(x.s,shift);assert.equal(blockers.canEndShift,false);assert.deepEqual(blockers.orderIds,[order]);assert.throws(()=>x.run({type:'endShift',authContextId:auth,shiftId:shift}),/Сначала завершите/);
 x.run({type:'posStatus',orderId:order,status:'served'});x.run({type:'endShift',authContextId:auth,shiftId:shift});assert.equal(x.s.shifts[0].status,'closed');
});

test('shift close detects unresolved waiter calls and pending cash',()=>{
 const x=scenario();const auth=x.run({type:'authenticateEmployee',employeeId:'w1',venueId:'mira',contextId:'device-obligations'});const shift=x.run({type:'startShift',authContextId:auth});const guest=x.enter();
 const call=x.run({type:'createStaffCall',guestId:guest,callType:'waiter'});x.order(guest);const order=x.s.orders[0];x.run({type:'posStatus',orderId:order.id,status:'served'});
 const part=x.run({type:'createSplit',guestId:guest,mode:'all'});const payment=x.run({type:'createPaymentIntent',guestId:guest,partId:part,method:'cash'});
 let blockers=getShiftBlockingObligations(x.s,shift);assert.deepEqual(blockers.callIds,[call]);assert.deepEqual(blockers.cashPaymentIds,[payment]);
 x.run({type:'legacyDemoStaffCallStatus',source:'legacy-demo',id:call,role:'waiter',status:'completed'});x.run({type:'confirmPayment',id:payment,source:'pos'});blockers=getShiftBlockingObligations(x.s,shift);assert.equal(blockers.canEndShift,true);
});

test('admin assignment supports multiple zones and a specific table',()=>{
 const x=scenario();const auth=x.run({type:'authenticateEmployee',employeeId:'w1',venueId:'mira',contextId:'device-assignment'});const shift=x.run({type:'startShift',authContextId:auth});
 x.run({type:'assignShiftScope',actorEmployeeId:'a1',shiftId:shift,zoneIds:['zone-main','zone-terrace'],tableIds:[]});let workspace=getWaiterWorkspace(x.s,auth);assert.deepEqual(workspace.assignedZones.map(zone=>zone.id),['zone-main','zone-terrace']);assert.equal(workspace.actionableTables.length,12);assert.equal(workspace.readOnlyTables.length,0);
 x.run({type:'assignShiftScope',actorEmployeeId:'a1',shiftId:shift,zoneIds:['zone-main'],tableIds:[7]});workspace=getWaiterWorkspace(x.s,auth);
 assert.deepEqual(workspace.assignedZones.map(zone=>zone.id),['zone-main']);assert.deepEqual(workspace.assignedTables.map(table=>table.id),[7]);assert.deepEqual(workspace.actionableTables.map(table=>table.id),[1,2,3,4,5,6,7]);assert.deepEqual(workspace.readOnlyTables.map(table=>table.id),[8,9,10,11,12]);
 assert.throws(()=>x.run({type:'assignShiftScope',actorEmployeeId:'w2',shiftId:shift,zoneIds:[],tableIds:[8]}),/администратору/);
});

test('waiter workspace is derived and contains scoped operational records',()=>{
 const x=scenario();const auth=x.run({type:'authenticateEmployee',employeeId:'w1',venueId:'mira',contextId:'device-workspace'});x.run({type:'startShift',authContextId:auth});
 const result=x.run({type:'legacyDemoStaffSubmitOrder',source:'legacy-demo',waiterId:'w1',tableId:7,expectedSessionId:null,items:[{productId:'p1',quantity:1,modifierIds:[],comment:''}],key:'workspace-order'});const workspace=getWaiterWorkspace(x.s,auth);
 assert.equal(workspace.employee.id,'w1');assert.equal(workspace.venue.id,'mira');assert.equal(workspace.shift.status,'open');assert.ok(workspace.actionableTables.some(table=>table.id===7));assert.ok(workspace.readOnlyTables.some(table=>table.id===1));assert.deepEqual(workspace.orders.map(order=>order.id),[result.orderId]);
});

test('actor validation rejects missing shift, wrong role and read-only table',()=>{
 const x=scenario();const auth=x.run({type:'authenticateEmployee',employeeId:'w1',venueId:'mira',contextId:'device-actor'});assert.throws(()=>validateWaiterActor(x.s,{authContextId:auth}),/активная смена/);
 const shift=x.run({type:'startShift',authContextId:auth});assert.equal(validateWaiterActor(x.s,{authContextId:auth,shiftId:shift,tableId:7}).employee.id,'w1');assert.throws(()=>validateWaiterActor(x.s,{authContextId:auth,shiftId:shift,tableId:1}),/только для просмотра/);
 const invalid=structuredClone(x.s);invalid.employees.find(employee=>employee.id==='w1')!.roles=['admin'];assert.throws(()=>validateWaiterActor(invalid,{authContextId:auth}),/роль официанта/);
 const wrongVenue=structuredClone(x.s);wrongVenue.employeeAuthContexts[0].activeVenueId='other';assert.throws(()=>validateWaiterActor(wrongVenue,{authContextId:auth}),/Нет доступа|не загружено/);
});

test('legacy v1 state migrates through the single normalizer',()=>{
 const legacy:any=structuredClone(seed());legacy.version=1;delete legacy.organizations;delete legacy.zones;delete legacy.employeeAuthContexts;delete legacy.shifts;delete legacy.shiftAssignments;delete legacy.venue.organizationId;
 for(const table of legacy.tables)delete table.zoneId;for(const employee of legacy.employees){delete employee.organizationId;delete employee.venueAccess;delete employee.roles;delete employee.status}
 const migrated=normalizeState(legacy);assert.equal(migrated.version,2);assert.equal(migrated.organizations.length,1);assert.equal(migrated.employees[0].roles[0],migrated.employees[0].role);assert.ok(migrated.tables.every(table=>migrated.zones.some(zone=>zone.id===table.zoneId)));assertInvariants(migrated);
});

test('new auth, shift and assignment state survives persisted-state normalization',()=>{
 const x=scenario();const auth=x.run({type:'authenticateEmployee',employeeId:'w1',venueId:'mira',contextId:'device-sync'});const shift=x.run({type:'startShift',authContextId:auth});x.run({type:'assignShiftScope',actorEmployeeId:'a1',shiftId:shift,zoneIds:['zone-terrace'],tableIds:[1]});
 const restored=normalizeState(JSON.parse(JSON.stringify(x.s)));assert.deepEqual(restored.employeeAuthContexts,x.s.employeeAuthContexts);assert.deepEqual(restored.shifts,x.s.shifts);assert.deepEqual(restored.shiftAssignments,x.s.shiftAssignments);assertInvariants(restored);
});

function stage72Actor(x:any,id='stage-7-2-actor'){
 const authContextId=x.run({type:'authenticateEmployee',employeeId:'w1',venueId:'mira',contextId:id});
 const shiftId=x.run({type:'startShift',authContextId});
 return {authContextId,shiftId,employeeId:'w1',venueId:'mira'};
}

test('stage 7.2 valid actor creates waiter order with employee, shift and venue attribution',()=>{
 const x=scenario(),actor=stage72Actor(x,'stage-7-2-order');
 const result=x.run({type:'staffSubmitOrder',actor,tableId:7,expectedSessionId:null,items:[{productId:'p1',quantity:1,modifierIds:[],comment:''}],key:'stage-7-2-order'});
 const order=x.s.orders.find((item:any)=>item.id===result.orderId)!;
 assert.equal(order.placedByWaiterId,'w1');assert.equal(order.placedByShiftId,actor.shiftId);assert.equal(order.placedByVenueId,'mira');
});

test('stage 7.2 waiter order rejects no shift, wrong venue and unassigned table',()=>{
 const x=scenario();const authContextId=x.run({type:'authenticateEmployee',employeeId:'w1',venueId:'mira',contextId:'stage-7-2-invalid-order'});
 const base={type:'staffSubmitOrder',tableId:7,expectedSessionId:null,items:[{productId:'p1',quantity:1,modifierIds:[],comment:''}],key:'stage-7-2-invalid'};
 assert.throws(()=>x.run(base),/operational actor/);
 assert.throws(()=>x.run({...base,actor:{authContextId,shiftId:'missing',employeeId:'w1',venueId:'mira'}}),/активная смена/);
 const shiftId=x.run({type:'startShift',authContextId});
 assert.throws(()=>x.run({...base,actor:{authContextId,shiftId,employeeId:'w1',venueId:'other'}}),/другому заведению/);
 assert.throws(()=>x.run({...base,tableId:1,actor:{authContextId,shiftId,employeeId:'w1',venueId:'mira'}}),/только для просмотра/);
 assert.equal(x.s.orders.length,0);
});

test('stage 7.2 guest order remains employee-independent',()=>{
 const x=scenario(),guestId=x.enter();const orderId=x.order(guestId);const order=x.s.orders.find((item:any)=>item.id===orderId)!;
 assert.equal(order.placedByWaiterId,undefined);assert.equal(order.placedByShiftId,undefined);assert.equal(x.s.employeeAuthContexts.length,0);assert.equal(x.s.shifts.length,0);
});

test('stage 7.2 guest creates staff call without employee identity',()=>{
 const x=scenario(),guestId=x.enter();const callId=x.run({type:'createStaffCall',guestId,callType:'waiter'});const call=x.s.calls.find((item:any)=>item.id===callId)!;
 assert.equal(call.acceptedByEmployeeId,undefined);assert.equal(call.completedByEmployeeId,undefined);assert.equal(x.s.employeeAuthContexts.length,0);
});

test('stage 7.2 valid waiter handles shared call with employee and shift attribution',()=>{
 const x=scenario(),guestId=x.enter(),actor=stage72Actor(x,'stage-7-2-call');const callId=x.run({type:'createStaffCall',guestId,callType:'waiter'});
 x.run({type:'staffCallStatus',id:callId,role:'waiter',status:'accepted',actor});let call=x.s.calls.find((item:any)=>item.id===callId)!;
 assert.equal(call.acceptedByEmployeeId,'w1');assert.equal(call.acceptedByShiftId,actor.shiftId);assert.equal(x.s.notifications.at(-1)?.message,'Официант уже идёт');
 x.run({type:'staffCallStatus',id:callId,role:'waiter',status:'completed',actor});call=x.s.calls.find((item:any)=>item.id===callId)!;
 assert.equal(call.completedByEmployeeId,'w1');assert.equal(call.completedByShiftId,actor.shiftId);assert.equal(call.status,'completed');
});

test('stage 7.2 staff call rejects invalid operational actor without mutation',()=>{
 const x=scenario(),guestId=x.enter(),actor=stage72Actor(x,'stage-7-2-call-invalid');const callId=x.run({type:'createStaffCall',guestId,callType:'waiter'});const before=structuredClone(x.s.calls);
 assert.throws(()=>x.run({type:'staffCallStatus',id:callId,role:'waiter',status:'accepted'}),/operational actor/);
 assert.throws(()=>x.run({type:'staffCallStatus',id:callId,role:'waiter',status:'accepted',actor:{...actor,employeeId:'w2'}}),/другому сотруднику/);
 assert.deepEqual(x.s.calls,before);
});

test('stage 7.2 waiter POS send and retry retain actor attribution on the same order',()=>{
 const x=scenario(),guestId=x.enter(),orderId=x.order(guestId),actor=stage72Actor(x,'stage-7-2-pos');
 x.run({type:'posStatus',orderId,status:'error',actor});x.run({type:'posStatus',orderId,status:'accepted',actor});
 const order=x.s.orders.find((item:any)=>item.id===orderId)!;assert.equal(order.executionStatus,'accepted');assert.equal(order.posEmployeeId,'w1');assert.equal(order.posShiftId,actor.shiftId);assert.equal(x.s.orders.length,1);
});

test('stage 7.2 POS action rejects actor without actionable order table',()=>{
 const x=scenario();const created=x.run({type:'legacyDemoStaffSubmitOrder',source:'legacy-demo',waiterId:'w2',tableId:1,expectedSessionId:null,items:[{productId:'p1',quantity:1,modifierIds:[],comment:''}],key:'stage-7-2-pos-denied'});const actor=stage72Actor(x,'stage-7-2-pos-denied');
 assert.throws(()=>x.run({type:'posStatus',orderId:created.orderId,status:'accepted',actor}),/только для просмотра/);assert.equal(x.s.orders[0].executionStatus,'submitted');
});

test('stage 7.2 valid waiter confirms cash without changing financial calculation',()=>{
 const x=scenario(),guestId=x.enter();x.order(guestId);const partId=x.run({type:'createSplit',guestId,mode:'all'});const paymentId=x.run({type:'createPaymentIntent',guestId,partId,method:'cash',guestPaysCommission:true});const actor=stage72Actor(x,'stage-7-2-cash');const before=structuredClone(x.s.payments[0]);
 x.run({type:'confirmPayment',id:paymentId,source:'pos',actor});const payment=x.s.payments[0];assert.equal(payment.status,'succeeded');assert.equal(payment.cashConfirmedByEmployeeId,'w1');assert.equal(payment.cashConfirmedByShiftId,actor.shiftId);assert.equal(payment.total,before.total);assert.equal(payment.base,before.base);assert.equal(payment.commission,before.commission);
});

test('stage 7.2 cash confirmation rejects no shift and unassigned table',()=>{
 const x=scenario(),guestId=x.enter();x.order(guestId);const partId=x.run({type:'createSplit',guestId,mode:'all'});const paymentId=x.run({type:'createPaymentIntent',guestId,partId,method:'cash'});const authContextId=x.run({type:'authenticateEmployee',employeeId:'w1',venueId:'mira',contextId:'stage-7-2-cash-invalid'});
 assert.throws(()=>x.run({type:'confirmPayment',id:paymentId,source:'pos',actor:{authContextId,shiftId:'missing',employeeId:'w1',venueId:'mira'}}),/активная смена/);assert.equal(x.s.payments[0].status,'pending');
 const actor={authContextId,shiftId:x.run({type:'startShift',authContextId}),employeeId:'w1',venueId:'mira'};const other=x.run({type:'legacyDemoStaffSubmitOrder',source:'legacy-demo',waiterId:'w2',tableId:1,expectedSessionId:null,items:[{productId:'p1',quantity:1,modifierIds:[],comment:''}],key:'stage-7-2-cash-other'});const otherPart=x.run({type:'createSplit',guestId:other.guestId,mode:'all'});const otherPayment=x.run({type:'createPaymentIntent',guestId:other.guestId,partId:otherPart,method:'cash'});
 assert.throws(()=>x.run({type:'confirmPayment',id:otherPayment,source:'pos',actor}),/только для просмотра/);assert.equal(x.s.payments.find((item:any)=>item.id===otherPayment)?.status,'pending');
});

test('stage 7.2 cross-role mutations update existing shared order and call entities',()=>{
 const x=scenario(),guestId=x.enter(),orderId=x.order(guestId),callId=x.run({type:'createStaffCall',guestId,callType:'waiter'}),actor=stage72Actor(x,'stage-7-2-cross-role');const orderCount=x.s.orders.length,callCount=x.s.calls.length;
 x.run({type:'posStatus',orderId,status:'accepted',actor});x.run({type:'staffCallStatus',id:callId,role:'waiter',status:'accepted',actor});
 assert.equal(x.s.orders.length,orderCount);assert.equal(x.s.calls.length,callCount);assert.equal(x.s.orders[0].id,orderId);assert.equal(x.s.calls[0].id,callId);assert.equal(x.s.orders[0].executionStatus,'accepted');assert.equal(x.s.calls[0].status,'accepted');
});

test('stage 7.2 legacy operational entities without attribution remain valid',()=>{
 const x=scenario(),guestId=x.enter(),orderId=x.order(guestId),callId=x.run({type:'createStaffCall',guestId,callType:'waiter'});const partId=x.run({type:'createSplit',guestId,mode:'all'});const paymentId=x.run({type:'createPaymentIntent',guestId,partId,method:'cash'});const legacy:any=JSON.parse(JSON.stringify(x.s));
 for(const order of legacy.orders){delete order.placedByShiftId;delete order.placedByVenueId;delete order.posEmployeeId;delete order.posShiftId}for(const call of legacy.calls){delete call.acceptedByEmployeeId;delete call.acceptedByShiftId;delete call.completedByEmployeeId;delete call.completedByShiftId}for(const payment of legacy.payments){delete payment.cashConfirmedByEmployeeId;delete payment.cashConfirmedByShiftId}
 const restored=normalizeState(legacy);assert.equal(restored.orders[0].id,orderId);assert.equal(restored.calls[0].id,callId);assert.equal(restored.payments[0].id,paymentId);assertInvariants(restored);
});
