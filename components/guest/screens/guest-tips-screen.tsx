'use client';
import {ArrowLeft} from 'lucide-react';
import {Button,Card,Checkbox,Chip,Field,TextInput} from '@/components/design-system';
import type {MiraMode} from '@/components/design-system/tokens';

export function GuestTipsScreen({mode,base,selected,tip,commission,finalAmount,custom,support,busy,canSubmit,onBack,onPreset,onCustom,onSupport,onSubmit}:{mode:MiraMode;base:string;selected:string;tip:string;commission:string;finalAmount:string;custom:string;support:boolean;busy:boolean;canSubmit:boolean;onBack?:()=>void;onPreset:(value:number)=>void;onCustom:(value:string)=>void;onSupport:(value:boolean)=>void;onSubmit:()=>void}){
 return <section className="guest-screen-stack guest-tips-screen">
  <header className="guest-tips-header">{onBack?<button type="button" aria-label="Назад" onClick={onBack}><ArrowLeft/></button>:<span/>}<h2>Чаевые</h2><span/></header>

  <div className="guest-tips-intro">
   <div className="guest-tips-avatar" aria-hidden="true">А</div>
   <h3>Спасибо, что были с нами</h3>
   <p>Официант Александр</p>
  </div>

  <div className="guest-tip-presets" aria-label="Размер чаевых">
   {[0,10,15,20,25].map(value=><Chip key={value} mode={mode} selected={selected===`${value}%`} onClick={()=>onPreset(value)}>{value}%</Chip>)}
  </div>

  <Card mode={mode} className="guest-tip-custom-card">
   <Field mode={mode} label="Своя сумма, ₽"><TextInput mode={mode} type="number" min="1" value={custom} onChange={e=>onCustom(e.target.value)}/></Field>
  </Card>

  <Card mode={mode} className="guest-tip-commission-card">
   <Checkbox mode={mode} className="guest-tip-checkbox" label="Оплатить комиссию сверху" checked={support} onCheckedChange={value=>onSupport(value===true)}/>
   <small>Комиссия: {commission}. Итог с комиссией: {finalAmount}.</small>
  </Card>

  <div className="guest-tip-total"><span>Чаевые</span><strong>{tip}</strong></div>
  <small className="guest-tip-base">Сумма счёта: {base}</small>

  <div className="guest-tips-sticky">
   <Button mode={mode} size="l" fullWidth disabled={!canSubmit} loading={busy} onClick={onSubmit}>Оставить чаевые · {tip}</Button>
  </div>
 </section>
}