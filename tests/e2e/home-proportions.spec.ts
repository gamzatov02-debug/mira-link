import {expect,test} from '@playwright/test';

test('Guest Home keeps the approved visual hierarchy at 390px',async({page})=>{
 await page.setViewportSize({width:390,height:900});
 await page.goto('/demo/guest/home');
 await page.evaluate(()=>document.fonts.ready);
 const hero=page.locator('.restaurant-hero');
 const primaryActions=page.getByRole('navigation',{name:'Основные функции'});
 const promo=page.locator('.guest-promo');
 const popular=page.locator('.guest-popular');
 const services=page.getByRole('navigation',{name:'Дополнительные сервисы'});
 const carousel=page.getByLabel('Популярное');
 const cards=carousel.locator(':scope > div');
 await expect(cards).toHaveCount(6);
 const [heroBox,primaryBox,promoBox,popularBox,servicesBox]=await Promise.all([hero,primaryActions,promo,popular,services].map(locator=>locator.evaluate(node=>node.getBoundingClientRect().toJSON())));
 expect(heroBox.height).toBeCloseTo(188,0);
 expect(primaryBox.height).toBeCloseTo(82,0);
 expect(promoBox.height).toBeCloseTo(116*1.25,2);
 expect(servicesBox.height).toBeCloseTo(72,0);
 expect(primaryBox.y).toBeGreaterThanOrEqual(heroBox.bottom);
 expect(promoBox.y).toBeGreaterThanOrEqual(primaryBox.bottom);
 expect(popularBox.y).toBeGreaterThanOrEqual(promoBox.bottom);
 expect(servicesBox.y).toBeGreaterThanOrEqual(popularBox.bottom);
 await expect(primaryActions.getByRole('button')).toHaveCount(4);
 await expect(services.getByRole('button')).toHaveCount(4);
 const card=cards.first();
 const metrics=await card.evaluate(node=>{const box=node.getBoundingClientRect();const image=node.querySelector('img')!.getBoundingClientRect();const description=node.querySelector('p');const buttons=[...node.querySelectorAll('button')];const favourite=buttons[0].getBoundingClientRect();const action=buttons.at(-1)!.getBoundingClientRect();return {width:box.width,height:box.height,imageHeight:image.height,descriptionPresent:Boolean(description),actionText:buttons.at(-1)!.textContent?.trim(),favourite:{width:favourite.width,height:favourite.height},action:{width:action.width,height:action.height}}});
 expect(metrics.width).toBeCloseTo(130.3125*.8,2);
 expect(metrics.imageHeight).toBeCloseTo(70*.8,1);
 expect(metrics.height).toBeCloseTo(162,0);
 expect(metrics.descriptionPresent).toBe(false);
 expect(metrics.actionText).toBe('Выбрать');
 expect(metrics.favourite.width).toBeGreaterThanOrEqual(43.5);
 expect(metrics.favourite.height).toBeGreaterThanOrEqual(43.5);
 expect(metrics.action.height).toBeGreaterThanOrEqual(43.5);
 const carouselMetrics=await carousel.evaluate(node=>({clientWidth:node.clientWidth,scrollWidth:node.scrollWidth,gap:Number.parseFloat(getComputedStyle(node).columnGap)}));
 expect(carouselMetrics.gap).toBeCloseTo(6,1);
 expect(carouselMetrics.clientWidth/(metrics.width+carouselMetrics.gap)).toBeGreaterThanOrEqual(3.2);
 expect(carouselMetrics.clientWidth/(metrics.width+carouselMetrics.gap)).toBeLessThanOrEqual(3.4);
 expect(carouselMetrics.scrollWidth).toBeGreaterThan(carouselMetrics.clientWidth);
 const promoImage=promo.locator('img');
 const promoAction=promo.locator('.promo-action');
 expect(await promoImage.evaluate(node=>getComputedStyle(node).objectFit)).toBe('cover');
 const [promoImageBox,promoActionBox]=await Promise.all([promoImage,promoAction].map(locator=>locator.evaluate(node=>node.getBoundingClientRect().toJSON())));
 expect(promoImageBox.width).toBeGreaterThanOrEqual(promoBox.width-2);
 expect(promoImageBox.height).toBeGreaterThanOrEqual(promoBox.height-2);
 expect(promoActionBox.width).toBeGreaterThanOrEqual(44);
 expect(promoActionBox.height).toBeGreaterThanOrEqual(44);
 expect(promoActionBox.y+promoActionBox.height/2).toBeCloseTo(promoBox.y+promoBox.height/2,0);
 expect(promoActionBox.right).toBeLessThanOrEqual(promoBox.right);
 expect(promoActionBox.bottom).toBeLessThanOrEqual(promoBox.bottom);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await promo.click();
 await expect(page.getByRole('heading',{name:'Акции',exact:true})).toBeVisible();
});

