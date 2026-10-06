import type {CSSProperties} from 'react';

export const themeNames={navy_gold:'Navy Gold',emerald_gold:'Emerald Gold',espresso_gold:'Espresso Gold',onyx_gold:'Onyx Gold',plum_gold:'Plum Gold',ruby_gold:'Ruby Gold',amber_gold:'Amber Gold',ivory_gold:'Ivory Gold',porcelain_gold:'Porcelain Gold'} as const;
export type ThemeId=keyof typeof themeNames;
export type BrandConfig={restaurantName:string;restaurantLogo?:string;restaurantDisplayFont:string;heroImages:string[];restaurantImages:string[];promoImages:string[];marketingContent:string[]};
export const defaultBrand:BrandConfig={restaurantName:'MIRA Restaurant',restaurantDisplayFont:'Georgia, serif',heroImages:['/images/mira-restaurant.jpg','/images/menu/p11.png','/images/burrata.png','/images/menu/p13.png'],restaurantImages:['/images/mira-restaurant.jpg'],promoImages:['/images/menu/p13.png'],marketingContent:['Современная кухня. Время для вашего вечера.','Блюда с характером. Внимание к каждой детали.','Свежие вкусы и любимые сочетания.','Сладкое завершение вашего вечера.']};

const palettes:Record<ThemeId,string[]>={
 navy_gold:['#03234B','#011831','#082A50','#0C345E','#123D69','#FAFBFD','#D3DEE9','#91A5B9','#A4C3E139'],
 emerald_gold:['#043820','#012715','#073C23','#0B482B','#105432','#F8FBF8','#CEE1D3','#91AC99','#AAD1B533'],
 espresso_gold:['#342014','#1F1108','#382217','#43291A','#50311D','#FCF7F0','#DBCABC','#A9907D','#DDB88733'],
 onyx_gold:['#0A0A0A','#050505','#121212','#191919','#222222','#FAFAF8','#D2D2CF','#92928E','#FFFFFF24'],
 plum_gold:['#2B0B31','#17031C','#321036','#3D1542','#4B1E50','#FCF8FC','#DFCFE1','#A994AC','#E1ABE833'],
 ruby_gold:['#650304','#3D0001','#6B0909','#791111','#8B1718','#FFF8F7','#EDD1CF','#BC9692','#FFA6A638'],
 amber_gold:['#72501D','#2C1C07','#533711','#63471D','#715426','#FFF9EB','#E6D6B8','#B5A17D','#FFDC8740'],
 ivory_gold:['#F1E4D2','#F8EEE2','#F7EDDF','#FFF7EC','#FFFDF8','#201912','#675C51','#988B7E','#7E562924'],
 porcelain_gold:['#FFFFFF','#F7F6F3','#FFFFFF','#F8F7F5','#FFFFFF','#171513','#605B55','#96908A','#E9E5DF']
};

export const guestThemePresetNames={classic:'MIRA Classic',dark:'MIRA Dark',light:'MIRA Light',custom:'Custom'} as const;
export type GuestThemePresetId=keyof typeof guestThemePresetNames;
export const guestThemeKeys=['background','surface','surfaceElevated','surfaceSoft','accent','accentStrong','accentSoft','textPrimary','textSecondary','textMuted','border','borderStrong','activeBackground','activeText','bottomNavBackground','gradientStart','gradientEnd'] as const;
export type GuestThemeKey=typeof guestThemeKeys[number];
export type GuestThemePalette=Record<GuestThemeKey,string>;
export type GuestThemeSelection={preset:GuestThemePresetId;palette:GuestThemePalette};

