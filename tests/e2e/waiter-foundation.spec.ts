import {expect,test} from '@playwright/test';

test('WTR-001 separates employee authentication from shift start and restaurant sessions',async({page})=>{
 await page.goto('/demo/waiter');
 await expect(page.getByRole('heading',{name:'Рабочая смена',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Войти как Александр',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Здравствуйте, Александр',exact:true})).toBeVisible();
 const afterLogin=await page.evaluate(()=>JSON.parse(localStorage.getItem('mira-link-demo-v1')!));
 expect(afterLogin.employeeAuthContexts).toHaveLength(1);
 expect(afterLogin.shifts).toHaveLength(0);
 expect(afterLogin.sessions).toHaveLength(0);
 await page.getByRole('button',{name:'Начать смену',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Зал',exact:true})).toBeVisible();
 const afterStart=await page.evaluate(()=>JSON.parse(localStorage.getItem('mira-link-demo-v1')!));
 expect(afterStart.employeeAuthContexts).toHaveLength(1);
 expect(afterStart.shifts).toHaveLength(1);
 expect(afterStart.shifts[0].status).toBe('open');
 expect(afterStart.sessions).toHaveLength(0);
});

test('WaiterShell exposes the approved primary navigation and preserves the legacy operations',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/demo/waiter');
 await page.getByRole('button',{name:'Войти как Александр',exact:true}).click();
 await page.getByRole('button',{name:'Начать смену',exact:true}).click();
 const nav=page.getByRole('navigation',{name:'Основная навигация официанта'});
 for(const [label,route,heading] of [['Зал','floor','Зал'],['Заказы','orders','Заказы'],['Вызовы','calls','Вызовы'],['Ещё','more','Ещё']] as const){await nav.getByRole('button',{name:label,exact:true}).click();await expect(page).toHaveURL(new RegExp(`/demo/waiter/${route}$`));await expect(page.getByRole('heading',{name:heading,exact:true})).toBeVisible()}
 await nav.getByRole('button',{name:'Ещё',exact:true}).click();
 await expect(page.getByText('Дополнительные операции демо',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Выйти из аккаунта',exact:true}).click();
 await expect(page.getByRole('dialog',{name:'Выйти с открытой сменой?',exact:true})).toBeVisible();
 await expect(page.getByText('Выход не завершает смену и не передаёт задачи другому сотруднику.',{exact:true})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:'docs/QA/stage-7.3/waiter-shell-390.png',fullPage:true});
});

for(const width of [360,480,1440])test(`Waiter UI foundation has no horizontal overflow at ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:900});
 await page.goto('/demo/waiter');
 await page.getByRole('button',{name:'Войти как Александр',exact:true}).click();
 await page.getByRole('button',{name:'Начать смену',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Зал',exact:true})).toBeVisible();
 const tableHeight=()=>page.locator('.waiter-table-card').first().evaluate(node=>node.getBoundingClientRect().height);
 await expect.poll(tableHeight).toBeGreaterThanOrEqual(width<768?148:68);
 if(width>=768)expect(await tableHeight()).toBeLessThan(90)
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 if(width<768){const short=await page.locator('.waiter-shell button:visible').evaluateAll(buttons=>buttons.filter(button=>button.getBoundingClientRect().height<43.5).map(button=>button.textContent));expect(short).toEqual([])}
 await page.screenshot({path:`docs/QA/stage-7.3/waiter-shell-${width}.png`,fullPage:true});
});
