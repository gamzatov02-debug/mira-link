'use client';

import {useEffect,useState,type ReactNode} from 'react';
import {useRouter} from 'next/navigation';
import {AlertTriangle,Bell,CheckCircle2,ChevronRight,CircleDollarSign,ClipboardList,LogOut,Map,MoreHorizontal,Play,Plus,RefreshCw,Store,UserRound,UtensilsCrossed} from 'lucide-react';
import {dispatch,useDomain} from '@/lib/store';
import {getActiveShift,getWaiterWorkspace,type WaiterWorkspace} from '@/lib/domain/waiter';
import {calculateBill,formatMoney,itemTotal} from '@/lib/domain/selectors';
import {DemoPOSAdapter} from '@/lib/adapters';
import type {ExecutionStatus,Order,OperationalActorContext,StaffCall,State,Table,Zone} from '@/lib/domain/model';
import {Alert,Badge,BottomSheet,Button,Card,Chip,Dialog,StatusBadge} from '@/components/design-system';

const mode='operational-light' as const;
const storageKey='mira-waiter-auth-context-v1';
const pages=new Set(['dashboard','floor','orders','calls','more']);

type Props={initialPage?:string;legacyWorkspace:ReactNode};

export function WaiterApp({initialPage='login',legacyWorkspace}:Props){
 const state=useDomain();
 const router=useRouter();
 const [authContextId,setAuthContextId]=useState('');
 const [ready,setReady]=useState(false);
 const [busy,setBusy]=useState(false);
 const [message,setMessage]=useState('');
 const [logoutWarning,setLogoutWarning]=useState(false);
 const [orderEditorOpen,setOrderEditorOpen]=useState(false);
 const [selectedZone,setSelectedZone]=useState('all');
 const [selectedTableId,setSelectedTableId]=useState<number|null>(null);

 useEffect(()=>{setAuthContextId(sessionStorage.getItem(storageKey)??'');setReady(true)},[]);
 useEffect(()=>{if(initialPage==='more'&&new URLSearchParams(window.location.search).get('create')==='order')setOrderEditorOpen(true)},[initialPage]);
 useEffect(()=>{if(!ready||!authContextId)return;if(!state.employeeAuthContexts.some(context=>context.id===authContextId)){sessionStorage.removeItem(storageKey);setAuthContextId('')}},[state.revision,authContextId,ready,state.employeeAuthContexts]);

 const context=state.employeeAuthContexts.find(item=>item.id===authContextId&&item.status==='authenticated');
 const employee=context?state.employees.find(item=>item.id===context.employeeId):undefined;
 const shift=context?getActiveShift(state,context.employeeId,context.activeVenueId):undefined;
 const page=pages.has(initialPage)&&initialPage!=='dashboard'?initialPage:'floor';
 const loginEmployee=state.employees.find(item=>item.id==='w1'&&item.status==='active'&&item.roles.includes('waiter'));

 async function run(action:()=>Promise<unknown>){setBusy(true);setMessage('');try{return await action()}catch(error){setMessage(error instanceof Error?error.message:'Не удалось выполнить действие')}finally{setBusy(false)}}
 const navigate=(target:string)=>{const href=`/demo/waiter/${target}`;if(typeof window!=='undefined'&&`${window.location.pathname}${window.location.search}`===href)return;router.push(href)};

 async function authenticate(){if(!loginEmployee)return;const result=await run(()=>dispatch({type:'authenticateEmployee',employeeId:loginEmployee.id,venueId:state.venue.id,contextId:`waiter-device-${loginEmployee.id}`}));if(typeof result==='string'){sessionStorage.setItem(storageKey,result);setAuthContextId(result);router.push('/demo/waiter/shift')}}
 async function startShift(){if(!context)return;const result=await run(()=>dispatch({type:'startShift',authContextId:context.id}));if(typeof result==='string')navigate('floor')}
 async function endShift(){if(!context||!shift)return;const result=await run(()=>dispatch({type:'endShift',authContextId:context.id,shiftId:shift.id}));if(typeof result==='string')router.push('/demo/waiter/shift')}
 async function logout(confirm=false){if(!context)return;const result=await run(()=>dispatch({type:'logoutEmployee',authContextId:context.id,confirm}));if(result&&typeof result==='object'&&'requiresConfirmation' in result&&result.requiresConfirmation){setLogoutWarning(true);return}if(result&&typeof result==='object'&&'loggedOut' in result){sessionStorage.removeItem(storageKey);setAuthContextId('');setLogoutWarning(false);router.push('/demo/waiter')}}

 if(!ready)return <main className="waiter-entry" aria-label="Загрузка интерфейса официанта"><Card mode={mode}>Загрузка рабочего пространства…</Card></main>;
 if(!context||!employee)return <main className="waiter-entry" aria-labelledby="waiter-login-title"><div className="waiter-entry-brand"><span>MIRA LINK</span><small>OPERATIONAL WORKSPACE</small></div><Card mode={mode} variant="raised" className="waiter-entry-card"><div className="waiter-entry-icon"><UserRound aria-hidden="true"/></div><p className="waiter-kicker">WTR-001 · Вход сотрудника</p><h1 id="waiter-login-title">Рабочая смена</h1><p>Личная авторизация сотрудника не создаёт гостя или ресторанную сессию.</p>{message&&<Alert mode={mode} status="error" title="Вход не выполнен">{message}</Alert>}<div className="waiter-identity"><strong>{loginEmployee?.name??'Сотрудник недоступен'}</strong><span>{state.venue.name} · Официант</span></div><Button mode={mode} size="l" fullWidth loading={busy} disabled={!loginEmployee} leadingIcon={<UserRound/>} onClick={()=>void authenticate()}>Войти как {loginEmployee?.name??'официант'}</Button><small>Демонстрационная авторизация. Реальные учётные данные и backend-провайдер не входят в текущий этап.</small></Card></main>;

 if(!shift)return <main className="waiter-entry" aria-labelledby="waiter-shift-title"><div className="waiter-entry-brand"><span>MIRA LINK</span><small>OPERATIONAL WORKSPACE</small></div><Card mode={mode} variant="raised" className="waiter-entry-card"><p className="waiter-kicker">WTR-001 · Начало смены</p><h1 id="waiter-shift-title">Здравствуйте, {employee.name}</h1><p>Авторизация выполнена. Для операционных действий требуется отдельная активная смена.</p>{message&&<Alert mode={mode} status="error" title="Смена не открыта">{message}</Alert>}<Card mode={mode} className="waiter-venue-card"><Store aria-hidden="true"/><div><strong>{state.venue.name}</strong><span>Доступ подтверждён</span></div><StatusBadge mode={mode} status="success">Доступно</StatusBadge></Card><Button mode={mode} size="l" fullWidth loading={busy} leadingIcon={<Play/>} onClick={()=>void startShift()}>Начать смену</Button><Button mode={mode} size="l" fullWidth variant="ghost" leadingIcon={<LogOut/>} onClick={()=>void logout()}>Выйти</Button></Card></main>;

 const workspace=getWaiterWorkspace(state,context.id);
 const startedAt=new Date(shift.startedAt).toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'});
 const navigation=[['floor','Зал',Map],['orders','Заказы',ClipboardList],['calls','Вызовы',Bell],['more','Ещё',MoreHorizontal]] as const;
 const heading={floor:'Зал',orders:'Заказы',calls:'Вызовы',more:'Ещё'}[page];

 return <main className="waiter-shell" data-mode="operational-light"><header className="waiter-header"><button className="waiter-brand-button" onClick={()=>navigate('floor')} aria-label="Открыть зал"><span>MIRA LINK</span><small>WAITER</small></button><div className="waiter-shift-context"><strong>{employee.name}</strong><span>{state.venue.name} · с {startedAt}</span></div><StatusBadge mode={mode} status="success">Смена открыта</StatusBadge></header><div className="waiter-content">{message&&<Alert mode={mode} status="error" title="Действие не выполнено" onDismiss={()=>setMessage('')}>{message}</Alert>}<div className="waiter-page-heading"><div><p className="waiter-kicker">Операционное пространство</p><h1>{heading}</h1></div></div>{page==='floor'&&<FloorView state={state} workspace={workspace} selectedZone={selectedZone} onSelectZone={setSelectedZone} selectedTableId={selectedTableId} onSelectTable={setSelectedTableId} onNavigate={navigate} onRun={run}/>} {page==='orders'&&<OrdersView state={state} workspace={workspace} busy={busy} onCreateOrder={()=>navigate('more?create=order')} onRun={run}/>} {page==='calls'&&<CallsView state={state} workspace={workspace} busy={busy} onRun={run}/>} {page==='more'&&<section className="waiter-more"><Card mode={mode}><h2>Смена и профиль</h2><dl><div><dt>Сотрудник</dt><dd>{employee.name}</dd></div><div><dt>Заведение</dt><dd>{state.venue.name}</dd></div><div><dt>Начало</dt><dd>{startedAt}</dd></div></dl></Card><Alert mode={mode} status={workspace.obligations.canEndShift?'info':'warning'} title={workspace.obligations.canEndShift?'Смену можно завершить':'Есть незавершённые задачи'}>{workspace.obligations.canEndShift?'Активных заказов, вызовов и ожидающих наличных оплат нет.':`Заказы: ${workspace.obligations.orderIds.length}, вызовы: ${workspace.obligations.callIds.length}, наличные: ${workspace.obligations.cashPaymentIds.length}.`}</Alert><details className="waiter-legacy" open={orderEditorOpen} onToggle={event=>setOrderEditorOpen(event.currentTarget.open)}><summary>Дополнительные операции демо</summary><p>Заказы за гостя, меню, POS и наличные сохранены до миграции соответствующих рабочих экранов.</p><div className="waiter-legacy-content">{legacyWorkspace}</div></details><Button mode={mode} size="l" fullWidth variant="secondary" loading={busy} onClick={()=>void endShift()}>Завершить смену</Button><Button mode={mode} size="l" fullWidth variant="ghost" leadingIcon={<LogOut/>} onClick={()=>void logout()}>Выйти из аккаунта</Button></section>}</div><nav className="waiter-navigation" aria-label="Основная навигация официанта">{navigation.map(([id,label,Icon])=><button key={id} aria-current={page===id?'page':undefined} onClick={()=>navigate(id)}><Icon aria-hidden="true"/><span>{label}</span>{id==='orders'&&workspace.orders.length>0&&<b>{workspace.orders.length}</b>}{id==='calls'&&workspace.calls.length>0&&<b>{workspace.calls.length}</b>}</button>)}</nav><Dialog mode={mode} open={logoutWarning} onOpenChange={setLogoutWarning} title="Выйти с открытой сменой?" description="Выход не завершает смену и не передаёт задачи другому сотруднику." actions={<><Button mode={mode} variant="secondary" onClick={()=>setLogoutWarning(false)}>Остаться</Button><Button mode={mode} onClick={()=>void logout(true)}>Выйти</Button></>}><p>После повторного входа открытая смена будет доступна для продолжения.</p></Dialog></main>;
}