test('Guest Home keeps service actions below Popular and above the current order',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/demo/guest/home');
 const primaryActions=page.getByRole('navigation',{name:'Основные функции'});
 const services=page.getByRole('navigation',{name:'Дополнительные сервисы'});
 await expect(primaryActions.getByRole('button')).toHaveText(['МенюБлюда и напитки','ЗаказВаши позиции','СчётОплата за столом','ОфициантКоманда рядом']);
 await expect(services.getByRole('button')).toHaveText(['АкцииСпецпредложения','Wi-FiСеть заведения','ПауэрбанкЗарядка рядом','ТаксиПоездка домой']);
 await expect(page.locator('.guest-quick-actions>button')).toHaveCount(8);

 await page.getByRole('button',{name:'Сканировать QR стола №12',exact:true}).click();
 await primaryActions.getByRole('button',{name:'Меню — быстрое действие',exact:true}).click();
 await page.getByRole('button',{name:'Добавить: Буррата с томатами',exact:true}).click();
 await page.getByRole('button',{name:/^Заказ/}).click();
 await page.getByRole('button',{name:'Оформить заказ',exact:true}).click();
 await page.getByRole('navigation',{name:'Основная навигация гостя'}).getByRole('button',{name:'Главная',exact:true}).click();
 const currentOrder=page.getByRole('heading',{name:'Текущий заказ',exact:true});
 await expect(currentOrder).toBeVisible();
 const currentOrderCard=currentOrder.locator('..').locator('..');
 await expect(currentOrderCard.getByText('Ожидает подтверждения',{exact:true})).toBeVisible();
 await expect(currentOrderCard.getByText('pending',{exact:true})).toHaveCount(0);
 const [popularBox,servicesBox,orderBox]=await Promise.all([page.locator('.guest-popular'),services,currentOrder].map(locator=>locator.evaluate(node=>node.getBoundingClientRect().toJSON())));
 expect(servicesBox.y).toBeGreaterThanOrEqual(popularBox.bottom);
 expect(orderBox.y).toBeGreaterThanOrEqual(servicesBox.bottom);

 await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
 const nav=page.getByRole('navigation',{name:'Основная навигация гостя'});
 const qr=page.getByRole('button',{name:'Сканировать QR',exact:true});
 const [navBefore,qrBefore]=await Promise.all([nav,qr].map(locator=>locator.evaluate(node=>node.getBoundingClientRect().toJSON())));
 const scrollHeight=await page.evaluate(()=>document.documentElement.scrollHeight);
 for(const top of [scrollHeight*.35,scrollHeight,scrollHeight*.2,scrollHeight]){
  await page.evaluate(y=>window.scrollTo({top:y,behavior:'instant'}),top);
  await page.evaluate(()=>new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve()))));
  const [navAtScroll,qrAtScroll]=await Promise.all([nav,qr].map(locator=>locator.evaluate(node=>node.getBoundingClientRect().toJSON())));
  expect(navAtScroll.y).toBeCloseTo(navBefore.y,0);
  expect(qrAtScroll.y).toBeCloseTo(qrBefore.y,0);
 }
 const [cardAtBottom,navAfter,qrAfter]=await Promise.all([currentOrderCard,nav,qr].map(locator=>locator.evaluate(node=>node.getBoundingClientRect().toJSON())));
 expect(cardAtBottom.bottom).toBeLessThanOrEqual(Math.min(navAfter.y,qrAfter.y));
 await currentOrderCard.getByRole('button',{name:'Отследить заказ',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Мой заказ',exact:true})).toBeVisible();
 await nav.getByRole('button',{name:'Главная',exact:true}).click();
 await expect(currentOrder).toBeVisible();

 const stateBefore=await page.evaluate(()=>localStorage.getItem('mira-link-demo-v1'));
 const destinations=[['Акции','Акции'],['Wi-Fi','Wi-Fi заведения'],['Пауэрбанк','Пауэрбанк'],['Такси','Такси от MIRA Restaurant']] as const;
 for(const [action,heading] of destinations){
  await services.getByRole('button',{name:action,exact:true}).click();
  await expect(page.getByRole('heading',{name:heading,exact:true}).first()).toBeVisible();
  await page.getByRole('navigation',{name:'Основная навигация гостя'}).getByRole('button',{name:'Главная',exact:true}).click();
 }
 expect(await page.evaluate(()=>localStorage.getItem('mira-link-demo-v1'))).toBe(stateBefore);
 await page.getByRole('button',{name:'Сканировать QR',exact:true}).click();
 await expect(page.getByRole('dialog',{name:'Сканировать QR',exact:true})).toBeVisible();
});

