import type {VenueEvent} from './domain/model';

export type GuestEventFilter='today'|'tomorrow'|'weekend'|'all';

const dateFormatter=(timeZone:string)=>new Intl.DateTimeFormat('en-CA',{timeZone,year:'numeric',month:'2-digit',day:'2-digit'});
export function venueDateKey(value:Date|string,timeZone='Europe/Moscow'){
 const parts=dateFormatter(timeZone).formatToParts(typeof value==='string'?new Date(value):value);
 const get=(type:string)=>parts.find(part=>part.type===type)?.value??'';
 return `${get('year')}-${get('month')}-${get('day')}`;
}
function addDays(key:string,days:number){const [year,month,day]=key.split('-').map(Number);const date=new Date(Date.UTC(year,month-1,day+days));return date.toISOString().slice(0,10)}
function dayOfWeek(key:string){const [year,month,day]=key.split('-').map(Number);return new Date(Date.UTC(year,month-1,day)).getUTCDay()}
function timeZoneOffsetMs(date:Date,timeZone:string){
 const parts=new Intl.DateTimeFormat('en-CA',{timeZone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(date);
 const get=(type:string)=>Number(parts.find(part=>part.type===type)?.value??0);
 return Date.UTC(get('year'),get('month')-1,get('day'),get('hour'),get('minute'),get('second'))-date.getTime();
}
function zonedIso(dateKey:string,time:string,timeZone:string){
 const [year,month,day]=dateKey.split('-').map(Number),[hour,minute]=time.split(':').map(Number);
 const guess=new Date(Date.UTC(year,month-1,day,hour,minute));
 const offset=timeZoneOffsetMs(guess,timeZone);
 return new Date(guess.getTime()-offset).toISOString();
}
export function nearestWeekendKeys(now=new Date(),timeZone='Europe/Moscow'){
 const today=venueDateKey(now,timeZone),weekday=dayOfWeek(today);
 if(weekday===0)return [addDays(today,-1),today];
 const saturday=addDays(today,(6-weekday+7)%7);
 return [saturday,addDays(saturday,1)];
}
export function getVenueEvents(events:VenueEvent[],{venueId,filter='all',now=new Date(),timeZone='Europe/Moscow'}:{venueId?:string;filter?:GuestEventFilter;now?:Date;timeZone?:string}={}){
 const current=now.getTime(),today=venueDateKey(now,timeZone),tomorrow=addDays(today,1),weekend=new Set(nearestWeekendKeys(now,timeZone));
 return events.filter(event=>event.published&&(!venueId||event.venueId===venueId)&&Number.isFinite(Date.parse(event.startsAt))&&Date.parse(event.startsAt)>=current).filter(event=>{
  const key=venueDateKey(event.startsAt,timeZone);
  return filter==='all'||filter==='today'&&key===today||filter==='tomorrow'&&key===tomorrow||filter==='weekend'&&weekend.has(key);
 }).sort((a,b)=>Date.parse(a.startsAt)-Date.parse(b.startsAt));
}
export function formatEventDate(value:string,timeZone='Europe/Moscow'){return new Intl.DateTimeFormat('ru-RU',{timeZone,weekday:'short',day:'numeric',month:'long'}).format(new Date(value)).replace(/^./,char=>char.toUpperCase())}
export function formatEventTime(value:string,timeZone='Europe/Moscow'){return new Intl.DateTimeFormat('ru-RU',{timeZone,hour:'2-digit',minute:'2-digit'}).format(new Date(value))}

export function createDemoVenueEvents(now=new Date(),venueId='mira',timeZone='Europe/Moscow'):VenueEvent[]{
 const today=venueDateKey(now,timeZone),tomorrow=addDays(today,1),weekday=dayOfWeek(today);
 let saturdayOffset=(6-weekday+7)%7;if(saturdayOffset<2)saturdayOffset+=7;
 const saturday=addDays(today,saturdayOffset),nextWeek=addDays(today,7),later=addDays(today,12);
 return [
  {id:'event-jazz-evening',venueId,title:'Джаз. Вино. Хороший вечер.',category:'Живая музыка',startsAt:zonedIso(tomorrow,'20:00',timeZone),endsAt:zonedIso(tomorrow,'22:00',timeZone),image:'/images/mira-restaurant.jpg',locationLabel:'Основной зал',shortDescription:'Акустический джаз и спокойный вечер в MIRA.',description:'Живой акустический джаз, мягкий свет и вечерняя атмосфера MIRA Restaurant. Бронирование столика не гарантирует отдельное место на мероприятии.',published:true,demo:true},
  {id:'event-chef-dinner',venueId,title:'Ужин с шефом: сезонное меню',category:'Гастрономия',startsAt:zonedIso(saturday,'19:00',timeZone),endsAt:zonedIso(saturday,'22:00',timeZone),image:'/images/venues/atelier.jpg',locationLabel:'Основной зал',shortDescription:'Знакомство с сезонным меню и подачами шефа.',description:'Вечер, посвящённый сезонным продуктам и авторским подачам шефа MIRA. Детали меню уточняйте у команды ресторана.',published:true,demo:true},
  {id:'event-vinyl-night',venueId,title:'Виниловый вечер',category:'DJ-сет',startsAt:zonedIso(nextWeek,'21:00',timeZone),endsAt:zonedIso(nextWeek,'23:00',timeZone),image:'/images/venues/ember-grill.jpg',locationLabel:'Бар',shortDescription:'Музыка на виниле и вечерние коктейли.',description:'Камерный DJ-сет на виниле в барной зоне MIRA Restaurant. Формат события не предполагает отдельной продажи билетов в текущем demo.',published:true,demo:true},
  {id:'event-tasting',venueId,title:'Дегустация вкусов MIRA',category:'Дегустация',startsAt:zonedIso(later,'18:30',timeZone),locationLabel:'Основной зал',shortDescription:'Новый взгляд на знакомые сочетания.',description:'Демонстрационное событие афиши: знакомство с сочетаниями сезонных блюд и безалкогольных напитков.',published:true,demo:true},
 ];
}
