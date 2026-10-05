'use client';
import {createContext,useContext,useEffect,useState,type ReactNode} from 'react';
import {defaultBrand,getTheme,isThemeId,themeNames,themeStyle,validateTheme,type ThemeId,type BrandConfig} from '@/lib/guest-theme';
const KEY='mira-venue-theme-v1';
const ThemeContext=createContext<ReturnType<typeof getTheme>|null>(null);
export const useGuestTheme=()=>useContext(ThemeContext);
export function GuestTheme({children,themeId,brand=defaultBrand}:{children:ReactNode;themeId?:ThemeId;brand?:BrandConfig}){
 const [saved,setSaved]=useState<ThemeId>('emerald_gold');
 useEffect(()=>{const read=()=>{try{const v=localStorage.getItem(KEY);if(isThemeId(v))setSaved(v)}catch{}};read();window.addEventListener('storage',read);window.addEventListener('mira-theme',read);return()=>{window.removeEventListener('storage',read);window.removeEventListener('mira-theme',read)}},[]);
 const theme=getTheme(themeId??saved);return <ThemeContext.Provider value={theme}><div className="guest-theme" data-theme={theme.themeId} data-mode={theme.mode} style={themeStyle(theme,brand)}>{children}</div></ThemeContext.Provider>;
}
export function ThemeSettings({preview}:{preview:(id:ThemeId)=>ReactNode}){
 const [id,setId]=useState<ThemeId>('emerald_gold'),[message,setMessage]=useState('');useEffect(()=>{const v=localStorage.getItem(KEY);if(isThemeId(v))setId(v)},[]);const results=validateTheme(getTheme(id));
 return <section className="theme-settings card"><h3>Тема гостевого приложения</h3><label className="field">Готовая тема<select aria-label="Тема заведения" value={id} onChange={e=>{setId(e.target.value as ThemeId);setMessage('')}}>{Object.entries(themeNames).map(([key,name])=><option key={key} value={key}>{name}</option>)}</select></label><p>Предпросмотр: меняются цвета, геометрия остаётся общей.</p><div className="theme-preview">{preview(id)}</div><details><summary>Проверка контрастности</summary>{results.map((r,i)=><p key={i}>{r.pass?'✓':'!'} {r.label}: {r.ratio.toFixed(2)}:1 · минимум {r.min}:1</p>)}</details><button className="button" disabled={results.some(r=>!r.pass)} onClick={()=>{localStorage.setItem(KEY,id);window.dispatchEvent(new Event('mira-theme'));setMessage('Тема применена к гостевому приложению')}}>Применить тему</button><p role="status">{message}</p></section>;
}
