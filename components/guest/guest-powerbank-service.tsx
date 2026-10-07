'use client';

import {useEffect,useMemo,useRef,useState} from 'react';
import {BatteryCharging,ChevronRight,MapPin,QrCode,RefreshCw,Route,ShieldCheck,Undo2,Zap} from 'lucide-react';
import {MiraBottomSheet,MiraButton} from '@/components/mira';
import {demoPowerbankService,loadDemoPowerbankView,type PowerbankDemoScenario,type PowerbankProvider,type PowerbankServiceView,type PowerbankStation} from '@/lib/powerbank';
import styles from './guest-powerbank-service.module.css';

type VenueContext={id:string;name:string};
type Props={
 venue?:VenueContext;
 activeRentalId?:string;
 qrTerminalId?:string;
 busy?:boolean;
 onScanTerminal:()=>void;
 onStartRental:()=>Promise<unknown>;
};

const scenarioLabels:Record<PowerbankDemoScenario,string>={one:'EnerGO доступен',none:'Нет свободных устройств',active:'Активная аренда',return:'Возврат',error:'Провайдер недоступен'};

function distanceLabel(distance?:number){return distance===undefined?'':distance<1000?`~${distance} м`:`~${(distance/1000).toFixed(1)} км`}
function providerFor(providers:PowerbankProvider[],station:PowerbankStation){return providers.find(provider=>provider.id===station.providerId)}
function stationCountLabel(count:number){const mod100=count%100,mod10=count%10;const noun=mod100>=11&&mod100<=14?'станций':mod10===1?'станция':mod10>=2&&mod10<=4?'станции':'станций';return `${count} ${noun} поблизости`}

function StationOffer({station,provider,showRecommendation,onScan}:{station:PowerbankStation;provider?:PowerbankProvider;showRecommendation:boolean;onScan:()=>void}){
 return <article className={styles.offer} aria-label={`Предложение ${provider?.name??'провайдера'}`}>
  <img src={station.image} alt={`Терминал ${provider?.name??'аренды пауэрбанков'}`}/>
  <div className={styles.offerBody}>
   <div className={styles.offerHeading}><div><strong>{provider?.name}</strong><span>Оператор аренды</span></div>{showRecommendation&&station.recommended&&<em>Рекомендуем</em>}</div>
   <p><MapPin aria-hidden="true"/>{station.locationLabel}{station.distanceMeters!==undefined&&<span>· {distanceLabel(station.distanceMeters)}</span>}</p>
   <div className={styles.availability}>{station.availableUnits!==undefined&&<span><Zap aria-hidden="true"/><strong>{station.availableUnits}</strong> доступно</span>}{station.tariff&&<span><strong>{station.tariff.summary.split('/')[0].trim()}</strong><small>{station.tariff.summary.includes('/')?'первый час':''}</small></span>}</div>
   <MiraButton onClick={onScan}><QrCode aria-hidden="true"/>Сканировать QR терминала</MiraButton>
  </div>
 </article>;
}

function NearbyEntry({count,onOpen}:{count:number;onOpen:()=>void}){
 return <button type="button" className={styles.actionRow} onClick={onOpen}><span><strong>Другие станции рядом</strong><small>{stationCountLabel(count)}</small></span><span>Показать станции <ChevronRight aria-hidden="true"/></span></button>;
}

