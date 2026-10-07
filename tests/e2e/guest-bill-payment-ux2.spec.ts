import {mkdirSync} from 'node:fs';
import {test,expect,type Page} from '@playwright/test';
import {seed} from '../../lib/domain/seed';
import {execute} from '../../lib/domain/engine';
import type {State} from '../../lib/domain/model';
import {getGuestThemePreset} from '../../lib/guest-theme';

const output='docs/QA/guest-bill-payment-ux2-2';
mkdirSync(output,{recursive:true});

function scenario({tipRate=0,paid=0,quantity=1}:{tipRate?:number;paid?:number;quantity?:number}={}){
 let state=seed();
 const run=(command:any)=>{const next=execute(state,command);state=next.state;return next.result};
 const guestId=run({type:'enterTableByToken',token:'mira-table-12',confirm:true,registered:true}).guestId as string;
 run({type:'setCart',guestId,items:[{productId:'p1',quantity,modifierIds:[],comment:''}]});
 run({type:'submitOrder',guestId,key:'bill-ux-order'});
 if(tipRate)run({type:'setTipCommission',rate:tipRate});
 if(paid){const partId=run({type:'createSplit',guestId,mode:'custom',amount:paid});const paymentId=run({type:'createPaymentIntent',guestId,partId,method:'online'});run({type:'confirmPayment',id:paymentId,source:'payment'})}
 return {state,guestId};
}

function partialPaymentScenario(){
 let state=seed();
 const run=(command:any)=>{const next=execute(state,command);state=next.state;return next.result};
 const guestId=run({type:'enterTableByToken',token:'mira-table-12',confirm:true,registered:true}).guestId as string;
 run({type:'updateProduct',source:'pos',id:'p11',price:290000});
 run({type:'setCart',guestId,items:[{productId:'p11',quantity:1,modifierIds:['medium'],comment:''},{productId:'p1',quantity:1,modifierIds:[],comment:''}]});
 run({type:'submitOrder',guestId,key:'bill-nav-partial-order'});
 const partId=run({type:'createSplit',guestId,mode:'custom',amount:290000});
 const paymentId=run({type:'createPaymentIntent',guestId,partId,method:'online'});
 run({type:'confirmPayment',id:paymentId,source:'payment'});
 return {state,guestId};
}

async function load(page:Page,state:State,guestId:string,theme:'classic'|'dark'|'light'='classic'){
 await page.goto('/demo');
 await page.evaluate(({state,guestId,theme,palette})=>{localStorage.setItem('mira-link-demo-v1',JSON.stringify(state));localStorage.setItem('mira-link-user-v1','u1');localStorage.setItem('mira-demo-guest-theme',JSON.stringify({preset:theme,palette}));sessionStorage.setItem('mira-guest',guestId)}, {state,guestId,theme,palette:getGuestThemePreset(theme)});
 await page.goto('/demo/guest/bill');
 await expect(page.getByRole('heading',{name:'Мой счёт',exact:true})).toBeVisible();
 await expect(page.getByRole('radio',{name:'Онлайн',exact:true})).toBeVisible();
 await expect(page.getByRole('navigation',{name:'Основная навигация гостя'})).toBeVisible();
}

const paymentButton=(page:Page)=>page.locator('[aria-label="Итог и оплата"]').getByRole('button');

