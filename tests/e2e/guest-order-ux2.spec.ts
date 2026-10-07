import {mkdirSync} from 'node:fs';
import {test,expect,type Page} from '@playwright/test';
import {seed} from '../../lib/domain/seed';
import {execute,type Command} from '../../lib/domain/engine';
import type {ExecutionStatus,State} from '../../lib/domain/model';
import {getGuestThemePreset} from '../../lib/guest-theme';

const output='docs/QA/guest-order-ux2';
mkdirSync(output,{recursive:true});

type ItemFixture={productId:string;quantity?:number;modifierIds?:string[];comment?:string};

function scenario(){
 let state=seed();
 const run=(command:Command)=>{const result=execute(state,command);state=result.state;return result.result};
 const guestId=run({type:'enterTableByToken',token:'mira-table-12',confirm:true,registered:false}).guestId as string;
 const addOrder=(items:ItemFixture[],status:ExecutionStatus='accepted',createdAt='2026-10-07T19:14:00+03:00')=>{
  run({type:'setCart',guestId,items:items.map(item=>({productId:item.productId,quantity:item.quantity??1,modifierIds:item.modifierIds??[],comment:item.comment??''}))});
  const orderId=run({type:'submitOrder',guestId,key:`order-${state.seq}-${items[0].productId}`}) as string;
  if(status!=='submitted')run({type:'posStatus',orderId,status});
  state.orders.find(order=>order.id===orderId)!.createdAt=createdAt;
  return orderId;
 };
 return {get state(){return state},guestId,addOrder};
}

async function load(page:Page,state:State,guestId:string,theme:'classic'|'dark'|'light'='classic'){
 await page.goto('/demo');
 await page.evaluate(({state,guestId,theme,palette})=>{
  localStorage.setItem('mira-link-demo-v1',JSON.stringify(state));
  localStorage.removeItem('mira-link-user-v1');
  localStorage.setItem('mira-demo-guest-theme',JSON.stringify({preset:theme,palette}));
  sessionStorage.setItem('mira-guest',guestId);
 },{state,guestId,theme,palette:getGuestThemePreset(theme)});
 await page.goto('/demo/guest/order');
 await expect(page.getByRole('heading',{name:'Мой заказ',exact:true})).toBeVisible();
}

