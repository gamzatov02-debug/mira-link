'use client';

import {useState} from 'react';
import {ArrowLeft,Banknote,ChevronRight,CreditCard,Heart,MoreHorizontal,ReceiptText,QrCode,UserRound} from 'lucide-react';
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
 stage?:'legacy'|'bill'|'payment';
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
 onProceed?:()=>void;
 onTips?:()=>void;
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
 const {mode,venueName,tableId,status,items,billTotal,paidAmount,remainingAmount,closed,busy,error,split,bonus,tips,payment,stage='legacy'}=props;
 const [showAll,setShowAll]=useState(false);
 const [bonusOpen,setBonusOpen]=useState(Boolean(bonus?.applied));
 const [paymentOption,setPaymentOption]=useState<'card'|'sbp'|'other'>(payment.method==='cash'?'other':'card');
 const visibleItems=showAll?items:items.slice(0,4);
 const bonusExpanded=bonusOpen||Boolean(bonus?.applied);
 const canPay=!closed&&!!split.partAmount&&!payment.pending;
 const payLabel=payment.method==='cash'?`Передать ${payment.payable} наличными`:`Оплатить ${payment.payable}`;

 if(stage==='bill')return <section className={`${styles.screen} ${styles.v21Bill}`} aria-labelledby="guest-bill-title">
  <header className={styles.v21Header}><button type="button" aria-label="Назад" onClick={props.onBack}><ArrowLeft/></button><h1 id="guest-bill-title">Счёт</h1><button type="button" aria-label="Ещё"><MoreHorizontal/></button></header>
  <div className={styles.v21BillIntro}><h2>Счёт за стол №{tableId??'—'}</h2><span>{closed?'Закрыт':'Открыт'}</span></div>
  <div className={styles.v21BillItems}>{items.map(item=><div key={item.id}><span><strong>{item.name}</strong><small>{item.quantity} × {item.unitPrice}</small></span><strong>{item.total}</strong></div>)}</div>
  <div className={styles.v21BillTotals}>
   <div><span>Сумма</span><strong>{billTotal}</strong></div>
   {paidAmount&&<div><span>Оплачено</span><strong>−{paidAmount}</strong></div>}
   <div className={styles.v21Payable}><span>К оплате</span><strong>{remainingAmount}</strong></div>
  </div>
  {bonus&&<div className={styles.v21BonusHint}><span>Бонусы</span><small>Можно списать до {bonus.limit} по правилам заведения</small></div>}
  {!closed&&<div className={styles.v21BottomAction}><Button mode={mode} size="l" fullWidth disabled={busy} onClick={props.onProceed}>Перейти к оплате</Button></div>}
 </section>;

 if(stage==='payment')return <section className={`${styles.screen} ${styles.v21Payment}`} aria-labelledby="guest-payment-title">
  <header className={styles.v21Header}><button type="button" aria-label="Назад" onClick={props.onBack}><ArrowLeft/></button><h1 id="guest-payment-title">Оплата</h1><button type="button" aria-label="Ещё"><MoreHorizontal/></button></header>
  <div className={styles.v21PaymentAmount}><span>Сумма к оплате</span><strong>{payment.payable}</strong></div>
  <section className={styles.v21Methods}><h2>Способ оплаты</h2>
   <button type="button" data-selected={paymentOption==='card'} onClick={()=>{setPaymentOption('card');props.onMethodChange('online')}}><span><strong>Банковская карта</strong><small>•••• 4242</small></span><b>{paymentOption==='card'?'✓':'○'}</b></button>
   <button type="button" data-selected={paymentOption==='sbp'} onClick={()=>{setPaymentOption('sbp');props.onMethodChange('online')}}><span><strong>СБП</strong><small>Быстрая оплата</small></span><b>{paymentOption==='sbp'?'✓':'○'}</b></button>
   <button type="button" data-selected={paymentOption==='other'} onClick={()=>{setPaymentOption('other');props.onMethodChange('cash')}}><span><strong>Другой способ</strong><small>Партнёрский provider</small></span><b>{paymentOption==='other'?'✓':'○'}</b></button>
  </section>
  {bonus&&<button type="button" className={styles.v21PaymentRow} onClick={()=>{const raw=Number(bonus.available.replace(/[^0-9,]/g,'').replace(',','.'))||0;props.onBonus?.(bonus.applied?'0':String(raw))}}><span className={styles.v21RowIcon}>M</span><span><strong>Использовать бонусы</strong><small>{bonus.applied?`− ${bonus.applied} применено`:`Доступно ${bonus.available}`}</small></span><ChevronRight/></button>}
  <button type="button" className={styles.v21PaymentRow} onClick={props.onTips}><span className={styles.v21RowIcon}><Heart/></span><span><strong>Чаевые после оплаты</strong><small>Можно оставить отдельно</small></span><ChevronRight/></button>
  {payment.pending&&<Alert mode={mode} status={payment.pending.tone==='pending'?'info':payment.pending.tone} title={payment.pending.label}>{payment.pending.total}</Alert>}
  {!!payment.records.length&&<section className={styles.paymentHistory} aria-label="Платежи по счёту">{payment.records.map(record=><div key={record.id}><span>{record.method}</span><strong>{record.total}</strong><StatusBadge mode={mode} status={record.tone}>{record.label}</StatusBadge></div>)}</section>}
  {!closed&&!payment.pending&&<div className={styles.v21BottomAction}><Button mode={mode} size="l" fullWidth disabled={busy||!split.partAmount} loading={busy} onClick={props.onSubmit}>Оплатить {payment.payable}</Button></div>}
  {payment.pending?.method==='online'&&<div className={styles.confirmActions}><Button mode={mode} size="l" loading={busy} onClick={()=>props.onConfirm(true)}>Симулировать успешную оплату</Button><Button mode={mode} size="l" variant="secondary" disabled={busy} onClick={()=>props.onConfirm(false)}>Симулировать ошибку</Button></div>}
 </section>;
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

  {!closed&&!split.partAmount&&!payment.pending&&<Card mode={mode} className={styles.sectionCard}><p className={styles.helper}>Подготавливаем оплату оставшейся суммы счёта…</p>{error&&<Alert mode={mode} status="error" title="Не удалось подготовить оплату">{error}</Alert>}</Card>}

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
