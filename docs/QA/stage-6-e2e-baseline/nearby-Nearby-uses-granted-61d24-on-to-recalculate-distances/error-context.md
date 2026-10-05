# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: nearby.spec.ts >> Nearby uses granted geolocation to recalculate distances
- Location: tests/e2e/nearby.spec.ts:23:1

# Error details

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator: locator('.nearby-list article').first()
Expected: "ember"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toHaveAttribute" locator('.nearby-list article').first() with timeout 5000ms
  - waiting for locator('.nearby-list article').first()

```

```yaml
- group "Демонстрация MIRA LINK":
  - banner:
    - link "Вернуться на сайт":
      - /url: /
      - text: ← Вернуться на сайт
    - text: ДЕМО · без реальных заказов и платежей
    - navigation "Режимы демо":
      - link "Все режимы":
        - /url: /demo
      - link "Гость":
        - /url: /demo/guest/welcome
      - link "Официант":
        - /url: /demo/waiter
      - link "Администратор":
        - /url: /demo/admin
      - link "Полный цикл":
        - /url: /demo/full-cycle
      - button "Сбросить демо"
  - banner:
    - img "Монограмма MIRA LINK"
    - text: MIRA LINK
    - button "Уведомления"
    - button "Профиль"
  - banner:
    - heading "Рядом с вами" [level=2]
    - paragraph: Места рядом с вами
  - region "Местоположение":
    - text: Ваша геопозиция
    - button "Демо-режим"
  - text: Найти место…
  - textbox "Найти место…":
    - /placeholder: Ресторан, кухня или блюдо
  - navigation "Фильтры заведений":
    - button "Все" [pressed]
    - button "Рестораны"
    - button "Кофе"
    - button "Кафе"
    - button "Доставка"
    - button "Акции"
  - region "Карта заведений рядом":
    - button "Открыть Ember Grill": ●
    - button "Открыть Garden Café": ●
    - button "Открыть Family Kitchen": ●
    - button "Открыть Atelier": ●
    - button "Открыть MIRA Restaurant": ●
    - button "Открыть Leaf Café": ●
    - img
    - button "Zoom in"
    - button "Zoom out"
    - link "Leaflet":
      - /url: https://leafletjs.com
    - text: ©
    - link "OpenStreetMap":
      - /url: https://www.openstreetmap.org/copyright
    - text: Ваша геопозиция · заведения и адреса демонстрационные.
  - heading "Заведения рядом 6" [level=3]
  - paragraph: Демонстрационные заведения в Москве. Расстояния рассчитаны от вашей геопозиции.
  - img "Ember Grill"
  - heading "Ember Grill" [level=3]
  - paragraph: Гриль-ресторан
  - text: Закрыто
  - button "Открыть"
  - button "На карте"
  - button "Доставка"
  - img "Garden Café"
  - text: Сезонная коллекция десертов
  - heading "Garden Café" [level=3]
  - paragraph: Кофе и завтраки
  - text: Открыто
  - button "Открыть"
  - button "На карте"
  - button "Доставка"
  - img "Family Kitchen"
  - heading "Family Kitchen" [level=3]
  - paragraph: Семейный ресторан
  - text: Открыто
  - button "Открыть"
  - button "На карте"
  - button "Доставка"
  - img "Atelier"
  - text: Ужин с шефом по субботам
  - heading "Atelier" [level=3]
  - paragraph: Авторская кухня
  - text: Закрыто
  - button "Открыть"
  - button "На карте"
  - img "MIRA Restaurant"
  - text: Вечер в MIRA
  - heading "MIRA Restaurant" [level=3]
  - paragraph: Современная кухня
  - text: Закрыто
  - button "Открыть"
  - button "На карте"
  - button "Доставка"
  - img "Leaf Café"
  - text: Новое сезонное меню
  - heading "Leaf Café" [level=3]
  - paragraph: Кафе
  - text: Открыто
  - button "Открыть"
  - button "На карте"
  - button "Доставка"
  - group: Гости и устройства демо
  - navigation "Основная навигация гостя":
    - button "Главная"
    - button "Меню"
    - button "Рядом"
    - button "Афиша"
    - button "Ещё"
