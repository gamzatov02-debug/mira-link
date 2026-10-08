import {expect,test,type Page} from '@playwright/test';

const qa='docs/QA/stage-7.6a';

async function openWaiterCalls(page:Page,width=1440){
 await page.setViewportSize({width,height:900});
 await page.goto('/demo/waiter');
 const navigation=page.getByRole('navigation',{name:'Основная навигация официанта'});
 const login=page.getByRole('button',{name:'Войти как Александр',exact:true});
 await expect(login.or(navigation)).toBeVisible();
 if(await login.isVisible())await login.click();
 const start=page.getByRole('button',{name:'Начать смену',exact:true});
 await expect(start.or(navigation)).toBeVisible();
 if(await start.isVisible())await start.click();
 await expect(navigation).toBeVisible();
 await navigation.getByRole('button',{name:/^Вызовы/}).click();
 await expect(page.getByRole('heading',{name:'Вызовы',exact:true})).toBeVisible();
 await expect(navigation.getByRole('button',{name:/^Вызовы/})).toHaveAttribute('aria-current','page');
}

async function enterGuest(page:Page){
 await page.goto('/demo/guest/home');
 const scan=page.getByRole('button',{name:'Сканировать QR стола №12',exact:true});
 if(await scan.isVisible())await scan.click();
}

async function createWaiterCall(page:Page){
 await page.getByRole('button',{name:'Официант',exact:true}).click();
 await page.getByRole('button',{name:'Позвать официанта',exact:true}).click();
 await expect(page.getByText('Официант вызван',{exact:true})).toBeVisible();
 await expect(page.getByText('Вызов отправлен',{exact:true})).toBeVisible();
}

const firstCall=(page:Page)=>page.getByRole('button',{name:/^Вызов, стол 12/}).first();

test('WTR-007 route exposes real filters and a compact empty state',async({page})=>{
 await openWaiterCalls(page,1440);
 await expect(page.getByRole('navigation',{name:'Фильтры вызовов'})).toBeVisible();
 await expect(page.getByText('Активных вызовов нет',{exact:true})).toBeVisible();
 await expect(page.getByText('Выберите вызов, чтобы увидеть детали',{exact:true})).toBeVisible();
 await expect(page.getByRole('button',{name:/Взять|Передать|Назначить/})).toHaveCount(0);
 await page.screenshot({path:`${qa}/empty-1440.png`,fullPage:true});
});

test('Guest-created call synchronizes to Calls, accepts and completes through the existing entity',async({page,context})=>{
 await enterGuest(page);
 const waiter=await context.newPage();await openWaiterCalls(waiter,1440);
 await expect(waiter.getByText('Активных вызовов нет',{exact:true})).toBeVisible();
 await createWaiterCall(page);
 const card=firstCall(waiter);await expect(card).toBeVisible();await expect(card).toContainText('Новый');
 const before=await waiter.evaluate(()=>JSON.parse(localStorage.getItem('mira-link-demo-v1')!).calls.length);
 await card.click();
 const detail=waiter.getByRole('complementary',{name:'Детали вызова'});
 await expect(detail.getByRole('heading',{name:'Стол 12',exact:true})).toBeVisible();
 await expect(detail.getByText('Вызов официанта',{exact:true})).toBeVisible();
 await detail.getByRole('button',{name:'Принять вызов',exact:true}).click();
 await expect(detail.getByText('Принят',{exact:true}).first()).toBeVisible();
 await expect(page.getByText('Официант уже идёт',{exact:true})).toBeVisible();
 await detail.getByRole('button',{name:'Завершить вызов',exact:true}).click();
 await expect(detail.getByText('Завершён',{exact:true}).first()).toBeVisible();
 await expect(page.getByText('Обращение выполнено',{exact:true})).toBeVisible();
 expect(await waiter.evaluate(()=>JSON.parse(localStorage.getItem('mira-link-demo-v1')!).calls.length)).toBe(before);
});

