'use client';

import {useMemo,useState} from 'react';
import {ArrowRight,CalendarDays,ChevronRight,Clock3,MapPin} from 'lucide-react';
import {BottomSheet,Button} from '@/components/design-system';
import {guestProductionMode} from '@/components/guest/adapters/status';
import {useGuestTheme} from '@/components/guest-theme';
import {formatEventDate,formatEventTime,getVenueEvents,type GuestEventFilter} from '@/lib/events';
import {themeStyle} from '@/lib/guest-theme';
import type {VenueEvent} from '@/lib/domain/model';
import styles from './guest-events.module.css';

const filters:[GuestEventFilter,string][]=[['today','Сегодня'],['tomorrow','Завтра'],['weekend','Выходные'],['all','Все']];
const fallbackImage='/images/venues/mira-link-venue-placeholder.svg';

function eventMeta(event:VenueEvent,timeZone:string){
 return `${formatEventDate(event.startsAt,timeZone)} · ${formatEventTime(event.startsAt,timeZone)}`;
}

export function GuestEvents({events,venueId,venueName,timeZone='Europe/Moscow',navigate,now}:{events:VenueEvent[];venueId?:string;venueName?:string;timeZone?:string;navigate:(page:string)=>void;now?:Date}){
 const [filter,setFilter]=useState<GuestEventFilter>('all');
 const [selectedId,setSelectedId]=useState('');
 const theme=useGuestTheme(),overlayMode=theme?.mode==='light'?'operational-light':guestProductionMode;
 const visible=useMemo(()=>getVenueEvents(events,{venueId,filter,now:now??new Date(),timeZone}),[events,filter,now,timeZone,venueId]);
 const featured=visible[0],feed=featured?visible.slice(1):[];
 const selected=events.find(event=>event.id===selectedId&&event.published&&(!venueId||event.venueId===venueId));
 const chooseFilter=(value:GuestEventFilter)=>{setFilter(value);setSelectedId('')};
 return <section className={styles.screen} aria-labelledby="guest-events-title">
  <header className={styles.header}><h1 id="guest-events-title">Афиша</h1><p>{venueName?<>События, музыка и особые вечера<br/>в <strong>{venueName}</strong>.</>:<>Интересные события и мероприятия рядом с вами.</>}</p></header>
  <nav className={styles.filters} aria-label="Дата мероприятий">{filters.map(([id,label])=><button type="button" key={id} aria-pressed={filter===id} onClick={()=>chooseFilter(id)}>{label}</button>)}</nav>
  {!visible.length&&<div className={styles.empty}><CalendarDays aria-hidden="true"/><h2>{filter==='all'?'Пока нет запланированных событий':'На выбранные даты событий нет'}</h2><p>{filter==='all'?'Следите за обновлениями афиши.':'Посмотрите все ближайшие мероприятия.'}</p>{filter!=='all'&&<Button mode={guestProductionMode} size="l" onClick={()=>chooseFilter('all')}>Показать все</Button>}</div>}
  {featured&&<article className={styles.featured} data-event-id={featured.id}><img src={featured.image??fallbackImage} alt=""/><span className={styles.featuredShade} aria-hidden="true"/><div className={styles.featuredBody}><span className={styles.badge}>{featured.category}</span><h2>{featured.title}</h2><p className={styles.meta}><CalendarDays aria-hidden="true"/>{eventMeta(featured,timeZone)}</p><p className={styles.meta}><MapPin aria-hidden="true"/>{featured.locationLabel?`${venueName??'Заведение'} · ${featured.locationLabel}`:venueName??'Заведение'}</p><p className={styles.featuredDescription}>{featured.shortDescription??featured.description}</p><button type="button" className={styles.more} onClick={()=>setSelectedId(featured.id)}>Подробнее <ArrowRight aria-hidden="true"/></button></div></article>}
  {!!feed.length&&<section className={styles.feed} aria-labelledby="guest-events-feed"><h2 id="guest-events-feed">Ближайшие события</h2>{feed.map(event=><button type="button" className={styles.card} key={event.id} onClick={()=>setSelectedId(event.id)} aria-label={`Открыть событие: ${event.title}`} data-event-id={event.id}><img className={styles.thumbnail} src={event.image??fallbackImage} alt=""/><span className={styles.cardCopy}><span className={styles.badge}>{event.category}</span><h3>{event.title}</h3><span className={styles.cardMeta}>{eventMeta(event,timeZone)}</span><span className={styles.cardVenue}>{venueName??'Заведение'}{event.locationLabel?` · ${event.locationLabel}`:''}</span><p>{event.shortDescription??event.description}</p></span><ChevronRight aria-hidden="true"/></button>)}</section>}
  <BottomSheet mode={overlayMode} presentation="responsive-dialog" className={theme?'guest-theme':undefined} style={theme?themeStyle(theme):undefined} overlayStyle={theme?{background:theme.colors.overlay}:undefined} open={Boolean(selected)} onOpenChange={open=>!open&&setSelectedId('')} title={selected?.title??'Мероприятие'} description={selected?`${selected.category} · ${venueName??'Заведение'}`:undefined} actions={selected&&<Button mode={overlayMode} size="l" fullWidth onClick={()=>{setSelectedId('');navigate('booking')}}>Забронировать стол</Button>}>
   {selected&&<div className={styles.detail}><img className={styles.detailImage} src={selected.image??fallbackImage} alt=""/><p className={styles.detailLead}>{selected.description}</p><div className={styles.detailSummary}><div><CalendarDays aria-hidden="true"/><span>Дата</span><strong>{formatEventDate(selected.startsAt,timeZone)}</strong></div><div><Clock3 aria-hidden="true"/><span>Время</span><strong>{formatEventTime(selected.startsAt,timeZone)}{selected.endsAt?`–${formatEventTime(selected.endsAt,timeZone)}`:''}</strong></div><div className={styles.detailVenue}><MapPin aria-hidden="true"/><span>Место</span><strong>{venueName??'Заведение'}{selected.locationLabel?` · ${selected.locationLabel}`:''}</strong></div></div><p className={styles.bookingNote}>Бронируется стол в заведении. Это не гарантирует отдельное место на мероприятии.</p></div>}
  </BottomSheet>
 </section>;
}
