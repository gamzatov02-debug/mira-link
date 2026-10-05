import {expect,test,type Page} from '@playwright/test';

const qa='docs/QA/waiter-mobile-first';
const viewports=[{width:360,height:800},{width:375,height:812},{width:390,height:844},{width:393,height:852},{width:430,height:932},{width:480,height:900},{width:768,height:900},{width:1024,height:900},{width:1280,height:900},{width:1440,height:900}];

async function openWaiter(page:Page,section:'Зал'|'Заказы'|'Вызовы'='Зал'){
 await page.goto('/demo/waiter');
 const navigation=page.getByRole('navigation',{name:'Основная навигация официанта'});
 const login=page.getByRole('button',{name:'Войти как Александр',exact:true});
 await expect(login.or(navigation)).toBeVisible();
 if(await login.isVisible())await login.click();
 const start=page.getByRole('button',{name:'Начать смену',exact:true});
 await expect(start.or(navigation)).toBeVisible();
 if(await start.isVisible())await start.click();
 await expect(navigation).toBeVisible();
 await navigation.getByRole('button',{name:section==='Зал'?'Зал':new RegExp(`^${section}`)}).click();
 await expect(page.getByRole('heading',{name:section,exact:true})).toBeVisible();
}

async function enterGuest(page:Page){
 await page.goto('/demo/guest/home');
 const scan=page.getByRole('button',{name:'Сканировать QR стола №12',exact:true});
 if(await scan.isVisible())await scan.click();
}

async function placeOrder(page:Page){
 await page.getByRole('navigation',{name:'Основная навигация гостя'}).getByRole('button',{name:'Меню',exact:true}).click();
 await page.getByRole('button',{name:'Выбрать блюдо',exact:true}).first().click();
 await page.getByRole('button',{name:'В корзину',exact:true}).click();
 await page.getByRole('button',{name:/^Заказ/}).click();
 await page.getByRole('button',{name:'Оформить заказ',exact:true}).click();
 await expect(page.getByText('Заказ отправлен',{exact:true}).first()).toBeVisible();
}

