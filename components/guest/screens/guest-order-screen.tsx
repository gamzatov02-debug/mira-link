'use client';

import {useMemo,useState} from 'react';
import {ChevronRight,ReceiptText,UtensilsCrossed} from 'lucide-react';
import {BottomSheet,Button,EmptyState,StatusBadge} from '@/components/design-system';
import {ProductImage} from '@/components/mira-domain-ui';
import {orderStatusPresentation,guestProductionMode} from '@/components/guest/adapters/status';
import {formatMoney,itemTotal} from '@/lib/domain/selectors';
import type {ExecutionStatus,Order,OrderItem,Product,State} from '@/lib/domain/model';
import styles from './guest-order-screen.module.css';

const servedStatuses=new Set<ExecutionStatus>(['served','completed']);
const inactiveStatuses=new Set<ExecutionStatus>(['served','completed','cancelled']);
const time=(value:string)=>new Date(value).toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'});
const positions=(count:number)=>{const mod100=count%100,mod10=count%10;return mod100>=11&&mod100<=14?'позиций':mod10===1?'позиция':mod10>=2&&mod10<=4?'позиции':'позиций'};

type Selection={order:Order;item:OrderItem}|null;

function progressSummary(orders:Order[]){
 const active=orders.filter(order=>!inactiveStatuses.has(order.executionStatus));
 const count=active.reduce((sum,order)=>sum+order.items.length,0);
 if(!active.length)return 'Нет позиций в работе';
 if(active.some(order=>order.executionStatus==='error'))return 'Нужно внимание команды';
 if(active.every(order=>order.executionStatus==='ready'))return 'Всё готово';
 if(active.some(order=>order.executionStatus==='in_progress'))return `${count} ${positions(count)} в работе`;
 if(active.every(order=>['submitted','accepted'].includes(order.executionStatus)))return `${count} ${positions(count)} приняты`;
 return `${count} ${positions(count)} в работе`;
}

function DishImage({product,name,className}:{product?:Product;name:string;className?:string}){
 if(product)return <ProductImage product={product} className={className}/>;
 return <span className={`${styles.placeholder} ${className??''}`} role="img" aria-label={`${name}: фото пока нет`}><UtensilsCrossed aria-hidden="true"/></span>;
}

function ItemRow({state,order,item,showGuest,onOpen}:{state:State;order:Order;item:OrderItem;showGuest:boolean;onOpen:()=>void}){
 const product=state.products.find(candidate=>candidate.id===item.productId);
 const guest=state.guests.find(candidate=>candidate.id===item.guestId);
 const status=orderStatusPresentation(order.executionStatus);
 const unit=item.unitPriceSnapshot+item.modifierPriceSnapshot;
 return <button type="button" className={styles.item} onClick={onOpen} aria-label={`Детали заказа: ${item.name}`}>
  <DishImage product={product} name={item.name} className={styles.thumb}/>
  <span className={styles.itemCopy}>
   <strong>{item.name}</strong>
   <small>{item.quantity} × {formatMoney(unit)}</small>
   {(item.modifiers.length>0||item.comment)&&<small className={styles.options}>{[item.modifiers.join(' · '),item.comment].filter(Boolean).join(' · ')}</small>}
   {showGuest&&guest&&<small>{guest.name}</small>}
  </span>
  <span className={styles.itemTrailing}>
   <StatusBadge mode={guestProductionMode} status={status.tone}>{status.label}</StatusBadge>
   <span><strong>{formatMoney(itemTotal(item))}</strong><ChevronRight aria-hidden="true"/></span>
  </span>
 </button>;
}

function OrderGroup({state,order,label,showGuest,onSelect}:{state:State;order:Order;label:string;showGuest:boolean;onSelect:(selection:Selection)=>void}){
 const status=orderStatusPresentation(order.executionStatus);
 return <section className={styles.group} aria-label={label}>
  <header className={styles.groupHeader}>
   <div><h2>{label}</h2><p>{time(order.createdAt)} · {order.items.length} {positions(order.items.length)}</p></div>
   <StatusBadge mode={guestProductionMode} status={status.tone}>{status.label}</StatusBadge>
  </header>
  <div className={styles.items}>{order.items.map(item=><ItemRow state={state} order={order} item={item} showGuest={showGuest} onOpen={()=>onSelect({order,item})} key={item.id}/>)}</div>
 </section>;
}

