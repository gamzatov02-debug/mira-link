import {expect,test} from '@playwright/test';
import fs from 'node:fs';

const viewports=[360,375,390,430,480,1440];
const screenshotWidths=new Set(viewports);
const evidenceDir='docs/QA/stage-6.2c';
const results:unknown[]=[];

test.afterAll(()=>fs.writeFileSync(`${evidenceDir}/product-card-layout.json`,JSON.stringify(results,null,2)));

for(const width of viewports)test(`ProductCard Menu and recommendations layout at ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:900});
  await page.goto('/demo/guest/menu');
  await page.evaluate(()=>document.fonts.ready);

  const menu=page.getByLabel('Каталог меню');
  const cards=menu.locator(':scope > div');
  await expect(cards).toHaveCount(16);
  const menuMetrics=await cards.evaluateAll(nodes=>nodes.map(node=>{
    const card=node.getBoundingClientRect();
    const image=node.querySelector('img')!.getBoundingClientRect();
    const title=node.querySelector('h3')!;const titleStyle=getComputedStyle(title);const titleBox=title.getBoundingClientRect();
    const description=node.querySelector('p')!;const descriptionStyle=getComputedStyle(description);const descriptionBox=description.getBoundingClientRect();
    const favourite=node.querySelector<HTMLButtonElement>('button[aria-label^="В избранное:"]')!.getBoundingClientRect();
    const action=[...node.querySelectorAll<HTMLButtonElement>('button')].at(-1)!.getBoundingClientRect();
    return {x:card.x,y:card.y,width:card.width,height:card.height,imageWidth:image.width,titleLines:Math.round(titleBox.height/parseFloat(titleStyle.lineHeight)),descriptionLines:Math.round(descriptionBox.height/parseFloat(descriptionStyle.lineHeight)),favourite:{x:favourite.x,y:favourite.y,right:favourite.right,bottom:favourite.bottom,height:favourite.height},action:{x:action.x,right:action.right,height:action.height}};
  }));
  expect(Math.abs(menuMetrics[0].y-menuMetrics[1].y)).toBeLessThanOrEqual(1);
  expect(menuMetrics[1].x).toBeGreaterThan(menuMetrics[0].x);
  expect(menuMetrics[2].y).toBeGreaterThan(menuMetrics[0].y);
  for(let index=0;index<menuMetrics.length;index+=2){expect(Math.abs(menuMetrics[index].height-menuMetrics[index+1].height)).toBeLessThanOrEqual(1)}
  for(const card of menuMetrics){expect(card.imageWidth).toBeGreaterThanOrEqual(card.width-3);expect(card.titleLines).toBeLessThanOrEqual(2);expect(card.descriptionLines).toBeLessThanOrEqual(2);expect(card.favourite.height).toBeGreaterThanOrEqual(43.5);expect(card.favourite.x).toBeGreaterThanOrEqual(card.x);expect(card.favourite.right).toBeLessThanOrEqual(card.x+card.width+1);expect(card.action.height).toBeGreaterThanOrEqual(47.5);expect(card.action.x).toBeGreaterThanOrEqual(card.x);expect(card.action.right).toBeLessThanOrEqual(card.x+card.width+1)}
  const menuNoOverflow=await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth);expect(menuNoOverflow).toBe(true);
  if(screenshotWidths.has(width))await page.screenshot({path:`${evidenceDir}/product-card-menu-${width}.png`,fullPage:true});

  await page.goto('/demo/guest/home');
  await page.evaluate(()=>document.fonts.ready);
  const carousel=page.getByLabel('Популярное');
  const recommendationCards=carousel.locator(':scope > div');
  await expect(recommendationCards).toHaveCount(6);
  const recommendationMetrics=await recommendationCards.evaluateAll(nodes=>nodes.map(node=>{
    const card=node.getBoundingClientRect();const image=node.querySelector('img')!.getBoundingClientRect();const title=node.querySelector('h3')!;const description=node.querySelector('p');const titleStyle=getComputedStyle(title);const buttons=[...node.querySelectorAll<HTMLButtonElement>('button')];const favourite=buttons[0].getBoundingClientRect();const action=buttons.at(-1)!.getBoundingClientRect();const metadata=node.querySelector('strong')!;return {width:card.width,y:card.y,height:card.height,imageHeight:image.height,titleLines:Math.round(title.getBoundingClientRect().height/parseFloat(titleStyle.lineHeight)),descriptionPresent:Boolean(description),metadataLines:Math.round(metadata.getBoundingClientRect().height/parseFloat(getComputedStyle(metadata).lineHeight)),metadataWhiteSpace:getComputedStyle(metadata).whiteSpace,favourite:{width:favourite.width,height:favourite.height},action:{width:action.width,height:action.height}};
  }));
  const carouselMetrics=await carousel.evaluate(node=>({clientWidth:node.clientWidth,scrollWidth:node.scrollWidth,gap:parseFloat(getComputedStyle(node).columnGap)}));expect(carouselMetrics.scrollWidth).toBeGreaterThan(carouselMetrics.clientWidth);
  expect(new Set(recommendationMetrics.map(card=>Math.round(card.y))).size).toBe(1);
  expect(Math.max(...recommendationMetrics.map(card=>card.height))-Math.min(...recommendationMetrics.map(card=>card.height))).toBeLessThanOrEqual(1);
  for(const card of recommendationMetrics){expect(card.width).toBeGreaterThanOrEqual(121.5);expect(card.width).toBeLessThanOrEqual(132.5);expect(card.imageHeight).toBeGreaterThanOrEqual(69.5);expect(card.imageHeight).toBeLessThanOrEqual(70.5);expect(card.titleLines).toBeLessThanOrEqual(2);expect(card.descriptionPresent).toBe(false);expect(card.metadataLines).toBe(1);expect(card.metadataWhiteSpace).toBe('nowrap');expect(card.favourite.width).toBeGreaterThanOrEqual(43.5);expect(card.favourite.height).toBeGreaterThanOrEqual(43.5);expect(card.action.height).toBeGreaterThanOrEqual(47.5);expect(card.action.width).toBeLessThanOrEqual(card.width)}
  const visibleCardCount=carouselMetrics.clientWidth/(recommendationMetrics[0].width+carouselMetrics.gap);expect(visibleCardCount).toBeGreaterThanOrEqual(2.6);expect(visibleCardCount).toBeLessThanOrEqual(3.3);
  const recommendationsNoOverflow=await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth);expect(recommendationsNoOverflow).toBe(true);
  if(screenshotWidths.has(width))await page.screenshot({path:`${evidenceDir}/product-card-popular-${width}.png`,fullPage:true});
  results.push({width,menu:{columns:2,noHorizontalOverflow:menuNoOverflow,cards:menuMetrics},recommendations:{horizontalCarousel:true,visibleCardCount,noHorizontalOverflow:recommendationsNoOverflow,carousel:carouselMetrics,cards:recommendationMetrics}});
});