test('My Bill payable cases A-J and mobile orchestration',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 let current=scenario();
 await load(page,current.state,current.guestId);
 await expect(paymentButton(page)).toHaveText(/Оплатить 890,00\s*₽/);
 await expect(page.getByText('Комиссия за чаевые',{exact:true})).toHaveCount(0);
 await expect(page.getByRole('button',{name:/^Разделить счёт/})).toHaveAttribute('aria-expanded','false');
 await expect(page.getByRole('button',{name:/^Разделить счёт/})).not.toContainText('890');
 await expect(page.getByRole('button',{name:/^Бонусы MIRA/})).toHaveAttribute('aria-expanded','false');
 const collapsedRows=await Promise.all([page.getByRole('button',{name:/^Разделить счёт/}),page.getByRole('button',{name:/^Бонусы MIRA/})].map(locator=>locator.evaluate(element=>element.getBoundingClientRect().height)));
 expect(Math.abs(collapsedRows[0]-collapsedRows[1])).toBeLessThanOrEqual(1);
 await expect(page.getByRole('heading',{name:'Чаевые официанту',exact:true})).toBeVisible();
 await expect(page.getByRole('button',{name:'Сканировать QR',exact:true})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(0);
 await expect(paymentButton(page)).toHaveCSS('min-height','48px');
 await expect(paymentButton(page)).toHaveCSS('color','rgb(17, 27, 22)');
 await expect(paymentButton(page).locator('span')).toHaveCSS('color','rgb(17, 27, 22)');
 expect(await page.locator('[aria-label="Итог и оплата"]').evaluate(element=>element.getBoundingClientRect().height)).toBeLessThanOrEqual(60);
 expect(await page.getByRole('spinbutton',{name:'Другая сумма чаевых, ₽',exact:true}).evaluate(element=>element.getBoundingClientRect().height)).toBe(44);
 expect(await page.getByRole('radio',{name:'Онлайн',exact:true}).evaluate(element=>element.closest('label')?.getBoundingClientRect().height)).toBeLessThanOrEqual(56);
 await page.screenshot({path:`${output}/01-top-current-bill-390.png`});
 await page.getByRole('button',{name:'Назад к посещению',exact:true}).click();
 await expect(page.getByRole('navigation',{name:'Основная навигация гостя'})).toBeVisible();
 await load(page,current.state,current.guestId);

 await page.getByRole('button',{name:/^Разделить счёт/}).click();
 await expect(page.getByRole('button',{name:/^Разделить счёт/})).toHaveAttribute('aria-expanded','true');
 await page.getByRole('heading',{name:'Как разделить?',exact:true}).scrollIntoViewIfNeeded();
 await page.getByRole('button',{name:/^Разделить счёт/}).click();

 await page.getByRole('button',{name:/^Бонусы MIRA/}).click();
 await expect(page.getByRole('spinbutton',{name:'Использовать бонусы, ₽',exact:true})).toBeVisible();

 await page.getByRole('button',{name:'10%',exact:true}).click();
 await expect(paymentButton(page)).toHaveText(/Оплатить 979,00\s*₽/);
 await expect(page.getByText('Оплатить комиссию сервиса за чаевые',{exact:true})).toHaveCount(0);
 await page.getByRole('heading',{name:'Чаевые официанту',exact:true}).scrollIntoViewIfNeeded();

 current=scenario({tipRate:.1});
 await load(page,current.state,current.guestId);
 await page.getByRole('spinbutton',{name:'Другая сумма чаевых, ₽',exact:true}).fill('100');
 await expect(page.getByText('Оплатить комиссию сервиса за чаевые',{exact:true})).toBeVisible();
 await expect(paymentButton(page)).toHaveText(/Оплатить 1\s000,00\s*₽/);
 await page.getByRole('heading',{name:'Способ оплаты',exact:true}).evaluate(element=>element.scrollIntoView({block:'center'}));
 await page.waitForTimeout(250);
 await page.screenshot({path:`${output}/02-tips-payment-methods-390.png`});
 await page.getByRole('heading',{name:'К оплате сейчас',exact:true}).scrollIntoViewIfNeeded();
 const breakdownAmount=page.getByText('Итого к оплате',{exact:true}).locator('..').locator('strong');
 const [breakdownSize,stickySize]=await Promise.all([breakdownAmount,paymentButton(page).locator('..').locator('strong')].map(locator=>locator.evaluate(element=>Number.parseFloat(getComputedStyle(element).fontSize))));
 expect(breakdownSize).toBeLessThan(stickySize);
 await page.screenshot({path:`${output}/03-bottom-breakdown-sticky-390.png`});
 await page.getByText('Оплатить комиссию сервиса за чаевые',{exact:true}).click();
 await expect(paymentButton(page)).toHaveText(/Оплатить 990,00\s*₽/);
 await expect(page.getByText(/Комиссия 10,00\s*₽ будет удержана из чаевых/)).toBeVisible();

 await page.getByRole('radio',{name:'Наличными',exact:true}).click();
 await expect(paymentButton(page)).toHaveText(/Передать 990,00\s*₽ наличными/);
 await expect(page.getByText('Оплатить комиссию сервиса за чаевые',{exact:true})).toHaveCount(0);
 await expect(page.getByText('Чаевые передайте официанту наличными.',{exact:true})).toBeVisible();
 await page.getByRole('heading',{name:'Способ оплаты',exact:true}).scrollIntoViewIfNeeded();
 await page.getByRole('radio',{name:'Онлайн',exact:true}).click();
 await expect(page.getByText('Оплатить комиссию сервиса за чаевые',{exact:true})).toBeVisible();
 await expect(paymentButton(page)).toHaveText(/Оплатить 990,00\s*₽/);

 current=scenario();
 await load(page,current.state,current.guestId,'light');
 await page.getByRole('button',{name:/^Бонусы MIRA/}).click();
 await page.getByRole('spinbutton',{name:'Использовать бонусы, ₽',exact:true}).fill('445');
 await page.getByRole('spinbutton',{name:'Другая сумма чаевых, ₽',exact:true}).fill('100');
 await expect(paymentButton(page)).toHaveText(/Оплатить 545,00\s*₽/);
 await page.getByRole('button',{name:/^Бонусы MIRA/}).scrollIntoViewIfNeeded();
 await page.screenshot({path:`${output}/05-bonuses-active-light-390.png`});

 current=scenario();
 await load(page,current.state,current.guestId);
 await page.getByRole('button',{name:/^Разделить счёт/}).click();
 await page.getByRole('spinbutton',{name:'Своя сумма, ₽',exact:true}).fill('100');
 await page.getByRole('button',{name:'Выбрать',exact:true}).click();
 await expect(page.getByText('Ваша часть счёта',{exact:true})).toBeVisible();
 await expect(page.getByText('Ваша часть счёта',{exact:true}).locator('..').getByText('100,00 ₽',{exact:true})).toBeVisible();
 await page.getByText('Ваша часть счёта',{exact:true}).evaluate(element=>element.scrollIntoView({block:'center'}));
 await page.waitForTimeout(250);
 await page.screenshot({path:`${output}/04-split-active-390.png`});
 await page.getByRole('spinbutton',{name:'Другая сумма чаевых, ₽',exact:true}).fill('10');
 await expect(paymentButton(page)).toHaveText(/Оплатить 110,00\s*₽/);

 current=scenario({paid:89000,quantity:2});
 await load(page,current.state,current.guestId);
 await expect(page.getByText('Уже оплачено',{exact:true})).toBeVisible();
 await expect(page.getByText('1 780,00 ₽',{exact:true}).first()).toBeVisible();
 await expect(page.getByText('890,00 ₽',{exact:true}).first()).toBeVisible();
 await expect(paymentButton(page)).toHaveText(/Оплатить 890,00\s*₽/);

 current=scenario();
 await load(page,current.state,current.guestId,'dark');
 await expect(page.locator('.guest-theme')).toHaveAttribute('data-theme','dark');
 await expect(paymentButton(page)).toHaveCSS('color','rgb(25, 19, 11)');
 await expect(paymentButton(page).locator('span')).toHaveCSS('color','rgb(25, 19, 11)');
 await page.screenshot({path:`${output}/06-dark-theme-390.png`});
 await load(page,current.state,current.guestId,'light');
 await expect(page.locator('.guest-theme')).toHaveAttribute('data-theme','light');
 await expect(paymentButton(page)).toHaveCSS('color','rgb(25, 19, 11)');
 await expect(paymentButton(page).locator('span')).toHaveCSS('color','rgb(25, 19, 11)');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(0);

 current=scenario();
 await load(page,current.state,current.guestId);
 await paymentButton(page).click();
 await page.getByRole('button',{name:'Симулировать успешную оплату',exact:true}).click();
 await expect(page.getByText('Оплата прошла',{exact:true})).toBeVisible();
 await expect(page.getByRole('navigation',{name:'Основная навигация гостя'})).toBeVisible();
});

