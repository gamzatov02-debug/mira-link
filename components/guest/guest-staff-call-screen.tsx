'use client';

import {useMemo,useState} from 'react';
import {CircleHelp,ConciergeBell,ReceiptText,QrCode,UserRoundCog,UtensilsCrossed} from 'lucide-react';
import {Button,Card,StatusBadge} from '@/components/design-system';
import {GuestCompactHeader} from '@/components/guest/guest-compact-header';
import {callStatusPresentation,guestProductionMode} from '@/components/guest/adapters/status';
import type {StaffCall} from '@/lib/domain/model';
import styles from './guest-staff-call-screen.module.css';

type StaffCallType=StaffCall['type'];
type ReasonId='waiter'|'admin'|'bill'|'cutlery'|'other';

const reasons:{id:ReasonId;title:string;type:StaffCallType;Icon:typeof ConciergeBell}[]=[
 {id:'waiter',title:'Позвать официанта',type:'waiter',Icon:ConciergeBell},
 {id:'admin',title:'Пригласить администратора',type:'admin',Icon:UserRoundCog},
 {id:'bill',title:'Принести счёт',type:'waiter',Icon:ReceiptText},
 {id:'cutlery',title:'Принести приборы',type:'waiter',Icon:UtensilsCrossed},
 {id:'other',title:'Другой вопрос',type:'waiter',Icon:CircleHelp},
];

function requestCopy(call:StaffCall){
 const role=call.type==='waiter'?'Официант':'Администратор';
 const title=call.reason||role;
 if(call.status==='created')return {title,detail:'Отправлен · ожидает принятия'};
 if(call.status==='accepted')return {title,detail:'Сотрудник принял запрос'};
 if(call.status==='completed')return {title,detail:'Запрос выполнен'};
 return {title,detail:'Запрос отменён'};
}

export function GuestStaffCallScreen({
 tableId,calls,busy=false,navigate,onCall,onCancel,onScanQr,
}:{tableId?:number;calls:StaffCall[];busy?:boolean;navigate:(page:string)=>void;onCall:(type:StaffCallType,reason:string,comment?:string)=>void;onCancel:(callId:string)=>void;onScanQr:()=>void}){
 const [selected,setSelected]=useState<ReasonId>('waiter');
 const [comment,setComment]=useState('');
 const hasTable=typeof tableId==='number';
 const activeCalls=calls.filter(call=>!['completed','cancelled'].includes(call.status));
 const latestCall=useMemo(()=>[...calls].sort((a,b)=>Date.parse(b.createdAt)-Date.parse(a.createdAt)).at(0),[calls]);
 const selectedReason=reasons.find(reason=>reason.id===selected)??reasons[0];
 const current=activeCalls[0]??latestCall;
 const submit=()=>{
  if(!hasTable||busy||activeCalls.length)return;
  onCall(selectedReason.type,selectedReason.title,comment.trim()||undefined);
  setComment('');
 };

 return <section className={styles.screen} aria-labelledby="guest-staff-title">
  <GuestCompactHeader title="Вызов сотрудника" navigate={navigate} back menuOnly/>
  <div className={styles.tableLabel}>Стол №{tableId??'—'}</div>
  <h2 id="guest-staff-title" className={styles.question}>Чем помочь?</h2>

  {hasTable?<div className={styles.reasonList} role="radiogroup" aria-label="Причина вызова">
   {reasons.map(({id,title,Icon})=><button type="button" key={id} role="radio" aria-checked={selected===id} data-selected={selected===id} disabled={busy||activeCalls.length>0} onClick={()=>setSelected(id)}>
    <span className={styles.reasonIcon} aria-hidden="true"><Icon/></span>
    <strong>{title}</strong>
    <span className={styles.reasonState} aria-hidden="true">{selected===id?'✓':'›'}</span>
   </button>)}
  </div>:<Card mode={guestProductionMode} className={styles.gate}>
   <span className={styles.gateIcon} aria-hidden="true"><QrCode/></span>
   <div><h2>Сначала откройте стол</h2><p>Сканируйте QR-код на столе, чтобы отправить запрос команде ресторана.</p></div>
   <Button mode={guestProductionMode} size="l" fullWidth leadingIcon={<QrCode aria-hidden="true"/>} onClick={onScanQr}>Сканировать QR</Button>
  </Card>}

  {hasTable&&<label className={styles.comment}><span>Комментарий</span><textarea value={comment} disabled={busy||activeCalls.length>0} maxLength={500} rows={3} placeholder="Например: нужна детская посуда" onChange={event=>setComment(event.target.value)}/></label>}

  {hasTable&&<div className={styles.submit}><Button mode={guestProductionMode} size="l" fullWidth disabled={busy||activeCalls.length>0} loading={busy} onClick={submit}>Отправить запрос</Button></div>}

  {current&&<section className={styles.current} aria-labelledby="guest-current-call-title">
   <h3 id="guest-current-call-title">Последний запрос</h3>
   <Card mode={guestProductionMode} className={styles.currentCard}>
    <div className={styles.currentTop}><div><strong>{requestCopy(current).title}</strong><p>{requestCopy(current).detail}</p>{current.comment&&<small>{current.comment}</small>}</div><StatusBadge mode={guestProductionMode} status={callStatusPresentation(current.status).tone}>{callStatusPresentation(current.status).label}</StatusBadge></div>
    {current.status==='created'&&<Button mode={guestProductionMode} variant="secondary" size="l" fullWidth className={styles.cancel} disabled={busy} onClick={()=>onCancel(current.id)}>Отменить запрос</Button>}
   </Card>
  </section>}
 </section>;
}
