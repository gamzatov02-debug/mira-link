import {test,expect} from '@playwright/test';
import {getGuestThemePreset} from '../../lib/guest-theme';
test.use({reducedMotion:'reduce'});
const state=async(page:import('@playwright/test').Page)=>page.evaluate(()=>JSON.parse(localStorage.getItem('mira-link-demo-v1')||'{}'));
const shots='docs/QA/guest-nearby-ux2';
test('menu categories use two rows and preserve filtering at 390px',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/demo/guest/menu');
 const nav=page.getByRole('navigation',{name:'Категории меню'});await expect(nav).toBeVisible();
 expect(await nav.evaluate(el=>getComputedStyle(el).gridAutoFlow)).toBe('column');
 expect(await nav.locator('button').evaluateAll(els=>new Set(els.map(el=>Math.round(el.getBoundingClientRect().y))).size)).toBe(2);
 await nav.getByRole('button',{name:'Все',exact:true}).click();await expect(page.locator('.guest-content img[src^="/images/menu/"], .guest-content img[src="/images/burrata.png"]')).toHaveCount(16);
 await nav.locator('button').last().click();expect(await page.locator('.guest-content img[src^="/images/menu/"], .guest-content img[src="/images/burrata.png"]').count()).toBeLessThan(16);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:'.test-runtime/categories-390.png',fullPage:true});
});
test('Nearby map, preview, catalogue search and filters share one result set',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/demo/guest/nearby');await expect(page.getByRole('group',{name:'Демонстрация MIRA LINK',exact:true})).toBeEnabled();
 await expect(page.locator('[data-map-provider="branded-demo"]')).toBeVisible();await expect(page.getByText('Демокарта',{exact:true}).first()).toBeVisible();
 await expect(page.locator('.nearby-list [data-venue-id]')).toHaveCount(6);await expect(page.locator('[data-venue-marker]')).toHaveCount(6);await expect(page.locator('[data-venue-preview]')).toHaveCount(0);
 await page.screenshot({path:`${shots}/01-base-classic.png`,fullPage:true});
 await page.getByRole('button',{name:'Выбрать Garden Café',exact:true}).click();await expect(page.locator('[data-venue-preview]')).toContainText('Garden Café');await expect(page.locator('[data-venue-id="garden"]')).toHaveAttribute('class',/selected/);await page.screenshot({path:`${shots}/02-selected-preview.png`,fullPage:true});
 await page.getByRole('button',{name:'Закрыть карточку заведения',exact:true}).click();await expect(page.locator('[data-venue-preview]')).toHaveCount(0);
 await page.locator('[data-venue-id="atelier"]').getByRole('button',{name:'Выбрать Atelier на карте',exact:true}).click();await expect(page.getByRole('button',{name:'Выбрать Atelier',exact:true})).toHaveAttribute('aria-pressed','true');await expect(page.locator('[data-venue-preview]')).toContainText('Atelier');
 await page.locator('[data-venue-id="atelier"]').getByRole('button',{name:'Подробнее',exact:true}).click();await expect(page.getByRole('dialog')).toContainText('Atelier');await page.keyboard.press('Escape');
 await page.locator('[data-venue-id="atelier"]').getByRole('button',{name:'Меню',exact:true}).click();await expect(page.getByRole('dialog').getByRole('navigation',{name:'Разделы заведения'}).getByRole('button',{name:'Меню',exact:true})).toBeVisible();await page.keyboard.press('Escape');
 await page.getByRole('navigation',{name:'Фильтры заведений'}).getByRole('button',{name:'Кофе',exact:true}).click();await expect(page.locator('[data-venue-marker]')).toHaveCount(1);await expect(page.locator('.nearby-list [data-venue-id]')).toHaveCount(1);
 await page.getByRole('navigation',{name:'Фильтры заведений'}).getByRole('button',{name:'Акции',exact:true}).click();await expect(page.locator('[data-venue-marker]')).toHaveCount(1);await expect(page.locator('[data-venue-id="mira"]')).toBeVisible();
 await page.getByRole('navigation',{name:'Фильтры заведений'}).getByRole('button',{name:'Доставка',exact:true}).click();await expect(page.locator('[data-venue-marker]')).toHaveCount(5);await page.screenshot({path:`${shots}/04-delivery-filter.png`,fullPage:true});
 await page.getByRole('navigation',{name:'Фильтры заведений'}).getByRole('button',{name:'Все',exact:true}).click();await page.getByLabel('Поиск рядом',{exact:true}).fill('Atelier');await expect(page.locator('[data-venue-marker]')).toHaveCount(1);
 await page.getByLabel('Поиск рядом',{exact:true}).fill('Капучино');await expect(page.locator('[data-venue-marker]')).toHaveCount(3);
 await page.getByLabel('Поиск рядом',{exact:true}).fill('несуществующее');await expect(page.locator('[data-venue-marker]')).toHaveCount(0);await expect(page.getByText('Места не найдены. Измените запрос или фильтр.')).toBeVisible();
 await page.getByLabel('Поиск рядом',{exact:true}).fill('');await page.locator('[data-venue-id="mira"]').scrollIntoViewIfNeeded();await page.screenshot({path:`${shots}/03-venue-list.png`,fullPage:true});expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBe(0);
});
test('Nearby geolocation is opt-in and fails safely to Demo Mode',async({page})=>{
 await page.addInitScript(()=>Object.defineProperty(navigator,'geolocation',{configurable:true,value:{getCurrentPosition:(_success:unknown,error:(value:{code:number})=>void)=>error({code:1})}}));
 await page.goto('/demo/guest/nearby');await expect(page.getByRole('group',{name:'Демонстрация MIRA LINK',exact:true})).toBeEnabled();await expect(page.getByText('Демокарта',{exact:true}).first()).toBeVisible();await page.getByRole('button',{name:'Использовать геопозицию',exact:true}).click();await expect(page.getByText('Показаны условные заведения и схема района.',{exact:true})).toBeVisible();await expect(page.locator('[data-venue-marker]')).toHaveCount(6);await page.screenshot({path:`${shots}/05-demo-mode.png`,fullPage:true});
});
test('Nearby accepts geolocation but does not present demo coordinates as real distances',async({page,context})=>{
 await context.grantPermissions(['geolocation']);await context.setGeolocation({latitude:55.771,longitude:37.608});await page.goto('/demo/guest/nearby');await expect(page.getByRole('group',{name:'Демонстрация MIRA LINK',exact:true})).toBeEnabled();await page.getByRole('button',{name:'Использовать геопозицию',exact:true}).click();await expect(page.getByText('Геопозиция получена',{exact:true})).toBeVisible();await expect(page.getByText(/расстояния скрыты/i)).toBeVisible();await expect(page.locator('.nearby-list')).not.toContainText(/\d+\s(?:м|км)/);
});
test('venue menus and delivery carts remain separate from the active table',async({page})=>{
 await page.goto('/demo/guest/home');await page.getByRole('button',{name:'Сканировать QR стола №12',exact:true}).click();await page.getByRole('button',{name:'Меню — быстрое действие',exact:true}).click();await page.getByRole('button',{name:/^Открыть:/}).first().click();await page.getByRole('button',{name:/^В корзину(?: ·|$)/}).click();await expect(page.getByRole('dialog')).toHaveCount(0);const before=await state(page);
 await page.getByRole('button',{name:'Рядом',exact:true}).click();await page.locator('[data-venue-id="garden"]').getByRole('button',{name:'Доставка',exact:true}).click();const dialog=page.getByRole('dialog');await dialog.getByRole('button',{name:/^Открыть:/}).first().click();await dialog.getByRole('button',{name:/^В корзину доставки(?: ·|$)/}).click();await page.keyboard.press('Escape');
 await page.locator('[data-venue-id="mira"]').getByRole('button',{name:'Доставка',exact:true}).click();await expect(dialog.getByText('Выберите блюда из меню этого заведения.',{exact:true})).toBeVisible();await page.keyboard.press('Escape');
 await page.locator('[data-venue-id="garden"]').getByRole('button',{name:'Доставка',exact:true}).click();await dialog.getByLabel('Адрес доставки',{exact:true}).fill('Демо-адрес, дом 12');await dialog.getByLabel('Телефон / контакт',{exact:true}).fill('Демо-гость');await dialog.getByRole('button',{name:'Оформить демо-доставку',exact:true}).click();await expect(dialog.getByText(/Демо-заявка .* создана/)).toBeVisible();
 const after=await state(page);for(const key of ['sessions','guests','orders','carts','payments','financialSplits'])expect(after[key]).toEqual(before[key]);expect(after.deliveries.length).toBe(before.deliveries.length+1);expect(after.deliveries.at(-1).items).toContain('garden');
});

