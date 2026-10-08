import {expect,test,type Page} from '@playwright/test';
import {getGuestThemePreset} from '../../lib/guest-theme';

const qa='docs/QA/guest-staff-call-ux21';

async function enterVisit(page:Page){
 await page.goto('/demo/guest/home');
 await page.getByRole('button',{name:'Сканировать QR стола №12',exact:true}).click();
 await page.getByRole('button',{name:'Официант',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Помощь персонала',exact:true})).toBeVisible();
}

async function openWaiterCalls(page:Page){
 await page.setViewportSize({width:1024,height:900});
 await page.goto('/demo/waiter');
 const navigation=page.getByRole('navigation',{name:'Основная навигация официанта'});
 const login=page.getByRole('button',{name:'Войти как Александр',exact:true});
 await expect(login.or(navigation)).toBeVisible();
 if(await login.isVisible())await login.click();
 const start=page.getByRole('button',{name:'Начать смену',exact:true});
 await expect(start.or(navigation)).toBeVisible();
 if(await start.isVisible())await start.click();
 await navigation.getByRole('button',{name:/^Вызовы/}).click();
 await expect(page.getByRole('heading',{name:'Вызовы',exact:true})).toBeVisible();
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
 await page.waitForTimeout(2500);
 await page.screenshot({path:`${qa}/no-active-call-390.png`});
 await waiter.click();
 await expect(page.getByRole('heading',{name:'Текущий запрос',exact:true})).toBeVisible();
 await expect(page.getByText('Официант вызван',{exact:true})).toBeVisible();
 await expect(page.getByText('Стол 12 · Запрос отправлен',{exact:true})).toBeVisible();
 await expect(waiter).toBeDisabled();
 await page.waitForTimeout(2500);
 await page.screenshot({path:`${qa}/call-sent-390.png`});
 await admin.click();
 await expect(page.getByText('Администратор вызван',{exact:true})).toBeVisible();
 await expect(admin).toBeDisabled();
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('mira-link-demo-v1')!).calls.length)).toBe(2);
 await expect(page.getByRole('button',{name:'Отменить вызов'})).toHaveCount(2);
 await expect(page.getByRole('navigation',{name:'Основная навигация гостя'})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBe(0);
 const adminWorkspace=await context.newPage();await adminWorkspace.goto('/demo/admin');await adminWorkspace.getByRole('button',{name:'Операции',exact:true}).click();
 await expect(adminWorkspace.getByText('Стол №12 · Вызов',{exact:true}).first()).toBeVisible();
 await page.waitForTimeout(2500);
});

test('pending cancellation synchronizes with Waiter, preserves history and permits a new call',async({page,context})=>{
 await page.setViewportSize({width:390,height:844});await enterVisit(page);
 await page.getByRole('button',{name:'Позвать официанта',exact:true}).click();
 const waiter=await context.newPage();await openWaiterCalls(waiter);
 const call=waiter.getByRole('button',{name:/^Вызов, стол 12/}).first();await expect(call).toContainText('Новый');
 await page.getByRole('button',{name:'Отменить вызов',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Последний запрос',exact:true})).toBeVisible();
 await expect(page.getByText('Вызов отменён',{exact:true}).first()).toBeVisible();
 await expect(page.getByRole('button',{name:'Позвать официанта',exact:true})).toBeEnabled();
 await expect(waiter.getByRole('button',{name:/^Отменённые · 1$/})).toBeVisible();
 await expect(call).toContainText('Отменён гостем');
 await call.click();
 await expect(waiter.getByRole('complementary',{name:'Детали вызова'}).getByRole('button',{name:'Принять вызов',exact:true})).toHaveCount(0);
 const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('mira-link-demo-v1')!).calls.length);
 await page.getByRole('button',{name:'Позвать официанта',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Текущий запрос',exact:true})).toBeVisible();
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('mira-link-demo-v1')!).calls.length)).toBe(before+1);
 await page.getByRole('button',{name:'Отменить вызов',exact:true}).click();
 await page.waitForTimeout(2500);
 await page.screenshot({path:`${qa}/call-cancelled-390.png`});
});

