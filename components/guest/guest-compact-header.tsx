'use client';

import {ArrowLeft,Bell,MoreHorizontal,UserRound} from 'lucide-react';

export function GuestCompactHeader({title,navigate,back=false,showAccount=true,menuOnly=false}:{title:string;navigate:(page:string)=>void;back?:boolean;showAccount?:boolean;menuOnly?:boolean}){
 return <header className="guest-compact-header">
  {back
   ? <button type="button" className="guest-compact-back" aria-label="Назад" onClick={()=>navigate('home')}><ArrowLeft/></button>
   : <button type="button" className="guest-compact-brand" aria-label="На главную" onClick={()=>navigate('home')}><img src="/brand/mira-monogram.svg" alt=""/><span>MIRA LINK</span></button>}
  <h1>{title}</h1>
  <div className="guest-compact-actions">
   {showAccount&&!menuOnly&&<button type="button" aria-label="Уведомления" onClick={()=>navigate('notifications')}><Bell/></button>}
   {showAccount&&!menuOnly&&<button type="button" aria-label="Профиль" onClick={()=>navigate('profile')}><UserRound/></button>}
   {menuOnly&&<button type="button" aria-label="Дополнительные разделы" onClick={()=>navigate('more')}><MoreHorizontal/></button>}
  </div>
 </header>
}
