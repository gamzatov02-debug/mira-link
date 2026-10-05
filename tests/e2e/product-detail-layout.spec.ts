import {expect,test} from '@playwright/test';
import {mkdirSync,writeFileSync} from 'node:fs';

const qa='docs/QA/product-detail-responsive-fix';
const viewports=[360,375,390,430,480,768,1024,1280,1440] as const;
type Measurement={viewportWidth:number;dialogWidth:number;leftEdge:number;rightEdge:number;contentWidth:number;imageWidth:number;imageHeight:number;imageObjectFit:string;documentOverflow:number};
const measurements:Measurement[]=[];

test.beforeAll(()=>mkdirSync(qa,{recursive:true}));
test.afterAll(()=>writeFileSync(`${qa}/metrics.json`,`${JSON.stringify(measurements,null,2)}\n`));

for(const width of viewports)test(`Guest Product Detail stays inside the ${width}px viewport`,async({page})=>{
 await page.setViewportSize({width,height:900});
 await page.goto('/demo/guest/menu');
 await page.getByRole('button',{name:'Выбрать блюдо',exact:true}).first().click();
 const dialog=page.getByRole('dialog',{name:'Буррата с томатами'});
 await expect(dialog).toBeVisible();
 await page.waitForTimeout(550);
 const measurement=await dialog.evaluate((node,viewportWidth)=>{
  const rect=node.getBoundingClientRect();
  const image=node.querySelector('img') as HTMLImageElement;
  const imageRect=image.getBoundingClientRect();
  const contentRect=image.parentElement!.getBoundingClientRect();
  return {
   viewportWidth,
   dialogWidth:rect.width,
   leftEdge:rect.left,
   rightEdge:viewportWidth-rect.right,
   contentWidth:contentRect.width,
   imageWidth:imageRect.width,
   imageHeight:imageRect.height,
   imageObjectFit:getComputedStyle(image).objectFit,
   documentOverflow:document.documentElement.scrollWidth-document.documentElement.clientWidth
  };
 },width);
 measurements.push(measurement);
 expect(measurement.leftEdge).toBeGreaterThanOrEqual(-1);
 expect(measurement.rightEdge).toBeGreaterThanOrEqual(-1);
 expect(measurement.documentOverflow).toBe(0);
 expect(measurement.imageWidth).toBeLessThanOrEqual(measurement.contentWidth+1);
 expect(measurement.imageObjectFit).toBe('cover');
 if(width>=768){expect(measurement.dialogWidth).toBeLessThanOrEqual(481);expect(measurement.leftEdge).toBeGreaterThanOrEqual(24);expect(measurement.rightEdge).toBeGreaterThanOrEqual(24)}

 const title=dialog.getByRole('heading',{name:'Буррата с томатами',exact:true});
 const titleBounds=await title.evaluate(element=>{const rect=element.getBoundingClientRect();return {left:rect.left,right:rect.right,scrollWidth:element.scrollWidth,clientWidth:element.clientWidth}});
 expect(titleBounds.left).toBeGreaterThanOrEqual(-1);
 expect(titleBounds.right).toBeLessThanOrEqual(width+1);
 expect(titleBounds.scrollWidth).toBeLessThanOrEqual(titleBounds.clientWidth+1);
 await expect(dialog.getByText('Состав блюда',{exact:true})).toBeAttached();
 await expect(dialog.getByText('Аллергены в демо-рецепте',{exact:true})).toBeAttached();
 await expect(dialog.getByText('890,00 ₽ · 220 г',{exact:true})).toBeAttached();
 await expect(dialog.getByText(/Дополнительный соус/).first()).toBeAttached();
 const close=dialog.getByRole('button',{name:'Close',exact:true});
 const closeBox=await close.boundingBox();
 expect(closeBox!.width).toBeGreaterThanOrEqual(43.5);
 expect(closeBox!.height).toBeGreaterThanOrEqual(43.5);
 expect(closeBox!.x).toBeGreaterThanOrEqual(-1);
 expect(closeBox!.x+closeBox!.width).toBeLessThanOrEqual(width+1);
 if([390,768,1024,1440].includes(width))await page.screenshot({path:`${qa}/product-detail-${width}.png`});
 const cartAction=dialog.getByRole('button',{name:'В корзину',exact:true});
 await cartAction.scrollIntoViewIfNeeded();
 await expect(cartAction).toBeVisible();
 const cartBox=await cartAction.boundingBox();
 expect(cartBox!.height).toBeGreaterThanOrEqual(43.5);
});
