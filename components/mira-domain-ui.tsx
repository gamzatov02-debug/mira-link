'use client';
import {useEffect,useState,type ReactNode} from 'react';
import {menuPresentation} from '@/lib/menu-presentation';
import type {Product,OrderItem as OrderItemModel,Payment} from '@/lib/domain/model';
import {itemTotal,formatMoney as money} from '@/lib/domain/selectors';
import {MiraButton,MiraCard,MiraStatusBadge,MiraChip,MiraNavIcon,MiraModal} from './mira';

export function ProductImage({product,className=''}:{product:Product;className?:string}){
 const [failed,setFailed]=useState(false);
 const image=menuPresentation(product).image;
 useEffect(()=>setFailed(false),[image]);
 return image&&!failed?<img className={className} src={image} alt={`${product.name} — пример подачи`} loading="lazy" width="600" height="400" onError={()=>setFailed(true)}/>:<span className={`dish-placeholder ${className}`} role="img" aria-label={`${product.name}: фото пока нет`}><MiraNavIcon label="Меню"/><span>{product.category}</span></span>;
}
export function ProductInfo({product}:{product:Product}){const details=menuPresentation(product);return <div className="product-info"><h4>Состав блюда</h4><p>{details.ingredients}</p><h4>Аллергены в демо-рецепте</h4><p>{details.allergens}</p><small>Демонстрационный состав. Фото — пример подачи. Реальный состав и возможные следы аллергенов уточняются у кухни.</small></div>}
export function ProductShowcase({product}:{product:Product}){const [open,setOpen]=useState(false);return <><ProductImage product={product} className="dish-image"/><MiraButton className="outline small" onClick={()=>setOpen(true)}>Показать фото и состав</MiraButton><MiraModal title={product.name} description="Меню MIRA Restaurant" open={open} onClose={()=>setOpen(false)}><ProductImage product={product} className="dish-detail-image"/><ProductInfo product={product}/></MiraModal></>}
export function OrderItem({item}:{item:OrderItemModel}){return <div className="line order-item"><span>{item.name} × {item.quantity}<small className="block">{item.modifiers.join(', ')} {item.comment}</small></span><span>{money(itemTotal(item))}</span></div>}
export function PaymentBreakdown({payment:p}:{payment:Payment}){return <MiraCard className="payment-breakdown"><div className="row"><strong>{money(p.total)} · {p.method==='cash'?'Наличные':'Онлайн'}</strong><MiraStatusBadge status={p.status}/></div>{[['Часть счёта',p.base],['Акция / промокод',p.promotion+p.promoCode],['Бонусы списаны',p.bonuses],['Чаевые',p.tips],[`Комиссия · ${p.guestPaysCommission?'гость':'ресторан'}`,p.commission]].map(([label,amount])=><div className="line" key={label}><span>{label}</span><span>{money(Number(amount))}</span></div>)}<small>{p.id} · Бонусы начислены: {p.status==='succeeded'?money(p.cashback):money(0)}</small></MiraCard>}
export function TipSelector({onSelect,value,base}:{onSelect:(percent:number)=>void;value:number;base:number}){return <div className="tip-selector actions">{[0,10,15,20,25].map(percent=><MiraChip selected={value===Math.round(base*percent/100)} key={percent} onClick={()=>onSelect(percent)}>{percent}%</MiraChip>)}</div>}
export function BonusControl({children}:{children:ReactNode}){return <div className="bonus-control">{children}</div>}
export function VenueCard({children}:{children:ReactNode}){return <MiraCard className="venue-card">{children}</MiraCard>}
export function EventCard({children}:{children:ReactNode}){return <MiraCard className="event-card">{children}</MiraCard>}
export function TableCard({children}:{children:ReactNode}){return <MiraCard className="table-card">{children}</MiraCard>}
export function StaffCallCard({children}:{children:ReactNode}){return <MiraCard className="staff-call-card">{children}</MiraCard>}
