'use client';

import {useState} from 'react';
import {Check,Copy,Eye,EyeOff,QrCode,Wifi} from 'lucide-react';
import type {VenueWifi} from '@/lib/domain/model';
import {classifyGuestQrPayload,type GuestQrRoute} from '@/lib/guest-qr';
import {Alert,Button,Card} from '@/components/design-system';
import {guestProductionMode} from '@/components/guest/adapters/status';
import {GuestQrScanner,type QrHandlingResult} from './guest-qr-scanner';

type TableRoute=Extract<GuestQrRoute,{kind:'table'}>;

export function GuestWifiSurface({venueName,wifi,onOpenTable}:{venueName:string;wifi:VenueWifi;onOpenTable:(entry:TableRoute)=>void}){
 const [credentials,setCredentials]=useState(wifi);
 const [scannerOpen,setScannerOpen]=useState(false);
 const [copied,setCopied]=useState(false);
 const [revealed,setRevealed]=useState(true);
 const [found,setFound]=useState(false);
 const [tableQr,setTableQr]=useState<TableRoute|null>(null);

 const copy=async()=>{
  try{await navigator.clipboard.writeText(credentials.password);setCopied(true);window.setTimeout(()=>setCopied(false),1800)}catch{setCopied(false)}
 };
 const handlePayload=(payload:string):QrHandlingResult=>{
  const route=classifyGuestQrPayload(payload);
  if(route.kind==='wifi'){
   setCredentials(route.wifi);setFound(true);setTableQr(null);
   return {status:'success',message:'Wi-Fi найден',close:true};
  }
  if(route.kind==='table'){
   setTableQr(route);
   return {status:'success',message:'Это QR-код стола MIRA LINK, а не Wi-Fi.',close:true};
  }
  return {status:'invalid',message:route.kind==='powerbank'?'Это QR-код терминала, а не Wi-Fi.':'Не удалось распознать Wi-Fi QR-код.'};
 };
 return <section className="guest-wifi-surface" aria-labelledby="guest-wifi-title">
  <header><span aria-hidden="true"><Wifi/></span><div><h2 id="guest-wifi-title">Wi-Fi заведения</h2><p>{venueName}</p></div></header>
  {found&&<Alert mode={guestProductionMode} status="success" title="Wi-Fi найден">Данные сети распознаны на устройстве.</Alert>}
  {tableQr&&<Alert mode={guestProductionMode} status="warning" title="Это QR-код стола MIRA LINK, а не Wi-Fi." action={<div className="guest-wifi-alert-actions"><Button mode={guestProductionMode} size="l" onClick={()=>onOpenTable(tableQr)}>Открыть стол</Button><Button mode={guestProductionMode} variant="secondary" size="l" onClick={()=>{setTableQr(null);setScannerOpen(true)}}>Сканировать другой QR</Button></div>}>Переход к столу начнётся только после вашего подтверждения.</Alert>}
  <Card mode={guestProductionMode} variant="raised" className="guest-wifi-credentials">
   <div><span>Сеть</span><strong>{credentials.ssid}</strong></div>
   <div><span>Пароль</span><strong>{revealed?credentials.password:'•'.repeat(Math.max(8,credentials.password.length))}</strong><button type="button" aria-label={revealed?'Скрыть пароль':'Показать пароль'} onClick={()=>setRevealed(value=>!value)}>{revealed?<EyeOff/>:<Eye/>}</button></div>
   <Button mode={guestProductionMode} size="l" fullWidth leadingIcon={copied?<Check/>:<Copy/>} onClick={()=>void copy()}>{copied?'Скопировано':'Копировать пароль'}</Button>
  </Card>
  <Card mode={guestProductionMode} className="guest-wifi-connect">
   <h3>Быстрое подключение</h3>
   <p>Отсканируйте Wi-Fi QR-код, размещённый на столе.</p>
   <Button mode={guestProductionMode} variant="secondary" size="l" fullWidth leadingIcon={<QrCode/>} onClick={()=>setScannerOpen(true)}>Сканировать QR</Button>
   {found&&<small>Данные сети распознаны. Скопируйте пароль и выберите сеть {credentials.ssid} в настройках Wi-Fi.</small>}
  </Card>
  <GuestQrScanner open={scannerOpen} onOpenChange={setScannerOpen} onPayload={handlePayload} title="Сканировать Wi-Fi QR"/>
 </section>;
}
