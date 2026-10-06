'use client';

import {createContext,useContext,useEffect,useMemo,useState,type ReactNode} from 'react';
import {defaultBrand,createGuestTheme,defaultGuestThemeSelection,getGuestThemePreset,getTheme,guestThemeCssVariables,guestThemePresetNames,isGuestThemeColor,isGuestThemePalette,isThemeId,themeStyle,validateGuestTheme,type BrandConfig,type GuestThemeKey,type GuestThemePalette,type GuestThemePresetId,type GuestThemeSelection,type ThemeId} from '@/lib/guest-theme';
import styles from './guest-theme-lab.module.css';

export const GUEST_THEME_STORAGE_KEY='mira-demo-guest-theme';
const THEME_EVENT='mira-theme';
const ThemeContext=createContext<ReturnType<typeof createGuestTheme>|null>(null);
export const useGuestTheme=()=>useContext(ThemeContext);

const fieldLabels:Record<GuestThemeKey,string>={background:'Основной фон',surface:'Карточки',surfaceElevated:'Приподнятая поверхность',surfaceSoft:'Дополнительная поверхность',accent:'Акцент',accentStrong:'Сильный акцент',accentSoft:'Мягкий акцент',textPrimary:'Основной текст',textSecondary:'Вторичный текст',textMuted:'Приглушённый текст',border:'Границы',borderStrong:'Сильные границы',activeBackground:'Активный элемент',activeText:'Текст активного элемента',bottomNavBackground:'Нижняя навигация',gradientStart:'Начало градиента',gradientEnd:'Конец градиента'};

function readSelection():GuestThemeSelection{
 try{
  const parsed:unknown=JSON.parse(localStorage.getItem(GUEST_THEME_STORAGE_KEY)??'null');
  if(parsed&&typeof parsed==='object'){
   const value=parsed as {preset?:unknown;palette?:unknown;colors?:unknown};
   if(typeof value.preset==='string'&&Object.hasOwn(guestThemePresetNames,value.preset)&&isGuestThemePalette(value.palette??value.colors))return {preset:value.preset as GuestThemePresetId,palette:{...(value.palette??value.colors) as GuestThemePalette}};
  }
 }catch{}
 return defaultGuestThemeSelection();
}

function persistSelection(selection:GuestThemeSelection){localStorage.setItem(GUEST_THEME_STORAGE_KEY,JSON.stringify(selection));window.dispatchEvent(new Event(THEME_EVENT))}

export function GuestTheme({children,themeId,brand=defaultBrand}:{children:ReactNode;themeId?:ThemeId;brand?:BrandConfig}){
 const [selection,setSelection]=useState<GuestThemeSelection>(defaultGuestThemeSelection);
 useEffect(()=>{const read=()=>setSelection(readSelection());read();window.addEventListener('storage',read);window.addEventListener(THEME_EVENT,read);return()=>{window.removeEventListener('storage',read);window.removeEventListener(THEME_EVENT,read)}},[]);
 const theme=themeId&&isThemeId(themeId)?getTheme(themeId):createGuestTheme(selection);
 return <ThemeContext.Provider value={theme}><div className="guest-theme" data-theme={theme.themeId} data-mode={theme.mode} style={themeStyle(theme,brand)}>{children}</div></ThemeContext.Provider>;
}

