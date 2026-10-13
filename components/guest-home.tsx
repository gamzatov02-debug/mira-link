'use client';

import {useRef,useState} from 'react';
import {Bell,UserRound,ChevronDown,ChevronLeft,ChevronRight,UtensilsCrossed,ReceiptText,Wallet,Tag,Heart,BatteryCharging,Car,ArrowRight,Wifi} from 'lucide-react';
import type {Product,CartItem} from '@/lib/domain/model';
import {defaultBrand,type BrandConfig} from '@/lib/guest-theme';
import {Button,Card,IconButton} from '@/components/design-system';
import {guestProductionMode} from '@/components/guest/adapters/status';
import headerStyles from './guest-header.module.css';
import styles from './guest-home.module.css';
import {ProductImage} from './mira-domain-ui';
import {menuPresentation} from '@/lib/menu-presentation';

const money=(value:number)=>new Intl.NumberFormat('ru-RU',{style:'currency',currency:'RUB',minimumFractionDigits:0,maximumFractionDigits:2}).format(value/100);

export function GuestHeader({tableId,navigate,unread=false,onTable}:{tableId?:string;navigate:(page:string)=>void;unread?:boolean;onTable:()=>void}){return <header className="guest-header"><div className={`guest-logo ${headerStyles.logo}`}><div className={headerStyles.lockup}><img className={headerStyles.monogram} src="/brand/mira-monogram.svg" alt="Монограмма MIRA LINK" draggable={false}/><span>MIRA LINK</span></div></div><div className="guest-header-controls">{tableId&&<button className="table-selector" onClick={onTable} aria-label={`Текущий стол ${tableId}`}><UtensilsCrossed/><span>Стол {tableId}</span><ChevronDown/></button>}<IconButton mode={guestProductionMode} variant="ghost" aria-label="Уведомления" onClick={()=>navigate('notifications')}><Bell/>{unread&&<i className="unread-dot"/>}</IconButton><IconButton mode={guestProductionMode} variant="ghost" aria-label="Профиль" onClick={()=>navigate('profile')}><UserRound/></IconButton></div></header>}

export function RestaurantHero({brand=defaultBrand,onMenu}:{brand?:BrandConfig;onMenu?:()=>void}){
 const [slide,setSlide]=useState(0);
 const touch=useRef<number|null>(null);
 const move=(delta:number)=>setSlide(n=>(n+delta+brand.heroImages.length)%brand.heroImages.length);
 return <section className="restaurant-hero" aria-label="Ресторан" onTouchStart={e=>{touch.current=e.touches[0].clientX}} onTouchEnd={e=>{if(touch.current!==null){const delta=e.changedTouches[0].clientX-touch.current;if(Math.abs(delta)>40)move(delta<0?1:-1)}touch.current=null}}>
  <img src={brand.heroImages[slide]} alt={`${brand.restaurantName} · ${slide+1}`} draggable={false}/>
  <div className="restaurant-hero-copy"><span>РЕСТОРАН · MIRA LINK</span><h2>{brand.restaurantName}</h2><p>{brand.marketingContent[slide%brand.marketingContent.length]}</p></div>
  {onMenu&&<button className="hero-menu-cta" type="button" onClick={onMenu}>Смотреть меню <ArrowRight/></button>}
  <div className="hero-paging"><span>{String(slide+1).padStart(2,'0')} / {String(brand.heroImages.length).padStart(2,'0')}</span><i className="hero-dots" aria-hidden="true">{brand.heroImages.map((_,index)=><b key={index} data-active={index===slide}/>)}</i><button aria-label="Следующий слайд" onClick={()=>move(1)}><ChevronRight/></button></div>
 </section>
}

