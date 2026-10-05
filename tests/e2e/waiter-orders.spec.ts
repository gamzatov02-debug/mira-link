import {expect,test,type Page} from '@playwright/test';

const qa='docs/QA/stage-7.6';

async function openWaiterOrders(page:Page,width=1440){
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
 await navigation.getByRole('button',{name:/^Заказы/}).click();
 await expect(page.getByRole('heading',{name:'Заказы',exact:true})).toBeVisible();
 await expect(navigation.getByRole('button',{name:/^Заказы/})).toHaveAttribute('aria-current','page');
}

async function enterGuest(page:Page){
 await page.goto('/demo/guest/home');
 const scan=page.getByRole('button',{name:'Сканировать QR стола №12',exact:true});
 if(await scan.isVisible())await scan.click();
}

async function placeGuestOrder(page:Page,index=0){
 await page.getByRole('navigation',{name:'Основная навигация гостя'}).getByRole('button',{name:'Меню',exact:true}).click();
 await page.getByRole('button',{name:'Выбрать блюдо',exact:true}).nth(index).click();
 await page.getByRole('button',{name:'В корзину',exact:true}).click();
 await page.getByRole('button',{name:/^Заказ/}).click();
 await page.getByRole('button',{name:'Оформить заказ',exact:true}).click();
 await expect(page.getByText('Заказ отправлен',{exact:true}).first()).toBeVisible();
}

async function firstOrder(page:Page){return page.getByRole('button',{name:/^Заказ №.+стол 12/}).first()}

test('WTR-005 route opens with active navigation, derived filters and compact empty detail',async({page})=>{
 await openWaiterOrders(page,1440);
 await expect(page.getByRole('navigation',{name:'Фильтры заказов'})).toBeVisible();
 await expect(page.getByText('Выберите заказ, чтобы увидеть детали',{exact:true})).toBeVisible();
 await expect(page.getByRole('button',{name:'Отменить заказ',exact:true})).toHaveCount(0);
 await expect(page.getByRole('button',{name:'Удалить позицию',exact:true})).toHaveCount(0);
 await expect(page.getByRole('button',{name:'Взять заказ',exact:true})).toHaveCount(0);
});

test('Guest-created Order appears in the shared list and complete Order Detail',async({page,context})=>{
 await enterGuest(page);await placeGuestOrder(page);
 const waiter=await context.newPage();await openWaiterOrders(waiter,1024);
 const card=await firstOrder(waiter);await expect(card).toContainText('Гость');await card.click();
 const detail=waiter.getByRole('complementary',{name:'Детали заказа'});
 await expect(detail.getByRole('heading',{name:/Заказ №/})).toBeVisible();
 await expect(detail.getByText('Стол',{exact:true})).toBeVisible();
 await expect(detail.getByRole('heading',{name:'Позиции',exact:true})).toBeVisible();
 await expect(detail.getByText('Сумма заказа',{exact:true})).toBeVisible();
 await expect(detail.getByText('Счёт посещения',{exact:true})).toBeVisible();
 await expect(detail.getByRole('heading',{name:'POS / iiko',exact:true})).toBeVisible();
 await expect(card).toHaveAttribute('aria-pressed','true');
 await waiter.screenshot({path:`${qa}/selected-1024.png`,fullPage:true});
});

test('New, Ready and empty filters track live existing status transitions',async({page,context})=>{
 await enterGuest(page);await placeGuestOrder(page);
 const waiter=await context.newPage();await openWaiterOrders(waiter,1440);
 const filters=waiter.getByRole('navigation',{name:'Фильтры заказов'});
 await filters.getByRole('button',{name:/^Новые · 1$/}).click();
 await (await firstOrder(waiter)).click();
 await waiter.getByRole('complementary',{name:'Детали заказа'}).getByRole('button',{name:'Отправить в iiko',exact:true}).click();
 await expect(waiter.getByText('В этом фильтре заказов нет',{exact:true})).toBeVisible();
 await filters.getByRole('button',{name:/^Все · 1$/}).click();
 await (await firstOrder(waiter)).click();
 await waiter.getByRole('complementary',{name:'Детали заказа'}).getByRole('button',{name:'Готово к подаче',exact:true}).click();
 await filters.getByRole('button',{name:/^Готовы · 1$/}).click();
 await expect(await firstOrder(waiter)).toContainText('Готово к подаче');
 await waiter.screenshot({path:`${qa}/ready-filter-1440.png`,fullPage:true});
 await filters.getByRole('button',{name:/^Ошибка POS · 0$/}).click();
 await expect(waiter.getByText('В этом фильтре заказов нет',{exact:true})).toBeVisible();
 await waiter.screenshot({path:`${qa}/empty-filter-1440.png`,fullPage:true});
});