type OrderFilter='all'|'submitted'|'ready'|'error';
type OrderPresentation={order:Order;session:State['sessions'][number];table:Table;zone:Zone;actionable:boolean;subtotal:number};

const orderStatuses:Record<ExecutionStatus,{label:string;tone:TableTone}>={created:{label:'Создан',tone:'neutral'},submitted:{label:'Новый',tone:'info'},accepted:{label:'Принят кухней',tone:'info'},in_progress:{label:'Готовится',tone:'warning'},ready:{label:'Готово к подаче',tone:'success'},served:{label:'Подано',tone:'success'},completed:{label:'Завершён',tone:'neutral'},cancelled:{label:'Отменён',tone:'neutral'},error:{label:'Ошибка POS',tone:'error'}};
const orderStatus=(status:ExecutionStatus)=>orderStatuses[status];
const orderNumber=(id:string)=>id.replace(/^order-/,'');
const itemCount=(order:Order)=>order.items.reduce((sum,item)=>sum+item.quantity,0);
const orderPriority=(status:ExecutionStatus)=>status==='error'?0:status==='ready'?1:status==='submitted'?2:['accepted','in_progress'].includes(status)?3:4;

function OrdersView({state,workspace,busy,onCreateOrder,onRun}:{state:State;workspace:WaiterWorkspace;busy:boolean;onCreateOrder:()=>void;onRun:(action:()=>Promise<unknown>)=>Promise<unknown>}){
 const [filter,setFilter]=useState<OrderFilter>('all');
 const [selectedOrderId,setSelectedOrderId]=useState<string|null>(null);
 const [viewport,setViewport]=useState<'pending'|'mobile'|'split'>('pending');
 useEffect(()=>{const media=window.matchMedia('(min-width: 768px)');const update=()=>setViewport(media.matches?'split':'mobile');update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update)},[]);
 const actionableIds=new Set(workspace.actionableTables.map(table=>table.id));
 const venueZoneIds=new Set(state.zones.filter(zone=>zone.venueId===workspace.venue.id).map(zone=>zone.id));
 const venueTableIds=new Set(state.tables.filter(table=>venueZoneIds.has(table.zoneId)).map(table=>table.id));
 const orders=state.orders.flatMap(order=>{const session=state.sessions.find(item=>item.id===order.sessionId);const table=session&&state.tables.find(item=>item.id===session.tableId);const zone=table&&state.zones.find(item=>item.id===table.zoneId);return session&&table&&zone&&venueTableIds.has(table.id)?[{order,session,table,zone,actionable:actionableIds.has(table.id),subtotal:order.items.reduce((sum,item)=>sum+itemTotal(item),0)}]:[]}).sort((a,b)=>orderPriority(a.order.executionStatus)-orderPriority(b.order.executionStatus)||Date.parse(b.order.createdAt)-Date.parse(a.order.createdAt));
 const counts={all:orders.length,submitted:orders.filter(item=>item.order.executionStatus==='submitted').length,ready:orders.filter(item=>item.order.executionStatus==='ready').length,error:orders.filter(item=>item.order.executionStatus==='error').length};
 const visible=orders.filter(item=>filter==='all'||item.order.executionStatus===filter);
 const selected=visible.find(item=>item.order.id===selectedOrderId);
 const visibleIds=visible.map(item=>item.order.id).join('|');
 useEffect(()=>{if(selectedOrderId&&!visibleIds.split('|').includes(selectedOrderId))setSelectedOrderId(null)},[selectedOrderId,visibleIds]);
 const actor:OperationalActorContext={authContextId:workspace.authContext.id,shiftId:workspace.shift.id,employeeId:workspace.employee.id,venueId:workspace.venue.id};
 const changeFilter=(next:OrderFilter)=>{setFilter(next);setSelectedOrderId(null)};
 const action=selected?.actionable?<OrderAction item={selected} actor={actor} busy={busy} onRun={onRun}/>:undefined;
 return <section className="waiter-orders-workspace" aria-label="Заказы официанта">
  <div className="waiter-orders-pane">
   <div className="waiter-orders-toolbar"><nav className="waiter-order-filters" aria-label="Фильтры заказов">{([['all','Все'],['submitted','Новые'],['ready','Готовы'],['error','Ошибка POS']] as const).map(([id,label])=><Chip key={id} mode={mode} selected={filter===id} onClick={()=>changeFilter(id)}>{label} · {counts[id]}</Chip>)}</nav><Button mode={mode} size="l" variant="secondary" leadingIcon={<Plus/>} onClick={onCreateOrder}>Новый заказ</Button></div>
   {visible.length?<div className="waiter-order-list" aria-live="polite">{visible.map(item=><OrderListCard key={item.order.id} item={item} selected={selectedOrderId===item.order.id} onSelect={()=>setSelectedOrderId(item.order.id)}/>)}</div>:<div className="waiter-orders-empty"><ClipboardList aria-hidden="true"/><strong>{orders.length?'В этом фильтре заказов нет':'Заказов пока нет'}</strong><span>{orders.length?'Список обновится автоматически при изменении статуса.':'Новые заказы гостей появятся здесь автоматически.'}</span></div>}
  </div>
  <aside className="waiter-order-detail-pane" aria-label="Детали заказа" data-split-view={viewport==='split'||undefined}>{selected?<OrderDetail item={selected} state={state} action={action}/>:<div className="waiter-order-detail-empty"><ClipboardList aria-hidden="true"/><strong>Выберите заказ, чтобы увидеть детали</strong><span>Список и выбранный фильтр останутся видимыми.</span></div>}</aside>
  <BottomSheet mode={mode} open={viewport==='mobile'&&Boolean(selected)} onOpenChange={open=>!open&&setSelectedOrderId(null)} title={selected?`Заказ №${orderNumber(selected.order.id)}`:'Заказ'} description={selected?`Стол ${selected.table.id} · ${selected.zone.name}`:undefined} actions={<><Button mode={mode} size="l" variant="secondary" onClick={()=>setSelectedOrderId(null)}>Закрыть</Button>{action}</>}>
   {selected&&<OrderDetail item={selected} state={state} compactHeader/>} 
  </BottomSheet>
 </section>;
}

