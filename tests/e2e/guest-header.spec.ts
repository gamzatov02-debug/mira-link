import {test,expect,type Page} from '@playwright/test';
import {getGuestThemePreset} from '../../lib/guest-theme';
test.use({reducedMotion:'reduce'});
const shots='docs/QA/guest-header-logo';
async function ready(page:Page){await expect(page.getByRole('group',{name:'Демонстрация MIRA LINK',exact:true})).toBeEnabled();await expect(page.locator('.guest-header img')).toHaveJSProperty('complete',true)}
async function geometry(page:Page){
 const header=page.locator('.guest-header');await expect(header).toBeVisible();
 expect(await header.evaluate(el=>Math.round(el.getBoundingClientRect().height))).toBe(64);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBe(0);
 expect(await header.evaluate(el=>{const logo=el.querySelector('.guest-logo')!.getBoundingClientRect(),controls=el.querySelector('.guest-header-controls')!.getBoundingClientRect(),img=el.querySelector('img')!.getBoundingClientRect(),text=el.querySelector('.guest-logo span')!.getBoundingClientRect();return img.width>0&&img.left>=logo.left&&text.right<=controls.left&&Math.abs(img.y+img.height/2-(text.y+text.height/2))<1})).toBe(true);
 for(const name of ['Уведомления','Профиль']){const button=header.getByRole('button',{name,exact:true});const box=await button.boundingBox();expect(box!.width).toBeGreaterThanOrEqual(44);expect(box!.height).toBeGreaterThanOrEqual(44);await button.click({trial:true})}
 await expect(header.locator('img')).toHaveAttribute('src','/brand/mira-monogram.svg');
 expect(await header.locator('img').evaluate(el=>{const css=getComputedStyle(el);return [css.backgroundColor,css.filter,css.boxShadow]})).toEqual(['rgba(0, 0, 0, 0)','none','none']);
}
for(const width of [320,375,390,1440])test(`Guest Header fits ${width}px with table controls and semantic themes`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.goto('/demo/guest/home');await ready(page);await geometry(page);
 await page.getByRole('button',{name:'Сканировать QR стола №12',exact:true}).click();await expect(page.getByRole('button',{name:'Текущий стол 12'})).toBeVisible();
 for(const preset of ['classic','dark','light','custom'] as const){const palette=preset==='custom'?{...getGuestThemePreset('dark'),accent:'#D4AE64',background:'#18212D'}:getGuestThemePreset(preset);await page.evaluate(selection=>{localStorage.setItem('mira-demo-guest-theme',JSON.stringify(selection));window.dispatchEvent(new Event('mira-theme'))},{preset,palette});await expect(page.locator('.guest-theme').first()).toHaveAttribute('data-theme',preset);await geometry(page);if(preset==='classic'||width===390&&preset==='light')await page.screenshot({path:`${shots}/home-${width}-${preset}.png`})}
});
test('canonical Guest Header is used across guest pages and venue delivery',async({page})=>{
 await page.setViewportSize({width:390,height:900});
 for(const route of ['home','menu','order','bill','waiter','nearby','events','promotions','powerbank','delivery']){await page.goto(`/demo/guest/${route}`);await ready(page);await geometry(page)}
 await page.goto('/demo/guest/nearby');await ready(page);await page.locator('[data-venue-id="garden"]').getByRole('button',{name:'Подробнее',exact:true}).click();await expect(page.getByRole('dialog')).toBeVisible();await expect(page.locator('.guest-header img')).toHaveAttribute('src','/brand/mira-monogram.svg');await page.getByRole('dialog').getByRole('button',{name:'Меню',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:'Заказать домой',exact:true}).click();await expect(page.getByRole('dialog').getByText('Корзина доставки',{exact:true})).toBeVisible();
});
test('Guest Header table notification and profile controls remain clickable',async({page})=>{
 await page.setViewportSize({width:320,height:844});await page.goto('/demo/guest/home');await ready(page);await page.getByRole('button',{name:'Сканировать QR стола №12',exact:true}).click();
 await page.getByRole('button',{name:'Текущий стол 12',exact:true}).click();await expect(page.locator('.guest-theme .device-tools')).toHaveAttribute('open','');
 await page.locator('.guest-header').getByRole('button',{name:'Уведомления',exact:true}).click();await expect(page.getByRole('dialog',{name:'Войдите в аккаунт'})).toBeVisible();await page.getByRole('button',{name:'Войти как Алексей',exact:true}).click();await expect(page.getByRole('heading',{name:'Уведомления',exact:true})).toBeVisible();
 await page.locator('.guest-header').getByRole('button',{name:'Профиль',exact:true}).click();await expect(page.getByRole('heading',{name:'Алексей',exact:true})).toBeVisible();
});