async function createCall(page:Page){
 await page.getByRole('button',{name:'Официант',exact:true}).click();
 await page.getByRole('button',{name:'Позвать официанта',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Официант · Стол 12',exact:true})).toBeVisible();
}

async function metrics(page:Page,detailSelector:string){
 return page.evaluate(detailSelector=>{
  const box=(selector:string)=>{const node=document.querySelector<HTMLElement>(selector);if(!node)return null;const rect=node.getBoundingClientRect();return {left:Math.round(rect.left),right:Math.round(rect.right),top:Math.round(rect.top),bottom:Math.round(rect.bottom),width:Math.round(rect.width),height:Math.round(rect.height)}};
  const shell=document.querySelector<HTMLElement>('.waiter-shell')!;
  const nav=document.querySelector<HTMLElement>('.waiter-navigation')!;
  const detail=document.querySelector<HTMLElement>(detailSelector);
  const grid=document.querySelector<HTMLElement>('.waiter-table-grid');
  const buttons=[...document.querySelectorAll<HTMLElement>('.waiter-shell button')].filter(button=>{const rect=button.getBoundingClientRect();return rect.width>0&&rect.height>0});
  const touchTargets=buttons.map(button=>{const rect=button.getBoundingClientRect();return {label:button.getAttribute('aria-label')||button.textContent?.trim()||button.className,width:Math.round(rect.width),height:Math.round(rect.height),minimum:Math.round(Math.min(rect.width,rect.height))}});
  const touch=touchTargets.map(target=>target.minimum);
  const shellBox=shell.getBoundingClientRect(),navBox=nav.getBoundingClientRect();
  return {viewport:innerWidth,appWidth:Math.round(shellBox.width),appLeft:Math.round(shellBox.left),columns:grid?getComputedStyle(grid).gridTemplateColumns.split(' ').length:1,detailMode:detail&&getComputedStyle(detail).display!=='none'?'persistent':'bottom-sheet',navigationMode:Math.abs(navBox.width-shellBox.width)<2?'mobile-full':'desktop-compact',horizontalOverflow:document.documentElement.scrollWidth-innerWidth,appClipping:Math.max(0,-shellBox.left)+Math.max(0,shellBox.right-innerWidth),bottomNavHeight:Math.round(navBox.height),minimumTouchTarget:Math.round(Math.min(...touch)),smallTouchTargets:touchTargets.filter(target=>target.minimum<44),bottomClearance:Math.round(parseFloat(getComputedStyle(shell).paddingBottom)),demoHeader:box('.demo-header'),demoNavOverflow:(()=>{const demoNav=document.querySelector<HTMLElement>('.demo-header nav');return demoNav?Math.max(0,Math.round(demoNav.scrollWidth-demoNav.clientWidth)):0})()};
 },detailSelector);
}

function verify(measurement:Awaited<ReturnType<typeof metrics>>,width:number){
 expect(measurement.horizontalOverflow).toBe(0);
 expect(measurement.appClipping).toBe(0);
 expect(measurement.minimumTouchTarget,JSON.stringify(measurement.smallTouchTargets)).toBeGreaterThanOrEqual(44);
 expect(measurement.bottomClearance).toBeGreaterThanOrEqual(measurement.bottomNavHeight);
 if(width<768){expect(measurement.appWidth).toBe(width);expect(measurement.detailMode).toBe('bottom-sheet');expect(measurement.navigationMode).toBe('mobile-full')}
 else expect(measurement.detailMode).toBe('persistent');
}

test('Waiter Floor uses the physical mobile viewport and one 768px breakpoint',async({page})=>{
 await page.setViewportSize(viewports[0]);await openWaiter(page);
 for(const viewport of viewports){
  await page.setViewportSize(viewport);await page.waitForTimeout(50);
  const measurement=await metrics(page,'.waiter-detail-pane');verify(measurement,viewport.width);
  expect(measurement.columns).toBe(viewport.width<768?2:viewport.width>=1180?3:2);
  console.log('WAITER_MOBILE_FIRST_FLOOR',JSON.stringify(measurement));
  if([360,390,430,768,1440].includes(viewport.width))await page.screenshot({path:`${qa}/floor-${viewport.width}.png`});
 }
});

test('Waiter Orders keeps a full-width mobile list and BottomSheet detail',async({page,context})=>{
 await enterGuest(page);await placeOrder(page);
 const waiter=await context.newPage();await waiter.setViewportSize(viewports[0]);await openWaiter(waiter,'Заказы');
 const card=waiter.getByRole('button',{name:/^Заказ №.+стол 12/}).first();
 for(const viewport of viewports){
  await waiter.setViewportSize(viewport);await waiter.waitForTimeout(50);
  if(viewport.width===360||viewport.width===390)await waiter.screenshot({path:`${qa}/orders-${viewport.width}.png`});
  if(viewport.width===390){await card.click();await expect(waiter.getByRole('dialog',{name:/Заказ №/})).toBeVisible();await waiter.screenshot({path:`${qa}/order-detail-390.png`});await waiter.getByRole('dialog',{name:/Заказ №/}).getByRole('button',{name:'Закрыть',exact:true}).click()}
  if(viewport.width>=768)await card.click();
  const measurement=await metrics(waiter,'.waiter-order-detail-pane');verify(measurement,viewport.width);
  console.log('WAITER_MOBILE_FIRST_ORDERS',JSON.stringify(measurement));
  if([768,1440].includes(viewport.width))await waiter.screenshot({path:`${qa}/orders-${viewport.width}.png`});
 }
});

test('Waiter Calls keeps a full-width mobile inbox and BottomSheet detail',async({page,context})=>{
 await enterGuest(page);await createCall(page);
 const waiter=await context.newPage();await waiter.setViewportSize(viewports[0]);await openWaiter(waiter,'Вызовы');
 const card=waiter.getByRole('button',{name:/^Вызов, стол 12/}).first();
 for(const viewport of viewports){
  await waiter.setViewportSize(viewport);await waiter.waitForTimeout(50);
  if(viewport.width===360||viewport.width===390)await waiter.screenshot({path:`${qa}/calls-${viewport.width}.png`});
  if(viewport.width===390){await card.click();await expect(waiter.getByRole('dialog',{name:'Вызов · Стол 12',exact:true})).toBeVisible();await waiter.screenshot({path:`${qa}/call-detail-390.png`});await waiter.getByRole('dialog',{name:'Вызов · Стол 12',exact:true}).getByRole('button',{name:'Закрыть',exact:true}).click()}
  if(viewport.width>=768)await card.click();
  const measurement=await metrics(waiter,'.waiter-call-detail-pane');verify(measurement,viewport.width);
  console.log('WAITER_MOBILE_FIRST_CALLS',JSON.stringify(measurement));
  if([768,1440].includes(viewport.width))await waiter.screenshot({path:`${qa}/calls-${viewport.width}.png`});
 }
});