test('WTR-014 POS error and retry use the existing adapter and same Order',async({page,context})=>{
 await enterGuest(page);await placeGuestOrder(page);
 const admin=await context.newPage();await admin.goto('/demo/admin');await admin.getByRole('button',{name:'Интеграции',exact:true}).click();await admin.getByRole('switch',{name:'Ошибка передачи новых заказов',exact:true}).click();
 const waiter=await context.newPage();await openWaiterOrders(waiter,1440);
 await (await firstOrder(waiter)).click();
 const detail=waiter.getByRole('complementary',{name:'Детали заказа'});
 await detail.getByRole('button',{name:'Отправить в iiko',exact:true}).click();
 await expect(detail.getByText('Заказ не передан в POS',{exact:true})).toBeVisible();
 await expect(detail.getByRole('button',{name:'Повторить передачу',exact:true})).toBeVisible();
 await waiter.screenshot({path:`${qa}/pos-error-1440.png`,fullPage:true});
 const before=await waiter.evaluate(()=>JSON.parse(localStorage.getItem('mira-link-demo-v1')!).orders.length);
 await admin.getByRole('switch',{name:'Ошибка передачи новых заказов',exact:true}).click();
 await detail.getByRole('button',{name:'Повторить передачу',exact:true}).click();
 await expect(detail.getByText('Принят кухней',{exact:true}).first()).toBeVisible();
 expect(await waiter.evaluate(()=>JSON.parse(localStorage.getItem('mira-link-demo-v1')!).orders.length)).toBe(before);
});

test('WTR-013 existing waiter-created Order flow remains reachable and attributed',async({page,context})=>{
 await enterGuest(page);
 const waiter=await context.newPage();await openWaiterOrders(waiter,1440);
 await waiter.getByRole('button',{name:'Новый заказ',exact:true}).click();
 await expect(waiter.getByRole('heading',{name:'Ещё',exact:true})).toBeVisible();
 await waiter.getByRole('button',{name:'Оформить заказ за гостя',exact:true}).click();
 await waiter.getByLabel('Гость для заказа',{exact:true}).selectOption({label:'Гость 1'});
 await waiter.getByLabel('Поиск в меню сотрудника',{exact:true}).fill('Рибай');
 await waiter.getByRole('button',{name:'Фото и состав',exact:true}).click();
 await waiter.getByRole('radio',{name:/Medium/}).check();
 await waiter.getByRole('button',{name:'Добавить в заказ официанта',exact:true}).click();
 await waiter.getByRole('button',{name:'Оформить заказ официантом',exact:true}).click();
 await waiter.getByRole('navigation',{name:'Основная навигация официанта'}).getByRole('button',{name:/^Заказы/}).click();
 await expect(await firstOrder(waiter)).toContainText('Официант');
});

test('read-only Order is inspectable and exposes no mutation or handoff',async({page,context})=>{
 await enterGuest(page);await placeGuestOrder(page);
 const waiter=await context.newPage();await openWaiterOrders(waiter,1440);
 await waiter.evaluate(()=>{const state=JSON.parse(localStorage.getItem('mira-link-demo-v1')!);state.shiftAssignments=state.shiftAssignments.map((item:{shiftId:string;zoneIds:string[];tableIds:number[]})=>({...item,zoneIds:[],tableIds:[]}));localStorage.setItem('mira-link-demo-v1',JSON.stringify(state))});
 await waiter.reload();
 const card=await firstOrder(waiter);await expect(card).toContainText('Только просмотр');await card.click();
 const detail=waiter.getByRole('complementary',{name:'Детали заказа'});
 await expect(detail.getByText('Только просмотр',{exact:true}).first()).toBeVisible();
 await expect(detail.getByRole('button',{name:/Отправить|Повторить|Готово|Подан/})).toHaveCount(0);
 await expect(detail.getByRole('button',{name:/Взять|Передать|Назначить/})).toHaveCount(0);
 await waiter.screenshot({path:`${qa}/read-only-1440.png`,fullPage:true});
});

for(const width of [360,375,390,430,480,768,1024,1280,1440])test(`Orders workspace responsive behavior at ${width}px`,async({page,context})=>{
 await enterGuest(page);await placeGuestOrder(page);
 const waiter=await context.newPage();await openWaiterOrders(waiter,width);
 expect(await waiter.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 const detail=waiter.getByRole('complementary',{name:'Детали заказа'});
 if(width<768){await expect(detail).toBeHidden()}else await expect(detail).toBeVisible();
 const navigation=waiter.getByRole('navigation',{name:'Основная навигация официанта'});await expect(navigation).toBeVisible();
 const card=await firstOrder(waiter);
 if(width===390)await waiter.screenshot({path:`${qa}/orders-list-390.png`,fullPage:true});
 await card.click();
 if(width<768){const sheet=waiter.getByRole('dialog',{name:/Заказ №/});await expect(sheet).toBeVisible();const short=await sheet.locator('button:visible').evaluateAll(buttons=>buttons.filter(button=>button.getBoundingClientRect().height<43.5).map(button=>button.textContent));expect(short).toEqual([])}else{await expect(detail.getByRole('heading',{name:/Заказ №/})).toBeVisible()}
 expect(await waiter.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 if([390,768,1024,1440].includes(width))await waiter.screenshot({path:`${qa}/${width===390?'order-detail':'selected'}-${width}.png`,fullPage:true});
 if(width===390){const sheet=waiter.getByRole('dialog',{name:/Заказ №/});await sheet.getByRole('button',{name:'Отправить в iiko',exact:true}).click();await sheet.getByRole('button',{name:'Готово к подаче',exact:true}).click();await sheet.getByRole('button',{name:'Закрыть',exact:true}).click();await waiter.getByRole('navigation',{name:'Фильтры заказов'}).getByRole('button',{name:/^Готовы · 1$/}).click();await expect(await firstOrder(waiter)).toContainText('Готово к подаче');await waiter.screenshot({path:`${qa}/ready-filter-390.png`,fullPage:true})}
});