test('Bill keeps canonical navigation below a stationary payment bar',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 const current=partialPaymentScenario();
 await load(page,current.state,current.guestId);

 const nav=page.getByRole('navigation',{name:'Основная навигация гостя'});
 const sticky=page.locator('[aria-label="Итог и оплата"]');
 const qr=page.getByRole('button',{name:'Сканировать QR',exact:true});
 await expect(page.getByText('Сумма заказа',{exact:true}).first().locator('..')).toContainText('3 790,00 ₽');
 await expect(page.getByText('Уже оплачено',{exact:true}).locator('..')).toContainText('2 900,00 ₽');
 await expect(page.getByText('Осталось',{exact:true}).first().locator('..')).toContainText('890,00 ₽');
 await expect(paymentButton(page)).toHaveText(/Оплатить 890,00\s*₽/);
 await expect(nav).toBeVisible();
 await expect(qr).toBeVisible();

 const layerMetrics=async()=>page.evaluate(()=>{
  const nav=document.querySelector<HTMLElement>('[aria-label="Основная навигация гостя"]')!;
  const sticky=document.querySelector<HTMLElement>('[aria-label="Итог и оплата"]')!;
  const qr=document.querySelector<HTMLElement>('[aria-label="Сканировать QR"]')!;
  const navRect=nav.getBoundingClientRect(),stickyRect=sticky.getBoundingClientRect(),qrRect=qr.getBoundingClientRect();
  return {navTop:navRect.top,navBottom:navRect.bottom,stickyTop:stickyRect.top,stickyBottom:stickyRect.bottom,qrTop:qrRect.top,navPosition:getComputedStyle(nav).position,stickyPosition:getComputedStyle(sticky).position};
 });
 const initial=await layerMetrics();
 expect(initial.navPosition).toBe('fixed');
 expect(initial.stickyPosition).toBe('fixed');
 expect(Math.abs(initial.navBottom-844)).toBeLessThanOrEqual(1);
 expect(initial.stickyBottom).toBeLessThanOrEqual(initial.qrTop+1);
 expect(initial.stickyBottom).toBeLessThan(initial.navTop);

 await page.getByRole('button',{name:/^Разделить счёт/}).click();
 await expect(nav).toBeVisible();
 await page.getByRole('button',{name:/^Разделить счёт/}).click();
 await page.getByRole('button',{name:/^Бонусы MIRA/}).click();
 await expect(nav).toBeVisible();
 await page.getByRole('button',{name:'10%',exact:true}).click();
 await page.getByRole('radio',{name:'Наличными',exact:true}).click();
 await expect(nav).toBeVisible();
 await expect(qr).toBeVisible();

 const maxScroll=await page.evaluate(()=>document.documentElement.scrollHeight-innerHeight);
 for(const y of [maxScroll,Math.round(maxScroll/2),0,maxScroll]){
  await page.evaluate(scrollY=>scrollTo(0,scrollY),y);
  await page.evaluate(()=>new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve()))));
  const currentMetrics=await layerMetrics();
  expect(Math.abs(currentMetrics.navTop-initial.navTop)).toBeLessThanOrEqual(1);
  expect(Math.abs(currentMetrics.stickyTop-initial.stickyTop)).toBeLessThanOrEqual(1);
 }
 const finalTotal=page.getByText('Итого к оплате',{exact:true}).locator('..');
 const finalBottom=await finalTotal.evaluate(element=>element.getBoundingClientRect().bottom);
 const stickyTop=await sticky.evaluate(element=>element.getBoundingClientRect().top);
 expect(finalBottom).toBeLessThanOrEqual(stickyTop);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(0);

 await page.getByRole('button',{name:'Рядом',exact:true}).click();
 await expect(page.getByRole('button',{name:'Рядом',exact:true})).toHaveAttribute('aria-current','page');
 await page.getByRole('button',{name:'Главная',exact:true}).click();
 await page.getByRole('button',{name:/^Счёт/}).first().click();
 await expect(page.getByRole('heading',{name:'Мой счёт',exact:true})).toBeVisible();
 await expect(page.getByText('Уже оплачено',{exact:true}).locator('..')).toContainText('2 900,00 ₽');
 await expect(paymentButton(page)).toHaveText(/Оплатить 890,00\s*₽/);

 await page.getByRole('button',{name:'Сканировать QR',exact:true}).click();
 await expect(page.locator('.guest-camera-sheet')).toBeVisible();
 await page.keyboard.press('Escape');
 await expect(page.locator('.guest-camera-sheet')).not.toBeVisible();
});
