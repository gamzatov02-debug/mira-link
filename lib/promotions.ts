import type {Promotion,PromotionType} from './domain/model';

export type GuestPromotionFilter='all'|'discount'|'combo'|'gift';
export type PromotionAvailability='active'|'upcoming'|'expired';

const eventLanguage=/\b(джаз|dj|концерт|живая музыка|гастроужин|ужин с шефом|тематический вечер)\b/i;

export function isEventLikePromotion(promotion:Promotion){
 return promotion.type==='event'||['pr1','pr2'].includes(promotion.id)||eventLanguage.test(`${promotion.title} ${promotion.description}`);
}

export function promotionAvailability(promotion:Promotion,now=new Date()):PromotionAvailability{
 const timestamp=now.getTime();
 const starts=promotion.startAt?new Date(promotion.startAt).getTime():undefined;
 const ends=promotion.endAt?new Date(promotion.endAt).getTime():undefined;
 if(ends!==undefined&&Number.isFinite(ends)&&ends<timestamp)return 'expired';
 if(starts!==undefined&&Number.isFinite(starts)&&starts>timestamp)return 'upcoming';
 return 'active';
}

export function promotionTypeLabel(type:PromotionType|undefined){
 return type==='discount'?'Скидка':type==='combo'?'Комбо':type==='gift'?'Подарок':'Спецпредложение';
}

export function getGuestPromotions(promotions:Promotion[],filter:GuestPromotionFilter='all',now=new Date()){
 return promotions
  .filter(promotion=>promotion.published&&!isEventLikePromotion(promotion)&&promotionAvailability(promotion,now)!=='expired')
  .filter(promotion=>filter==='all'||promotion.type===filter)
  .sort((left,right)=>Number(Boolean(right.featured))-Number(Boolean(left.featured))||Number(promotionAvailability(left,now)==='upcoming')-Number(promotionAvailability(right,now)==='upcoming')||String(left.endAt??'9999').localeCompare(String(right.endAt??'9999'))||left.id.localeCompare(right.id));
}
