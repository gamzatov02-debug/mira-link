import {test,expect} from '@playwright/test';
import fs from 'node:fs';

const shot=async(page:any,name:string)=>{
  await page.waitForTimeout(250);
  await page.screenshot({path:'visual-artifacts/'+name+'.png',fullPage:true});
};

test('capture v2.1 guest screens',async({page})=>{
  fs.mkdirSync('visual-artifacts',{recursive:true});
  await page.setViewportSize({width:390,height:844});

  for(const name of ['home','menu','nearby','qr','events','promotions','more','wifi','powerbank','taxi'] as const){
    await page.goto('/demo/guest/'+name,{waitUntil:'networkidle'});
    await shot(page,name);
    if(name==='home'){
      const metrics=await page.evaluate(()=>{
        const pick=(selector:string)=>{const el=document.querySelector(selector);if(!el)return null;const r=el.getBoundingClientRect(),s=getComputedStyle(el);return {x:r.x,y:r.y,width:r.width,height:r.height,fontSize:s.fontSize,lineHeight:s.lineHeight}};
        return {header:pick('.guest-header'),hero:pick('.restaurant-hero'),quick:pick('.guest-quick-actions'),promo:pick('.guest-promo-banner'),popular:pick('.guest-popular'),bottomNav:pick('.bottom-nav')};
      });
      fs.writeFileSync('visual-artifacts/home-metrics.json',JSON.stringify(metrics,null,2));
    }
  }

  // Open demo table session through the hidden developer-only QR scenario.
  await page.goto('/demo/guest/qr',{waitUntil:'networkidle'});
  await page.locator('.guest-qr-demo-tools button').first().evaluate((el:any)=>el.click());
  await page.waitForURL(/\/demo\/guest\/home/);
  await expect(page.getByText('Стол 12').first()).toBeVisible();

  await page.goto('/demo/guest/menu',{waitUntil:'networkidle'});
  await page.locator('.guest-menu-product-add').first().click();
  await page.locator('.guest-menu-product-add').nth(1).click();
  await page.goto('/demo/guest/order',{waitUntil:'networkidle'});
  await shot(page,'cart');
  await page.getByRole('button',{name:'Оформить заказ'}).click();
  await page.waitForTimeout(300);
  await shot(page,'order-status');

  await page.goto('/demo/guest/bill',{waitUntil:'networkidle'});
  await page.waitForTimeout(350);
  await shot(page,'bill');
  await page.getByRole('button',{name:'Перейти к оплате'}).click();
  await page.waitForURL(/\/demo\/guest\/payment/);
  await page.waitForTimeout(250);
  await shot(page,'payment');

  await page.goto('/demo/guest/tips',{waitUntil:'networkidle'});
  await shot(page,'tips');
  await page.goto('/demo/guest/waiter',{waitUntil:'networkidle'});
  await shot(page,'staff');

  // Authenticate demo account to capture protected account surfaces.
  await page.goto('/demo/guest/profile',{waitUntil:'networkidle'});
  const login=page.getByRole('button',{name:/Войти как/});
  if(await login.isVisible()) await login.click();
  for(const name of ['profile','bonuses','history','favorites','notifications','communications','bookings'] as const){
    await page.goto('/demo/guest/'+name,{waitUntil:'networkidle'});
    await shot(page,name);
  }
});