function OrderListCard({item,selected,onSelect}:{item:OrderPresentation;selected:boolean;onSelect:()=>void}){
 const status=orderStatus(item.order.executionStatus);
 const source=item.order.placedByWaiterId?'Официант':'Гость';
 return <button type="button" className={`waiter-order-card waiter-order-card-${status.tone}`} aria-pressed={selected} data-selected={selected||undefined} data-read-only={!item.actionable||undefined} onClick={onSelect} aria-label={`Заказ №${orderNumber(item.order.id)}, стол ${item.table.id}, ${status.label}${!item.actionable?', только просмотр':''}`}><span className="waiter-order-card-top"><span><strong>Заказ №{orderNumber(item.order.id)}</strong><small>Стол {item.table.id} · {item.zone.name}</small></span><ChevronRight aria-hidden="true"/></span><span className="waiter-order-card-status"><StatusBadge mode={mode} status={status.tone}>{status.label}</StatusBadge>{!item.actionable&&<Badge mode={mode}>Только просмотр</Badge>}</span><span className="waiter-order-card-meta"><span>{source} · {itemCount(item.order)} поз.</span><time>{new Date(item.order.createdAt).toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'})}</time></span><strong className="waiter-order-card-total">{formatMoney(item.subtotal)}</strong></button>;
}

function OrderDetail({item,state,action,compactHeader=false}:{item:OrderPresentation;state:State;action?:ReactNode;compactHeader?:boolean}){
 const status=orderStatus(item.order.executionStatus);
 const bill=calculateBill(state,item.session.id);
 const waiter=state.employees.find(employee=>employee.id===item.table.waiterId)?.name;
 const source=item.order.placedByWaiterId?'Официант':'Гость';
 return <div className="waiter-order-detail">{compactHeader?<div className="waiter-order-mobile-status"><span>{new Date(item.order.createdAt).toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'})} · {source}</span><div className="waiter-order-detail-badges"><StatusBadge mode={mode} status={status.tone}>{status.label}</StatusBadge>{!item.actionable&&<Badge mode={mode}>Только просмотр</Badge>}</div></div>:<header><div><p>{item.zone.name} · Стол {item.table.id}</p><h2>Заказ №{orderNumber(item.order.id)}</h2><span>{new Date(item.order.createdAt).toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'})} · {source}</span></div><div className="waiter-order-detail-badges"><StatusBadge mode={mode} status={status.tone}>{status.label}</StatusBadge>{!item.actionable&&<Badge mode={mode}>Только просмотр</Badge>}</div></header>}
  <section className="waiter-order-context"><h3>Посещение</h3><dl><div><dt>Стол</dt><dd>{item.table.id}</dd></div><div><dt>Гостей</dt><dd>{item.session.guestIds.length}</dd></div><div><dt>Открыто</dt><dd>{new Date(item.session.createdAt).toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'})}</dd></div>{waiter&&<div><dt>Официант</dt><dd>{waiter}</dd></div>}</dl></section>
  <section className="waiter-order-items"><div className="waiter-order-section-heading"><h3>Позиции</h3><Badge mode={mode}>{itemCount(item.order)}</Badge></div>{item.order.items.map(orderItem=><div className="waiter-order-item" key={orderItem.id}><div><strong>{orderItem.name}</strong>{orderItem.modifiers.length>0&&<span>{orderItem.modifiers.join(', ')}</span>}{orderItem.comment&&<em>Комментарий: {orderItem.comment}</em>}</div><b>× {orderItem.quantity}</b><strong>{formatMoney(itemTotal(orderItem))}</strong></div>)}</section>
  <section className="waiter-order-finance"><h3>Суммы</h3><dl><div><dt>Сумма заказа</dt><dd>{formatMoney(item.subtotal)}</dd></div><div><dt>Счёт посещения</dt><dd>{formatMoney(bill.total)}</dd></div><div><dt>Оплачено</dt><dd>{formatMoney(bill.paid)}</dd></div><div><dt>Осталось</dt><dd>{formatMoney(bill.unpaidBalance)}</dd></div></dl></section>
  <section className="waiter-order-pos"><div><h3>POS / iiko</h3><span>Текущий статус общей Order entity</span></div><StatusBadge mode={mode} status={status.tone}>{status.label}</StatusBadge></section>
  {item.order.executionStatus==='error'&&<Alert mode={mode} status="error" title="Заказ не передан в POS">Проверьте подключение и повторите передачу. Повтор создаёт только новый запрос к POS, не новый заказ.</Alert>}
  {!item.actionable&&<Alert mode={mode} status="info" title="Только просмотр">Стол не входит в текущее назначение. Операционные действия недоступны.</Alert>}
  {action&&<div className="waiter-order-actions">{action}</div>}
 </div>;
}

