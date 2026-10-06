'use client';

import {useState} from 'react';
import {ArrowLeft,Banknote,ChevronRight,CreditCard,ReceiptText,QrCode,UserRound} from 'lucide-react';
import {Alert,Button,Card,Checkbox,Chip,Field,Radio,StatusBadge,TextInput} from '@/components/design-system';
import type {MiraMode} from '@/components/design-system/tokens';
import styles from './guest-bill-screen.module.css';

type Tone='success'|'warning'|'error'|'info'|'neutral'|'pending';
type SplitMode='all'|'own'|'items'|'equal'|'custom';
type BillItem={id:string;name:string;quantity:number;unitPrice:string;total:string;details:string[];guest?:string};
type SplitItem={id:string;label:string;remaining:string;disabled:boolean;selected:boolean};
type PaymentRecord={id:string;method:string;total:string;tone:Tone;label:string};

export type GuestBillScreenProps={
 mode:MiraMode;
 venueName:string;
 tableId?:number;
 status:{tone:Tone;label:string};
 items:BillItem[];
 billTotal:string;
 paidAmount?:string;
 remainingAmount:string;
 closed:boolean;
 busy:boolean;
 error?:string;
 split:{expanded:boolean;mode?:SplitMode;partAmount?:string;items:SplitItem[];customAmount:string};
 bonus?:{value:string;applied?:string;available:string;balance:string;limit:string};
 tips:{amount:string;preset:number|null;custom:string;waiterName?:string;waiterPhoto?:string;showCommissionControl:boolean;guestPaysCommission:boolean;commission:string;commissionNote?:string;cashNote?:string};
 payment:{method:'online'|'cash';payable:string;restaurantAmount:string;splitAmount?:string;bonusAmount?:string;tipAmount?:string;commissionAmount?:string;pending?:{method:'online'|'cash';total:string;tone:Tone;label:string};records:PaymentRecord[]};
 onBack:()=>void;
 onSplitChange:(expanded:boolean)=>void;
 onToggleItem:(id:string,checked:boolean)=>void;
 onSplitMode:(mode:'all'|'own'|'items'|'equal')=>void;
 onCustomAmount:(value:string)=>void;
 onCustomSubmit:()=>void;
 onBonus?:(value:string)=>void;
 onTipPreset:(value:number)=>void;
 onCustomTip:(value:string)=>void;
 onGuestPaysCommission:(value:boolean)=>void;
 onMethodChange:(method:'online'|'cash')=>void;
 onSubmit:()=>void;
 onConfirm:(success:boolean)=>void;
};

const tipPresets=[0,10,15,20,25];

