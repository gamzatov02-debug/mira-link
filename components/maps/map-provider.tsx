'use client';

import {Coffee,MapPin,UtensilsCrossed} from 'lucide-react';
import type {ComponentType} from 'react';
import type {Location,NearbyVenue} from '@/lib/nearby';
import styles from './map-provider.module.css';

export type MapProviderId='yandex'|'2gis'|'branded-demo';
export type MapProviderProps={venues:NearbyVenue[];location:Location;selectedId?:string;onSelect?:(id:string)=>void;detail?:boolean;isDemo?:boolean};
export type MapProvider={id:MapProviderId;label:string;Map:ComponentType<MapProviderProps>};

export const mapProviderEnvironment={
 yandex:'NEXT_PUBLIC_YANDEX_MAPS_API_KEY',
 twoGis:'NEXT_PUBLIC_2GIS_MAPS_API_KEY',
} as const;

function project(venues:NearbyVenue[],venue:NearbyVenue){
 const latitudes=venues.map(item=>item.latitude),longitudes=venues.map(item=>item.longitude);
 const minLat=Math.min(...latitudes),maxLat=Math.max(...latitudes),minLon=Math.min(...longitudes),maxLon=Math.max(...longitudes);
 const latRange=Math.max(maxLat-minLat,.004),lonRange=Math.max(maxLon-minLon,.004);
 return {left:Number((50+((venue.longitude-(minLon+maxLon)/2)/lonRange)*68).toFixed(3)),top:Number((52-((venue.latitude-(minLat+maxLat)/2)/latRange)*50).toFixed(3))};
}

function VenueIcon({venue}:{venue:NearbyVenue}){
 return venue.kind==='restaurant'?<UtensilsCrossed aria-hidden/>:<Coffee aria-hidden/>;
}

function VenueMapMarker({venue,point,selected,onSelect}:{venue:NearbyVenue;point:{left:number;top:number};selected:boolean;onSelect?:()=>void}){
 const props={className:`${styles.pin} ${selected?styles.selected:''}`,style:{left:`${point.left}%`,top:`${point.top}%`},'data-venue-marker':venue.id};
 const content=<span className={styles.pinCore}>{selected?<span className={styles.monogram}>M</span>:<VenueIcon venue={venue}/>}</span>;
 return onSelect?<button {...props} type="button" aria-label={`Выбрать ${venue.name}`} aria-pressed={selected} onClick={onSelect}>{content}</button>:<span {...props} role="img" aria-label={venue.name}>{content}</span>;
}

function BrandedDemoMap({venues,selectedId,onSelect,detail=false}:MapProviderProps){
 return <div className={`${styles.map} ${detail?styles.detail:''}`}>
  <div className={styles.blocks} aria-hidden>{Array.from({length:9},(_,index)=><span key={index}/>)}</div>
  <div className={styles.streetHorizontal} aria-hidden/><div className={styles.streetVertical} aria-hidden/><div className={styles.streetCurve} aria-hidden/>
  <span className={styles.demoBadge}>Демокарта</span>
  {venues.map(venue=><VenueMapMarker key={venue.id} venue={venue} point={project(venues,venue)} selected={selectedId===venue.id} onSelect={onSelect?()=>onSelect(venue.id):undefined}/>)}
  {!venues.length&&<div className={styles.empty}><MapPin aria-hidden/><span>Нет мест по выбранным условиям</span></div>}
 </div>;
}

const brandedDemoMapProvider:MapProvider={id:'branded-demo',label:'MIRA LINK demo map',Map:BrandedDemoMap};
const providers:Partial<Record<MapProviderId,MapProvider>>={'branded-demo':brandedDemoMapProvider};

/** The demo provider is the safe fallback until a real provider implementation and key are connected. */
export function resolveMapProvider(preferred:MapProviderId[]=['yandex','2gis','branded-demo']):MapProvider{
 for(const id of preferred){const provider=providers[id];if(provider)return provider}
 return brandedDemoMapProvider;
}