export const quickActions=[['menu','Меню','Блюда и напитки',UtensilsCrossed],['order','Заказ','Ваши позиции',ReceiptText],['bill','Счёт','Оплата за столом',Wallet],['waiter','Официант','Команда рядом',Bell],['promotions','Акции','Спецпредложения',Tag],['wifi','Wi-Fi','Сеть заведения',Wifi],['powerbank','Пауэрбанк','Зарядка рядом',BatteryCharging],['taxi','Такси','Поездка домой',Car]] as const;

export function GuestHome({products,navigate,onProduct,promotion,favorites,onFavorite}:{products:Product[];navigate:(page:string)=>void;onProduct:(p:Product)=>void;promotion?:string;favorites:string[];onFavorite:(id:string)=>void}){
 const renderQuickAction=([page,title,caption,Icon]:(typeof quickActions)[number])=><button key={page} aria-label={title==='Меню'?'Меню — быстрое действие':title} onClick={()=>navigate(page)}><Icon/><span>{title}</span><small>{caption}</small></button>;
 return <>
  <RestaurantHero onMenu={()=>navigate('menu')}/>
  <div className="guest-service-kicker">ВАШ ВЕЧЕР · ВСЁ ПОД РУКОЙ</div>
  <nav className="guest-quick-actions" aria-label="Основные функции">{quickActions.map(renderQuickAction)}</nav>
  <button type="button" className={`guest-promo guest-promo-banner ${styles.promoBanner}`} aria-label="Посмотреть рекламное предложение" onClick={()=>navigate('promotions')}>
   <img src={defaultBrand.promoImages[0]} alt=""/>
   <span className="guest-promo-banner-shade" aria-hidden="true"/>
   <span className="guest-promo-banner-copy"><small>СПЕЦИАЛЬНОЕ ПРЕДЛОЖЕНИЕ</small><strong>{promotion??'Обед в MIRA'}</strong><em>Суп, горячее и напиток<br/>по специальной цене</em></span>
   <span className="promo-action" aria-hidden="true"><ArrowRight/></span>
  </button>
  <section className="guest-popular">
   <div className="row"><h2>Популярное</h2><button className="guest-popular-more" type="button" onClick={()=>navigate('menu')}>Смотреть всё →</button></div>
   <div className="popular-grid" aria-label="Популярное">{products.slice(0,6).map(p=><article className="popular-dish" key={p.id}>
    <button className="popular-image" type="button" onClick={()=>onProduct(p)} aria-label={`Открыть блюдо: ${p.name}`}><img src={menuPresentation(p).image} alt=""/></button>
    <button className="dish-favorite" type="button" aria-label={`В избранное: ${p.name}`} aria-pressed={favorites.includes(p.id)} onClick={()=>onFavorite(p.id)}><Heart/></button>
    <span>{p.name}</span><small>{p.weight}</small>
    <div><strong>{money(p.price)}</strong><button type="button" disabled={p.stopped} aria-label={p.stopped?`${p.name} недоступно`:`Выбрать ${p.name}`} onClick={()=>onProduct(p)}>+</button></div>
   </article>)}</div>
  </section>
 </>;
}

export const guestHomeLayoutClass=styles.homeApp;

export function FloatingCart({cart,products,navigate}:{cart:CartItem[];products:Product[];navigate:(page:string)=>void}){if(!cart.length)return null;const first=products.find(p=>p.id===cart[0].productId);const total=cart.reduce((sum,i)=>{const p=products.find(p=>p.id===i.productId);return sum+(p?(p.price+p.modifiers.filter(m=>i.modifierIds.includes(m.id)).reduce((n,m)=>n+m.price,0))*i.quantity:0)},0);return <Card mode={guestProductionMode} className="floating-cart" aria-label="Корзина"><div>{first&&<ProductImage product={first}/>}</div><div><strong>Ваш заказ</strong><small>{cart.reduce((n,i)=>n+i.quantity,0)} поз. · {money(total)}</small></div><Button size="l" mode={guestProductionMode} onClick={()=>navigate('order')}>Оформить →</Button></Card>}
