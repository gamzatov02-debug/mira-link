'use client';

import type {NearbyVenue,Location} from '@/lib/nearby';
import {resolveMapProvider} from './maps/map-provider';

export function VenueMap({venues,location,selectedId,onSelect,detail=false,isDemo=true}:{venues:NearbyVenue[];location:Location;selectedId?:string;onSelect?:(id:string)=>void;detail?:boolean;isDemo?:boolean}){
 const provider=resolveMapProvider();
 const Map=provider.Map;
 return <section className="venue-map" data-map-provider={provider.id} aria-label={detail?'Карта расположения заведения':'Карта заведений рядом'}><Map venues={venues} location={location} selectedId={selectedId} onSelect={onSelect} detail={detail} isDemo={isDemo}/><small>{isDemo?'Демокарта · схема района и расположение заведений условны.':'Геопозиция получена · координаты заведений демонстрационные.'}</small></section>;
}