function OrderAction({item,actor,busy,onRun}:{item:OrderPresentation;actor:OperationalActorContext;busy:boolean;onRun:(action:()=>Promise<unknown>)=>Promise<unknown>}){
 const status=item.order.executionStatus;
 if(status==='submitted'||status==='error')return <Button mode={mode} size="l" loading={busy} leadingIcon={status==='error'?<RefreshCw/>:undefined} onClick={()=>void onRun(()=>new DemoPOSAdapter().submitOrder(item.order.id,actor))}>{status==='error'?'Повторить передачу':'Отправить в iiko'}</Button>;
 if(status==='accepted'||status==='in_progress')return <Button mode={mode} size="l" loading={busy} onClick={()=>void onRun(()=>dispatch({type:'posStatus',orderId:item.order.id,status:'ready',actor}))}>Готово к подаче</Button>;
 if(status==='ready')return <Button mode={mode} size="l" loading={busy} onClick={()=>void onRun(()=>dispatch({type:'posStatus',orderId:item.order.id,status:'served',actor}))}>Отметить поданным</Button>;
 return null;
}

type CallFilter='all'|'created'|'accepted'|'completed';
type CallPresentation={call:StaffCall;table:Table;zone:Zone;session:State['sessions'][number]|undefined;actionable:boolean};