test('anonymous venue menu does not create a table session and navigation remains canonical',async({page})=>{
 await page.goto('/demo/guest/nearby');await expect(page.getByRole('group',{name:'Демонстрация MIRA LINK',exact:true})).toBeEnabled();const before=await state(page);
 await page.locator('[data-venue-id="atelier"]').getByRole('button',{name:'Подробнее',exact:true}).click();
 const dialog=page.getByRole('dialog');await dialog.getByRole('button',{name:'Меню',exact:true}).click();await dialog.getByRole('button',{name:/^Открыть:/}).first().click();await expect(dialog.getByText('Состав блюда',{exact:true})).toBeVisible();await expect(dialog.getByRole('button',{name:/^В корзину доставки(?: ·|$)/})).toHaveCount(0);
 expect(await state(page)).toEqual(before);await page.keyboard.press('Escape');await page.keyboard.press('Escape');await expect(page.getByRole('navigation',{name:'Основная навигация гостя'})).toBeVisible();await page.getByRole('button',{name:'Сканировать QR',exact:true}).click();await expect(page.getByRole('dialog')).toBeVisible();
});

test('Nearby is responsive at 320/390 and uses semantic Classic Dark Light themes',async({page})=>{
 for(const width of [320,390]){await page.setViewportSize({width,height:844});await page.goto('/demo/guest/nearby');await expect(page.getByRole('group',{name:'Демонстрация MIRA LINK',exact:true})).toBeEnabled();expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth),`${width}px`).toBe(0)}
 for(const id of ['classic','dark','light'] as const){const palette=getGuestThemePreset(id);await page.evaluate(selection=>{localStorage.setItem('mira-demo-guest-theme',JSON.stringify(selection));window.dispatchEvent(new Event('mira-theme'))},{preset:id,palette});await expect(page.locator('.guest-theme').first()).toHaveAttribute('data-theme',id);expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBe(0);if(id==='light')await page.screenshot({path:`${shots}/06-light-theme.png`,fullPage:true})}
 await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));await expect(page.getByRole('navigation',{name:'Основная навигация гостя'})).toBeVisible();await page.screenshot({path:`${shots}/07-scroll-bottom-nav.png`});
});