const classicPalette:GuestThemePalette={background:'#043820',surface:'#073C23',surfaceElevated:'#105432',surfaceSoft:'#0B482B',accent:'#F4C65D',accentStrong:'#93651F',accentSoft:'#FFE28B',textPrimary:'#F8FBF8',textSecondary:'#CEE1D3',textMuted:'#91AC99',border:'#AAD1B533',borderStrong:'#F4C65DB8',activeBackground:'#F4C65D',activeText:'#19130B',bottomNavBackground:'#012715',gradientStart:'#FFE082',gradientEnd:'#D4A017'};
const darkPalette:GuestThemePalette={background:'#021A11',surface:'#082A1C',surfaceElevated:'#103A28',surfaceSoft:'#0B3222',accent:'#E7BE64',accentStrong:'#8E611F',accentSoft:'#F7D98E',textPrimary:'#F8FAF6',textSecondary:'#C7D7CC',textMuted:'#879E90',border:'#A7C8B52E',borderStrong:'#E7BE64A8',activeBackground:'#E7BE64',activeText:'#171109',bottomNavBackground:'#01140D',gradientStart:'#F2D47F',gradientEnd:'#B98224'};
const lightPalette:GuestThemePalette={background:'#F5F0E6',surface:'#FFFDF7',surfaceElevated:'#EEE6D7',surfaceSoft:'#F8F3EA',accent:'#B47A25',accentStrong:'#7E531B',accentSoft:'#E7C579',textPrimary:'#183629',textSecondary:'#4D685B',textMuted:'#7A8B82',border:'#6E5A3829',borderStrong:'#B47A25A8',activeBackground:'#183629',activeText:'#FFFDF7',bottomNavBackground:'#FFF9EF',gradientStart:'#E7C067',gradientEnd:'#AA7424'};
const presetPalettes={classic:classicPalette,dark:darkPalette,light:lightPalette} as const;

export type ThemeConfig={themeId:string;version:'1.0';mode:'dark'|'light';semantic:GuestThemePalette;colors:Record<string,string>;effects:{cardShadow:string;accentGlow:string;backdropBlur:number};appearance:{mapStyle:'dark'|'light';logoVariant:'gold'|'bronze';primaryButton:'gold-gradient'}};

const colorPattern=/^#[0-9A-F]{6}(?:[0-9A-F]{2})?$/u;
export function isGuestThemeColor(value:unknown):value is string{return typeof value==='string'&&colorPattern.test(value.toUpperCase())}
export function isGuestThemePalette(value:unknown):value is GuestThemePalette{return Boolean(value)&&typeof value==='object'&&guestThemeKeys.every(key=>isGuestThemeColor((value as Record<string,unknown>)[key]))}
export function getGuestThemePreset(id:'classic'|'dark'|'light'):GuestThemePalette{return {...presetPalettes[id]}}
export function defaultGuestThemeSelection():GuestThemeSelection{return {preset:'classic',palette:getGuestThemePreset('classic')}}

