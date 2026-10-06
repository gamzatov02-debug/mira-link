'use client';

import {Banknote,CreditCard,QrCode} from 'lucide-react';
import {Alert,Button,Card,Checkbox,Chip,Field,Radio,StatusBadge,TextInput} from '@/components/design-system';
import type {MiraMode} from '@/components/design-system/tokens';

type Tone='success'|'warning'|'error'|'info'|'neutral'|'pending';

type GuestPaymentScreenProps={
 mode:MiraMode;
 bonus?:{value:string;help:string};
 busy:boolean;
 pending?:{method:'online'|'cash';total:string;tipCommission:string;tone:Tone;label:string};
 payments:{id:string;method:string;total:string;tone:Tone;label:string}[];
 onBonus?:(value:string)=>void;
 onMethod:(method:'online'|'cash')=>void;
 onRelease?:()=>void;
 onConfirm:(success:boolean)=>void;
};

const tipPresets=[0,10,15,20];

export function GuestTipSelectionCard({mode,tipAmount,tipPreset,customTip,guestPaysCommission,tipCommission,busy,pending,onTipPreset,onCustomTip,onGuestPaysCommission}:{mode:MiraMode;tipAmount:string;tipPreset:number|null;customTip:string;guestPaysCommission:boolean;tipCommission:string;busy:boolean;pending:boolean;onTipPreset:(value:number)=>void;onCustomTip:(value:string)=>void;onGuestPaysCommission:(value:boolean)=>void}){
 return <Card mode={mode} className="guest-mobile-card guest-payment-tip-card">
  <header>
   <img className="guest-payment-tip-avatar" src="/images/waiter-alexander-demo.png" alt="Официант Александр"/>
   <div><h3>Чаевые</h3><p>Поблагодарить Александра</p></div>
   <strong>{tipAmount}</strong>
  </header>
  <div className="guest-tip-presets" role="group" aria-label="Размер чаевых">
   {tipPresets.map(value=><Chip key={value} mode={mode} selected={tipPreset===value} disabled={busy||pending} onClick={()=>onTipPreset(value)}>{value}%</Chip>)}
  </div>
  <label className="guest-payment-tip-custom"><span>Другая сумма</span><span><TextInput mode={mode} aria-label="Другая сумма чаевых, ₽" type="number" inputMode="decimal" min="0" step="1" value={customTip} disabled={busy||pending} onChange={event=>onCustomTip(event.target.value)}/><b>₽</b></span></label>
  <Checkbox mode={mode} className="guest-tip-commission-choice" checked={guestPaysCommission} disabled={busy||pending||!(Number(customTip)>0)} label={<span><strong>Оплатить комиссию сервиса за чаевые</strong><small className="block">Если не выбрано, комиссия {tipCommission} будет удержана из суммы чаевых официанта.</small></span>} onCheckedChange={checked=>onGuestPaysCommission(checked===true)}/>
 </Card>;
}

export function GuestPaymentScreen({mode,bonus,busy,pending,payments,onBonus,onMethod,onRelease,onConfirm}:GuestPaymentScreenProps){
 return <section className="guest-screen-stack">
  {!pending&&<Card mode={mode} className="guest-mobile-card guest-payment-method-card">
   <h3>Способ оплаты</h3>
   <div className="guest-payment-method-options">
    <Radio mode={mode} name="payment-method" aria-label="Онлайн" className="guest-payment-method" disabled={busy} label={<span className="guest-payment-method-content"><span className="guest-payment-method-icon guest-payment-method-icon-online"><QrCode aria-hidden="true"/><CreditCard aria-hidden="true"/></span><span className="guest-payment-method-copy"><strong>Онлайн</strong><small>СБП или банковская карта</small></span><span className="guest-payment-method-brands" aria-hidden="true"><b className="guest-payment-method-brand guest-payment-method-brand-sbp">СБП</b><b className="guest-payment-method-brand">МИР</b></span></span>} onChange={()=>onMethod('online')}/>
    <Radio mode={mode} name="payment-method" aria-label="Наличными" className="guest-payment-method" disabled={busy} label={<span className="guest-payment-method-content"><span className="guest-payment-method-icon"><Banknote aria-hidden="true"/></span><span className="guest-payment-method-copy"><strong>Наличными</strong><small>Оплата через официанта</small></span></span>} onChange={()=>onMethod('cash')}/>
   </div>
   {bonus&&<Field mode={mode} label="Списать бонусы, ₽" help={bonus.help}><TextInput mode={mode} type="number" min="0" value={bonus.value} onChange={e=>onBonus?.(e.target.value)}/></Field>}
   {!bonus&&<p>Бонусы доступны зарегистрированному пользователю.</p>}
   {onRelease&&<Button mode={mode} size="l" variant="ghost" onClick={onRelease}>Отменить выбор</Button>}
  </Card>}
  {pending&&<Card mode={mode} className="guest-mobile-card guest-payment-pending-card"><Alert mode={mode} status={pending.tone==='pending'?'info':pending.tone} title={pending.label}>{pending.total} · комиссия за чаевые {pending.tipCommission}</Alert>{pending.method==='online'&&<div className="guest-inline-actions"><Button mode={mode} size="l" loading={busy} onClick={()=>onConfirm(true)}>Симулировать успешную оплату</Button><Button mode={mode} size="l" variant="secondary" disabled={busy} onClick={()=>onConfirm(false)}>Симулировать ошибку</Button></div>}</Card>}
  {payments.map(payment=><Card mode={mode} className="guest-mobile-card" key={payment.id}><strong>{payment.total} · {payment.method}</strong><StatusBadge mode={mode} status={payment.tone}>{payment.label}</StatusBadge></Card>)}
 </section>;
}