const callStatuses:Record<StaffCall['status'],{label:string;tone:TableTone}>={created:{label:'Новый',tone:'warning'},accepted:{label:'Принят',tone:'info'},completed:{label:'Завершён',tone:'success'}};
const callPriority=(item:CallPresentation)=>item.call.status==='created'&&item.actionable?0:item.call.status==='accepted'&&item.actionable?1:item.call.status==='created'?2:item.call.status==='accepted'?3:4;
const callElapsed=(createdAt:string,now:number|null)=>{if(now===null)return '—';const minutes=Math.max(0,Math.floor((now-Date.parse(createdAt))/60000));if(minutes<1)return 'только что';if(minutes<60)return `${minutes} мин`;const hours=Math.floor(minutes/60),rest=minutes%60;return rest?`${hours} ч ${rest} мин`:`${hours} ч`};

function CallsView({state,workspace,busy,onRun}:{state:State;workspace:WaiterWorkspace;busy:boolean;onRun:(action:()=>Promise<unknown>)=>Promise<unknown>}){
 const [filter,setFilter]=useState<CallFilter>('all');
 const [selectedCallId,setSelectedCallId]=useState<string|null>(null);
 const [viewport,setViewport]=useState<'pending'|'mobile'|'split'>('pending');
 const [now,setNow]=useState<number|null>(null);
 useEffect(()=>{const media=window.matchMedia('(min-width: 768px)');const update=()=>setViewport(media.matches?'split':'mobile');update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update)},[]);
 useEffect(()=>{const update=()=>setNow(Date.now());update();const timer=window.setInterval(update,30000);return()=>window.clearInterval(timer)},[]);
 const actionableIds=new Set(workspace.actionableTables.map(table=>table.id));
 const venueZoneIds=new Set(state.zones.filter(zone=>zone.venueId===workspace.venue.id).map(zone=>zone.id));
 const calls=state.calls.flatMap(call=>{const table=state.tables.find(item=>item.id===call.tableId);const zone=table&&state.zones.find(item=>item.id===table.zoneId);const session=call.sessionId?state.sessions.find(item=>item.id===call.sessionId):state.sessions.find(item=>item.tableId===call.tableId&&!item.closed);return call.type==='waiter'&&table&&zone&&venueZoneIds.has(zone.id)?[{call,table,zone,session,actionable:actionableIds.has(table.id)}]:[]}).sort((a,b)=>callPriority(a)-callPriority(b)||Date.parse(a.call.createdAt)-Date.parse(b.call.createdAt));
 const counts={all:calls.length,created:calls.filter(item=>item.call.status==='created').length,accepted:calls.filter(item=>item.call.status==='accepted').length,completed:calls.filter(item=>item.call.status==='completed').length};
 const visible=calls.filter(item=>filter==='all'||item.call.status===filter);
 const selected=visible.find(item=>item.call.id===selectedCallId);
 const visibleIds=visible.map(item=>item.call.id).join('|');
 useEffect(()=>{if(selectedCallId&&!visibleIds.split('|').includes(selectedCallId))setSelectedCallId(null)},[selectedCallId,visibleIds]);
 const actor:OperationalActorContext={authContextId:workspace.authContext.id,shiftId:workspace.shift.id,employeeId:workspace.employee.id,venueId:workspace.venue.id};
 const changeFilter=(next:CallFilter)=>{setFilter(next);setSelectedCallId(null)};
 const action=selected?.actionable&&selected.call.status!=='completed'?<CallAction item={selected} actor={actor} busy={busy} onRun={onRun}/>:undefined;
 return <section className="waiter-calls-workspace" aria-label="Вызовы официанта">
  <div className="waiter-calls-pane">
   <nav className="waiter-call-filters" aria-label="Фильтры вызовов">{([['all','Все'],['created','Новые'],['accepted','В работе'],['completed','Завершённые']] as const).map(([id,label])=><Chip key={id} mode={mode} selected={filter===id} onClick={()=>changeFilter(id)}>{label} · {counts[id]}</Chip>)}</nav>
   {visible.length?<div className="waiter-call-list" aria-live="polite">{visible.map(item=><CallListCard key={item.call.id} item={item} now={now} selected={selectedCallId===item.call.id} onSelect={()=>setSelectedCallId(item.call.id)}/>)}</div>:<div className="waiter-calls-empty"><Bell aria-hidden="true"/><strong>{calls.length?'В этом фильтре вызовов нет':'Активных вызовов нет'}</strong><span>{calls.length?'Список обновится автоматически при изменении статуса.':'Новые обращения гостей появятся здесь автоматически.'}</span></div>}
  </div>
  <aside className="waiter-call-detail-pane" aria-label="Детали вызова" data-split-view={viewport==='split'||undefined}>{selected?<CallDetail item={selected} state={state} now={now} action={action}/>:<div className="waiter-call-detail-empty"><Bell aria-hidden="true"/><strong>Выберите вызов, чтобы увидеть детали</strong><span>Список и выбранный фильтр останутся видимыми.</span></div>}</aside>
  <BottomSheet mode={mode} open={viewport==='mobile'&&Boolean(selected)} onOpenChange={open=>!open&&setSelectedCallId(null)} title={selected?`Вызов · Стол ${selected.table.id}`:'Вызов'} description={selected?selected.zone.name:undefined} actions={<><Button mode={mode} size="l" variant="secondary" onClick={()=>setSelectedCallId(null)}>Закрыть</Button>{action}</>}>
   {selected&&<CallDetail item={selected} state={state} now={now} compactHeader/>}
  </BottomSheet>
 </section>;
}

