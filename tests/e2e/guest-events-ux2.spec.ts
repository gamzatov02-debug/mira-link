import {expect,test,type Page} from '@playwright/test';
import {seed} from '../../lib/domain/seed';
import {getGuestThemePreset} from '../../lib/guest-theme';

const qa='docs/QA/guest-events-ux2';
const stateKey='mira-link-demo-v1';

async function openEvents(page:Page,state=seed(),theme:'classic'|'dark'|'light'='classic'){
 await page.setViewportSize({width:390,height:844});
 await page.addInitScript(({state,key,theme,palette})=>{localStorage.clear();sessionStorage.clear();localStorage.setItem(key,JSON.stringify(state));localStorage.setItem('mira-demo-guest-theme',JSON.stringify({preset:theme,palette}))},{state,key:stateKey,theme,palette:getGuestThemePreset(theme)});
 await page.goto('/demo/guest/events');
 await expect(page.getByRole('heading',{name:'Афиша',exact:true})).toBeVisible();
}

test('Afisha renders venue-bound upcoming events, real filters and canonical navigation without a table',async({page})=>{
 await openEvents(page);
 await expect(page.getByText('События, музыка и особые вечера')).toBeVisible();
 await expect(page.getByText('MIRA Restaurant',{exact:true}).first()).toBeVisible();
 await expect(page.getByRole('navigation',{name:'Дата мероприятий'}).getByRole('button')).toHaveCount(4);
 await expect(page.getByRole('button',{name:'Подробнее',exact:true})).toBeVisible();
 await expect(page.locator('[data-event-id]')).toHaveCount(4);
 await expect(page.getByRole('navigation',{name:'Основная навигация гостя'})).toBeVisible();
 await expect(page.getByRole('navigation',{name:'Основная навигация гостя'}).getByRole('button',{name:'Афиша',exact:true})).toHaveAttribute('aria-current','page');
 expect(await page.evaluate(()=>{const value=JSON.parse(localStorage.getItem('mira-link-demo-v1')!);return {sessions:value.sessions.length,guests:value.guests.length}})).toEqual({sessions:0,guests:0});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBe(0);
 await page.screenshot({path:`${qa}/multiple-events-390.png`});

 await page.getByRole('button',{name:'Сегодня',exact:true}).click();
 await expect(page.getByRole('heading',{name:'На выбранные даты событий нет',exact:true})).toBeVisible();
 await page.screenshot({path:`${qa}/empty-filter-390.png`});
 await page.getByRole('button',{name:'Показать все',exact:true}).click();
 await expect(page.locator('[data-event-id]')).toHaveCount(4);
});

test('Event Detail exposes truthful venue/time data and hands off only to table booking',async({page})=>{
 await openEvents(page);
 await page.getByRole('button',{name:'Подробнее',exact:true}).click();
 const dialog=page.getByRole('dialog');
 await expect(dialog.getByRole('heading',{name:'Джаз. Вино. Хороший вечер.',exact:true})).toBeVisible();
 await expect(dialog.getByText('Дата',{exact:true})).toBeVisible();
 await expect(dialog.getByText('Время',{exact:true})).toBeVisible();
 await expect(dialog.getByText('MIRA Restaurant · Основной зал',{exact:true})).toBeVisible();
 await expect(dialog.getByText('Бронируется стол в заведении. Это не гарантирует отдельное место на мероприятии.',{exact:true})).toBeVisible();
 await expect(dialog.getByRole('button',{name:'Забронировать стол',exact:true})).toBeVisible();
 await dialog.getByRole('button',{name:'Забронировать стол',exact:true}).scrollIntoViewIfNeeded();
 await page.screenshot({path:`${qa}/event-detail-390.png`});
 await dialog.getByRole('button',{name:'Забронировать стол',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Стол в MIRA Restaurant',exact:true})).toBeVisible();
});

test('single event, missing image and narrow mobile remain compact',async({page})=>{
 const state=seed();state.venueEvents=[{...state.venueEvents[0],image:undefined,title:'Камерный музыкальный вечер с длинным названием'}];
 await openEvents(page,state);
 await expect(page.locator('[data-event-id]')).toHaveCount(1);
 await expect(page.getByRole('heading',{name:'Ближайшие события',exact:true})).toHaveCount(0);
 await page.screenshot({path:`${qa}/single-event-390.png`});
 await page.setViewportSize({width:320,height:844});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBe(0);
 await page.setViewportSize({width:1280,height:900});
 const guest=await page.locator('.guest-app').boundingBox();expect(guest!.width).toBeLessThanOrEqual(480);
});

test('Afisha has a truthful empty catalogue state',async({page})=>{
 const state=seed();state.venueEvents=[];await openEvents(page,state);
 await expect(page.getByRole('heading',{name:'Пока нет запланированных событий',exact:true})).toBeVisible();
 await expect(page.getByText('Следите за обновлениями афиши.',{exact:true})).toBeVisible();
 await expect(page.locator('[data-event-id]')).toHaveCount(0);
});

for(const theme of ['classic','dark','light'] as const)test(`Afisha supports ${theme} theme at 390px`,async({page})=>{
 await openEvents(page,seed(),theme);
 await expect(page.locator('.guest-theme').first()).toHaveAttribute('data-theme',theme);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBe(0);
 if(theme==='light')await page.screenshot({path:`${qa}/light-theme-390.png`});
});

test('scroll keeps the canonical Bottom Navigation visible and stable',async({page})=>{
 await openEvents(page);
 const nav=page.getByRole('navigation',{name:'Основная навигация гостя'}),before=await nav.boundingBox();
 await page.evaluate(()=>window.scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'}));
 await page.waitForTimeout(150);
 const after=await nav.boundingBox();
 expect(Math.round(after!.y+after!.height)).toBe(844);expect(Math.round(before!.y+before!.height)).toBe(844);
 await expect(page.getByRole('button',{name:'Открыть событие: Дегустация вкусов MIRA'})).toBeVisible();
 await page.screenshot({path:`${qa}/scroll-bottom-nav-390.png`});
});
