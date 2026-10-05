'use client';

import type {ComponentType,CSSProperties} from 'react';
import {MapPin} from 'lucide-react';
import type {Location,NearbyVenue} from '@/lib/nearby';

export type MapProviderId='yandex'|'2gis'|'branded-demo';
export type MapProviderProps={
 venues:NearbyVenue[];
 location:Location;
 selectedId?:string;
 onSelect?:(id:string)=>void;
 detail?:boolean;
 isDemo?:boolean;
};

export interface MapProvider{
 id:MapProviderId;
 label:string;
 Map:ComponentType<MapProviderProps>;
}

export const mapProviderEnvironment={
 yandex:'NEXT_PUBLIC_YANDEX_MAPS_API_KEY',
 twoGis:'NEXT_PUBLIC_2GIS_MAPS_API_KEY',
} as const;

function project(points:Location[],point:Location):CSSProperties{
 const latitudes=points.map(item=>item.latitude),longitudes=points.map(item=>item.longitude);
 const minLat=Math.min(...latitudes),maxLat=Math.max(...latitudes),minLon=Math.min(...longitudes),maxLon=Math.max(...longitudes);
 const latSpan=Math.max(maxLat-minLat,.008),lonSpan=Math.max(maxLon-minLon,.012);
 const centerLat=(minLat+maxLat)/2,centerLon=(minLon+maxLon)/2;
 const x=50+((point.longitude-centerLon)/lonSpan)*72;
 const y=50-((point.latitude-centerLat)/latSpan)*70;
 return {left:`${Math.max(8,Math.min(92,x))}%`,top:`${Math.max(12,Math.min(88,y))}%`};
}

function BrandedDemoMap({venues,location,selectedId,onSelect,detail=false,isDemo=true}:MapProviderProps){
 const points=detail?venues:[location,...venues];
 return <div className="venue-map-canvas mira-demo-map" data-map-provider="branded-demo" role="group" aria-label="Демонстрационная карта заведений MIRA LINK">
  <span className="mira-demo-map-road road-one" aria-hidden="true"/><span className="mira-demo-map-road road-two" aria-hidden="true"/><span className="mira-demo-map-road road-three" aria-hidden="true"/>
  <span className="mira-demo-map-badge">DEMO MAP · MIRA LINK</span>
  {!detail&&<span className="guest-location-marker" style={project(points,location)} aria-label={isDemo?'Демо-местоположение':'Ваше местоположение'}><span className="guest-location-dot"/><small>{isDemo?'DEMO':'ВЫ'}</small></span>}
  {venues.map(venue=><button type="button" key={venue.id} data-venue-marker={venue.id} className={`mira-map-pin ${selectedId===venue.id?'selected':''}`} style={project(points,venue)} aria-label={`Выбрать ${venue.name}`} aria-pressed={selectedId===venue.id} onClick={()=>onSelect?.(venue.id)}><span className="mira-map-pin-core"><MapPin aria-hidden="true"/></span><span className="mira-map-pin-label">{venue.name}</span></button>)}
 </div>;
}

const brandedDemoMapProvider:MapProvider={id:'branded-demo',label:'MIRA LINK demo map',Map:BrandedDemoMap};
const providers:Partial<Record<MapProviderId,MapProvider>>={'branded-demo':brandedDemoMapProvider};

export function resolveMapProvider(preferred:MapProviderId[]=['yandex','2gis','branded-demo']):MapProvider{
 for(const id of preferred){const provider=providers[id];if(provider)return provider}
 return brandedDemoMapProvider;
}