function CallListCard({item,now,selected,onSelect}:{item:CallPresentation;now:number|null;selected:boolean;onSelect:()=>void}){
 const status=callStatuses[item.call.status];
 return <button type="button" className={`waiter-call-card waiter-call-card-${status.tone}`} aria-pressed={selected} data-selected={selected||undefined} data-read-only={!item.actionable||undefined} onClick={onSelect} aria-label={`Вызов, стол ${item.table.id}, ${status.label}${!item.actionable?', только просмотр':''}`}><span className="waiter-call-card-top"><span><strong>Стол {item.table.id}</strong><small>{item.zone.name} · Официант</small></span><ChevronRight aria-hidden="true"/></span><span className="waiter-call-card-status"><StatusBadge mode={mode} status={status.tone}>{status.label}</StatusBadge><span className="waiter-call-elapsed">{callElapsed(item.call.createdAt,now)}</span>{!item.actionable&&<Badge mode={mode}>Только просмотр</Badge>}</span><span className="waiter-call-card-meta"><time>{new Date(item.call.createdAt).toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'})}</time><span>{item.session?`${item.session.guestIds.length} ${item.session.guestIds.length===1?'гость':'гостей'}`:'Без активного посещения'}</span></span></button>;
}

function CallDetail({item,state,now,action,compactHeader=false}:{item:CallPresentation;state:State;now:number|null;action?:ReactNode;compactHeader?:boolean}){
 const status=callStatuses[item.call.status];
 const responsible=state.employees.find(employee=>employee.id===item.table.waiterId)?.name;
 const acceptedBy=state.employees.find(employee=>employee.id===item.call.acceptedByEmployeeId)?.name;
 return <div className="waiter-call-detail">{compactHeader?<div className="waiter-call-mobile-status"><span>{new Date(item.call.createdAt).toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'})} · Официант</span><div className="waiter-call-detail-badges"><StatusBadge mode={mode} status={status.tone}>{status.label}</StatusBadge>{!item.actionable&&<Badge mode={mode}>Только просмотр</Badge>}</div></div>:<header><div><p>{item.zone.name}</p><h2>Стол {item.table.id}</h2><span>{new Date(item.call.createdAt).toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'})} · Официант</span></div><div className="waiter-call-detail-badges"><StatusBadge mode={mode} status={status.tone}>{status.label}</StatusBadge>{!item.actionable&&<Badge mode={mode}>Только просмотр</Badge>}</div></header>}
  <section className="waiter-call-context"><h3>Обращение</h3><dl><div><dt>Тип</dt><dd>Вызов официанта</dd></div><div><dt>Стол</dt><dd>{item.table.id}</dd></div><div><dt>Зона</dt><dd>{item.zone.name}</dd></div><div><dt>Создан</dt><dd>{new Date(item.call.createdAt).toLocaleString('ru-RU',{hour:'2-digit',minute:'2-digit',day:'2-digit',month:'short'})}</dd></div><div><dt>Ожидание</dt><dd>{callElapsed(item.call.createdAt,now)}</dd></div>{responsible&&<div><dt>Ответственный</dt><dd>{responsible}</dd></div>}{acceptedBy&&<div><dt>Принял</dt><dd>{acceptedBy}</dd></div>}</dl></section>
  {item.session?<section className="waiter-call-context"><h3>Посещение</h3><dl><div><dt>Статус</dt><dd>{item.session.closed?'Закрыто':'Активно'}</dd></div><div><dt>Гостей</dt><dd>{item.session.guestIds.length}</dd></div><div><dt>Открыто</dt><dd>{new Date(item.session.createdAt).toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'})}</dd></div></dl></section>:<Alert mode={mode} status="info" title="Без активного посещения">Вызов относится к столу, но активная ресторанная сессия не найдена.</Alert>}
  {!item.actionable&&<Alert mode={mode} status="info" title="Только просмотр">Стол не входит в текущее назначение. Принять или завершить вызов нельзя.</Alert>}
  {action&&<div className="waiter-call-actions">{action}</div>}
 </div>;
}

function CallAction({item,actor,busy,onRun}:{item:CallPresentation;actor:OperationalActorContext;busy:boolean;onRun:(action:()=>Promise<unknown>)=>Promise<unknown>}){
 const next=item.call.status==='created'?'accepted':'completed';
 return <Button mode={mode} size="l" loading={busy} onClick={()=>void onRun(()=>dispatch({type:'staffCallStatus',id:item.call.id,role:'waiter',status:next,actor}))}>{next==='accepted'?'Принять вызов':'Завершить вызов'}</Button>;
}

type TableTone='success'|'warning'|'error'|'info'|'neutral';
type TablePresentation={table:Table;zone:Zone;actionable:boolean;session:State['sessions'][number]|undefined;orders:State['orders'];call:State['calls'][number]|undefined;cash:State['payments'][number]|undefined;tone:TableTone;status:string;detail:string;total:number};

function tablePresentation(state:State,workspace:WaiterWorkspace,table:Table):TablePresentation{
 const zone=state.zones.find(item=>item.id===table.zoneId)!;
 const session=state.sessions.find(item=>item.tableId===table.id&&!item.closed);
 const orders=session?state.orders.filter(item=>item.sessionId===session.id&&item.executionStatus!=='cancelled'):[];
 const call=state.calls.find(item=>item.tableId===table.id&&item.type==='waiter'&&item.status!=='completed');
 const cash=session?state.payments.find(item=>item.sessionId===session.id&&item.method==='cash'&&item.status==='pending'):undefined;
 const latest=orders.at(-1);
 const hasError=orders.some(item=>item.executionStatus==='error');
 const ready=orders.some(item=>item.executionStatus==='ready');
 const actionable=workspace.actionableTables.some(item=>item.id===table.id);
 let tone:TableTone='neutral',status='Свободен',detail='Нет активного посещения';
 if(call){tone='warning';status=call.status==='created'?'Вызов гостя':'Вызов принят';detail='Требуется внимание'}
 else if(hasError){tone='error';status='Ошибка POS';detail='Нужна повторная передача'}
 else if(cash){tone='warning';status='Ожидаются наличные';detail=formatMoney(cash.total)}
 else if(ready){tone='success';status='Готово к подаче';detail=`${orders.length} ${orders.length===1?'заказ':'заказа'}`}
 else if(latest){tone='info';status=latest.executionStatus==='submitted'?'Новый заказ':latest.executionStatus==='accepted'?'Принят кухней':latest.executionStatus==='in_progress'?'Готовится':latest.executionStatus==='served'?'Подано':'Активный заказ';detail=`${orders.length} ${orders.length===1?'заказ':'заказа'}`}
 else if(session){status='Занят';detail=`${session.guestIds.length} ${session.guestIds.length===1?'гость':'гостей'}`}
 return {table,zone,actionable,session,orders,call,cash,tone,status,detail,total:session?calculateBill(state,session.id).total:0};
}

function FloorView({state,workspace,selectedZone,onSelectZone,selectedTableId,onSelectTable,onNavigate,onRun}:{state:State;workspace:WaiterWorkspace;selectedZone:string;onSelectZone:(zone:string)=>void;selectedTableId:number|null;onSelectTable:(table:number|null)=>void;onNavigate:(target:string)=>void;onRun:(action:()=>Promise<unknown>)=>Promise<unknown>}){
 const [viewport,setViewport]=useState<'pending'|'mobile'|'split'>('pending');
 useEffect(()=>{const media=window.matchMedia('(min-width: 768px)');const update=()=>setViewport(media.matches?'split':'mobile');update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update)},[]);
 const splitView=viewport==='split';
 const zones=state.zones.filter(zone=>zone.venueId===workspace.venue.id);
 const tables=[...workspace.actionableTables,...workspace.readOnlyTables].filter(table=>selectedZone==='all'||table.zoneId===selectedZone).map(table=>tablePresentation(state,workspace,table));
 const assigned=tables.filter(item=>item.actionable),readOnly=tables.filter(item=>!item.actionable);
 const ready=workspace.orders.filter(order=>order.executionStatus==='ready').length;
 const errors=workspace.orders.filter(order=>order.executionStatus==='error').length;
 const priorityCount=workspace.calls.length+workspace.pendingCashPayments.length+ready+errors;
 const selected=selectedTableId===null?undefined:tablePresentation(state,workspace,state.tables.find(table=>table.id===selectedTableId)!);
 const actor={authContextId:workspace.authContext.id,shiftId:workspace.shift.id,employeeId:workspace.employee.id,venueId:workspace.venue.id};
 const openOperations=()=>{onSelectTable(null);onNavigate('more')};
 const handleCall=async()=>{if(!selected?.call)return;const completed=selected.call.status==='accepted';await onRun(()=>dispatch({type:'staffCallStatus',id:selected.call!.id,role:'waiter',status:completed?'completed':'accepted',actor}));if(completed&&!splitView)onSelectTable(null)};
 const selectZone=(zoneId:string)=>{onSelectZone(zoneId);if(selected&&zoneId!=='all'&&selected.table.zoneId!==zoneId)onSelectTable(null)};
 const actions=selected?.actionable?<>{selected.call&&<Button mode={mode} size="l" onClick={()=>void handleCall()}>{selected.call.status==='created'?'Принять вызов':'Завершить вызов'}</Button>}<Button mode={mode} size="l" variant={selected.call?'secondary':'primary'} onClick={openOperations}>{selected.orders.length?'Открыть заказ':'Создать заказ'}</Button></>:undefined;
 return <section className="waiter-floor-workspace" aria-label="Зал официанта">
  <div className="waiter-floor-pane">
   {zones.length>1?<nav className="waiter-zones" aria-label="Зоны зала"><Chip mode={mode} selected={selectedZone==='all'} onClick={()=>selectZone('all')}>Все</Chip>{zones.map(zone=><Chip key={zone.id} mode={mode} selected={selectedZone===zone.id} onClick={()=>selectZone(zone.id)}>{zone.name}{workspace.assignedZones.some(item=>item.id===zone.id)?' · моя':''}</Chip>)}</nav>:<div className="waiter-zone-single"><Map aria-hidden="true"/><span>{zones[0]?.name}</span></div>}
   <div className="waiter-summary" aria-label="Операционная сводка"><span><strong>{selectedZone==='all'?workspace.actionableTables.length:tables.length}</strong> столов</span>{workspace.orders.length>0&&<span><strong>{workspace.orders.length}</strong> заказов</span>}{workspace.calls.length>0&&<span><strong>{workspace.calls.length}</strong> вызовов</span>}{ready>0&&<span><strong>{ready}</strong> готово</span>}{workspace.pendingCashPayments.length>0&&<span><strong>{workspace.pendingCashPayments.length}</strong> наличные</span>}</div>
   {priorityCount===0?<div className="waiter-priority waiter-priority-calm"><CheckCircle2 aria-hidden="true"/><span>Всё спокойно</span></div>:<div className="waiter-priority waiter-priority-active"><AlertTriangle aria-hidden="true"/><div><strong>Требуется внимание · {priorityCount}</strong><span>{workspace.calls.length>0&&`${workspace.calls.length} вызов · `}{ready>0&&`${ready} готово · `}{errors>0&&`${errors} POS · `}{workspace.pendingCashPayments.length>0&&`${workspace.pendingCashPayments.length} наличные`}</span></div></div>}
   <TableSection title="Мои столы" items={assigned} selectedTableId={selectedTableId} onSelect={onSelectTable}/>
   {readOnly.length>0&&<TableSection title="Другие столы" items={readOnly} selectedTableId={selectedTableId} onSelect={onSelectTable} readOnly/>}
  </div>
  <aside className="waiter-detail-pane" aria-label="Детали стола" data-split-view={splitView||undefined}>{selected?<TableDetailPanel state={state} data={selected} actions={actions}/>:<div className="waiter-detail-empty"><UtensilsCrossed aria-hidden="true"/><strong>Выберите стол, чтобы увидеть детали</strong><span>Зал останется видимым во время работы со столом.</span></div>}</aside>
  <BottomSheet mode={mode} open={viewport==='mobile'&&Boolean(selected)} onOpenChange={open=>!open&&onSelectTable(null)} title={selected?`Стол ${selected.table.id}`:'Стол'} description={selected?`${selected.zone.name} · ${selected.actionable?'Мой стол':'Только просмотр'}`:undefined} actions={selected?.actionable?actions:<Button mode={mode} size="l" variant="secondary" onClick={()=>onSelectTable(null)}>Закрыть</Button>}>
   {selected&&<TableDetail state={state} data={selected}/>} 
  </BottomSheet>
 </section>;
}

