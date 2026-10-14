'use client';

import {useMemo,useState} from 'react';
import {ArrowRight,ChevronRight,Tag} from 'lucide-react';
import {BottomSheet,Button} from '@/components/design-system';
import {guestProductionMode} from '@/components/guest/adapters/status';
import {menuPresentation} from '@/lib/menu-presentation';
import {getGuestPromotions,promotionAvailability,promotionTypeLabel,type GuestPromotionFilter} from '@/lib/promotions';
import {formatMoney} from '@/lib/domain/selectors';
import type {Product,Promotion} from '@/lib/domain/model';
import styles from './guest-promotions.module.css';

const filters:[GuestPromotionFilter,string][]=[['all','Все'],['discount','Скидки'],['combo','Комбо'],['gift','Подарки']];
const fallbackImage='/images/venues/mira-link-venue-placeholder.svg';

function imageFor(promotion:Promotion,products:Product[]){
 if(promotion.image)return promotion.image;
 const product=products.find(item=>promotion.eligibleProductIds?.includes(item.id));
 return product?menuPresentation(product).image??fallbackImage:fallbackImage;
}

function timingFor(promotion:Promotion){
 if(promotionAvailability(promotion)==='upcoming'&&promotion.startAt)return `Будет доступно с ${new Date(promotion.startAt).toLocaleDateString('ru-RU',{day:'numeric',month:'long'})}`;
 return [promotion.timeWindow,promotion.validity].filter(Boolean).join(' · ')||'Условия у заведения';
}

export function GuestPromotions({promotions,products,venueName,onOpenMenu,onOpenProduct}:{promotions:Promotion[];products:Product[];venueName:string;onOpenMenu:(category?:string)=>void;onOpenProduct:(product:Product)=>void}){
 const [filter,setFilter]=useState<GuestPromotionFilter>('all');
 const [selectedId,setSelectedId]=useState('');
 const visible=useMemo(()=>getGuestPromotions(promotions,filter),[filter,promotions]);
 const featured=visible.find(promotion=>promotion.featured);
 const feed=featured?visible.filter(promotion=>promotion.id!==featured.id):visible;
 const selected=promotions.find(promotion=>promotion.id===selectedId);
 const openDestination=(promotion:Promotion)=>{
  setSelectedId('');
  const linkedProducts=products.filter(product=>promotion.eligibleProductIds?.includes(product.id));
  if(linkedProducts.length===1){onOpenProduct(linkedProducts[0]);return;}
  onOpenMenu(promotion.eligibleCategories?.[0]);
 };
 return <section className={styles.screen} aria-labelledby="guest-promotions-title">
  <header className={styles.header}><h1 id="guest-promotions-title">Акции</h1><p>Специальные предложения<br/>от <strong>{venueName}</strong></p></header>
  <nav className={styles.filters} aria-label="Категории акций">{filters.map(([id,label])=><button type="button" key={id} aria-pressed={filter===id} onClick={()=>setFilter(id)}>{label}</button>)}</nav>
  {!visible.length&&<div className={styles.empty}><Tag aria-hidden="true"/><h2>Сейчас специальных предложений нет</h2><p>Новые акции появятся здесь.</p><Button mode={guestProductionMode} size="l" onClick={()=>onOpenMenu()}>Перейти в меню</Button></div>}
  {featured&&<button type="button" className={styles.featured} onClick={()=>setSelectedId(featured.id)} aria-label={`Открыть акцию: ${featured.title}`}><img src={imageFor(featured,products)} alt=""/><span className={styles.featuredShade} aria-hidden="true"/><span className={styles.featuredBody}><span className={styles.badge}>{promotionTypeLabel(featured.type)}</span><h2>{featured.title}</h2><p>{featured.shortDescription??featured.description}</p><span className={styles.featuredMeta}><strong>{featured.benefit??(featured.price?formatMoney(featured.price):timingFor(featured))}</strong><span aria-hidden="true"><ArrowRight/></span></span></span></button>}
  {!!feed.length&&<section className={styles.feed} aria-labelledby="guest-promotions-feed"><h2 id="guest-promotions-feed">Предложения</h2>{feed.map(promotion=><button type="button" className={styles.card} key={promotion.id} onClick={()=>setSelectedId(promotion.id)} aria-label={`Открыть акцию: ${promotion.title}`}><img className={styles.thumbnail} src={imageFor(promotion,products)} alt=""/><span className={styles.cardCopy}><span className={styles.badge}>{promotionTypeLabel(promotion.type)}</span><h3>{promotion.title}</h3><p>{promotion.shortDescription??promotion.description}</p><small>{timingFor(promotion)}</small></span><ChevronRight aria-hidden="true"/></button>)}</section>}
  <BottomSheet mode={guestProductionMode} presentation="responsive-dialog" open={Boolean(selected)} onOpenChange={open=>!open&&setSelectedId('')} title={selected?.title??'Акция'} description={selected?`${promotionTypeLabel(selected.type)} · ${venueName}`:undefined} actions={selected&&<Button mode={guestProductionMode} size="l" fullWidth onClick={()=>openDestination(selected)}>{selected.eligibleProductIds?.length===1?'Открыть блюдо':selected.eligibleCategories?.length?'Посмотреть подходящие блюда':'Перейти в меню'}</Button>}>
   {selected&&<div className={styles.detail}><img className={styles.detailImage} src={imageFor(selected,products)} alt=""/><p className={styles.detailLead}>{selected.description}</p><div className={styles.detailSummary}>{selected.benefit&&<div><span>Выгода</span><strong>{selected.benefit}</strong></div>}<div><span>Когда</span><strong>{timingFor(selected)}</strong></div>{selected.minimumOrder&&<div><span>Минимальный заказ</span><strong>{formatMoney(selected.minimumOrder)}</strong></div>}</div>{selected.conditions?.length?<><strong>Условия</strong><ul className={styles.conditions}>{selected.conditions.map(condition=><li key={condition}>{condition}</li>)}</ul></>:null}</div>}
  </BottomSheet>
 </section>;
}
