'use client';

import {useState} from 'react';
import {EventCard} from '@/components/patterns';
import {guestProductionMode} from '@/components/guest/adapters/status';
import {lifestyleEvents} from '@/lib/domain/seed';
import {MiraButton as Button, MiraChip, MiraModal, MiraEmptyState} from './mira';

export function GuestEvents({navigate}:{navigate:(page:string)=>void}) {
  const [filter,setFilter]=useState('Все');
  const [selected,setSelected]=useState('');
  const event=lifestyleEvents.find(item=>item.id===selected);
  const weekday=new Date().getDay();
  const visible=lifestyleEvents.filter(item=>filter==='Все'||filter==='Выходные'&&item.id==='chef'||filter==='Сегодня'&&weekday===(item.id==='jazz'?5:6)||filter==='Завтра'&&(weekday+1)%7===(item.id==='jazz'?5:6));
  return <>
    <h2>Афиша</h2>
    <nav className="nearby-filters" aria-label="Когда пойти">{['Сегодня','Завтра','Выходные','Все'].map(value=><MiraChip key={value} selected={filter===value} onClick={()=>setFilter(value)}>{value}</MiraChip>)}</nav>
    <p>Демонстрационная еженедельная афиша MIRA Restaurant.</p>
    {!visible.length&&<MiraEmptyState>На этот день событий пока нет. Посмотрите всю афишу.</MiraEmptyState>}
    <div className="guest-pattern-stack">{visible.map(item=><EventCard key={item.id} mode={guestProductionMode} title={item.title} venue="MIRA Restaurant" dateTime={item.date} category={item.id==='jazz'?'Музыка':'Кухня'} note={item.description} onAction={()=>setSelected(item.id)}/>)}</div>
    <MiraModal title={event?.title??'Событие'} open={!!event} onClose={()=>setSelected('')} description={event?.date}>
      {event&&<><h3>MIRA Restaurant</h3><p>{event.description}</p><Button onClick={()=>{setSelected('');navigate('booking')}}>Забронировать стол</Button><Button className="outline" onClick={()=>{setSelected('');navigate('nearby')}}>Открыть заведение</Button></>}
    </MiraModal>
  </>;
}