function TableSection({title,items,selectedTableId,onSelect,readOnly=false}:{title:string;items:TablePresentation[];selectedTableId:number|null;onSelect:(table:number)=>void;readOnly?:boolean}){return <section className="waiter-table-section"><div className="waiter-section-title"><h2>{title}</h2><Badge mode={mode}>{items.length}</Badge></div>{items.length?<div className="waiter-table-grid">{items.map(item=>{const active=Boolean(item.session||item.orders.length||item.call||item.cash);return <button type="button" className={`waiter-table-card waiter-table-${item.tone}`} data-read-only={!item.actionable||undefined} data-active={active||undefined} data-empty={!active||undefined} data-selected={selectedTableId===item.table.id||undefined} aria-pressed={selectedTableId===item.table.id} key={item.table.id} onClick={()=>onSelect(item.table.id)} aria-label={`Стол ${item.table.id}, ${item.status}${!item.actionable?', только просмотр':''}`}><span className="waiter-table-top"><strong>Стол {item.table.id}</strong><ChevronRight aria-hidden="true"/></span><StatusBadge mode={mode} status={item.tone}>{item.status}</StatusBadge><span className="waiter-table-detail">{item.detail}</span>{!item.actionable&&<span className="waiter-readonly-label"><span className="waiter-readonly-mobile">Только просмотр</span><span className="waiter-readonly-desktop">Просмотр</span></span>}{item.total>0&&<strong className="waiter-table-total">{formatMoney(item.total)}</strong>}</button>})}</div>:<p className="waiter-floor-empty">В выбранной зоне нет {readOnly?'доступных для просмотра':'назначенных'} столов.</p>}</section>}

