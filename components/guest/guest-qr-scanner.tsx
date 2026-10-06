'use client';

import {useCallback,useEffect,useRef,useState} from 'react';
import {Camera,CameraOff,LockKeyhole} from 'lucide-react';
import jsQR from 'jsqr';
import {BottomSheet,Button} from '@/components/design-system';
import {guestProductionMode} from '@/components/guest/adapters/status';
import {useGuestTheme} from '@/components/guest-theme';
import {themeStyle} from '@/lib/guest-theme';

export type ScannerState='INITIAL'|'REQUESTING'|'ACTIVE'|'DENIED'|'UNAVAILABLE'|'SUCCESS'|'INVALID';
export type QrHandlingResult={status:'success'|'invalid';message?:string;close?:boolean};

type DetectorResult={rawValue?:string};
type Detector={detect:(source:HTMLVideoElement)=>Promise<DetectorResult[]>};
type DetectorConstructor={new(options:{formats:string[]}):Detector;getSupportedFormats?:()=>Promise<string[]>};

export function GuestQrScanner({open,onOpenChange,onPayload,title='Сканировать QR'}:{open:boolean;onOpenChange:(open:boolean)=>void;onPayload:(payload:string)=>QrHandlingResult|Promise<QrHandlingResult>;title?:string}){
 const theme=useGuestTheme();
 const videoRef=useRef<HTMLVideoElement>(null);
 const streamRef=useRef<MediaStream|null>(null);
 const timerRef=useRef<number|null>(null);
 const handlingRef=useRef(false);
 const decodingRef=useRef(false);
 const payloadHandlerRef=useRef(onPayload);
 const [state,setState]=useState<ScannerState>('INITIAL');
 const [decoder,setDecoder]=useState<'pending'|'native'|'fallback'>('pending');
 const [message,setMessage]=useState('Наведите камеру на QR-код. Изображение обрабатывается только на устройстве.');
 useEffect(()=>{payloadHandlerRef.current=onPayload},[onPayload]);

 const stopCamera=useCallback(()=>{
  if(timerRef.current!==null){window.clearInterval(timerRef.current);timerRef.current=null}
  streamRef.current?.getTracks().forEach(track=>track.stop());
  streamRef.current=null;
  decodingRef.current=false;
  if(videoRef.current)videoRef.current.srcObject=null;
 },[]);

 const handlePayload=useCallback(async(payload:string)=>{
  if(handlingRef.current)return;
  handlingRef.current=true;
  const result=await payloadHandlerRef.current(payload);
  setState(result.status==='success'?'SUCCESS':'INVALID');
  setMessage(result.message??(result.status==='success'?'QR-код распознан':'Этот QR-код пока не поддерживается.'));
  if(result.status==='success')stopCamera();
  if(result.close)window.setTimeout(()=>onOpenChange(false),180);
  handlingRef.current=false;
 },[onOpenChange,stopCamera]);

 const startCamera=useCallback(async()=>{
  stopCamera();
  handlingRef.current=false;
  if(!window.isSecureContext&&!['localhost','127.0.0.1'].includes(window.location.hostname)){
   setState('UNAVAILABLE');setMessage('Камера доступна только через HTTPS.');return;
  }
  if(!navigator.mediaDevices?.getUserMedia){
   setState('UNAVAILABLE');setMessage('Этот браузер не поддерживает доступ к камере.');return;
  }
  setState('REQUESTING');
  setDecoder('pending');
  setMessage('Ожидаем разрешение на доступ к камере.');
  try{
   let stream:MediaStream;
   try{
    stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'}},audio:false});
   }catch(preferredError){
    const denied=preferredError instanceof DOMException&&(preferredError.name==='NotAllowedError'||preferredError.name==='SecurityError');
    if(denied)throw preferredError;
    stream=await navigator.mediaDevices.getUserMedia({video:true,audio:false});
   }
   streamRef.current=stream;
   const video=videoRef.current;
   if(video){
    video.srcObject=stream;
    try{await video.play()}catch{stopCamera();setState('UNAVAILABLE');setMessage('Не удалось запустить видео с камеры.');return}
   }
   setState('ACTIVE');
   setMessage('Наведите камеру на QR-код. Кадры не сохраняются и не отправляются.');
   const Detector=(window as typeof window&{BarcodeDetector?:DetectorConstructor}).BarcodeDetector;
   let nativeDetector:Detector|null=null;
   if(Detector){
    try{
     const formats=Detector.getSupportedFormats?await Detector.getSupportedFormats():['qr_code'];
     if(formats.includes('qr_code'))nativeDetector=new Detector({formats:['qr_code']});
    }catch{/* Safari and partial implementations continue through jsQR. */}
   }
   setDecoder(nativeDetector?'native':'fallback');
   const canvas=document.createElement('canvas');
   const context=canvas.getContext('2d',{willReadFrequently:true});
   timerRef.current=window.setInterval(()=>{
    const currentVideo=videoRef.current;
    if(!currentVideo||handlingRef.current||decodingRef.current||currentVideo.readyState<HTMLMediaElement.HAVE_CURRENT_DATA||currentVideo.videoWidth<=0||currentVideo.videoHeight<=0)return;
    decodingRef.current=true;
    void (async()=>{
     try{
      if(nativeDetector){
       try{
        const results=await nativeDetector.detect(currentVideo);
        const payload=results.find(result=>result.rawValue)?.rawValue;
        if(payload){await handlePayload(payload);return}
        return;
       }catch{nativeDetector=null;setDecoder('fallback')}
      }
      if(!context)return;
      const scale=Math.min(1,720/Math.max(currentVideo.videoWidth,currentVideo.videoHeight));
      const width=Math.max(1,Math.round(currentVideo.videoWidth*scale));
      const height=Math.max(1,Math.round(currentVideo.videoHeight*scale));
      if(canvas.width!==width)canvas.width=width;
      if(canvas.height!==height)canvas.height=height;
      context.drawImage(currentVideo,0,0,width,height);
      const frame=context.getImageData(0,0,width,height);
      const result=jsQR(frame.data,width,height,{inversionAttempts:'attemptBoth'});
      if(result?.data)await handlePayload(result.data);
     }catch{/* A single frame decode failure must not stop the live scanner. */}
     finally{decodingRef.current=false}
    })();
   },180);
  }catch(error){
   stopCamera();
   const denied=error instanceof DOMException&&(error.name==='NotAllowedError'||error.name==='SecurityError');
   const missing=error instanceof DOMException&&error.name==='NotFoundError';
   setState(denied?'DENIED':'UNAVAILABLE');
   setMessage(denied?'Нет доступа к камере. Разрешите доступ в настройках браузера.':missing?'Камера не найдена.':'Не удалось запустить камеру.');
  }
 },[handlePayload,stopCamera]);

 useEffect(()=>{
  if(open){setState('INITIAL');setMessage('Наведите камеру на QR-код. Изображение обрабатывается только на устройстве.');void startCamera()}
  else stopCamera();
  return stopCamera;
 },[open,startCamera,stopCamera]);

 const close=()=>{stopCamera();onOpenChange(false)};
 return <BottomSheet mode={guestProductionMode} open={open} onOpenChange={value=>value?onOpenChange(true):close()} title={title} className={`guest-camera-sheet${theme?' guest-theme':''}`} style={theme?themeStyle(theme):undefined} overlayStyle={theme?{background:theme.colors.overlay}:undefined}>
  <div className="guest-camera-scanner" data-state={state} data-decoder={decoder}>
   <div className="guest-camera-preview">
    <video ref={videoRef} autoPlay muted playsInline aria-label="Изображение с камеры"/>
    <span className="guest-camera-dim" aria-hidden="true"/>
    <span className="guest-camera-frame" aria-hidden="true"><i/><i/><i/><i/></span>
    {(state==='ACTIVE'||state==='SUCCESS')&&<div className="guest-camera-instruction"><strong>{state==='SUCCESS'?'QR распознан':'Наведите камеру на QR-код'}</strong><span>Стол · Wi-Fi · Пауэрбанк</span></div>}
    {(state==='INITIAL'||state==='REQUESTING')&&<div className="guest-camera-placeholder"><Camera/><span>{state==='REQUESTING'?'Запрашиваем камеру…':'Камера ещё не включена'}</span></div>}
    {(state==='DENIED'||state==='UNAVAILABLE')&&<div className="guest-camera-placeholder"><CameraOff/><span>Камера недоступна</span></div>}
   </div>
   <span className="guest-scanner-status" aria-live="polite">{state==='ACTIVE'?'Камера готова':message}</span>
   {(state==='DENIED'||state==='UNAVAILABLE'||state==='INVALID')&&<p className="guest-scanner-error">{message}</p>}
   {(state==='DENIED'||state==='UNAVAILABLE'||state==='INVALID')&&<Button mode={guestProductionMode} size="l" fullWidth onClick={()=>void startCamera()}>Попробовать снова</Button>}
   <small className="guest-scanner-privacy"><LockKeyhole aria-hidden="true"/>Обработка на устройстве</small>
  </div>
 </BottomSheet>;
}
