import {expect,test} from '@playwright/test';
import fs from 'node:fs';

const viewports=[320,360,375,390,430,480,1440];
const screenshotWidths=new Set(viewports);
const evidenceDir=process.env.MIRA_QA_OUTPUT_DIR??'docs/QA/stage-6.2c';
const results:unknown[]=[];

fs.mkdirSync(evidenceDir,{recursive:true});
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
    const imageElement=node.querySelector('img')!;const image=imageElement.getBoundingClientRect();
    const title=node.querySelector<HTMLElement>('.guest-menu-product-title')!;const titleStyle=getComputedStyle(title);const titleBox=title.getBoundingClientRect();
    const description=node.querySelector<HTMLElement>('.guest-menu-product-description')!;const descriptionStyle=getComputedStyle(description);const descriptionBox=description.getBoundingClientRect();
    const favourite=node.querySelector<HTMLButtonElement>('button[aria-label^="В избранное:"]')!.getBoundingClientRect();
    const action=node.querySelector<HTMLButtonElement>('.guest-menu-product-add')!.getBoundingClientRect();
    return {x:card.x,y:card.y,width:card.width,height:card.height,imageWidth:image.width,imageHeight:image.height,imageObjectFit:getComputedStyle(imageElement).objectFit,titleLines:Math.round(titleBox.height/parseFloat(titleStyle.lineHeight)),descriptionLines:Math.round(descriptionBox.height/parseFloat(descriptionStyle.lineHeight)),favourite:{x:favourite.x,y:favourite.y,right:favourite.right,bottom:favourite.bottom,height:favourite.height},action:{x:action.x,right:action.right,height:action.height}};
  }));
  for(let index=1;index<menuMetrics.length;index++){expect(menuMetrics[index].x).toBeCloseTo(menuMetrics[0].x,0);expect(menuMetrics[index].y).toBeGreaterThan(menuMetrics[index-1].y)}
  for(const card of menuMetrics){expect(card.height).toBeGreaterThanOrEqual(139);expect(card.height).toBeLessThanOrEqual(146);expect(card.imageWidth).toBeGreaterThanOrEqual(115.5);expect(card.imageWidth).toBeLessThanOrEqual(128.5);expect(card.imageHeight).toBeGreaterThanOrEqual(139);expect(card.imageHeight).toBeLessThanOrEqual(146);expect(card.imageObjectFit).toBe('cover');expect(card.titleLines).toBeLessThanOrEqual(2);expect(card.descriptionLines).toBeLessThanOrEqual(2);expect(card.favourite.height).toBeGreaterThanOrEqual(43.5);expect(card.favourite.x).toBeGreaterThanOrEqual(card.x);expect(card.favourite.right).toBeLessThanOrEqual(card.x+card.width+1);expect(card.action.height).toBeGreaterThanOrEqual(43.5);expect(card.action.x).toBeGreaterThanOrEqual(card.x);expect(card.action.right).toBeLessThanOrEqual(card.x+card.width+1)}
  const menuNoOverflow=await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth);expect(menuNoOverflow).toBe(true);
  if(screenshotWidths.has(width))await page.screenshot({path:`${evidenceDir}/product-card-menu-${width}.png`,fullPage:true});

  await page.goto('/demo/guest/home');
  await page.evaluate(()=>document.fonts.ready);
  const carousel=page.getByLabel('Популярное');
  const recommendationCards=carousel.locator(':scope > div');
  await expect(recommendationCards).toHaveCount(6);
  const recommendationMetrics=await recommendationCards.evaluateAll(nodes=>nodes.map(node=>{
    const card=node.getBoundingClientRect();const imageElement=node.querySelector('img')!;const image=imageElement.getBoundingClientRect();const title=node.querySelector('h3')!;const description=node.querySelector('p');const titleStyle=getComputedStyle(title);const naturalTitle=title.cloneNode(true) as HTMLElement;naturalTitle.style.cssText=`position:absolute;visibility:hidden;display:block;width:${title.clientWidth}px;min-height:0;height:auto;overflow:visible;-webkit-line-clamp:unset`;title.insertAdjacentElement('afterend',naturalTitle);const naturalTitleHeight=naturalTitle.getBoundingClientRect().height;naturalTitle.remove();const buttons=[...node.querySelectorAll<HTMLButtonElement>('button')];const favourite=buttons[0].getBoundingClientRect();const action=buttons.at(-1)!.getBoundingClientRect();const metadata=node.querySelector('strong')!;return {width:card.width,y:card.y,height:card.height,imageHeight:image.height,imageLoaded:imageElement.complete&&imageElement.naturalWidth>0,imageObjectFit:getComputedStyle(imageElement).objectFit,titleLines:Math.round(title.getBoundingClientRect().height/parseFloat(titleStyle.lineHeight)),titleFits:naturalTitleHeight<=title.clientHeight+.5,descriptionPresent:Boolean(description),metadataLines:Math.round(metadata.getBoundingClientRect().height/parseFloat(getComputedStyle(metadata).lineHeight)),metadataWhiteSpace:getComputedStyle(metadata).whiteSpace,metadataFits:metadata.scrollWidth<=metadata.clientWidth,favourite:{width:favourite.width,height:favourite.height},action:{width:action.width,height:action.height}};
  }));
  const carouselMetrics=await carousel.evaluate(node=>({clientWidth:node.clientWidth,scrollWidth:node.scrollWidth,gap:parseFloat(getComputedStyle(node).columnGap)}));expect(carouselMetrics.scrollWidth).toBeGreaterThan(carouselMetrics.clientWidth);expect(carouselMetrics.gap).toBeCloseTo(6,1);
  expect(new Set(recommendationMetrics.map(card=>Math.round(card.y))).size).toBe(1);
  expect(Math.max(...recommendationMetrics.map(card=>card.height))-Math.min(...recommendationMetrics.map(card=>card.height))).toBeLessThanOrEqual(1);
  const expectedCardWidth=Math.min(106,Math.max(98,(carouselMetrics.clientWidth-4)*.288));
  for(const card of recommendationMetrics){expect(card.width).toBeCloseTo(expectedCardWidth,1);expect(card.height).toBeCloseTo(162,0);expect(card.imageHeight).toBeCloseTo(56,0);expect(card.imageLoaded).toBe(true);expect(card.imageObjectFit).toBe('cover');expect(card.titleLines).toBeLessThanOrEqual(2);expect(card.titleFits).toBe(true);expect(card.descriptionPresent).toBe(false);expect(card.metadataLines).toBe(1);expect(card.metadataWhiteSpace).toBe('nowrap');expect(card.metadataFits).toBe(true);expect(card.favourite.width).toBeGreaterThanOrEqual(43.5);expect(card.favourite.height).toBeGreaterThanOrEqual(43.5);expect(card.action.height).toBeGreaterThanOrEqual(43.5);expect(card.action.width).toBeLessThanOrEqual(card.width)}
  const visibleCardCount=carouselMetrics.clientWidth/(recommendationMetrics[0].width+carouselMetrics.gap);expect(visibleCardCount).toBeGreaterThanOrEqual(2.8);expect(visibleCardCount).toBeLessThanOrEqual(4.1);
  await carousel.evaluate(node=>{node.scrollLeft=node.scrollWidth});
  await page.evaluate(()=>new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve()))));
  const [carouselBox,lastCardBox]=await Promise.all([carousel,recommendationCards.last()].map(locator=>locator.evaluate(node=>node.getBoundingClientRect().toJSON())));
  expect(lastCardBox.left).toBeGreaterThanOrEqual(carouselBox.left-1);expect(lastCardBox.right).toBeLessThanOrEqual(carouselBox.right+1);
  const recommendationsNoOverflow=await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth);expect(recommendationsNoOverflow).toBe(true);
  if(screenshotWidths.has(width))await page.screenshot({path:`${evidenceDir}/product-card-popular-${width}.png`,fullPage:true});
  results.push({width,menu:{columns:1,noHorizontalOverflow:menuNoOverflow,cards:menuMetrics},recommendations:{horizontalCarousel:true,visibleCardCount,noHorizontalOverflow:recommendationsNoOverflow,carousel:carouselMetrics,cards:recommendationMetrics}});
});

test('Guest Home compact Popular actions preserve product and favorite flows',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('/demo/guest/home');
  const favourite=page.getByRole('button',{name:'В избранное: Буррата с томатами',exact:true});
  await expect(favourite).toHaveAttribute('aria-pressed','false');
  await favourite.click();
  await expect(page.getByRole('dialog',{name:'Войдите в аккаунт'})).toBeVisible();
  await expect(page.getByRole('dialog').getByText('Состав блюда',{exact:true})).toHaveCount(0);
  await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'Выбрать',exact:true}).first().click();
  await expect(page.getByRole('dialog').getByText('Состав блюда',{exact:true})).toBeVisible();
  expect(await page.evaluate(()=>localStorage.getItem('mira-dish-favorites:u1'))).toBeNull();
});