function TableDetailPanel({state,data,actions}:{state:State;data:TablePresentation;actions?:ReactNode}){return <div className="waiter-detail-panel"><header><div><p>{data.zone.name}</p><h2>Стол {data.table.id}</h2></div><div className="waiter-detail-badges"><Badge mode={mode}>{data.actionable?'Мой стол':'Только просмотр'}</Badge><StatusBadge mode={mode} status={data.tone}>{data.status}</StatusBadge></div></header><TableDetail state={state} data={data}/>{actions&&<div className="waiter-detail-actions">{actions}</div>}</div>}

function TableDetail({state,data}:{state:State;data:TablePresentation}){
 const bill=data.session?calculateBill(state,data.session.id):undefined;
 const responsible=state.employees.find(employee=>employee.id===data.table.waiterId)?.name;
 const paymentLabel=bill?.financialStatus==='paid'?'Оплачен':bill?.financialStatus==='partially_paid'?'Частично оплачен':'Не оплачен';
 return <div className="waiter-table-sheet"><div className="waiter-table-sheet-status"><StatusBadge mode={mode} status={data.tone}>{data.status}</StatusBadge>{!data.actionable&&<Badge mode={mode}>Только просмотр</Badge>}</div>{data.session?<><section className="waiter-detail-section"><h3>Посещение</h3><dl><div><dt>Статус</dt><dd>Активно</dd></div><div><dt>Гости</dt><dd>{data.session.guestIds.length}</dd></div><div><dt>Открыто</dt><dd>{new Date(data.session.createdAt).toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'})}</dd></div>{responsible&&<div><dt>Официант</dt><dd>{responsible}</dd></div>}</dl></section><section className="waiter-detail-section"><h3>Счёт</h3><dl><div><dt>Итого</dt><dd>{formatMoney(bill?.total??0)}</dd></div><div><dt>Оплачено</dt><dd>{formatMoney(bill?.paid??0)}</dd></div><div><dt>Осталось</dt><dd>{formatMoney(bill?.unpaidBalance??0)}</dd></div><div><dt>Статус</dt><dd>{paymentLabel}</dd></div></dl></section></>:<div className="waiter-table-no-session"><UtensilsCrossed aria-hidden="true"/><span>Активного посещения и заказов нет.</span></div>}{data.call&&<Alert mode={mode} status="warning" title="Вызов официанта">{data.call.status==='created'?'Гость ждёт ответа.':'Вызов принят и ожидает завершения.'} · {new Date(data.call.createdAt).toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'})}</Alert>}{data.cash&&<Alert mode={mode} status="warning" title="Наличные ожидают подтверждения"><CircleDollarSign aria-hidden="true"/> {formatMoney(data.cash.total)}</Alert>}{data.orders.length>0&&<section className="waiter-table-orders"><h3>Заказы</h3>{data.orders.map(order=><Card mode={mode} key={order.id}><div className="waiter-order-heading"><strong>{order.id}</strong><StatusBadge mode={mode} status={order.executionStatus==='error'?'error':order.executionStatus==='ready'?'success':'info'}>{order.executionStatus==='submitted'?'Заказ отправлен':order.executionStatus==='accepted'?'Принят кухней':order.executionStatus==='in_progress'?'Готовится':order.executionStatus==='ready'?'Готово':order.executionStatus==='error'?'Ошибка POS':order.executionStatus}</StatusBadge></div><small>{new Date(order.createdAt).toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'})} · {formatMoney(order.items.reduce((sum,item)=>sum+itemTotal(item),0))}</small>{order.items.map(item=><p key={item.id}>{item.name} × {item.quantity}</p>)}</Card>)}</section>}</div>;
}