function rgb(hex:string){const value=hex.slice(1,7);return [0,2,4].map(index=>parseInt(value.slice(index,index+2),16)/255)}
function luminance(hex:string){const c=rgb(hex).map(value=>value<=.04045?value/12.92:((value+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722}
export function contrast(a:string,b:string){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)}

function makeTheme(themeId:string,semantic:GuestThemePalette,mode:'dark'|'light'):ThemeConfig{
 const light=mode==='light',classic=themeId==='classic'||themeId==='emerald_gold';
 return {themeId,version:'1.0',mode,semantic:{...semantic},colors:{bgPrimary:semantic.background,bgSecondary:semantic.bottomNavBackground,bgElevated:semantic.surfaceElevated,surfacePrimary:semantic.surface,surfaceSecondary:semantic.surfaceSoft,surfaceElevated:semantic.surfaceElevated,surfaceGlass:`color-mix(in srgb, ${semantic.surfaceElevated} 90%, transparent)`,textPrimary:semantic.textPrimary,textSecondary:semantic.textSecondary,textMuted:semantic.textMuted,textInverse:'#19130B',iconPrimary:semantic.textPrimary,iconSecondary:semantic.textSecondary,borderPrimary:semantic.border,borderSoft:light?'rgba(54,42,27,.10)':'rgba(255,255,255,.14)',borderAccent:semantic.borderStrong,accentPrimary:semantic.accent,accentLight:semantic.accentSoft,accentDark:semantic.accentStrong,buttonPrimaryStart:classic?'#DDA33A':semantic.gradientStart,buttonPrimaryMiddle:semantic.accent,buttonPrimaryEnd:classic?'#E5AB3F':semantic.gradientEnd,buttonPrimaryHighlight:semantic.accentSoft,buttonPrimaryText:'#19130B',success:light?'#197342':'#71D89B',warning:light?'#875511':'#FFCC70',error:light?'#A52435':'#FF98A6',overlay:light?'rgba(30,20,10,.28)':'rgba(0,0,0,.62)',shadow:light?'rgba(64,42,21,.07)':'rgba(0,0,0,.20)',glow:`color-mix(in srgb, ${semantic.accent} 12%, transparent)`,navBackground:semantic.bottomNavBackground,navBorder:semantic.border,heroText:'#FAFBFD',heroOverlay:'linear-gradient(90deg,rgba(0,0,0,.76),rgba(0,0,0,.50) 35%,rgba(0,0,0,.15) 65%,rgba(0,0,0,.02))',unread:'#FF355D',buttonHighlight:'rgba(255,255,255,.40)',buttonShadow:'rgba(229,171,63,.20)'},effects:{cardShadow:light?'0 7px 24px rgba(64,42,21,.07)':'0 8px 24px rgba(0,0,0,.20),inset 0 1px 0 rgba(255,255,255,.05)',accentGlow:`0 0 22px color-mix(in srgb, ${semantic.accent} 12%, transparent)`,backdropBlur:14},appearance:{mapStyle:light?'light':'dark',logoVariant:light?'bronze':'gold',primaryButton:'gold-gradient'}};
}

export function createGuestTheme(selection:GuestThemeSelection):ThemeConfig{
 const mode=selection.preset==='light'||(selection.preset==='custom'&&luminance(selection.palette.background)>.55)?'light':'dark';
 return makeTheme(selection.preset,selection.palette,mode);
}

export function getTheme(id:ThemeId):ThemeConfig{
 const [background,bottomNavBackground,surface,surfaceSoft,surfaceElevated,textPrimary,textSecondary,textMuted,border]=palettes[id];
 const light=id==='ivory_gold'||id==='porcelain_gold';
 const accent=light?(id==='ivory_gold'?'#B67B25':'#B47A25'):'#F4C65D';
 return makeTheme(id,{background,surface,surfaceElevated,surfaceSoft,accent,accentStrong:'#93651F',accentSoft:light?'#EBC15F':'#FFE28B',textPrimary,textSecondary,textMuted,border,borderStrong:light?'#B47A25B8':'#F4C65DB8',activeBackground:surfaceElevated,activeText:accent,bottomNavBackground,gradientStart:'#DDA33A',gradientEnd:'#E5AB3F'},light?'light':'dark');
}

export function guestThemeCssVariables(palette:GuestThemePalette):Record<string,string>{return {'--guest-bg':palette.background,'--guest-surface':palette.surface,'--guest-surface-elevated':palette.surfaceElevated,'--guest-surface-soft':palette.surfaceSoft,'--guest-accent':palette.accent,'--guest-accent-strong':palette.accentStrong,'--guest-accent-soft':palette.accentSoft,'--guest-text-primary':palette.textPrimary,'--guest-text-secondary':palette.textSecondary,'--guest-text-muted':palette.textMuted,'--guest-border':palette.border,'--guest-border-strong':palette.borderStrong,'--guest-active-bg':palette.activeBackground,'--guest-active-text':palette.activeText,'--guest-bottom-nav-bg':palette.bottomNavBackground,'--guest-accent-gradient-start':palette.gradientStart,'--guest-accent-gradient-end':palette.gradientEnd};}

export function themeStyle(theme:ThemeConfig,brand=defaultBrand):CSSProperties{
 const classic=theme.themeId==='classic'||theme.themeId==='emerald_gold';
 const vars:Record<string,string|number>={...guestThemeCssVariables(theme.semantic),
  '--guest-control-bg':classic?'#041E15':'var(--guest-bg)','--guest-control-surface':classic?'#0D3022':'var(--guest-surface)','--guest-control-text':classic?'#F0EFE9':'var(--guest-text-primary)','--guest-control-muted':classic?'#B8C1BA':'var(--guest-text-secondary)','--guest-control-border':classic?'rgba(240,239,233,.20)':'var(--guest-border)','--guest-control-focus':classic?'#C89B3C':'var(--guest-border-strong)','--guest-control-primary':classic?'#C89B3C':'var(--guest-accent)','--guest-control-primary-text':classic?'#111B16':'#19130B','--guest-control-active-bg':classic?'rgba(240,239,233,.20)':'var(--guest-active-bg)','--guest-control-active-text':classic?'#F0EFE9':'var(--guest-active-text)','--guest-control-backdrop':classic?'rgba(3,27,19,.72)':theme.colors.overlay,
  '--guest-splash-bg':classic?'#012815':'var(--guest-bottom-nav-bg)','--guest-splash-gold':classic?'#F0C864':'var(--guest-accent)','--guest-splash-gold-muted':classic?'#D3B77B':'var(--guest-accent-soft)','--guest-splash-text-primary':classic?'#F5FBF7':'var(--guest-text-primary)','--guest-splash-text-secondary':classic?'#A4C0B0':'var(--guest-text-secondary)','--guest-splash-pattern':classic?'rgba(174,148,86,.12)':'color-mix(in srgb,var(--guest-accent) 12%,transparent)','--guest-splash-gradient-start':classic?'#DDA33A':'var(--guest-accent-gradient-start)','--guest-splash-gradient-end':classic?'#E5AB3F':'var(--guest-accent-gradient-end)'};
 for(const [key,value]of Object.entries(theme.colors))vars[`--color-${key.replace(/[A-Z]/g,letter=>`-${letter.toLowerCase()}`)}`]=value;
 return {...vars,colorScheme:theme.mode,'--bg-primary':'var(--guest-bg)','--bg-deep':'var(--guest-bottom-nav-bg)','--surface-primary':'var(--guest-surface)','--surface-raised':'var(--guest-surface-soft)','--surface-top':'var(--guest-surface-elevated)','--accent-gold':'var(--guest-accent)','--accent-gold-dark':'var(--guest-accent-strong)','--text-primary':'var(--guest-text-primary)','--text-secondary':'var(--guest-text-secondary)','--border-default':'var(--guest-border)','--border-active':'var(--guest-border-strong)','--map-style':theme.appearance.mapStyle,'--map-filter':theme.mode==='light'?'none':'invert(.88) hue-rotate(155deg) saturate(.45) brightness(.8)','--card-shadow':theme.effects.cardShadow,'--accent-glow':theme.effects.accentGlow,'--backdrop-blur':`${theme.effects.backdropBlur}px`,'--restaurant-font':brand.restaurantDisplayFont} as CSSProperties;
}

export function isThemeId(value:unknown):value is ThemeId{return typeof value==='string'&&Object.hasOwn(palettes,value)}
export function validateGuestTheme(palette:GuestThemePalette){const pairs:[string,string,string,number][]=[['Основной текст / фон',palette.textPrimary,palette.background,4.5],['Вторичный текст / фон',palette.textSecondary,palette.background,4.5],['Основной текст / карточка',palette.textPrimary,palette.surface,4.5],['Активный текст / активный элемент',palette.activeText,palette.activeBackground,3],['Навигация',palette.textSecondary,palette.bottomNavBackground,3],['CTA / акцент','#19130B',palette.accent,4.5],['CTA / начало градиента','#19130B',palette.gradientStart,4.5],['CTA / конец градиента','#19130B',palette.gradientEnd,4.5]];return pairs.map(([label,foreground,background,min])=>{const ratio=contrast(foreground,background);return {label,ratio,min,pass:ratio>=min}})}
export function validateTheme(theme:ThemeConfig){return validateGuestTheme(theme.semantic)}
