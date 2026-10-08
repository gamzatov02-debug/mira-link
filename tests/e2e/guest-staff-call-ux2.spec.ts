import {expect,test,type Page} from '@playwright/test';
import {getGuestThemePreset} from '../../lib/guest-theme';

const qa='docs/QA/guest-staff-call-ux2';

async function enterVisit(page:Page){
 await page.goto('/demo/guest/home');
 await page.getByRole('button',{name:'Сканировать QR стола №12',exact:true}).click();
 await page.getByRole('button',{name:'Официант',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Помощь персонала',exact:true})).toBeVisible();
}

test('no-table Staff Call uses the canonical QR gate without creating a visit',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/demo/guest/waiter');
 await expect(page.getByRole('heading',{name:'Помощь персонала',exact:true})).toBeVisible();
 await expect(page.getByText('Сначала откройте стол',{exact:true})).toBeVisible();
 expect(await page.evaluate(()=>localStorage.getItem('mira-link-demo-v1'))).toBeNull();
 await page.getByRole('region',{name:'Помощь персонала'}).getByRole('button',{name:'Сканировать QR',exact:true}).click();
 await expect(page.getByRole('dialog',{name:'Сканировать QR',exact:true})).toBeVisible();
 await page.keyboard.press('Escape');
 expect(await page.evaluate(()=>localStorage.getItem('mira-link-demo-v1'))).toBeNull();
 await expect(page.getByRole('navigation',{name:'Основная навигация гостя'})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBe(0);
});

test('waiter and administrator cards create shared deduplicated active calls',async({page,context})=>{
 await page.setViewportSize({width:390,height:844});
 await enterVisit(page);
 const waiter=page.getByRole('button',{name:'Позвать официанта',exact:true});
 const admin=page.getByRole('button',{name:'Позвать администратора',exact:true});
 await expect(waiter).toBeEnabled();await expect(admin).toBeEnabled();
 await expect(page.getByRole('button',{name:'Позвать сотрудника',exact:true})).toHaveCount(0);
 await waiter.click();
 await expect(page.getByRole('heading',{name:'Текущий запрос',exact:true})).toBeVisible();
 await expect(page.getByText('Официант вызван',{exact:true})).toBeVisible();
 await expect(page.getByText('Стол 12 · Запрос отправлен',{exact:true})).toBeVisible();
 await expect(waiter).toBeDisabled();
 await admin.click();
 await expect(page.getByText('Администратор вызван',{exact:true})).toBeVisible();
 await expect(admin).toBeDisabled();
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('mira-link-demo-v1')!).calls.length)).toBe(2);
 await expect(page.getByRole('button',{name:'Отменить вызов'})).toHaveCount(0);
 await expect(page.getByRole('navigation',{name:'Основная навигация гостя'})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBe(0);
 const adminWorkspace=await context.newPage();await adminWorkspace.goto('/demo/admin');await adminWorkspace.getByRole('button',{name:'Операции',exact:true}).click();
 await expect(adminWorkspace.getByText('Стол №12 · Вызов',{exact:true}).first()).toBeVisible();
 await page.waitForTimeout(2500);
 await page.screenshot({path:`${qa}/active-calls-classic-390.png`,fullPage:true});
});

test('Staff Call presentation keeps geometry in Classic, Dark and Light',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await enterVisit(page);
 await page.getByRole('button',{name:'Позвать официанта',exact:true}).click();
 for(const id of ['classic','dark','light'] as const){
  const palette=getGuestThemePreset(id);
  await page.evaluate(selection=>{localStorage.setItem('mira-demo-guest-theme',JSON.stringify(selection));window.dispatchEvent(new Event('mira-theme'))},{preset:id,palette});
 await expect(page.locator('.guest-theme').first()).toHaveAttribute('data-theme',id);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth),id).toBe(0);
  const short=await page.locator('button:visible').evaluateAll(buttons=>buttons.filter(button=>button.getBoundingClientRect().height<43.5).map(button=>button.getAttribute('aria-label')||button.textContent));
  expect(short,id).toEqual([]);
  await page.waitForTimeout(120);
  await page.screenshot({path:`${qa}/staff-call-${id}-390.png`,fullPage:true});
 }
});
