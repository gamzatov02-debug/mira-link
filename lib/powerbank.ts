export type PowerbankProviderStatus='available'|'unavailable';
export type PowerbankStationStatus='available'|'empty'|'unavailable'|'closed';
export type PowerbankRentalStatus='active'|'returned';
export type PowerbankDemoScenario='one'|'none'|'active'|'return'|'error';

export type PowerbankProvider={
 id:string;
 name:string;
 adapterType:string;
 status:PowerbankProviderStatus;
 enabled:boolean;
 demo:boolean;
};

export type PowerbankTariff={
 summary:string;
 detail?:string;
};

export type PowerbankStation={
 id:string;
 providerId:string;
 venueId?:string;
 venueName:string;
 title:string;
 locationLabel:string;
 distanceMeters?:number;
 availableUnits?:number;
 returnSlots?:number;
 tariff?:PowerbankTariff;
 image?:string;
 compatibleProviderIds:string[];
 status:PowerbankStationStatus;
 recommended?:boolean;
};

export type PowerbankRental={
 id:string;
 providerId:string;
 stationId:string;
 deviceDisplayNumber?:string;
 startedAt?:string;
 elapsedMinutes?:number;
 status:PowerbankRentalStatus;
 currentCost?:string;
 compatibleProviderIds:string[];
};

export type PowerbankStationQuery={venueId?:string;nearby?:boolean};
export type StartPowerbankRentalRequest={stationId:string;guestReference?:string};

export interface PowerbankProviderAdapter{
 readonly provider:PowerbankProvider;
 getStations(query:PowerbankStationQuery):Promise<PowerbankStation[]>;
 getStation(stationId:string):Promise<PowerbankStation|undefined>;
 getAvailability(stationId:string):Promise<Pick<PowerbankStation,'availableUnits'|'returnSlots'|'status'>|undefined>;
 getTariff(stationId:string):Promise<PowerbankTariff|undefined>;
 startRental(request:StartPowerbankRentalRequest):Promise<PowerbankRental>;
 getRental(rentalId:string):Promise<PowerbankRental|undefined>;
 getReturnStations(rental:PowerbankRental):Promise<PowerbankStation[]>;
}

export class DemoPowerbankProviderAdapter implements PowerbankProviderAdapter{
 readonly provider:PowerbankProvider;
 private readonly stations:PowerbankStation[];
 private rental?:PowerbankRental;

 constructor(provider:PowerbankProvider,stations:PowerbankStation[],rental?:PowerbankRental){
  this.provider=provider;
  this.stations=stations.filter(station=>station.providerId===provider.id);
  this.rental=rental?.providerId===provider.id?rental:undefined;
 }

 async getStations(query:PowerbankStationQuery){
  if(this.provider.status==='unavailable')throw new Error('POWERBANK_PROVIDER_UNAVAILABLE');
  return this.stations.filter(station=>query.nearby||!query.venueId||station.venueId===query.venueId);
 }
 async getStation(stationId:string){return this.stations.find(station=>station.id===stationId)}
 async getAvailability(stationId:string){const station=await this.getStation(stationId);return station?{availableUnits:station.availableUnits,returnSlots:station.returnSlots,status:station.status}:undefined}
 async getTariff(stationId:string){return (await this.getStation(stationId))?.tariff}
 async startRental({stationId}:StartPowerbankRentalRequest){
  const station=await this.getStation(stationId);
  if(!station||station.status!=='available'||!station.availableUnits)throw new Error('POWERBANK_STATION_UNAVAILABLE');
  this.rental={id:`demo-rental-${stationId}`,providerId:this.provider.id,stationId,deviceDisplayNumber:'1248',startedAt:'22:40',elapsedMinutes:0,status:'active',currentCost:station.tariff?.summary.split('/')[0].trim(),compatibleProviderIds:[...station.compatibleProviderIds]};
  return this.rental;
 }
 async getRental(rentalId:string){return this.rental?.id===rentalId?this.rental:undefined}
 async getReturnStations(rental:PowerbankRental){return this.stations.filter(station=>station.returnSlots!==undefined&&station.returnSlots>0&&rental.compatibleProviderIds.includes(station.providerId)&&station.status!=='unavailable')}
}