for(const width of [320,375,390,1440])test(`Guest Home reordered services fit ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:844});
 await page.goto('/demo/guest/home');
 await page.evaluate(()=>document.fonts.ready);
 const services=page.getByRole('navigation',{name:'Дополнительные сервисы'});
 const promo=page.locator('.guest-promo');
 await expect(services.getByRole('button')).toHaveCount(4);
 const expectedServiceHeight=width<768?72:78;
 const expectedPromoHeight=(width<768?116:123)*1.25;
 const serviceMetrics=await services.getByRole('button').evaluateAll(buttons=>buttons.map(button=>{const box=button.getBoundingClientRect();const caption=button.querySelector('small')!;return {height:box.height,captionFits:caption.scrollHeight<=caption.clientHeight&&caption.scrollWidth<=caption.clientWidth}}));
 for(const metric of serviceMetrics){expect(metric.height).toBeCloseTo(expectedServiceHeight,0);expect(metric.height).toBeGreaterThanOrEqual(44);expect(metric.captionFits).toBe(true)}
 const [promoBox,promoImageBox,promoActionBox]=await Promise.all([promo,promo.locator('img'),promo.locator('.promo-action')].map(locator=>locator.evaluate(node=>node.getBoundingClientRect().toJSON())));
 expect(promoBox.height).toBeCloseTo(expectedPromoHeight,2);
 expect(promoBox.height/(width<768?116:123)).toBeCloseTo(1.25,3);
 expect(await promo.locator('img').evaluate(node=>getComputedStyle(node).objectFit)).toBe('cover');
 expect(await promo.locator('img').evaluate(node=>getComputedStyle(node).objectPosition)).toBe('50% 58%');
 expect(promoImageBox.width).toBeGreaterThanOrEqual(promoBox.width-2);
 expect(promoImageBox.height).toBeGreaterThanOrEqual(promoBox.height-2);
 expect(promoActionBox.height).toBeGreaterThanOrEqual(44);
 expect(promoActionBox.y+promoActionBox.height/2).toBeCloseTo(promoBox.y+promoBox.height/2,0);
 expect(await services.getByRole('button').evaluateAll(buttons=>new Set(buttons.map(button=>Math.round(button.getBoundingClientRect().y))).size)).toBe(1);
 const carousel=page.getByLabel('Популярное');
 expect(await carousel.evaluate(node=>node.scrollWidth>node.clientWidth)).toBe(true);
 expect(await carousel.evaluate(node=>getComputedStyle(node).overflowX)).toBe('auto');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(0);
 await expect(page.getByRole('navigation',{name:'Основная навигация гостя'})).toBeVisible();
});
