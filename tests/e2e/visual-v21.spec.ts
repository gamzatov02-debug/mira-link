import {test} from '@playwright/test';
import fs from 'node:fs';

const pages=['home','menu','nearby','qr','events','promotions','more'] as const;

test('capture v2.1 guest screens',async({page})=>{
  fs.mkdirSync('visual-artifacts',{recursive:true});
  await page.setViewportSize({width:390,height:844});
  for(const name of pages){
    await page.goto('/demo/guest/'+name,{waitUntil:'networkidle'});
    await page.screenshot({path:'visual-artifacts/'+name+'.png',fullPage:true});
  }
});