export class PowerbankService{
 private readonly adapters:Map<string,PowerbankProviderAdapter>;
 constructor(adapters:PowerbankProviderAdapter[]){this.adapters=new Map(adapters.map(adapter=>[adapter.provider.id,adapter]))}
 registeredProviders(){return [...this.adapters.values()].map(adapter=>adapter.provider)}
 providers(){return this.registeredProviders().filter(provider=>provider.enabled)}
 async getStations(query:PowerbankStationQuery){return (await Promise.all([...this.adapters.values()].filter(adapter=>adapter.provider.enabled&&adapter.provider.status==='available').map(adapter=>adapter.getStations(query)))).flat()}
 async startRental(providerId:string,request:StartPowerbankRentalRequest){const adapter=this.adapters.get(providerId);if(!adapter)throw new Error('POWERBANK_PROVIDER_NOT_REGISTERED');if(!adapter.provider.enabled)throw new Error('POWERBANK_PROVIDER_DISABLED');return adapter.startRental(request)}
 async getCompatibleReturnStations(rental:PowerbankRental){const adapter=this.adapters.get(rental.providerId);if(!adapter)return [];return (await adapter.getReturnStations(rental)).filter(station=>rental.compatibleProviderIds.includes(station.providerId))}
}

const stationImage='/images/energo-terminal-cutout.webp';
export const demoPowerbankProviders:PowerbankProvider[]=[
 {id:'energo-demo',name:'EnerGO',adapterType:'demo-energo',status:'available',enabled:true,demo:true},
 {id:'provider-b-test',name:'Provider B',adapterType:'demo-provider-b',status:'available',enabled:false,demo:true},
];

export const demoPowerbankStations:PowerbankStation[]=[
 {id:'energo-mira-entry',providerId:'energo-demo',venueId:'mira',venueName:'MIRA Restaurant',title:'MIRA Restaurant',locationLabel:'У входа в ресторан',distanceMeters:20,availableUnits:6,returnSlots:2,tariff:{summary:'99 ₽ / первый час',detail:'Далее 50 ₽ / час'},image:stationImage,compatibleProviderIds:['energo-demo'],status:'available',recommended:true},
 {id:'provider-b-mira-bar',providerId:'provider-b-test',venueId:'mira',venueName:'MIRA Restaurant',title:'MIRA Restaurant',locationLabel:'У бара',distanceMeters:35,availableUnits:3,returnSlots:1,tariff:{summary:'79 ₽ / первый час'},image:stationImage,compatibleProviderIds:['provider-b-test'],status:'available'},
 {id:'energo-garden-return',providerId:'energo-demo',venueName:'Garden Cafe',title:'Garden Cafe',locationLabel:'Главный вход',distanceMeters:120,availableUnits:4,returnSlots:2,tariff:{summary:'99 ₽ / первый час',detail:'Далее 50 ₽ / час'},image:stationImage,compatibleProviderIds:['energo-demo'],status:'available'},
 {id:'provider-b-atelier-return',providerId:'provider-b-test',venueName:'Atelier',title:'Atelier',locationLabel:'Стойка хостес',distanceMeters:180,availableUnits:2,returnSlots:3,tariff:{summary:'79 ₽ / первый час'},image:stationImage,compatibleProviderIds:['provider-b-test'],status:'available'},
];

export const demoPowerbankRental:PowerbankRental={id:'demo-rental-energo',providerId:'energo-demo',stationId:'energo-mira-entry',deviceDisplayNumber:'1248',startedAt:'22:40',elapsedMinutes:18,status:'active',currentCost:'99 ₽',compatibleProviderIds:['energo-demo']};

export const launchPowerbankProviderIds=['energo-demo'] as const;

export function createDemoPowerbankService(enabledProviderIds:readonly string[]=launchPowerbankProviderIds){
 const providers=demoPowerbankProviders.map(provider=>({...provider,enabled:enabledProviderIds.includes(provider.id)}));
 return new PowerbankService(providers.map(provider=>new DemoPowerbankProviderAdapter(provider,demoPowerbankStations,demoPowerbankRental)));
}

export const demoPowerbankService=createDemoPowerbankService();

export type PowerbankServiceView={
 providers:PowerbankProvider[];
 currentStations:PowerbankStation[];
 nearbyStations:PowerbankStation[];
 activeRental?:PowerbankRental;
 returnStations:PowerbankStation[];
 providerError:boolean;
};

export async function loadDemoPowerbankView(scenario:PowerbankDemoScenario,venueId='mira',activeRentalId?:string,service:PowerbankService=demoPowerbankService):Promise<PowerbankServiceView>{
 const providers=service.providers();
 const all=await service.getStations({nearby:true});
 const venueStations=all.filter(station=>station.venueId===venueId);
 const currentStations=scenario==='one'?venueStations:[];
 const activeRental=scenario==='active'||scenario==='return'||activeRentalId?{...demoPowerbankRental,id:activeRentalId||demoPowerbankRental.id}:undefined;
 const returnStations=activeRental?await service.getCompatibleReturnStations(activeRental):[];
 return {providers,currentStations,nearbyStations:all.filter(station=>station.venueId!==venueId),activeRental,returnStations,providerError:scenario==='error'};
}