export function GuestBillScreen(props:GuestBillScreenProps){
 const {mode,venueName,tableId,status,items,billTotal,paidAmount,remainingAmount,closed,busy,error,split,bonus,tips,payment}=props;
 const [showAll,setShowAll]=useState(false);
 const [bonusOpen,setBonusOpen]=useState(Boolean(bonus?.applied));
 const visibleItems=showAll?items:items.slice(0,4);
 const bonusExpanded=bonusOpen||Boolean(bonus?.applied);
 const canPay=!closed&&!!split.partAmount&&!payment.pending;
 const payLabel=payment.method==='cash'?`Передать ${payment.payable} наличными`:`Оплатить ${payment.payable}`;
 return <section className={styles.screen} aria-labelledby="guest-bill-title">
  <header className={styles.header}>
   <button type="button" className={styles.back} aria-label="Назад к посещению" onClick={props.onBack}><ArrowLeft aria-hidden="true"/></button>
   <div><span className={styles.eyebrow}>ТЕКУЩЕЕ ПОСЕЩЕНИЕ</span><h1 id="guest-bill-title">Мой счёт</h1></div>
   <StatusBadge mode={mode} status={status.tone}>{status.label}</StatusBadge>
   <p><strong>{venueName}</strong>{tableId&&<span>Стол {tableId}</span>}</p>
  </header>

  <Card mode={mode} className={styles.billCard}>
   <div className={styles.sectionTitle}><span aria-hidden="true"><ReceiptText/></span><div><h2>Ваш заказ</h2><p>{items.length} {items.length===1?'позиция':'позиций'} в текущем счёте</p></div></div>
   <div className={styles.items}>
    {visibleItems.map(item=><div className={styles.item} key={item.id}>
     <div><strong>{item.name}</strong>{item.details.map(detail=><small key={detail}>{detail}</small>)}{item.guest&&<small>{item.guest}</small>}<span>{item.quantity} × {item.unitPrice}</span></div>
     <strong>{item.total}</strong>
    </div>)}
   </div>
   {items.length>4&&<Button mode={mode} variant="link" size="m" onClick={()=>setShowAll(value=>!value)}>{showAll?'Свернуть':`Показать все ${items.length} позиций`}</Button>}
   <div className={styles.billTotals}>
    <div><span>Сумма заказа</span><strong>{billTotal}</strong></div>
    {paidAmount&&<div><span>Уже оплачено</span><strong>−{paidAmount}</strong></div>}
    <div className={styles.remaining}><span>Осталось</span><strong>{remainingAmount}</strong></div>
   </div>
  </Card>

  {!closed&&<Card mode={mode} className={styles.sectionCard}>
   <h2 className={styles.visuallyHidden}>Разделение счёта</h2>
   <button type="button" className={styles.compactRow} aria-expanded={split.expanded} disabled={busy||!!payment.pending} onClick={()=>props.onSplitChange(!split.expanded)}><span><strong>Разделить счёт</strong><small>По блюдам, поровну или своей суммой</small></span><span className={styles.rowTrailing}><ChevronRight aria-hidden="true"/></span></button>
   {split.expanded&&<div className={styles.disclosure} role="region" aria-label="Варианты разделения счёта">
    <h3>Как разделить?</h3>
    <div className={styles.splitModes}>
     <Button mode={mode} size="m" variant={split.mode==='own'?'primary':'secondary'} disabled={busy} onClick={()=>props.onSplitMode('own')}>Свои позиции</Button>
     <Button mode={mode} size="m" variant={split.mode==='items'?'primary':'secondary'} disabled={busy} onClick={()=>props.onSplitMode('items')}>По блюдам</Button>
     <Button mode={mode} size="m" variant={split.mode==='equal'?'primary':'secondary'} disabled={busy} onClick={()=>props.onSplitMode('equal')}>Поровну</Button>
     <Button mode={mode} size="m" variant={split.mode==='all'?'primary':'secondary'} disabled={busy} onClick={()=>props.onSplitMode('all')}>Оплатить весь остаток</Button>
    </div>
    <div className={styles.splitItems}><h3>Позиции счёта</h3>{split.items.map(item=><Checkbox key={item.id} mode={mode} label={<span>{item.label}<small>Остаток {item.remaining}</small></span>} checked={item.selected} disabled={item.disabled||busy} onCheckedChange={checked=>props.onToggleItem(item.id,checked===true)}/>)}</div>
    <div className={styles.customSplit}><Field mode={mode} label="Своя сумма, ₽"><TextInput mode={mode} type="number" inputMode="decimal" min="0" value={split.customAmount} disabled={busy} onChange={event=>props.onCustomAmount(event.target.value)}/></Field><Button mode={mode} size="m" disabled={busy||!split.customAmount} onClick={props.onCustomSubmit}>Выбрать</Button></div>
   </div>}
   {split.expanded&&split.partAmount&&<div className={styles.partAmount}><span>Ваша часть счёта</span><strong>{split.partAmount}</strong></div>}
   {error&&<Alert mode={mode} status="error" title="Не удалось выбрать часть счёта">{error}</Alert>}
  </Card>}

  {split.partAmount&&!payment.pending&&<>
   <Card mode={mode} className={styles.sectionCard}>
    {bonus?<button type="button" className={styles.compactRow} aria-expanded={bonusExpanded} disabled={busy} onClick={()=>setBonusOpen(value=>!value)}><span><strong>Бонусы MIRA</strong><small>Доступно {bonus.available}</small></span><span className={styles.rowTrailing}>{bonus.applied&&<strong>−{bonus.applied}</strong>}<ChevronRight aria-hidden="true"/></span></button>:<div className={styles.compactRowStatic}><span><strong>Бонусы MIRA</strong><small>Доступны после входа в профиль</small></span></div>}
    {bonus&&bonusExpanded&&<div className={styles.bonusDisclosure}><Field mode={mode} label="Использовать бонусы, ₽" help={`Баланс ${bonus.balance} · лимит ${bonus.limit} от суммы заказа`}><TextInput mode={mode} type="number" inputMode="decimal" min="0" max={Number(bonus.available.replace(/[^0-9,]/g,'').replace(',','.'))||undefined} value={bonus.value} disabled={busy} onChange={event=>props.onBonus?.(event.target.value)}/></Field></div>}
   </Card>

   <Card mode={mode} className={styles.sectionCard}>
    <div className={styles.tipHeader}>{tips.waiterPhoto?<img src={tips.waiterPhoto} alt={`Официант ${tips.waiterName??''}`}/>:<span className={styles.waiterFallback} aria-hidden="true"><UserRound/></span>}<div><h2>Чаевые официанту</h2><p>{tips.waiterName?<><strong>{tips.waiterName}</strong> · Ваш официант</>:'Ваш официант'}</p></div><strong>{tips.amount}</strong></div>
    <div className={styles.tipPresets} role="group" aria-label="Размер чаевых">{tipPresets.map(value=><Chip key={value} mode={mode} selected={tips.preset===value} disabled={busy} onClick={()=>props.onTipPreset(value)}>{value}%</Chip>)}</div>
    <label className={styles.customTip}><span>Другая сумма</span><span><TextInput mode={mode} aria-label="Другая сумма чаевых, ₽" type="number" inputMode="decimal" min="0" step="1" value={tips.custom} disabled={busy} onChange={event=>props.onCustomTip(event.target.value)}/><b>₽</b></span></label>
    {tips.showCommissionControl&&<Checkbox mode={mode} className={styles.commissionControl} checked={tips.guestPaysCommission} disabled={busy} label="Оплатить комиссию сервиса за чаевые" onCheckedChange={checked=>props.onGuestPaysCommission(checked===true)}/>}
    {tips.commissionNote&&<p className={styles.helper}>{tips.commissionNote}</p>}
    {tips.cashNote&&<p className={styles.helper}>{tips.cashNote}</p>}
   </Card>

   <Card mode={mode} className={styles.sectionCard}>
    <h2>Способ оплаты</h2>
    <div className={styles.paymentMethods}>
     <Radio mode={mode} name="payment-method" aria-label="Онлайн" className={styles.paymentMethod} checked={payment.method==='online'} disabled={busy} label={<span className={styles.methodContent}><span className={styles.methodIcon}><QrCode/><CreditCard/></span><span><strong>Онлайн</strong><small>СБП или банковская карта</small></span><span className={styles.brands}><b>СБП</b><b>МИР</b></span></span>} onChange={()=>props.onMethodChange('online')}/>
     <Radio mode={mode} name="payment-method" aria-label="Наличными" className={styles.paymentMethod} checked={payment.method==='cash'} disabled={busy} label={<span className={styles.methodContent}><span className={styles.methodIcon}><Banknote/></span><span><strong>Наличными</strong><small>Передайте официанту</small></span></span>} onChange={()=>props.onMethodChange('cash')}/>
    </div>
   </Card>

   <Card mode={mode} className={`${styles.sectionCard} ${styles.breakdown}`}>
    <h2>К оплате сейчас</h2>
    <div><span>{payment.splitAmount?'Счёт ресторана':'Сумма заказа'}</span><strong>{payment.restaurantAmount}</strong></div>
    {payment.splitAmount&&<div><span>Ваша часть</span><strong>{payment.splitAmount}</strong></div>}
    {payment.bonusAmount&&<div><span>Бонусы</span><strong>−{payment.bonusAmount}</strong></div>}
    {payment.tipAmount&&<div><span>Чаевые</span><strong>+{payment.tipAmount}</strong></div>}
    {payment.commissionAmount&&<div><span>Комиссия за чаевые</span><strong>+{payment.commissionAmount}</strong></div>}
    <div className={styles.finalTotal}><span>Итого к оплате</span><strong>{payment.payable}</strong></div>
   </Card>
  </>}

  {payment.pending&&<Card mode={mode} className={styles.pendingCard}><Alert mode={mode} status={payment.pending.tone==='pending'?'info':payment.pending.tone} title={payment.pending.label}>{payment.pending.total}</Alert>{payment.pending.method==='online'&&<div className={styles.confirmActions}><Button mode={mode} size="l" loading={busy} onClick={()=>props.onConfirm(true)}>Симулировать успешную оплату</Button><Button mode={mode} size="l" variant="secondary" disabled={busy} onClick={()=>props.onConfirm(false)}>Симулировать ошибку</Button></div>}</Card>}

  {!!payment.records.length&&<section className={styles.paymentHistory} aria-label="Платежи по счёту"><h2>{payment.records.some(record=>record.tone==='success')?'Оплата прошла':'Платежи'}</h2>{payment.records.map(record=><div key={record.id}><span>{record.method}</span><strong>{record.total}</strong><StatusBadge mode={mode} status={record.tone}>{record.label}</StatusBadge></div>)}</section>}

  {canPay&&<div className={styles.sticky} aria-label="Итог и оплата"><div><span>К оплате</span><strong>{payment.payable}</strong></div><Button mode={mode} size="l" disabled={busy} loading={busy} onClick={props.onSubmit}>{payLabel}</Button></div>}
 </section>;
}