```

# Test source

```ts
  1  | import {test,expect} from '@playwright/test';
  2  | const state=async(page:import('@playwright/test').Page)=>page.evaluate(()=>JSON.parse(localStorage.getItem('mira-link-demo-v1')||'{}'));
  3  | test('menu categories use two rows and preserve filtering at 390px',async({page})=>{
  4  |  await page.setViewportSize({width:390,height:844});await page.goto('/demo/guest/menu');
  5  |  const nav=page.getByRole('navigation',{name:'Категории меню'});await expect(nav).toBeVisible();
  6  |  expect(await nav.evaluate(el=>getComputedStyle(el).gridAutoFlow)).toBe('column');
  7  |  expect(await nav.locator('button').evaluateAll(els=>new Set(els.map(el=>Math.round(el.getBoundingClientRect().y))).size)).toBe(2);
  8  |  await nav.getByRole('button',{name:'Все',exact:true}).click();await expect(page.locator('.product-card')).toHaveCount(16);
  9  |  await nav.locator('button').last().click();expect(await page.locator('.product-card').count()).toBeLessThan(16);
  10 |  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  11 |  await page.screenshot({path:'.test-runtime/categories-390.png',fullPage:true});
  12 | });
  13 | test('Nearby fallback, search and map selection share six venues',async({page})=>{
  14 |  await page.setViewportSize({width:390,height:844});await page.goto('/demo/guest/nearby');await page.getByRole('button',{name:'Демо-режим',exact:true}).click();
  15 |  await expect(page.locator('.nearby-list article')).toHaveCount(6);await expect(page.locator('.mira-map-pin')).toHaveCount(6);
  16 |  const distances=await page.locator('.nearby-list article').evaluateAll(els=>els.map(el=>Number(el.getAttribute('data-distance'))));expect(distances).toEqual([...distances].sort((a,b)=>a-b));
  17 |  await page.getByRole('navigation',{name:'Фильтры заведений'}).getByRole('button',{name:'Кофе',exact:true}).click();await expect(page.locator('.mira-map-pin')).toHaveCount(1);await expect(page.locator('.nearby-list article')).toHaveCount(1);
  18 |  await page.getByRole('button',{name:'На карте',exact:true}).click();await expect(page.locator('.venue-preview')).toContainText('Garden');
  19 |  await page.getByRole('navigation',{name:'Фильтры заведений'}).getByRole('button',{name:'Все',exact:true}).click();await page.getByLabel('Найти место…',{exact:true}).fill('Atelier');await expect(page.locator('.mira-map-pin')).toHaveCount(1);
  20 |  await page.getByLabel('Найти место…',{exact:true}).fill('несуществующее');await expect(page.locator('.mira-map-pin')).toHaveCount(0);await expect(page.getByText('Места не найдены. Измените запрос или фильтр.')).toBeVisible();
  21 |  await page.getByLabel('Найти место…',{exact:true}).fill('');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:'.test-runtime/nearby-390.png',fullPage:true});
  22 | });
  23 | test('Nearby uses granted geolocation to recalculate distances',async({page,context})=>{
> 24 |  await context.grantPermissions(['geolocation']);await context.setGeolocation({latitude:55.771,longitude:37.608});await page.goto('/demo/guest/nearby');await expect(page.getByText('Ваша геопозиция',{exact:true})).toBeVisible();await expect(page.locator('.nearby-list article').first()).toHaveAttribute('data-venue-id','ember');expect(Number(await page.locator('.nearby-list article').first().getAttribute('data-distance'))).toBeLessThan(1);
     |                                                                                                                                                                                                                                                                                               ^ Error: expect(locator).toHaveAttribute(expected) failed
  25 | });
  26 | test('venue menus and delivery carts remain separate from the active table',async({page})=>{
  27 |  await page.goto('/demo/guest/home');await page.getByRole('button',{name:'Сканировать QR стола №12',exact:true}).click();await page.getByRole('button',{name:'Меню',exact:true}).click();await page.getByRole('button',{name:'Выбрать блюдо',exact:true}).first().click();await page.getByRole('button',{name:'В корзину',exact:true}).click();await expect(page.getByRole('dialog')).toHaveCount(0);const before=await state(page);
  28 |  await page.getByRole('button',{name:'Рядом',exact:true}).click();await page.locator('[data-venue-id="garden"]').getByRole('button',{name:'Доставка',exact:true}).click();const dialog=page.getByRole('dialog');await dialog.getByRole('button',{name:'Фото и состав',exact:true}).first().click();await dialog.getByRole('button',{name:'В корзину доставки',exact:true}).click();await page.keyboard.press('Escape');
  29 |  await page.locator('[data-venue-id="mira"]').getByRole('button',{name:'Доставка',exact:true}).click();await expect(dialog.getByText('Выберите блюда из меню этого заведения.',{exact:true})).toBeVisible();await page.keyboard.press('Escape');
  30 |  await page.locator('[data-venue-id="garden"]').getByRole('button',{name:'Доставка',exact:true}).click();await dialog.getByLabel('Адрес доставки',{exact:true}).fill('Демо-адрес, дом 12');await dialog.getByLabel('Телефон / контакт',{exact:true}).fill('Демо-гость');await dialog.getByRole('button',{name:'Оформить демо-доставку',exact:true}).click();await expect(dialog.getByText(/Демо-заявка .* создана/)).toBeVisible();
  31 |  const after=await state(page);for(const key of ['sessions','guests','orders','carts','payments','financialSplits'])expect(after[key]).toEqual(before[key]);expect(after.deliveries.length).toBe(before.deliveries.length+1);expect(after.deliveries.at(-1).items).toContain('garden');
  32 | });
  33 | 
  34 | test('anonymous venue menu does not create a table session',async({page})=>{
  35 |  await page.goto('/demo/guest/nearby');const before=await state(page);
  36 |  await page.locator('[data-venue-id="atelier"]').getByRole('button',{name:'Открыть',exact:true}).click();
  37 |  const dialog=page.getByRole('dialog');await dialog.getByRole('button',{name:'Меню',exact:true}).click();await dialog.getByRole('button',{name:'Фото и состав',exact:true}).first().click();await expect(dialog.getByText('Состав блюда',{exact:true})).toBeVisible();await expect(dialog.getByRole('button',{name:'В корзину доставки',exact:true})).toHaveCount(0);
  38 |  expect(await state(page)).toEqual(before);
  39 | });
  40 | 
```