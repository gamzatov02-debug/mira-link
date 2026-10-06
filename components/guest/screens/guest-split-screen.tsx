'use client';

import {Alert,Button,Card,Checkbox,Field,TextInput} from '@/components/design-system';
import {SplitParticipantRow} from '@/components/patterns';
import type {MiraMode} from '@/components/design-system/tokens';

type SplitItem={id:string;label:string;remaining:string;disabled:boolean;selected:boolean};
type Participant={name:string;amount:string;paid:string;remaining:string;status:'success'|'warning'|'error'|'info'|'neutral'|'pending';selected?:boolean};
export function GuestSplitScreen({
 mode,items,participants,defaultAmount,tipAmount,tipCommissionAmount,bonusAmount,totalAmount,commissionNote,expanded,customAmount,busy,error,onExpandedChange,onToggleItem,onMode,onCustomAmount,onCustomSubmit,
}:{
 mode:MiraMode;items:SplitItem[];participants:Participant[];defaultAmount:string;tipAmount?:string;tipCommissionAmount?:string;bonusAmount?:string;totalAmount:string;commissionNote?:string;expanded:boolean;customAmount:string;busy:boolean;error?:string;onExpandedChange:(expanded:boolean)=>void;onToggleItem:(id:string,checked:boolean)=>void;onMode:(mode:'own'|'items'|'equal')=>void;onCustomAmount:(value:string)=>void;onCustomSubmit:()=>void;
}){return <section className="guest-screen-stack guest-split-selection">
 <Card mode={mode} className="guest-mobile-card guest-bill-default-card">
  <div className="guest-bill-default-summary"><small>ПО УМОЛЧАНИЮ</small><h3>Оплата за весь заказ</h3></div>
  <div className="guest-bill-default-breakdown"><div><span>Сумма заказа</span><strong>{defaultAmount}</strong></div>{tipAmount&&<div><span>Чаевые</span><strong>{tipAmount}</strong></div>}{tipCommissionAmount&&<div><span>Комиссия за чаевые</span><strong>{tipCommissionAmount}</strong></div>}{bonusAmount&&<div><span>Бонусами</span><strong>−{bonusAmount}</strong></div>}<div className="guest-bill-default-total"><strong>Итого к оплате</strong><strong>{totalAmount}</strong></div>{commissionNote&&<p className="guest-bill-commission-note">{commissionNote}</p>}</div>
  <Checkbox mode={mode} className="guest-split-toggle" checked={expanded} disabled={busy} label={<span><strong>Разделить счёт</strong><small className="block">Выбрать блюда, равные доли или указать сумму</small></span>} onCheckedChange={checked=>onExpandedChange(checked===true)}/>
  {error&&<Alert mode={mode} status="error" title="Не удалось выбрать часть счёта">{error}</Alert>}
 </Card>
 {expanded&&<div className="guest-split-options" role="region" aria-label="Варианты разделения счёта">
  <Card mode={mode} className="guest-mobile-card guest-split-intro"><h3>Разделение счёта</h3><p>Выберите позиции, равные доли или укажите точную сумму.</p></Card>
  {participants.map(participant=><SplitParticipantRow key={participant.name} mode={mode} {...participant}/>) }
  <Card mode={mode} className="guest-mobile-card"><h3>Выберите позиции</h3>{items.map(item=><Checkbox key={item.id} mode={mode} label={<span>{item.label}<small className="block">Остаток {item.remaining}</small></span>} checked={item.selected} disabled={item.disabled||busy} onCheckedChange={checked=>onToggleItem(item.id,checked===true)}/>)}</Card>
  <Card mode={mode} className="guest-mobile-card guest-split-method-card"><h3>Способ разделения</h3><div className="guest-inline-actions"><Button mode={mode} size="l" variant="secondary" disabled={busy} onClick={()=>onMode('own')}>Свои позиции</Button><Button mode={mode} size="l" variant="secondary" disabled={busy} onClick={()=>onMode('items')}>По блюдам</Button><Button mode={mode} size="l" variant="secondary" disabled={busy} onClick={()=>onMode('equal')}>Поровну</Button></div><div className="guest-amount-selection"><Field mode={mode} label="Указанная сумма, ₽"><TextInput mode={mode} type="number" min="0" value={customAmount} onChange={event=>onCustomAmount(event.target.value)}/></Field><Button mode={mode} size="l" disabled={busy} onClick={onCustomSubmit}>Выбрать сумму</Button></div></Card>
 </div>}
</section>}
