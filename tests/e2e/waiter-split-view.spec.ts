import {expect,test,type BrowserContext,type Page} from '@playwright/test';

async function openFloor(page:Page,width:number){
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
 await navigation.getByRole('button',{name:'Зал',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Зал',exact:true})).toBeVisible();
}

async function enterGuest(page:Page){await page.goto('/demo/guest/home');await page.getByRole('button',{name:'Сканировать QR стола №12',exact:true}).click()}
async function placeOrder(page:Page){await page.getByRole('navigation',{name:'Основная навигация гостя'}).getByRole('button',{name:'Меню',exact:true}).click();await page.getByRole('button',{name:'Выбрать блюдо',exact:true}).first().click();await page.getByRole('button',{name:'В корзину',exact:true}).click();await page.getByRole('button',{name:/^Заказ/}).click();await page.getByRole('button',{name:'Оформить заказ',exact:true}).click();await expect(page.getByText('Заказ отправлен',{exact:true}).first()).toBeVisible()}
async function addDish(page:Page,index:number){await page.getByRole('navigation',{name:'Основная навигация гостя'}).getByRole('button',{name:'Меню',exact:true}).click();await page.getByRole('button',{name:'Выбрать блюдо',exact:true}).nth(index).click();await page.getByRole('button',{name:'В корзину',exact:true}).click()}
async function submitOrder(page:Page){await page.getByRole('button',{name:/^Заказ/}).click();await page.getByRole('button',{name:'Оформить заказ',exact:true}).click();await expect(page.getByText('Заказ отправлен',{exact:true}).first()).toBeVisible()}
async function openWaiterOperations(context:BrowserContext,width=1440){const waiter=await context.newPage();await openFloor(waiter,width);await waiter.getByRole('navigation',{name:'Основная навигация официанта'}).getByRole('button',{name:'Ещё',exact:true}).click();await waiter.getByText('Дополнительные операции демо',{exact:true}).click();await expect(waiter.getByRole('button',{name:'Оформить заказ за гостя',exact:true})).toBeVisible();return waiter}

test('desktop split view updates persistent detail and resets an invalid Zone selection',async({page})=>{
 await openFloor(page,768);
 const detail=page.getByRole('complementary',{name:'Детали стола'});
 await expect(detail).toBeVisible();
 await expect(detail.getByText('Выберите стол, чтобы увидеть детали',{exact:true})).toBeVisible();
 expect((await detail.boundingBox())!.height).toBeLessThan(110);
 await page.getByRole('button',{name:/Стол 7, Свободен/}).click();
 await expect(detail.getByRole('heading',{name:'Стол 7',exact:true})).toBeVisible();
 await expect(page.getByRole('dialog',{name:'Стол 7',exact:true})).toHaveCount(0);
 await expect(page.getByRole('button',{name:/Стол 7, Свободен/})).toHaveAttribute('aria-pressed','true');
 await page.getByRole('navigation',{name:'Зоны зала'}).getByRole('button',{name:'Основной зал',exact:true}).click();
 await expect(detail.getByText('Выберите стол, чтобы увидеть детали',{exact:true})).toBeVisible();
 await page.getByRole('navigation',{name:'Зоны зала'}).getByRole('button',{name:'Все',exact:true}).click();
 await page.getByRole('button',{name:/Стол 7, Свободен/}).click();
 await expect(detail.getByRole('heading',{name:'Стол 7',exact:true})).toBeVisible();
 await page.screenshot({path:'docs/QA/stage-7.5/split-768.png',fullPage:true});
 await page.screenshot({path:'docs/QA/stage-7.5a/split-768.png',fullPage:true});
});

test('mobile keeps the Stage 7.4 BottomSheet interaction',async({page})=>{
 await openFloor(page,390);
 await expect(page.getByRole('complementary',{name:'Детали стола'})).toBeHidden();
 await page.screenshot({path:'docs/QA/stage-7.5/mobile-floor-390.png',fullPage:true});
 await page.screenshot({path:'docs/QA/stage-7.5a/mobile-floor-390.png',fullPage:true});
 await page.getByRole('button',{name:/Стол 7, Свободен/}).click();
 await expect(page.getByRole('dialog',{name:'Стол 7',exact:true})).toBeVisible();
 await page.screenshot({path:'docs/QA/stage-7.5/mobile-table-sheet-390.png',fullPage:true});
 await page.screenshot({path:'docs/QA/stage-7.5a/mobile-table-sheet-390.png',fullPage:true});
});

test('desktop read-only Table stays inspectable without mutation actions',async({page})=>{
 await openFloor(page,1440);
 await page.getByRole('button',{name:/Стол 1, Свободен, только просмотр/}).click();
 const detail=page.getByRole('complementary',{name:'Детали стола'});
 await expect(detail.getByRole('heading',{name:'Стол 1',exact:true})).toBeVisible();
 await expect(detail.getByText('Только просмотр',{exact:true}).first()).toBeVisible();
 await expect(detail.getByRole('button',{name:'Создать заказ',exact:true})).toHaveCount(0);
 await expect(detail.getByRole('button',{name:'Открыть заказ',exact:true})).toHaveCount(0);
 await page.screenshot({path:'docs/QA/stage-7.5/read-only-1440.png',fullPage:true});
 await page.screenshot({path:'docs/QA/stage-7.5a/read-only-1440.png',fullPage:true});
});

test('occupied Table updates the desktop detail without losing Floor context',async({page,context})=>{
 await enterGuest(page);
 const waiter=await context.newPage();
 await openFloor(waiter,1024);
 await waiter.getByRole('button',{name:/Стол 12, Занят/}).click();
 const detail=waiter.getByRole('complementary',{name:'Детали стола'});
 await expect(detail.getByRole('heading',{name:'Стол 12',exact:true})).toBeVisible();
 await expect(detail.getByText('Активно',{exact:true})).toBeVisible();
 await expect(waiter.getByRole('heading',{name:'Мои столы',exact:true})).toBeVisible();
 await waiter.screenshot({path:'docs/QA/stage-7.5/occupied-1024.png',fullPage:true});
 await waiter.screenshot({path:'docs/QA/stage-7.5a/table-12-1024.png',fullPage:true});
});

test('ready Order and pending cash use the existing state in persistent detail',async({page,context})=>{
 await enterGuest(page);
 await placeOrder(page);
 await page.getByRole('button',{name:'Счёт',exact:true}).click();
 await page.getByRole('button',{name:'Свои позиции',exact:true}).click();
 await page.getByRole('radio',{name:'Наличными',exact:true}).click();
 await expect(page.getByText('Ожидает подтверждения',{exact:true}).first()).toBeVisible();
 const waiter=await openWaiterOperations(context,1440);
 await waiter.getByRole('button',{name:'Подтвердить iiko',exact:true}).click();
 await waiter.getByRole('button',{name:'Готово',exact:true}).click();
 await waiter.getByRole('navigation',{name:'Основная навигация официанта'}).getByRole('button',{name:'Зал',exact:true}).click();
 await waiter.getByRole('button',{name:/Стол 12, Ожидаются наличные/}).click();
 const detail=waiter.getByRole('complementary',{name:'Детали стола'});
 await expect(detail.getByText('Готово',{exact:true})).toBeVisible();
 await expect(detail.getByText('Наличные ожидают подтверждения',{exact:true})).toBeVisible();
 await expect(detail.getByText('Осталось',{exact:true})).toBeVisible();
 await waiter.screenshot({path:'docs/QA/stage-7.5/attention-1440.png',fullPage:true});
 await waiter.screenshot({path:'docs/QA/stage-7.5a/attention-1440.png',fullPage:true});
});

test('Stage 7.5A balances the filled two-order Table 12 detail at 1440px',async({page,context})=>{
 await enterGuest(page);
 await addDish(page,0);await addDish(page,1);await submitOrder(page);
 await addDish(page,0);await submitOrder(page);
 const waiter=await context.newPage();await openFloor(waiter,1440);
 await waiter.getByRole('button',{name:/Стол 12, Новый заказ/}).click();
 const detail=waiter.getByRole('complementary',{name:'Детали стола'});
 await expect(detail.getByText('2 760,00 ₽',{exact:true}).first()).toBeVisible();
 await expect(detail.getByRole('heading',{name:'Заказы',exact:true})).toBeVisible();
 const metrics=await waiter.evaluate(()=>{const box=(selector:string)=>{const rect=document.querySelector(selector)!.getBoundingClientRect();return {width:Math.round(rect.width),height:Math.round(rect.height)}};const firstSection=document.querySelectorAll('.waiter-table-section')[0];const myCards=firstSection?[...firstSection.querySelectorAll<HTMLElement>('.waiter-table-card')]:[];const navigation=document.querySelector('.waiter-navigation')!.getBoundingClientRect();return {shell:box('.waiter-shell'),floor:box('.waiter-floor-pane'),detail:box('.waiter-detail-pane'),detailContent:box('.waiter-detail-panel'),free:box('.waiter-table-card[data-empty]:not([data-read-only])'),active:box('.waiter-table-card[data-active]'),readOnly:box('.waiter-table-card[data-read-only]'),navigation:box('.waiter-navigation'),visibleMyTables:myCards.filter(card=>card.getBoundingClientRect().bottom<=navigation.top).length,overflow:document.documentElement.scrollWidth>innerWidth}});
 console.log('STAGE_7_5A_AFTER',JSON.stringify(metrics));
 expect(metrics.floor.width).toBe(527);expect(metrics.detail.width).toBe(699);
 expect(metrics.free.height).toBeLessThan(metrics.active.height);
 expect(metrics.readOnly.height).toBeLessThan(100);
 expect(metrics.navigation.width).toBeLessThanOrEqual(560);
 expect(metrics.overflow).toBe(false);
 await waiter.screenshot({path:'docs/QA/stage-7.5a/after-table-12-1440.png',fullPage:true});
});

test('StaffCall attention remains visible and actionable in desktop detail',async({page,context})=>{
 await enterGuest(page);
 await page.getByRole('button',{name:'Официант',exact:true}).click();
 await page.getByRole('button',{name:'Позвать официанта',exact:true}).click();
 const waiter=await context.newPage();
 await openFloor(waiter,1440);
 await waiter.getByRole('button',{name:/Стол 12, Вызов гостя/}).click();
 const detail=waiter.getByRole('complementary',{name:'Детали стола'});
 await expect(detail.getByText(/Гость ждёт ответа/)).toBeVisible();
 await detail.getByRole('button',{name:'Принять вызов',exact:true}).click();
 await expect(detail.getByText(/Вызов принят и ожидает завершения/)).toBeVisible();
 await expect(waiter.getByRole('heading',{name:'Мои столы',exact:true})).toBeVisible();
});

test('desktop split view renders the neutral state at 1440px without console errors',async({page})=>{
 const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));page.on('console',message=>{if(message.type()==='error')errors.push(message.text())});
 await openFloor(page,1440);
 await expect(page.getByRole('complementary',{name:'Детали стола'})).toBeVisible();
 await page.screenshot({path:'docs/QA/stage-7.5/split-1440.png',fullPage:true});
 expect(errors).toEqual([]);
});

for(const width of [360,375,390,430,480,768,1024,1280,1440])test(`Stage 7.5 has no horizontal overflow at ${width}px`,async({page})=>{
 await openFloor(page,width);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 const split=page.getByRole('complementary',{name:'Детали стола'});
 const navigation=page.getByRole('navigation',{name:'Основная навигация официанта'});
 const navBox=(await navigation.boundingBox())!;
 const firstTable=(await page.getByRole('button',{name:/Стол 7, Свободен/}).boundingBox())!;
 if(width<768){expect(navBox.width).toBe(width);expect(firstTable.height).toBe(148)}
 else{expect(navBox.width).toBeLessThanOrEqual(560);expect(navBox.height).toBeGreaterThanOrEqual(44);expect(firstTable.height).toBeLessThan(90)}
 if(width>=768)await expect(split).toBeVisible();else await expect(split).toBeHidden();
 if(width<768){const short=await page.locator('.waiter-shell button:visible').evaluateAll(buttons=>buttons.filter(button=>button.getBoundingClientRect().height<43.5).map(button=>button.textContent));expect(short).toEqual([])}
});