test('WTR-008 detail shows table, zone, visit, assignment and actor attribution',async({page,context})=>{
 await enterGuest(page);await createWaiterCall(page);
 const waiter=await context.newPage();await openWaiterCalls(waiter,1024);
 const card=firstCall(waiter);await card.click();
 const detail=waiter.getByRole('complementary',{name:'Детали вызова'});
 await expect(detail.getByText('Терраса',{exact:true}).first()).toBeVisible();
 await expect(detail.getByText('Активно',{exact:true})).toBeVisible();
 await expect(detail.getByText('Александр',{exact:true})).toBeVisible();
 await detail.getByRole('button',{name:'Принять вызов',exact:true}).click();
 await expect(detail.getByText('Принял',{exact:true})).toBeVisible();
 await expect(detail.getByText('Александр',{exact:true})).toHaveCount(2);
});

test('real status filters update counters and clear stale selection',async({page,context})=>{
 await enterGuest(page);await createWaiterCall(page);
 const waiter=await context.newPage();await openWaiterCalls(waiter,1440);
 const filters=waiter.getByRole('navigation',{name:'Фильтры вызовов'});
 await filters.getByRole('button',{name:/^Новые · 1$/}).click();
 await firstCall(waiter).click();
 await waiter.getByRole('complementary',{name:'Детали вызова'}).getByRole('button',{name:'Принять вызов',exact:true}).click();
 await expect(waiter.getByText('В этом фильтре вызовов нет',{exact:true})).toBeVisible();
 await expect(waiter.getByText('Выберите вызов, чтобы увидеть детали',{exact:true})).toBeVisible();
 await filters.getByRole('button',{name:/^В работе · 1$/}).click();
 await firstCall(waiter).click();
 await waiter.getByRole('complementary',{name:'Детали вызова'}).getByRole('button',{name:'Завершить вызов',exact:true}).click();
 await expect(waiter.getByText('В этом фильтре вызовов нет',{exact:true})).toBeVisible();
 await filters.getByRole('button',{name:/^Завершённые · 1$/}).click();
 await expect(firstCall(waiter)).toContainText('Завершён');
});

test('unassigned call stays visible read-only without mutation or handoff',async({page,context})=>{
 await enterGuest(page);await createWaiterCall(page);
 const waiter=await context.newPage();await openWaiterCalls(waiter,1440);
 await waiter.evaluate(()=>{const state=JSON.parse(localStorage.getItem('mira-link-demo-v1')!);state.shiftAssignments=state.shiftAssignments.map((item:{shiftId:string;zoneIds:string[];tableIds:number[]})=>({...item,zoneIds:[],tableIds:[]}));localStorage.setItem('mira-link-demo-v1',JSON.stringify(state))});
 await waiter.reload();
 const card=firstCall(waiter);await expect(card).toContainText('Только просмотр');await card.click();
 const detail=waiter.getByRole('complementary',{name:'Детали вызова'});
 await expect(detail.getByText('Только просмотр',{exact:true}).first()).toBeVisible();
 await expect(detail.getByRole('button',{name:/Принять|Завершить|Взять|Передать|Назначить/})).toHaveCount(0);
 await waiter.screenshot({path:`${qa}/read-only-1440.png`,fullPage:true});
});

for(const width of [360,375,390,430,480,768,1024,1280,1440])test(`Calls workspace responsive behavior at ${width}px`,async({page,context})=>{
 await enterGuest(page);await createWaiterCall(page);
 const waiter=await context.newPage();await openWaiterCalls(waiter,width);
 expect(await waiter.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 const persistent=waiter.getByRole('complementary',{name:'Детали вызова'});
 if(width<768)await expect(persistent).toBeHidden();else await expect(persistent).toBeVisible();
 const card=firstCall(waiter);
 if(width===390)await waiter.screenshot({path:`${qa}/calls-list-390.png`,fullPage:true});
 if(width===1440)await waiter.screenshot({path:`${qa}/attention-1440.png`,fullPage:true});
 await card.click();
 if(width<768){
  const sheet=waiter.getByRole('dialog',{name:'Вызов · Стол 12',exact:true});await expect(sheet).toBeVisible();
  const short=await sheet.locator('button:visible').evaluateAll(buttons=>buttons.filter(button=>button.getBoundingClientRect().height<43.5).map(button=>button.textContent));expect(short).toEqual([]);
 }else await expect(persistent.getByRole('heading',{name:'Стол 12',exact:true})).toBeVisible();
 expect(await waiter.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 if([390,768,1024,1440].includes(width))await waiter.screenshot({path:`${qa}/${width===390?'call-detail':'selected'}-${width}.png`,fullPage:true});
});
