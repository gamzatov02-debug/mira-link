'use client';
import {useCallback,useEffect,useMemo,useRef,useState} from 'react';
import {useDomain,dispatch} from '@/lib/store';
import type {CartItem,Product} from '@/lib/domain/model';
import {demoLocation,getNearbyVenues,isVenueOpen,type Location,type NearbyVenue} from '@/lib/nearby';
import {formatMoney} from '@/lib/domain/selectors';
import {VenueMap} from './venue-map';
import {MiraButton as Button,MiraCard as Card,MiraChip,MiraInput as Input,MiraSelect as Select,MiraSearch,MiraModal as Modal,MiraEmptyState as Empty,MiraToast} from './mira';
import {guestProductionMode} from '@/components/guest/adapters/status';
import {GuestMenuProductCard} from '@/components/guest/guest-menu-product-card';
import {GuestProductDetail} from '@/components/guest/guest-product-detail';
import {GuestVenueCard} from '@/components/guest/guest-venue-card';
import {baseProductQuantity,productRequiresRequiredModifier,withBaseProductQuantity} from '@/components/guest/guest-menu-cart';
import {menuPresentation} from '@/lib/menu-presentation';

function useNearbyLocation(){
 const [location,setLocation]=useState<Location>(demoLocation),[status,setStatus]=useState<'loading'|'located'|'fallback'>('loading');
 const sequence=useRef(0);
 const request=useCallback(()=>{
  const token=++sequence.current;setStatus('loading');
  if(!navigator.geolocation){setStatus('fallback');return}
  navigator.geolocation.getCurrentPosition(pos=>{if(token!==sequence.current)return;setLocation({latitude:pos.coords.latitude,longitude:pos.coords.longitude});setStatus('located')},()=>{if(token!==sequence.current)return;setLocation(demoLocation);setStatus('fallback')},{enableHighAccuracy:false,timeout:8000,maximumAge:300000});
 },[]);
 useEffect(()=>{request();return()=>{sequence.current++}},[request]);
 return {location,status,request,useDemo:()=>{sequence.current++;setLocation(demoLocation);setStatus('fallback')}};
}
function VenueSummary({venue,now}:{venue:NearbyVenue;now:Date|null}){return <><p>{venue.category} · {venue.distance} · ★ {venue.rating}</p><p>{venue.description}</p><div className="venue-tags">{now&&<span className="badge">{isVenueOpen(venue.hours,now)?'Открыто':'Закрыто'}</span>}{venue.deliveryEnabled&&<span className="badge">Доставка</span>}{venue.bookingEnabled&&<span className="badge">Бронирование</span>}</div>{venue.promotions.length>0&&<p className="venue-promotion">{venue.promotions[0]}</p>}</>}
export function Nearby({navigate,canFavorite,initialVenueId,favourites,onFavourite,onOpenProduct}:{navigate:(page:string)=>void;canFavorite:boolean;initialVenueId?:string;favourites:string[];onFavourite:(id:string)=>void;onOpenProduct:(product:Product,contextQuantity?:number)=>void}){
 const s=useDomain(),geo=useNearbyLocation();
 const [search,setSearch]=useState(''),[filter,setFilter]=useState('all'),[selectedId,setSelectedId]=useState(initialVenueId??''),[detailId,setDetailId]=useState(initialVenueId??'');
 const [mode,setMode]=useState<'details'|'menu'|'delivery'>('details'),[now,setNow]=useState<Date|null>(null);
 const [carts,setCarts]=useState<Record<string,CartItem[]>>({}),[productId,setProductId]=useState(''),[mods,setMods]=useState<string[]>([]),[quantity,setQuantity]=useState(1),[comment,setComment]=useState('');
 const [busy,setBusy]=useState(false),[message,setMessage]=useState(''),[receipt,setReceipt]=useState('');const lock=useRef(false);
 useEffect(()=>{setNow(new Date());const timer=setInterval(()=>setNow(new Date()),60000);return()=>clearInterval(timer)},[]);
 const venues=useMemo(()=>getNearbyVenues(s.products,s.promotions,geo.location),[s.products,s.promotions,geo.location]);
 const visible=useMemo(()=>venues.filter(v=>(filter==='all'||filter==='restaurant'&&v.kind==='restaurant'||filter==='coffee'&&v.kind==='coffee'||filter==='cafe'&&v.kind==='cafe'||filter==='delivery'&&v.deliveryEnabled||filter==='promotions'&&v.promotions.length>0)&&`${v.name} ${v.category} ${v.description} ${v.menu.map(p=>p.name).join(' ')}`.toLocaleLowerCase('ru').includes(search.toLocaleLowerCase('ru'))),[venues,search,filter]);
 const selected=visible.find(v=>v.id===selectedId),venue=venues.find(v=>v.id===detailId);
 const detailLocation=useMemo(()=>venue?{latitude:venue.latitude,longitude:venue.longitude}:demoLocation,[venue?.id]);
 const detailVenues=useMemo(()=>venue?[venue]:[],[venue]);
 const product=venue?.menu.find(p=>p.id===productId),cart=carts[detailId]??[];
 const lineTotal=(item:CartItem)=>{const p=venue?.menu.find(p=>p.id===item.productId);return p?(p.price+p.modifiers.filter(m=>item.modifierIds.includes(m.id)).reduce((n,m)=>n+m.price,0))*item.quantity:0};
 const total=cart.reduce((n,item)=>n+lineTotal(item),0);
 const unavailable=cart.some(item=>!venue?.menu.some(p=>p.id===item.productId&&!p.stopped));
 useEffect(()=>{if(initialVenueId){setSelectedId(initialVenueId);setDetailId(initialVenueId)}},[initialVenueId]);
 function open(v:NearbyVenue,next:'details'|'menu'|'delivery'='details'){setSelectedId(v.id);setDetailId(v.id);setMode(next);setProductId('');setMessage('');setReceipt('')}
 function pick(p:Product){setProductId(p.id);setMods([]);setQuantity(1);setComment('')}
 function updateCart(next:CartItem[]){setCarts(prev=>({...prev,[detailId]:next}));setReceipt('')}
 function menuQuantity(p:Product){return productRequiresRequiredModifier(p)?0:baseProductQuantity(cart,p.id)}
 function setMenuQuantity(p:Product,nextQuantity:number){updateCart(withBaseProductQuantity(cart,p.id,nextQuantity))}
 function quickAdd(p:Product){if(productRequiresRequiredModifier(p)){onOpenProduct(p,1);return}setMenuQuantity(p,menuQuantity(p)+1)}
 function quickAddDelivery(p:Product){if(productRequiresRequiredModifier(p)){pick(p);return}setMenuQuantity(p,menuQuantity(p)+1)}
 const requiredDeliveryGroups=product?[...new Set(product.modifiers.filter(modifier=>modifier.required).map(modifier=>modifier.group))]:[];
 const requiredDeliveryModifiersSelected=requiredDeliveryGroups.every(group=>product?.modifiers.some(modifier=>modifier.group===group&&mods.includes(modifier.id)));
 async function checkout(form:HTMLFormElement){
  if(lock.current||!venue||!venue.deliveryEnabled||!cart.length||unavailable)return;
  lock.current=true;setBusy(true);setMessage('');const fields=new FormData(form);
  const items=[`Заведение: ${venue.name} (${venue.id})`,...cart.map(item=>{const p=venue.menu.find(p=>p.id===item.productId)!;return `${p.name} × ${item.quantity} · ${p.modifiers.filter(m=>item.modifierIds.includes(m.id)).map(m=>m.name).join(', ')} · ${formatMoney(lineTotal(item))}`}),`Контакт: ${fields.get('contact')}`,`Комментарий: ${fields.get('comment')||'—'}`,`Способ оплаты (демо): ${fields.get('payment')}`,`Итого: ${formatMoney(total)}`].join('\n');
  try{const id=await dispatch({type:'createDelivery',address:fields.get('address'),items});setCarts(prev=>({...prev,[venue.id]:[]}));setReceipt(`Демо-заявка ${id} создана · ${venue.name}. Заказ не будет отправлен реально.`);form.reset()}
  catch(e){setMessage(e instanceof Error?e.message:'Не удалось создать демо-заявку')}
  finally{lock.current=false;setBusy(false)}
 }
 const actions=(v:NearbyVenue)=><div className="actions"><Button className="small" onClick={()=>open(v)}>Открыть заведение</Button><Button className="outline small" onClick={()=>open(v,'menu')}>Меню</Button>{v.deliveryEnabled&&<Button className="outline small" onClick={()=>open(v,'delivery')}>Заказать домой</Button>}</div>;
 return <div className="nearby-screen">
  <header className="nearby-heading"><h2>Рядом с вами</h2><p>Места рядом с вами</p></header>
  <section className="nearby-location" aria-label="Местоположение"><span>{geo.status==='located'?'Ваша геопозиция':geo.status==='loading'?'Определяем местоположение…':'Демо-область · Москва'}</span>{geo.status!=='located'&&<><p>Разрешите доступ к геопозиции, чтобы увидеть места рядом с вами</p><div className="actions"><Button className="outline small" disabled={geo.status==='loading'} onClick={geo.request}>Разрешить</Button><Button className="outline small" onClick={geo.useDemo}>Демо-режим</Button></div></>}{geo.status==='located'&&<Button className="outline small" onClick={geo.useDemo}>Демо-режим</Button>}</section>
  <MiraSearch label="Найти место…" placeholder="Ресторан, кухня или блюдо" value={search} onChange={e=>setSearch(e.target.value)}/>
  <nav className="nearby-filters" aria-label="Фильтры заведений">{[['all','Все'],['restaurant','Рестораны'],['coffee','Кофе'],['cafe','Кафе'],['delivery','Доставка'],['promotions','Акции']].map(([id,label])=><MiraChip key={id} selected={filter===id} onClick={()=>setFilter(id)}>{label}</MiraChip>)}</nav>
  <VenueMap venues={visible} location={geo.location} selectedId={selected?.id} onSelect={setSelectedId} isDemo={geo.status!=='located'}/>
  {selected&&<Card className="venue-preview"><img className="preview-image" src={selected.venueImage} alt={selected.name}/><small>ВЫБРАНО НА КАРТЕ</small><h3>{selected.name}</h3><VenueSummary venue={selected} now={now}/>{actions(selected)}</Card>}
  <h3>Заведения рядом <small>{visible.length}</small></h3><p className="catalog-note">Демонстрационные заведения в Москве. Расстояния рассчитаны от {geo.status==='located'?'вашей геопозиции':'демо-точки'}.</p>
  {!visible.length&&<Empty>Места не найдены. Измените запрос или фильтр.</Empty>}
  <div className="nearby-list">{visible.map(v=><GuestVenueCard key={v.id} id={v.id} name={v.name} image={v.venueImage} category={v.category} distance={v.distance} distanceMeters={v.distanceMeters} rating={v.rating} hours={v.hours} status={now?(isVenueOpen(v.hours,now)?'Открыто':'Закрыто'):undefined} imageType={v.venueImageType} selected={selected?.id===v.id} onOpen={()=>open(v)}/>)}</div>
  <Modal title={venue?.name??'О месте'} description={mode==='details'?'Демонстрационная карточка заведения':mode==='menu'?'Меню заведения · просмотр без входа к столу':'ДЕМО · заказ не будет отправлен реально'} open={!!venue} onClose={()=>{if(!busy){setDetailId('');setProductId('')}}}>
   {venue&&<div className="nearby-details">
    <nav className="quick-nav" aria-label="Разделы заведения">{[['details','О заведении'],['menu','Меню'],...(venue.deliveryEnabled?[['delivery','Заказать домой']]:[])].map(([id,label])=><MiraChip selected={mode===id} key={id} onClick={()=>{setMode(id as typeof mode);setProductId('')}}>{label}{id==='delivery'&&cart.length?` (${cart.reduce((n,item)=>n+item.quantity,0)})`:''}</MiraChip>)}</nav>
    {mode==='details'&&<><img className="dish-detail-image" src={venue.venueImage} alt={`${venue.name} · демонстрационное изображение пространства`}/><VenueSummary venue={venue} now={now}/><div className="line"><span>Часы работы</span><strong>{venue.hours}</strong></div><p>{venue.address}</p><p>{venue.services.join(' · ')}</p>{venue.promotions.slice(1).map(p=><p className="venue-promotion" key={p}>{p}</p>)}<VenueMap venues={detailVenues} location={detailLocation} detail isDemo/>{canFavorite&&<Button className="outline" onClick={()=>void dispatch({type:'favorite',id:venue.id})}>{s.favorites.includes(venue.id)?'Убрать из избранного':'В избранное'}</Button>}{venue.bookingEnabled&&<Button onClick={()=>{setDetailId('');navigate('booking')}}>Забронировать стол</Button>}</>}
    {mode==='menu'&&<><p className="catalog-note">Это меню {venue.name}. Просмотр не открывает посещение и не меняет заказ вашего стола.</p><div className="nearby-menu guest-menu-product-list" aria-label={`Меню ${venue.name}`}>{venue.menu.map(p=><GuestMenuProductCard key={p.id} image={menuPresentation(p).image} mode={guestProductionMode} title={p.name} description={p.description} metadata={`${p.weight} · ${formatMoney(p.price)}`} favourite={favourites.includes(p.id)} quantity={menuQuantity(p)} busy={busy} unavailable={p.stopped} onOpen={()=>onOpenProduct(p,Math.max(1,menuQuantity(p)))} onFavourite={()=>onFavourite(p.id)} onQuickAdd={()=>quickAdd(p)} onDecrease={()=>setMenuQuantity(p,menuQuantity(p)-1)}/>)}</div></>}
    {mode==='delivery'&&<><p className="catalog-note">Это меню {venue.name}. Просмотр не открывает посещение и не меняет заказ вашего стола.</p>{receipt&&<MiraToast kind="success">{receipt}</MiraToast>}<MiraToast kind="error">{message}</MiraToast>
     <div className="nearby-menu guest-menu-product-list" aria-label={`Меню доставки ${venue.name}`}>{venue.menu.map(p=><GuestMenuProductCard key={p.id} image={menuPresentation(p).image} mode={guestProductionMode} title={p.name} description={p.description} metadata={`${p.weight} · ${formatMoney(p.price)}`} favourite={favourites.includes(p.id)} quantity={menuQuantity(p)} busy={busy} unavailable={p.stopped} onOpen={()=>pick(p)} onFavourite={()=>onFavourite(p.id)} onQuickAdd={()=>quickAddDelivery(p)} onDecrease={()=>setMenuQuantity(p,menuQuantity(p)-1)}/>)}</div>
     <GuestProductDetail product={product??null} open={!!product} mode={guestProductionMode} description={`Меню доставки · ${venue.name}`} modifierIds={mods} quantity={quantity} comment={comment} busy={busy} canSubmit={Boolean(venue.deliveryEnabled&&product&&!product.stopped&&Number.isInteger(quantity)&&quantity>=1&&quantity<=99&&requiredDeliveryModifiersSelected)} submitLabel={product?.stopped?'В стоп-листе':'В корзину доставки'} onOpenChange={open=>{if(!open)setProductId('')}} onModifierChange={(modifier,checked)=>setMods(modifier.required?[...mods.filter(id=>!product?.modifiers.some(item=>item.id===id&&item.group===modifier.group)),modifier.id]:checked?[...mods,modifier.id]:mods.filter(id=>id!==modifier.id))} onDecrease={()=>setQuantity(value=>value-1)} onIncrease={()=>setQuantity(value=>value+1)} onCommentChange={setComment} onSubmit={()=>{if(!product)return;updateCart([...cart,{productId:product.id,quantity,modifierIds:mods,comment}]);setProductId('')}}/>
     <section className="delivery-checkout"><h3>Корзина доставки</h3>{!cart.length?<Empty>Выберите блюда из меню этого заведения.</Empty>:<>{cart.map((item,index)=><div className="line" key={index}><span>{venue.menu.find(p=>p.id===item.productId)?.name} × {item.quantity}<small className="block">{formatMoney(lineTotal(item))}</small></span><Button className="outline small" disabled={busy} onClick={()=>updateCart(cart.filter((_,i)=>i!==index))}>Убрать</Button></div>)}<div className="line"><strong>Итого</strong><strong>{formatMoney(total)}</strong></div>{unavailable&&<MiraToast kind="error">Некоторые блюда недоступны. Уберите их из корзины.</MiraToast>}<p className="catalog-note">ДЕМО · заказ не будет отправлен реально. Сумма за блюда; доставка и списание денег не выполняются.</p><form onSubmit={e=>{e.preventDefault();void checkout(e.currentTarget)}}><fieldset disabled={busy} className="order-target"><Input label="Адрес доставки" name="address" required maxLength={300}/><Input label="Телефон / контакт" name="contact" required maxLength={100}/><Input label="Комментарий к доставке" name="comment" maxLength={500}/><Select label="Способ оплаты доставки" name="payment"><option value="Картой (демо)">Картой · демо</option><option value="Наличными (демо)">Наличными · демо</option></Select><Button type="submit" loading={busy} disabled={unavailable}>Оформить демо-доставку</Button></fieldset></form></>}</section>
    </>}
   </div>}
  </Modal>
 </div>;
}