export function ThemeSettings(){
 const [selection,setSelection]=useState<GuestThemeSelection>(defaultGuestThemeSelection);
 const [basePreset,setBasePreset]=useState<'classic'|'dark'|'light'>('classic');
 const [drafts,setDrafts]=useState<GuestThemePalette>(selection.palette);
 const [message,setMessage]=useState('');
 const [importValue,setImportValue]=useState('');
 useEffect(()=>{const stored=readSelection();setSelection(stored);setDrafts(stored.palette);if(stored.preset!=='custom')setBasePreset(stored.preset)},[]);
 const theme=useMemo(()=>createGuestTheme(selection),[selection]);
 const checks=useMemo(()=>validateGuestTheme(selection.palette),[selection.palette]);
 const lowContrast=checks.some(check=>!check.pass);
 const apply=(next:GuestThemeSelection)=>{setSelection(next);setDrafts(next.palette);persistSelection(next);setMessage('Тема применена')};
 const choosePreset=(preset:GuestThemePresetId)=>{if(preset==='custom'){apply({preset,palette:{...selection.palette}});return}setBasePreset(preset);apply({preset,palette:getGuestThemePreset(preset)})};
 const updateColor=(key:GuestThemeKey,value:string)=>{const normalized=value.toUpperCase();setDrafts(current=>({...current,[key]:normalized}));if(isGuestThemeColor(normalized))apply({preset:'custom',palette:{...selection.palette,[key]:normalized}})};
 const resetClassic=()=>{setBasePreset('classic');apply(defaultGuestThemeSelection());setMessage('MIRA Classic восстановлена')};
 const resetPreset=()=>apply({preset:basePreset,palette:getGuestThemePreset(basePreset)});
 const copy=async(value:string,label:string)=>{try{await navigator.clipboard.writeText(value);setMessage(`${label} скопированы`)}catch{setMessage('Не удалось скопировать. Разрешите доступ к буферу обмена.')}};
 const exportJson=()=>JSON.stringify({preset:selection.preset,colors:selection.palette},null,2);
 const exportCss=()=>`:root {\n${Object.entries(guestThemeCssVariables(selection.palette)).map(([key,value])=>`  ${key}: ${value};`).join('\n')}\n}`;
 const importTheme=()=>{try{const parsed:unknown=JSON.parse(importValue);const candidate=parsed&&typeof parsed==='object'?((parsed as {colors?:unknown;palette?:unknown}).colors??(parsed as {palette?:unknown}).palette??parsed):null;if(!isGuestThemePalette(candidate))throw new Error();apply({preset:'custom',palette:{...candidate}});setMessage('Тема импортирована')}catch{setMessage('Некорректный JSON темы')}};

 return <section className={styles.lab} aria-label="Theme Lab">
  <header className={styles.header}><div><p>DEMO TOOLS</p><h3>Внешний вид</h3></div>{lowContrast&&<span className={styles.warning}>Низкий контраст</span>}</header>
  <label className={styles.preset}>Пресет<select aria-label="Пресет темы" value={selection.preset} onChange={event=>choosePreset(event.target.value as GuestThemePresetId)}>{Object.entries(guestThemePresetNames).map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></label>
  <div className={styles.preview+' guest-theme'} data-mode={theme.mode} style={themeStyle(theme)}>
   <span className={styles.previewActive}>Активный элемент</span><strong>Aa Основной текст</strong><p>Вторичный текст</p><div className={styles.previewCard}>Карточка</div><button type="button">Основная кнопка</button>
  </div>
  <div className={styles.grid}>{(Object.keys(fieldLabels) as GuestThemeKey[]).map(key=><label className={styles.colorField} key={key}><span>{fieldLabels[key]}</span><span className={styles.colorControl}><input type="color" aria-label={`${fieldLabels[key]} — палитра`} value={selection.palette[key].slice(0,7)} onChange={event=>updateColor(key,event.target.value)}/><input aria-label={`${fieldLabels[key]} — HEX`} value={drafts[key]} maxLength={9} spellCheck={false} onChange={event=>updateColor(key,event.target.value)}/><i aria-hidden="true" style={{background:selection.palette[key]}}/></span></label>)}</div>
  <details className={styles.contrast}><summary>Проверка контраста</summary>{checks.map(check=><p key={check.label} className={check.pass?styles.pass:styles.fail}>{check.pass?'PASS':'Низкий контраст'} · {check.label} · {check.ratio.toFixed(2)}:1</p>)}</details>
  <div className={styles.actions}><button type="button" className="button" onClick={resetClassic}>Вернуть MIRA по умолчанию</button><button type="button" className="button outline" onClick={resetPreset}>Сбросить изменения</button><button type="button" className="button outline" onClick={()=>void copy(exportJson(),'Настройки темы')}>Скопировать настройки темы</button><button type="button" className="button outline" onClick={()=>void copy(exportCss(),'CSS variables')}>Скопировать CSS variables</button></div>
  <details className={styles.import}><summary>Импортировать тему</summary><textarea aria-label="JSON темы" value={importValue} onChange={event=>setImportValue(event.target.value)} placeholder='{"background":"#043820", ...}'/><button type="button" className="button outline" onClick={importTheme}>Импортировать</button></details>
  <p className={styles.status} role="status">{message}</p>
 </section>;
}