export function GuestPowerbankService({venue,activeRentalId,qrTerminalId,busy=false,onScanTerminal,onStartRental}:Props){
 const [scenario,setScenario]=useState<PowerbankDemoScenario>(activeRentalId?'active':'one');
 const [view,setView]=useState<PowerbankServiceView|null>(null);
 const [selected,setSelected]=useState<PowerbankStation>();
 const [nearbyOpen,setNearbyOpen]=useState(false);
 const [starting,setStarting]=useState(false);
 const qrOpened=useRef(false);
 const venueId=venue?.id??'mira';

 useEffect(()=>{let live=true;void loadDemoPowerbankView(scenario,venueId,activeRentalId).then(next=>{if(live)setView(next)});return()=>{live=false}},[scenario,venueId,activeRentalId]);
 useEffect(()=>{if(activeRentalId)setScenario('active')},[activeRentalId]);
 useEffect(()=>{if(!qrTerminalId){qrOpened.current=false;return}if(!view||qrOpened.current||!view.currentStations[0])return;qrOpened.current=true;setSelected(view.currentStations[0])},[qrTerminalId,view]);

 const rentalProvider=useMemo(()=>view?.providers.find(provider=>provider.id===view.activeRental?.providerId),[view]);
 const startRental=async()=>{
  if(!selected)return;
  setStarting(true);
  try{await demoPowerbankService.startRental(selected.providerId,{stationId:selected.id});await onStartRental();setSelected(undefined);setScenario('active')}
  finally{setStarting(false)}
 };

 if(!view)return <section className={styles.screen} aria-label="Пауэрбанк"><div className={styles.loading}>Проверяем доступность…</div></section>;
 const showRental=scenario==='active'&&view.activeRental;
 const showReturn=scenario==='return'&&view.activeRental;
 const heroStation=!showRental&&!showReturn&&!view.providerError&&scenario==='one'?view.currentStations[0]:undefined;

 return <section className={styles.screen} aria-labelledby="powerbank-title" data-powerbank-scenario={scenario}>
  {heroStation?<header className={styles.hero}><div><span className={styles.contextLabel}>СЕРВИС MIRA LINK</span><h2 id="powerbank-title">Пауэрбанк</h2><p>Заряд всегда рядом</p></div><img src={heroStation.image} alt="Реальный терминал EnerGO" fetchPriority="high"/></header>:<header className={styles.pageTitle}><h2 id="powerbank-title">Пауэрбанк</h2></header>}

  {showRental&&<section className={styles.activeRental} aria-labelledby="active-rental-title">
   <span className={styles.stateLabel}>АКТИВНАЯ АРЕНДА</span>
   <div className={styles.rentalTitle}><div><h3 id="active-rental-title">Пауэрбанк №{view.activeRental?.deviceDisplayNumber}</h3><p>{rentalProvider?.name}</p></div><BatteryCharging aria-hidden="true"/></div>
   <div className={styles.rentalFacts}><span>Начало<strong>{view.activeRental?.startedAt}</strong></span><span>Время аренды<strong>{view.activeRental?.elapsedMinutes} минут</strong></span>{view.activeRental?.currentCost&&<span>Текущая стоимость<strong>{view.activeRental.currentCost}</strong></span>}</div>
   <MiraButton onClick={()=>setScenario('return')}><Route aria-hidden="true"/>Где вернуть</MiraButton>
  </section>}

  {showReturn&&<section className={styles.returnState} aria-labelledby="return-title">
   <button type="button" className={styles.backAction} onClick={()=>setScenario('active')}><Undo2 aria-hidden="true"/>К активной аренде</button>
   <div><span className={styles.stateLabel}>СОВМЕСТИМЫЕ СТАНЦИИ</span><h3 id="return-title">Где вернуть</h3><p>Показаны только станции, совместимые с пауэрбанком {rentalProvider?.name}.</p></div>
   <div className={styles.returnList}>{view.returnStations.map(station=><article key={station.id} className={styles.returnStation}><div><strong>{station.title}</strong><span>{station.locationLabel} · {distanceLabel(station.distanceMeters)}</span><small>{providerFor(view.providers,station)?.name}</small></div><div><strong>{station.returnSlots}</strong><span>свободные ячейки</span><MiraButton className="outline"><Route aria-hidden="true"/>Маршрут</MiraButton></div></article>)}</div>
  </section>}

  {!showRental&&!showReturn&&view.providerError&&<section className={styles.emptyState} role="status"><RefreshCw aria-hidden="true"/><h3>Не удалось проверить доступность</h3><p>Попробуйте обновить данные или посмотрите другие станции рядом.</p><div><MiraButton onClick={()=>setScenario('one')}>Обновить</MiraButton><MiraButton className="outline" onClick={()=>setNearbyOpen(true)}>Другие станции</MiraButton></div></section>}

  {!showRental&&!showReturn&&!view.providerError&&scenario==='none'&&<section className={styles.emptyState}><BatteryCharging aria-hidden="true"/><span className={styles.contextLabel}>{venue?'СЕЙЧАС В ЭТОМ ЗАВЕДЕНИИ':'СЕЙЧАС РЯДОМ'}</span><h3>Нет свободных пауэрбанков</h3><p>Покажем ближайшие совместимые станции с доступными устройствами.</p><MiraButton onClick={()=>setNearbyOpen(true)}>Найти ближайшую станцию</MiraButton></section>}

  {!showRental&&!showReturn&&!view.providerError&&scenario!=='none'&&<>
   <section className={styles.context} aria-label={venue?'Текущее заведение':'Станции рядом'}><div><span>{venue?'В этом заведении':'Рядом с вами'}</span><strong>{venue?.name??view.currentStations[0]?.venueName}</strong></div>{view.currentStations.length>1&&<span><Zap aria-hidden="true"/>{view.currentStations.reduce((total,station)=>total+(station.availableUnits??0),0)} доступно</span>}</section>
   <div className={styles.offers}>{view.currentStations.map(station=><StationOffer key={station.id} station={station} provider={providerFor(view.providers,station)} showRecommendation={view.providers.length>1} onScan={onScanTerminal}/>)}</div>
  </>}

  {!showReturn&&<NearbyEntry count={view.nearbyStations.length} onOpen={()=>setNearbyOpen(true)}/>}

  <div className={styles.help}>
   <details><summary>Как это работает?<ChevronRight aria-hidden="true"/></summary><ol><li>Выберите доступную станцию</li><li>Подтвердите аренду</li><li>Заберите пауэрбанк</li><li>Верните в совместимую станцию</li></ol></details>
   <details><summary>Где можно вернуть?<ChevronRight aria-hidden="true"/></summary><p>Совместимость определяет провайдер. MIRA LINK покажет только подходящие станции для вашего устройства.</p></details>
  </div>

  <details className={styles.demoTools}><summary>Состояния пауэрбанка · демо</summary><label>Сценарий<select aria-label="Сценарий пауэрбанка" value={scenario} onChange={event=>setScenario(event.target.value as PowerbankDemoScenario)}>{Object.entries(scenarioLabels).map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></label></details>

  <MiraBottomSheet title="Пауэрбанк" description={selected?`${providerFor(view.providers,selected)?.name} · ${selected.locationLabel}`:undefined} open={Boolean(selected)} onClose={()=>setSelected(undefined)}>
   {selected&&<div className={styles.confirmation}><img src={selected.image} alt={`Терминал ${providerFor(view.providers,selected)?.name??'аренды пауэрбанков'}`}/><div><span>Тариф</span><strong>{selected.tariff?.summary}</strong>{selected.tariff?.detail&&<small>{selected.tariff.detail}</small>}</div><p><ShieldCheck aria-hidden="true"/>Перед началом аренды проверьте тариф и выбранную станцию.</p><MiraButton loading={starting||busy} onClick={()=>void startRental()}>Начать аренду</MiraButton></div>}
  </MiraBottomSheet>

  <MiraBottomSheet title="Станции рядом" description={view.providers.length>1?'Совместимые предложения разных провайдеров':'Доступные станции '+(view.providers[0]?.name??'')} open={nearbyOpen} onClose={()=>setNearbyOpen(false)}>
   <div className={styles.nearbyList}>{view.nearbyStations.map(station=><article key={station.id}><MapPin aria-hidden="true"/><div><strong>{station.title}</strong><span>{providerFor(view.providers,station)?.name} · {distanceLabel(station.distanceMeters)}</span></div><span>{station.availableUnits??0} доступно</span></article>)}</div>
  </MiraBottomSheet>
 </section>;
}
