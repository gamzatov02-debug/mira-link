'use client';
import {ChevronRight} from 'lucide-react';
import {Card,EmptyState} from '@/components/design-system';
import {OrderCard,PaymentSummaryCard} from '@/components/patterns';
import {GuestCompactHeader} from '@/components/guest/guest-compact-header';
import type {MiraMode} from '@/components/design-system/tokens';

type Tone='success'|'warning'|'error'|'info'|'neutral'|'pending';

export function GuestProfileScreen({mode,name,actions,onNavigate}:{mode:MiraMode;name:string;actions:{id:string;label:string}[];onNavigate:(id:string)=>void}){
 const initial=name.trim().charAt(0).toUpperCase()||'M';
 return <section className="guest-screen-stack guest-profile-screen">
  <GuestCompactHeader title="Профиль" navigate={onNavigate} back/>
  <div className="guest-profile-identity"><div className="guest-profile-avatar">{initial}</div><h2>{name}</h2><p>{name==='Гостевой режим'?'Войдите, чтобы сохранять данные':'Ваш профиль MIRA LINK'}</p></div>
  <div className="guest-profile-list">{actions.map(action=><button type="button" key={action.id} onClick={()=>onNavigate(action.id)}><span className="guest-profile-row-icon">{action.label.slice(0,1)}</span><span><strong>{action.label}</strong><small>{profileSubtitle(action.id)}</small></span><ChevronRight/></button>)}</div>
 </section>
}

function profileSubtitle(id:string){
 const map:Record<string,string>={
  history:'Прошлые визиты и оплаты',
  bookings:'Текущие и прошлые',
  favorites:'Сохранённые позиции',
  'payment-methods':'Подключённые методы',
  communications:'Коммуникации и согласия',
  support:'Помощь по сервису',
 };
 return map[id]??'';
}

export function GuestBonusesScreen({mode,name,available,used,accrued,transactions,onNavigate}:{mode:MiraMode;name:string;available:string;used:string;accrued:string;transactions:{id:string;label:string;amount:string}[];onNavigate:(id:string)=>void}){
 return <section className="guest-screen-stack guest-bonuses-screen">
  <GuestCompactHeader title="Бонусы" navigate={onNavigate} back/>
  <Card mode={mode} className="guest-bonus-hero"><span>MIRA BONUS</span><strong>{available}</strong><small>Ваш баланс</small><p>Доступно к списанию по правилам заведения</p></Card>
  <h2 className="guest-account-section-title">История</h2>
  {!transactions.length?<EmptyState mode={mode} title="История бонусов пока пуста" description="Начисления и списания появятся после операций."/>:<div className="guest-bonus-history">{transactions.map(item=><div key={item.id}><span><strong>{bonusLabel(item.label)}</strong><small>{name}</small></span><strong>{item.amount}</strong></div>)}</div>}
  <Card mode={mode} className="guest-bonus-note"><small>Важно</small><p>Бонусы не выводятся на карту и не являются банковскими деньгами.</p><span>Начислено: {accrued} · использовано: {used}</span></Card>
 </section>
}

function bonusLabel(label:string){
 const map:Record<string,string>={accrual:'Начисление',spend:'Оплата заказа',refund:'Возврат'};
 return map[label]??label;
}

export function GuestHistoryScreen({mode,payments,onNavigate}:{mode:MiraMode;payments:{id:string;method:string;total:string;tone:Tone;label:string}[];onNavigate:(id:string)=>void}){
 if(!payments.length)return <section className="guest-screen-stack"><GuestCompactHeader title="История заказов" navigate={onNavigate} back/><EmptyState mode={mode} title="История появится после первой оплаты" description="Здесь сохраняются подтверждённые данные аккаунта."/></section>;
 return <section className="guest-screen-stack guest-history-screen">
  <GuestCompactHeader title="История заказов" navigate={onNavigate} back/>
  {payments.map(payment=><div className="guest-history-entry" key={payment.id}><OrderCard mode={mode} identifier={payment.id} context={payment.method} itemCount="Оплата" amount={payment.total} status={payment.tone}/><PaymentSummaryCard mode={mode} total={payment.total} paid={payment.tone==='success'?payment.total:'0 ₽'} remaining={payment.tone==='success'?'0 ₽':payment.total} method={payment.method} status={payment.tone}/></div>)}
 </section>
}