test('accepted call cannot be cancelled and completed call can be repeated',async({page,context})=>{
 await page.setViewportSize({width:390,height:844});await enterVisit(page);
 await page.getByRole('button',{name:'Позвать официанта',exact:true}).click();
 const waiter=await context.newPage();await openWaiterCalls(waiter);
 const card=waiter.getByRole('button',{name:/^Вызов, стол 12/}).first();await card.click();
 const detail=waiter.getByRole('complementary',{name:'Детали вызова'});
 await detail.getByRole('button',{name:'Принять вызов',exact:true}).click();
 await expect(page.getByText('Запрос принят',{exact:true})).toBeVisible();
 await expect(page.getByText('Сотрудник увидел ваш запрос',{exact:true})).toBeVisible();
 await expect(page.getByText('Принят сотрудником',{exact:true})).toBeVisible();
 await expect(page.getByRole('button',{name:'Отменить вызов',exact:true})).toHaveCount(0);
 await page.waitForTimeout(2500);
 await page.screenshot({path:`${qa}/call-accepted-390.png`});
 await detail.getByRole('button',{name:'Завершить вызов',exact:true}).click();
 await expect(page.getByText('Запрос завершён',{exact:true})).toBeVisible();
 await expect(page.getByText('Завершён',{exact:true}).first()).toBeVisible();
 await expect(page.getByRole('button',{name:'Позвать официанта',exact:true})).toBeEnabled();
 await page.waitForTimeout(2500);
 await page.screenshot({path:`${qa}/call-completed-390.png`});
});

test('concurrent Guest cancel and Waiter accept resolves to one consistent terminal or accepted state',async({page,context})=>{
 await page.setViewportSize({width:390,height:844});await enterVisit(page);
 await page.getByRole('button',{name:'Позвать официанта',exact:true}).click();
 const waiter=await context.newPage();await openWaiterCalls(waiter);
 const card=waiter.getByRole('button',{name:/^Вызов, стол 12/}).first();await card.click();
 const accept=waiter.getByRole('complementary',{name:'Детали вызова'}).getByRole('button',{name:'Принять вызов',exact:true});
 const cancel=page.getByRole('button',{name:'Отменить вызов',exact:true});
 await Promise.allSettled([accept.click({timeout:3000,noWaitAfter:true}),cancel.click({timeout:3000,noWaitAfter:true})]);
 await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem('mira-link-demo-v1')!).calls.at(-1).status)).toMatch(/accepted|cancelled/);
 const status=await page.evaluate(()=>JSON.parse(localStorage.getItem('mira-link-demo-v1')!).calls.at(-1).status);
 if(status==='accepted'){
  await expect(page.getByText('Принят сотрудником',{exact:true})).toBeVisible();
  await expect(waiter.getByText('Принят',{exact:true}).first()).toBeVisible();
 }else{
  await expect(page.getByText('Вызов отменён',{exact:true}).first()).toBeVisible();
  await expect(waiter.getByText('Отменён гостем',{exact:true}).first()).toBeVisible();
 }
});

test('Staff Call presentation keeps geometry in Classic, Dark and Light',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await enterVisit(page);
 await page.getByRole('button',{name:'Позвать официанта',exact:true}).click();
 await page.waitForTimeout(2500);
 for(const id of ['classic','dark','light'] as const){
  const palette=getGuestThemePreset(id);
  await page.evaluate(selection=>{localStorage.setItem('mira-demo-guest-theme',JSON.stringify(selection));window.dispatchEvent(new Event('mira-theme'))},{preset:id,palette});
 await expect(page.locator('.guest-theme').first()).toHaveAttribute('data-theme',id);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth),id).toBe(0);
  const short=await page.locator('button:visible').evaluateAll(buttons=>buttons.filter(button=>button.getBoundingClientRect().height<43.5).map(button=>button.getAttribute('aria-label')||button.textContent));
  expect(short,id).toEqual([]);
  await page.waitForTimeout(120);
  await page.screenshot({path:`${qa}/staff-call-${id}-390.png`});
 }
});

for(const width of [320,390,1024])test(`Staff Call remains responsive with canonical navigation at ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:844});await enterVisit(page);
 await page.getByRole('button',{name:'Позвать официанта',exact:true}).click();
 await expect(page.getByRole('navigation',{name:'Основная навигация гостя'})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBe(0);
 const short=await page.locator('button:visible').evaluateAll(buttons=>buttons.filter(button=>button.getBoundingClientRect().height<43.5).map(button=>button.getAttribute('aria-label')||button.textContent));
 expect(short).toEqual([]);
});
