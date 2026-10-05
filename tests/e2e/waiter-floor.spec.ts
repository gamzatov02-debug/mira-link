import {expect,test,type Page} from '@playwright/test';

async function openFloor(page:Page){
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

test('Stage 7.4 Floor uses zones and makes assigned tables the primary content',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await openFloor(page);
 await expect(page.getByText('Смена открыта',{exact:true})).toBeVisible();
 const zones=page.getByRole('navigation',{name:'Зоны зала'});
 await expect(zones.getByRole('button',{name:'Все',exact:true})).toBeVisible();
 await expect(zones.getByRole('button',{name:'Основной зал',exact:true})).toBeVisible();
 await expect(zones.getByRole('button',{name:/Терраса/})).toBeVisible();
 await expect(page.getByRole('heading',{name:'Мои столы',exact:true})).toBeVisible();
 await expect(page.getByRole('button',{name:/Стол 7/})).toBeVisible();
 await expect(page.getByRole('button',{name:/Стол 1.*только просмотр/})).toBeVisible();
 await expect(page.getByText('Текущие операции демо',{exact:true})).toHaveCount(0);
 await expect(page.getByText('Дополнительные операции демо',{exact:true})).toHaveCount(0);
 await expect(page.getByRole('heading',{name:'Вызовы',exact:true})).toHaveCount(0);
 await expect(page.getByRole('heading',{name:'Наличные',exact:true})).toHaveCount(0);
 await expect(page.getByText('Всё спокойно',{exact:true})).toBeVisible();
 expect(await page.locator('.waiter-priority').evaluate(node=>node.getBoundingClientRect().height)).toBeLessThanOrEqual(44);
 await page.screenshot({path:'docs/QA/stage-7.4/floor-390-normal.png',fullPage:true});
});

test('Table Detail opens and keeps unassigned tables read-only',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await openFloor(page);
 const before=await page.evaluate(()=>localStorage.getItem('mira-link-demo-v1'));
 await page.getByRole('button',{name:/Стол 1.*только просмотр/}).click();
 const detail=page.getByRole('dialog',{name:'Стол 1',exact:true});
 await expect(detail).toBeVisible();
 await expect(detail.getByText('Основной зал · Только просмотр',{exact:true})).toBeVisible();
 await expect(detail.getByRole('button',{name:'Создать заказ',exact:true})).toHaveCount(0);
 await expect(detail.getByRole('button',{name:'Открыть заказ',exact:true})).toHaveCount(0);
 const after=await page.evaluate(()=>localStorage.getItem('mira-link-demo-v1'));
 expect(after).toBe(before);
 await detail.getByRole('button',{name:'Закрыть',exact:true}).click();
 await page.getByRole('button',{name:/Стол 7/}).click();
 const ownDetail=page.getByRole('dialog',{name:'Стол 7',exact:true});
 await expect(ownDetail).toBeVisible();
 await expect(ownDetail.getByText('Активного посещения и заказов нет.',{exact:true})).toBeVisible();
 await expect(ownDetail.getByRole('button',{name:'Создать заказ',exact:true})).toBeVisible();
 await page.screenshot({path:'docs/QA/stage-7.4/table-detail-390.png',fullPage:true});
});

test('Guest StaffCall becomes visible on the assigned Table and can be handled',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/demo/guest/home');
 await page.getByRole('button',{name:'Сканировать QR стола №12',exact:true}).click();
 await page.getByRole('button',{name:'Официант',exact:true}).click();
 await page.getByRole('button',{name:'Позвать официанта',exact:true}).click();
 await openFloor(page);
 const table=page.getByRole('button',{name:/Стол 12, Вызов гостя/});
 await expect(table).toBeVisible();
 await expect(page.getByText(/Требуется внимание · 1/)).toBeVisible();
 await page.screenshot({path:'docs/QA/stage-7.4/floor-390-attention.png',fullPage:true});
 await table.click();
 await expect(page.getByRole('dialog',{name:'Стол 12',exact:true})).toContainText('Гость ждёт ответа.');
 await page.getByRole('button',{name:'Принять вызов',exact:true}).click();
 await expect(page.getByRole('dialog',{name:'Стол 12',exact:true}).getByText(/Вызов принят и ожидает завершения/)).toBeVisible();
 await page.getByRole('button',{name:'Завершить вызов',exact:true}).click();
 await expect(page.getByRole('dialog',{name:'Стол 12',exact:true})).toHaveCount(0);
 await expect(page.getByRole('button',{name:/Стол 12, Занят/})).toBeVisible();
});

for(const width of [360,375,390,430,480,1440])test(`Stage 7.4 Floor responsive metrics at ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:900});
 await openFloor(page);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 if(width<768){const controls=await page.locator('.waiter-shell button:visible').evaluateAll(buttons=>buttons.map(button=>({label:button.getAttribute('aria-label')||button.textContent?.trim(),height:button.getBoundingClientRect().height})).filter(item=>item.height<43.5));expect(controls).toEqual([])}
 const metrics=await page.evaluate(()=>{const rect=(selector:string)=>{const node=document.querySelector(selector)!;const box=node.getBoundingClientRect();return {y:Math.round(box.y),width:Math.round(box.width),height:Math.round(box.height)}};return {content:rect('.waiter-content'),header:rect('.waiter-header'),summary:rect('.waiter-summary'),priority:rect('.waiter-priority'),firstTable:rect('.waiter-table-card'),bottomNav:rect('.waiter-navigation'),columns:getComputedStyle(document.querySelector('.waiter-table-grid')!).gridTemplateColumns.split(' ').length,overflow:document.documentElement.scrollWidth>innerWidth}});
 console.log(`STAGE_7_4_METRICS_${width}`,JSON.stringify(metrics));
 if([480,1440].includes(width))await page.screenshot({path:`docs/QA/stage-7.4/floor-${width}.png`,fullPage:true});
});
