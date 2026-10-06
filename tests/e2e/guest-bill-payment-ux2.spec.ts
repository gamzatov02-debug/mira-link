import {mkdirSync} from 'node:fs';
import {test,expect,type Page} from '@playwright/test';
import {seed} from '../../lib/domain/seed';
import {execute} from '../../lib/domain/engine';
import type {State} from '../../lib/domain/model';
import {getGuestThemePreset} from '../../lib/guest-theme';

const output='docs/QA/guest-bill-payment-ux2';
mkdirSync(output,{recursive:true});

function scenario({tipRate=0,paid=0}:{tipRate?:number;paid?:number}={}){
 let state=seed();
 const run=(command:any)=>{const next=execute(state,command);state=next.state;return next.result};
 const guestId=run({type:'enterTableByToken',token:'mira-table-12',confirm:true,registered:true}).guestId as string;
 run({type:'setCart',guestId,items:[{productId:'p1',quantity:1,modifierIds:[],comment:''}]});
 run({type:'submitOrder',guestId,key:'bill-ux-order'});
 if(tipRate)run({type:'setTipCommission',rate:tipRate});
 if(paid){const partId=run({type:'createSplit',guestId,mode:'custom',amount:paid});const paymentId=run({type:'createPaymentIntent',guestId,partId,method:'online'});run({type:'confirmPayment',id:paymentId,source:'payment'})}
 return {state,guestId};
}

async function load(page:Page,state:State,guestId:string,theme:'classic'|'dark'|'light'='classic'){
 await page.goto('/demo');
 await page.evaluate(({state,guestId,theme,palette})=>{localStorage.setItem('mira-link-demo-v1',JSON.stringify(state));localStorage.setItem('mira-link-user-v1','u1');localStorage.setItem('mira-demo-guest-theme',JSON.stringify({preset:theme,palette}));sessionStorage.setItem('mira-guest',guestId)}, {state,guestId,theme,palette:getGuestThemePreset(theme)});
 await page.goto('/demo/guest/bill');
 await expect(page.getByRole('heading',{name:'Мой счёт',exact:true})).toBeVisible();
 await expect(page.getByRole('radio',{name:'Онлайн',exact:true})).toBeVisible();
}

const paymentButton=(page:Page)=>page.locator('[aria-label="Итог и оплата"]').getByRole('button');

test('My Bill payable cases A-J and mobile orchestration',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 let current=scenario();
 await load(page,current.state,current.guestId);
 await expect(paymentButton(page)).toHaveText(/Оплатить 890,00\s*₽/);
 await expect(page.getByText('Комиссия за чаевые',{exact:true})).toHaveCount(0);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(0);
 await page.screenshot({path:`${output}/01-base-no-tips-390.png`});

 await page.getByRole('button',{name:'10%',exact:true}).click();
 await expect(paymentButton(page)).toHaveText(/Оплатить 979,00\s*₽/);
 await expect(page.getByText('Оплатить комиссию сервиса за чаевые',{exact:true})).toHaveCount(0);
 await page.getByRole('heading',{name:'Чаевые официанту',exact:true}).scrollIntoViewIfNeeded();
 await page.screenshot({path:`${output}/02-tips-online-390.png`});

 current=scenario({tipRate:.1});
 await load(page,current.state,current.guestId);
 await page.getByRole('spinbutton',{name:'Другая сумма чаевых, ₽',exact:true}).fill('100');
 await expect(page.getByText('Оплатить комиссию сервиса за чаевые',{exact:true})).toBeVisible();
 await expect(paymentButton(page)).toHaveText(/Оплатить 1\s000,00\s*₽/);
 await page.getByRole('heading',{name:'Чаевые официанту',exact:true}).scrollIntoViewIfNeeded();
 await page.screenshot({path:`${output}/03-tip-commission-control-390.png`});
 await page.getByText('Оплатить комиссию сервиса за чаевые',{exact:true}).click();
 await expect(paymentButton(page)).toHaveText(/Оплатить 990,00\s*₽/);
 await expect(page.getByText(/Комиссия 10,00\s*₽ будет удержана из чаевых/)).toBeVisible();

 await page.getByRole('radio',{name:'Наличными',exact:true}).click();
 await expect(paymentButton(page)).toHaveText(/Передать 990,00\s*₽ наличными/);
 await expect(page.getByText('Оплатить комиссию сервиса за чаевые',{exact:true})).toHaveCount(0);
 await expect(page.getByText('Чаевые передайте официанту наличными.',{exact:true})).toBeVisible();
 await page.getByRole('heading',{name:'Способ оплаты',exact:true}).scrollIntoViewIfNeeded();
 await page.screenshot({path:`${output}/04-cash-tips-390.png`});
 await page.getByRole('radio',{name:'Онлайн',exact:true}).click();
 await expect(page.getByText('Оплатить комиссию сервиса за чаевые',{exact:true})).toBeVisible();
 await expect(paymentButton(page)).toHaveText(/Оплатить 990,00\s*₽/);

 current=scenario();
 await load(page,current.state,current.guestId);
 await page.getByRole('spinbutton',{name:'Использовать бонусы, ₽',exact:true}).fill('445');
 await page.getByRole('spinbutton',{name:'Другая сумма чаевых, ₽',exact:true}).fill('100');
 await expect(paymentButton(page)).toHaveText(/Оплатить 545,00\s*₽/);
 await page.getByRole('heading',{name:'Бонусы MIRA',exact:true}).scrollIntoViewIfNeeded();
 await page.screenshot({path:`${output}/05-bonuses-applied-390.png`});

 current=scenario();
 await load(page,current.state,current.guestId);
 await page.getByRole('checkbox',{name:/^Разделить счёт/}).click();
 await page.getByRole('heading',{name:'Как разделить?',exact:true}).scrollIntoViewIfNeeded();
 await page.screenshot({path:`${output}/06-split-active-390.png`});
 await page.getByRole('spinbutton',{name:'Своя сумма, ₽',exact:true}).fill('100');
 await page.getByRole('button',{name:'Выбрать',exact:true}).click();
 await page.getByRole('spinbutton',{name:'Другая сумма чаевых, ₽',exact:true}).fill('10');
 await expect(paymentButton(page)).toHaveText(/Оплатить 110,00\s*₽/);

 current=scenario({paid:10000});
 await load(page,current.state,current.guestId);
 await expect(page.getByText('Уже оплачено',{exact:true})).toBeVisible();
 await expect(page.getByText('790,00 ₽',{exact:true}).first()).toBeVisible();
 await expect(paymentButton(page)).toHaveText(/Оплатить 790,00\s*₽/);
 await page.screenshot({path:`${output}/07-partial-payment-390.png`});

 current=scenario();
 await load(page,current.state,current.guestId,'dark');
 await expect(page.locator('.guest-theme')).toHaveAttribute('data-theme','dark');
 await page.screenshot({path:`${output}/08-mira-dark-390.png`});
 await load(page,current.state,current.guestId,'light');
 await expect(page.locator('.guest-theme')).toHaveAttribute('data-theme','light');
 await page.screenshot({path:`${output}/09-mira-light-390.png`});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(0);
});
