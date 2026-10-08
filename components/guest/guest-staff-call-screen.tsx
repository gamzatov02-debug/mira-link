'use client';

import {ChevronRight,ConciergeBell,QrCode,UserRoundCog} from 'lucide-react';
import {Button,Card,StatusBadge} from '@/components/design-system';
import {callStatusPresentation,guestProductionMode} from '@/components/guest/adapters/status';
import type {StaffCall} from '@/lib/domain/model';
import styles from './guest-staff-call-screen.module.css';

type StaffCallType=StaffCall['type'];

const callCopy:Record<StaffCallType,{title:string;description:string;activeTitle:string}>={
 waiter:{title:'Позвать официанта',description:'Помощь с заказом, сервировкой или обслуживанием',activeTitle:'Официант вызван'},
 admin:{title:'Позвать администратора',description:'Вопросы по обслуживанию, обратная связь',activeTitle:'Администратор вызван'},
};

function CallAction({type,disabled,busy,onCall}:{type:StaffCallType;disabled:boolean;busy:boolean;onCall:(type:StaffCallType)=>void}){
 const copy=callCopy[type];
 const Icon=type==='waiter'?ConciergeBell:UserRoundCog;
 return <button type="button" className={styles.action} aria-label={copy.title} disabled={disabled||busy} onClick={()=>onCall(type)}>
  <span className={styles.icon} aria-hidden="true"><Icon/></span>
  <span className={styles.actionCopy}><strong>{copy.title}</strong><small>{copy.description}</small></span>
  <ChevronRight className={styles.chevron} aria-hidden="true"/>
 </button>;
}

export function GuestStaffCallScreen({tableId,activeCalls,busy=false,onCall,onScanQr}:{tableId?:number;activeCalls:StaffCall[];busy?:boolean;onCall:(type:StaffCallType)=>void;onScanQr:()=>void}){
 const hasTable=typeof tableId==='number';
 return <section className={styles.screen} aria-labelledby="guest-staff-title">
  <header className={styles.heading}>
   <h1 id="guest-staff-title">Помощь персонала</h1>
   <p>Мы рядом, если вам нужна помощь. Выберите, кого позвать.</p>
  </header>

  {hasTable?<div className={styles.actions} aria-label="Вызов сотрудника">
   {(['waiter','admin'] as const).map(type=><CallAction key={type} type={type} busy={busy} disabled={activeCalls.some(call=>call.type===type)} onCall={onCall}/>)}
  </div>:<Card mode={guestProductionMode} className={styles.gate}>
   <span className={styles.gateIcon} aria-hidden="true"><QrCode/></span>
   <div><h2>Сначала откройте стол</h2><p>Сканируйте QR-код на столе, чтобы отправить запрос команде ресторана.</p></div>
   <Button mode={guestProductionMode} size="l" fullWidth leadingIcon={<QrCode aria-hidden="true"/>} onClick={onScanQr}>Сканировать QR</Button>
  </Card>}

  {activeCalls.length>0&&<section className={styles.current} aria-labelledby="guest-current-call-title">
   <h2 id="guest-current-call-title">Текущий запрос</h2>
   <div className={styles.currentList}>{activeCalls.map(call=>{const copy=callCopy[call.type],status=callStatusPresentation(call.status);return <Card mode={guestProductionMode} className={styles.currentCard} key={call.id}>
    <div className={styles.currentTop}><div><strong>{copy.activeTitle}</strong><p>Стол {call.tableId} · {call.status==='created'?'Запрос отправлен':'Запрос принят'}</p></div><StatusBadge mode={guestProductionMode} status={status.tone}>{status.label}</StatusBadge></div>
   </Card>})}</div>
  </section>}
 </section>;
}