test('My Order uses the visit, real POS statuses and read-only item details',async({page})=>{
 test.setTimeout(90000);
 await page.setViewportSize({width:390,height:844});

 let current=scenario();
 await load(page,current.state,current.guestId);
 await expect(page.getByText('Вы ещё ничего не заказали',{exact:true})).toBeVisible();
 await expect(page.getByText('MIRA Restaurant',{exact:true})).toBeVisible();
 await expect(page.getByText('Стол 12',{exact:true})).toBeVisible();
 await expect(page.getByRole('navigation',{name:'Основная навигация гостя'})).toBeVisible();
 await page.screenshot({path:`${output}/01-empty-order-390.png`});
 await page.getByRole('button',{name:'Открыть меню',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Меню',exact:true})).toBeVisible();

 current=scenario();
 current.addOrder([{productId:'p1'}],'in_progress');
 await load(page,current.state,current.guestId);
 await expect(page.getByRole('heading',{name:'Текущий заказ',exact:true})).toBeVisible();
 await expect(page.getByText('1 позиция в работе',{exact:true})).toBeVisible();
 await expect(page.getByRole('img',{name:/Буррата с томатами/})).toBeVisible();
 await expect(page.getByText('Готовится',{exact:true}).first()).toBeVisible();
 await expect(page.locator('.guest-content')).not.toContainText(/order-\d+/);
 await expect(page.getByText('Итого',{exact:true})).toHaveCount(0);
 await expect(page.getByRole('button',{name:'Дозаказать',exact:true})).toBeVisible();
 await expect(page.getByRole('button',{name:/Перейти к счёту/})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(0);
 await page.screenshot({path:`${output}/02-current-order-390.png`});
 await page.getByRole('button',{name:'Дозаказать',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Меню',exact:true})).toBeVisible();
 await expect(page.getByRole('button',{name:'Текущий стол 12',exact:true})).toBeVisible();

 current=scenario();
 current.addOrder([{productId:'p1'}],'in_progress','2026-10-07T19:14:00+03:00');
 current.addOrder([{productId:'p16',modifierIds:['oat'],comment:'Без сахара'}],'accepted','2026-10-07T19:32:00+03:00');
 await load(page,current.state,current.guestId);
 await expect(page.getByRole('heading',{name:'Текущий заказ',exact:true})).toBeVisible();
 await expect(page.getByRole('heading',{name:'Дозаказ',exact:true})).toBeVisible();
 await expect(page.getByText('Готовится',{exact:true}).first()).toBeVisible();
 await expect(page.getByText('Принят кухней',{exact:true}).first()).toBeVisible();
 await page.screenshot({path:`${output}/03-current-and-dorder-390.png`});
 await page.screenshot({path:`${output}/04-mixed-order-statuses-390.png`});

 await page.getByRole('button',{name:'Детали заказа: Капучино',exact:true}).click();
 const details=page.getByRole('dialog');
 await expect(details.getByRole('heading',{name:'Детали заказа',exact:true})).toBeVisible();
 await expect(details.getByText('Овсяное молоко',{exact:true})).toBeVisible();
 await expect(details.getByText('Без сахара',{exact:true})).toBeVisible();
 await expect(details.getByText('Заказ уже отправлен. Изменить эту позицию здесь нельзя.',{exact:true})).toBeVisible();
 await expect(details.getByRole('button',{name:/Увеличить|Уменьшить|В корзину/})).toHaveCount(0);
 await page.screenshot({path:`${output}/08-item-details-390.png`});
 await page.keyboard.press('Escape');

 current=scenario();
 current.addOrder([{productId:'p1'}],'served','2026-10-07T19:14:00+03:00');
 current.addOrder([{productId:'p16'}],'accepted','2026-10-07T19:32:00+03:00');
 await load(page,current.state,current.guestId);
 const served=page.getByRole('button',{name:/Уже подано · 1 позиция/});
 await expect(served).toHaveAttribute('aria-expanded','false');
 await expect(page.getByRole('button',{name:'Детали заказа: Буррата с томатами'})).toHaveCount(0);
 await page.screenshot({path:`${output}/05-served-collapsed-390.png`});
 await served.click();
 await expect(page.getByRole('button',{name:'Детали заказа: Буррата с томатами'})).toBeVisible();
 await page.screenshot({path:`${output}/06-served-expanded-390.png`});

 current=scenario();
 current.addOrder([{productId:'p1'}],'served','2026-10-07T19:14:00+03:00');
 current.addOrder([{productId:'p16'}],'served','2026-10-07T19:32:00+03:00');
 await load(page,current.state,current.guestId);
 await expect(page.getByText('Всё подано',{exact:true})).toBeVisible();
 await expect(page.getByRole('heading',{name:'Текущий заказ',exact:true})).toHaveCount(0);
 await expect(page.getByRole('heading',{name:'Дозаказ',exact:true})).toHaveCount(0);
 await page.screenshot({path:`${output}/07-all-served-390.png`});

 current=scenario();
 current.addOrder([{productId:'p11',modifierIds:['medium'],comment:'Без соли'}],'accepted');
 await load(page,current.state,current.guestId,'dark');
 await expect(page.locator('.guest-theme')).toHaveAttribute('data-theme','dark');
 await page.screenshot({path:`${output}/09-mira-dark-390.png`});
 await page.getByRole('button',{name:'Детали заказа: Стейк рибай',exact:true}).click();
 await expect(page.getByRole('dialog').getByText('Medium',{exact:true})).toBeVisible();
 await expect(page.getByRole('dialog').getByText('Без соли',{exact:true})).toBeVisible();
 await page.keyboard.press('Escape');

 await load(page,current.state,current.guestId,'light');
 await expect(page.locator('.guest-theme')).toHaveAttribute('data-theme','light');
 await page.screenshot({path:`${output}/10-mira-light-390.png`});
 await page.getByRole('button',{name:/Перейти к счёту/}).click();
 await expect(page.getByRole('heading',{name:'Мой счёт',exact:true})).toBeVisible();
});