export function GuestOrderScreen({state,sessionId,onOpenMenu,onOpenBill}:{state:State;sessionId?:string;onOpenMenu:()=>void;onOpenBill:()=>void}){
 const [servedOpen,setServedOpen]=useState(false),[selection,setSelection]=useState<Selection>(null);
 const session=sessionId?state.sessions.find(candidate=>candidate.id===sessionId):undefined;
 const orders=useMemo(()=>state.orders.filter(order=>order.sessionId===sessionId).sort((a,b)=>Date.parse(a.createdAt)-Date.parse(b.createdAt)),[state.orders,sessionId]);
 const served=orders.filter(order=>servedStatuses.has(order.executionStatus));
 const active=orders.filter(order=>!servedStatuses.has(order.executionStatus));
 const servedCount=served.reduce((sum,order)=>sum+order.items.length,0);
 const allServed=orders.length>0&&orders.every(order=>servedStatuses.has(order.executionStatus));
 const showGuest=Boolean(session&&session.guestIds.length>1);
 const selectedProduct=selection&&state.products.find(product=>product.id===selection.item.productId);
 const selectedGuest=selection&&state.guests.find(guest=>guest.id===selection.item.guestId);
 const selectedStatus=selection&&orderStatusPresentation(selection.order.executionStatus);

 return <section className={styles.screen} aria-label="Мой заказ">
  <header className={styles.pageHeader}>
   <span>ТЕКУЩЕЕ ПОСЕЩЕНИЕ</span>
   <h1>Мой заказ</h1>
   {session&&<p><strong>{state.venue.name}</strong><i aria-hidden="true">·</i> Стол {session.tableId}</p>}
  </header>

  {!orders.length&&<EmptyState mode={guestProductionMode} icon={<ReceiptText aria-hidden="true"/>} title="Вы ещё ничего не заказали" description="Выберите блюда в меню — здесь появится их статус приготовления." primaryAction={<Button mode={guestProductionMode} size="l" onClick={onOpenMenu}>Открыть меню</Button>}/>}

  {orders.length>0&&<>
   <section className={styles.summary} aria-label="Статус заказа">
    <span>{allServed?'ЗАВЕРШЕНО':'СЕЙЧАС'}</span>
    <strong>{allServed?'Всё подано':progressSummary(orders)}</strong>
    <p>{orders.reduce((sum,order)=>sum+order.items.length,0)} {positions(orders.reduce((sum,order)=>sum+order.items.length,0))} в этом посещении</p>
   </section>

   {active.map(order=><OrderGroup state={state} order={order} label={orders.indexOf(order)===0?'Текущий заказ':'Дозаказ'} showGuest={showGuest} onSelect={setSelection} key={order.id}/>)}

   {servedCount>0&&<section className={styles.served}>
    <button type="button" onClick={()=>setServedOpen(value=>!value)} aria-expanded={servedOpen}>
     <span><strong>Уже подано · {servedCount} {positions(servedCount)}</strong><small>Позиции, которые уже принесли</small></span>
     <ChevronRight aria-hidden="true"/>
    </button>
    {servedOpen&&<div className={styles.servedItems}>{served.flatMap(order=>order.items.map(item=><ItemRow state={state} order={order} item={item} showGuest={showGuest} onOpen={()=>setSelection({order,item})} key={item.id}/>))}</div>}
   </section>}

   {!session?.closed&&<button type="button" className={styles.reorder} aria-label="Дозаказать" onClick={onOpenMenu}><span aria-hidden="true">＋</span><span><strong>Дозаказать</strong><small>Открыть меню этого ресторана</small></span><ChevronRight aria-hidden="true"/></button>}

   <footer className={styles.billLink}><p>Все заказы этого посещения входят в общий счёт.</p><button type="button" onClick={onOpenBill}>Перейти к счёту <ChevronRight aria-hidden="true"/></button></footer>
  </>}

  <BottomSheet mode={guestProductionMode} presentation="responsive-dialog" title="Детали заказа" description="Фактически отправленная конфигурация" open={Boolean(selection)} onOpenChange={open=>{if(!open)setSelection(null)}}>
   {selection&&<article className={styles.details}>
    <DishImage product={selectedProduct||undefined} name={selection.item.name} className={styles.detailImage}/>
    <div className={styles.detailHeading}><div><h2>{selection.item.name}</h2>{selectedGuest&&<p>{selectedGuest.name}</p>}</div>{selectedStatus&&<StatusBadge mode={guestProductionMode} status={selectedStatus.tone}>{selectedStatus.label}</StatusBadge>}</div>
    <dl>
     <div><dt>Количество</dt><dd>{selection.item.quantity}</dd></div>
     {selection.item.modifiers.length>0&&<div><dt>Выбрано</dt><dd>{selection.item.modifiers.join(' · ')}</dd></div>}
     {selection.item.comment&&<div><dt>Комментарий</dt><dd>{selection.item.comment}</dd></div>}
     <div><dt>Цена позиции</dt><dd>{formatMoney(itemTotal(selection.item))}</dd></div>
     <div><dt>Отправлено</dt><dd>{time(selection.order.createdAt)}</dd></div>
    </dl>
    <p className={styles.readOnly}>Заказ уже отправлен. Изменить эту позицию здесь нельзя.</p>
   </article>}
  </BottomSheet>
 </section>;
}