test('Nearby menu quick add keeps the QR gate and does not populate delivery',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/demo/guest/nearby');await expect(page.getByRole('group',{name:'Демонстрация MIRA LINK',exact:true})).toBeEnabled();
 await expect(page.locator('[data-venue-id="garden"]')).toBeVisible();const before=await state(page);
 await page.locator('[data-venue-id="garden"]').getByRole('button',{name:'Меню',exact:true}).click();
 await page.getByRole('dialog').getByRole('button',{name:/^Добавить:/}).first().click();
 await expect(page.getByRole('button',{name:'Присоединиться к столу',exact:true})).toBeVisible();
 await expect(page.getByRole('button',{name:/^В корзину(?: ·|$)/})).toBeDisabled();expect(await state(page)).toEqual(before);
 await page.keyboard.press('Escape');await page.keyboard.press('Escape');
 await page.locator('[data-venue-id="garden"]').getByRole('button',{name:'Доставка',exact:true}).click();
 await expect(page.getByRole('dialog').getByText('Выберите блюда из меню этого заведения.',{exact:true})).toBeVisible();expect(await state(page)).toEqual(before);
});

test('Nearby marker bounds, preview and empty state work on mobile and desktop',async({page})=>{
 for(const width of [320,390,1440]){
  await page.setViewportSize({width,height:900});await page.goto('/demo/guest/nearby');await expect(page.getByRole('group',{name:'Демонстрация MIRA LINK',exact:true})).toBeEnabled();
  await expect(page.locator('[data-venue-marker]')).toHaveCount(6);
  const markerIds=await page.locator('[data-venue-marker]').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('data-venue-marker')).sort());
  expect(markerIds).toEqual(await page.locator('.nearby-list [data-venue-id]').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('data-venue-id')).sort()));
  expect(await page.locator('[data-venue-marker]').evaluateAll(nodes=>nodes.every(node=>{const marker=node.getBoundingClientRect(),map=node.parentElement!.getBoundingClientRect();return marker.left>=map.left&&marker.right<=map.right&&marker.top>=map.top&&marker.bottom<=map.bottom}))).toBe(true);
  await page.getByRole('button',{name:'Выбрать Garden Café',exact:true}).click();await expect(page.locator('[data-venue-preview]')).toBeInViewport({ratio:1});
  await expect.poll(async()=>{const preview=await page.locator('[data-venue-preview]').boundingBox(),nav=await page.getByRole('navigation',{name:'Основная навигация гостя'}).boundingBox();return !!preview&&!!nav&&preview.y+preview.height<=nav.y}).toBe(true);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBe(0);
  await page.screenshot({path:`${shots}/selected-${width}.png`});
  await page.getByLabel('Поиск рядом',{exact:true}).fill('Garden');await expect(page.locator('[data-venue-marker]')).toHaveCount(1);
  expect(await page.locator('[data-venue-marker]').evaluate(node=>{const marker=node.getBoundingClientRect(),map=node.parentElement!.getBoundingClientRect();return Math.abs(marker.x+marker.width/2-(map.x+map.width/2))<2})).toBe(true);
  await page.getByLabel('Поиск рядом',{exact:true}).fill('нет такого заведения');await expect(page.locator('[data-venue-marker]')).toHaveCount(0);await expect(page.locator('[data-venue-preview]')).toHaveCount(0);
 }
});

test('Nearby custom palette and long venue names preserve the layout',async({page})=>{
 await page.setViewportSize({width:320,height:844});await page.goto('/demo/guest/nearby');await expect(page.getByRole('group',{name:'Демонстрация MIRA LINK',exact:true})).toBeEnabled();
 const palette={...getGuestThemePreset('dark'),accent:'#CCAAEE',surface:'#202035'};
 await page.evaluate(selection=>{localStorage.setItem('mira-demo-guest-theme',JSON.stringify(selection));window.dispatchEvent(new Event('mira-theme'))},{preset:'custom',palette});
 await expect(page.locator('.guest-theme').first()).toHaveAttribute('data-theme','custom');
 await page.getByRole('button',{name:'Выбрать Garden Café',exact:true}).click();
 // A presentation fixture checks unusually long names without changing the fixed demo catalogue.
 await page.locator('[data-venue-preview] strong, [data-venue-id="garden"] strong').evaluateAll(nodes=>nodes.forEach(node=>{node.textContent='Очень длинное название семейного ресторана и кофейни у парка'}));
 await expect(page.locator('[data-venue-preview]')).toBeInViewport({ratio:1});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBe(0);
 await page.screenshot({path:`${shots}/custom-long-name-320.png`});
});
