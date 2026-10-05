# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: nearby.spec.ts >> menu categories use two rows and preserve filtering at 390px
- Location: tests/e2e/nearby.spec.ts:3:1

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('.product-card')
Expected: 16
Received: 0
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" locator('.product-card') with timeout 5000ms
  - waiting for locator('.product-card')
    14 × locator resolved to 0 elements
       - unexpected value "0"

```

# Page snapshot

```yaml
- group "Демонстрация MIRA LINK" [ref=e2]:
  - banner [ref=e3]:
    - link "Вернуться на сайт" [ref=e4] [cursor=pointer]:
      - /url: /
      - generic [ref=e5]: ← Вернуться на сайт
    - generic [ref=e6]: ДЕМО · без реальных заказов и платежей
    - navigation "Режимы демо" [ref=e7]:
      - link "Все режимы" [ref=e8] [cursor=pointer]:
        - /url: /demo
      - link "Гость" [ref=e9] [cursor=pointer]:
        - /url: /demo/guest/welcome
      - link "Официант" [ref=e10] [cursor=pointer]:
        - /url: /demo/waiter
      - link "Администратор" [ref=e11] [cursor=pointer]:
        - /url: /demo/admin
      - link "Полный цикл" [ref=e12] [cursor=pointer]:
        - /url: /demo/full-cycle
      - button "Сбросить демо" [ref=e13] [cursor=pointer]
  - generic [ref=e17]:
    - generic [ref=e18]:
      - banner [ref=e19]:
        - generic [ref=e20]:
          - img "Монограмма MIRA LINK" [ref=e21]
          - generic [ref=e22]: MIRA LINK
        - generic [ref=e23]:
          - button "Уведомления" [ref=e24] [cursor=pointer]
          - button "Профиль" [ref=e29] [cursor=pointer]
      - generic [ref=e34]:
        - button "Назад" [ref=e35] [cursor=pointer]
        - heading "Меню" [level=2] [ref=e39]
      - generic [ref=e44]:
        - text: Поиск блюда
        - textbox "Поиск блюда" [ref=e45]:
          - /placeholder: Название или описание
      - navigation "Категории меню" [ref=e46]:
        - button "Все" [active] [pressed] [ref=e47] [cursor=pointer]
        - button "Закуски" [ref=e49] [cursor=pointer]
        - button "Салаты" [ref=e51] [cursor=pointer]
        - button "Супы" [ref=e53] [cursor=pointer]
        - button "Горячее" [ref=e55] [cursor=pointer]
        - button "Десерты" [ref=e57] [cursor=pointer]
        - button "Напитки" [ref=e59] [cursor=pointer]
      - generic [ref=e61]:
        - img "Буррата с томатами" [ref=e62]
        - generic [ref=e63]:
          - heading "Буррата с томатами" [level=3] [ref=e64]
          - paragraph [ref=e65]: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 220 г
          - strong [ref=e67]: 890,00 ₽
          - button "Выбрать блюдо" [ref=e68] [cursor=pointer]
      - generic [ref=e70]:
        - img "Тартар из говядины" [ref=e71]
        - generic [ref=e72]:
          - heading "Тартар из говядины" [level=3] [ref=e73]
          - paragraph [ref=e74]: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 180 г
          - strong [ref=e76]: 980,00 ₽
          - button "Выбрать блюдо" [ref=e77] [cursor=pointer]
      - generic [ref=e79]:
        - img "Карпаччо из лосося" [ref=e80]
        - generic [ref=e81]:
          - heading "Карпаччо из лосося" [level=3] [ref=e82]
          - paragraph [ref=e83]: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 160 г
          - strong [ref=e85]: 1 090,00 ₽
          - button "Выбрать блюдо" [ref=e86] [cursor=pointer]
      - generic [ref=e88]:
        - img "Зелёный салат" [ref=e89]
        - generic [ref=e90]:
          - heading "Зелёный салат" [level=3] [ref=e91]
          - paragraph [ref=e92]: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 240 г
          - strong [ref=e94]: 690,00 ₽
          - button "Выбрать блюдо" [ref=e95] [cursor=pointer]
      - generic [ref=e97]:
        - img "Салат с креветками" [ref=e98]
        - generic [ref=e99]:
          - heading "Салат с креветками" [level=3] [ref=e100]
          - paragraph [ref=e101]: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 260 г
          - strong [ref=e103]: 940,00 ₽
          - button "Выбрать блюдо" [ref=e104] [cursor=pointer]
      - generic [ref=e106]:
        - img "Тёплый салат с уткой" [ref=e107]
        - generic [ref=e108]:
          - heading "Тёплый салат с уткой" [level=3] [ref=e109]
          - paragraph [ref=e110]: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 250 г
          - strong [ref=e112]: 990,00 ₽
          - button "Выбрать блюдо" [ref=e113] [cursor=pointer]
      - generic [ref=e115]:
        - img "Тыквенный крем-суп" [ref=e116]
        - generic [ref=e117]:
          - heading "Тыквенный крем-суп" [level=3] [ref=e118]
          - paragraph [ref=e119]: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 300 г
          - strong [ref=e121]: 590,00 ₽
          - button "Выбрать блюдо" [ref=e122] [cursor=pointer]
      - generic [ref=e124]:
        - img "Том ям" [ref=e125]
        - generic [ref=e126]:
          - heading "Том ям" [level=3] [ref=e127]
          - paragraph [ref=e128]: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 350 г
          - strong [ref=e130]: 890,00 ₽
          - button "Выбрать блюдо" [ref=e131] [cursor=pointer]
      - generic [ref=e133]:
        - img "Ризотто с грибами" [ref=e134]
        - generic [ref=e135]:
          - heading "Ризотто с грибами" [level=3] [ref=e136]
          - paragraph [ref=e137]: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 280 г
          - strong [ref=e139]: 990,00 ₽
          - button "Выбрать блюдо" [ref=e140] [cursor=pointer]
      - generic [ref=e142]:
        - img "Паста с креветками" [ref=e143]
        - generic [ref=e144]:
          - heading "Паста с креветками" [level=3] [ref=e145]
          - paragraph [ref=e146]: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 300 г
          - strong [ref=e148]: 1 190,00 ₽
          - button "Выбрать блюдо" [ref=e149] [cursor=pointer]
      - generic [ref=e151]:
        - img "Стейк рибай" [ref=e152]
        - generic [ref=e153]:
          - heading "Стейк рибай" [level=3] [ref=e154]
          - paragraph [ref=e155]: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 320 г
          - strong [ref=e157]: 2 890,00 ₽
          - button "Выбрать блюдо" [ref=e158] [cursor=pointer]
      - generic [ref=e160]:
        - img "Лосось на гриле" [ref=e161]
        - generic [ref=e162]:
          - heading "Лосось на гриле" [level=3] [ref=e163]
          - paragraph [ref=e164]: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 280 г
          - strong [ref=e166]: 1 690,00 ₽
          - button "Выбрать блюдо" [ref=e167] [cursor=pointer]
      - generic [ref=e169]:
        - img "Баскский чизкейк" [ref=e170]
        - generic [ref=e171]:
          - heading "Баскский чизкейк" [level=3] [ref=e172]
          - paragraph [ref=e173]: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 150 г
          - strong [ref=e175]: 590,00 ₽
          - button "Выбрать блюдо" [ref=e176] [cursor=pointer]
      - generic [ref=e178]:
        - img "Шоколадный фондан" [ref=e179]
        - generic [ref=e180]:
          - heading "Шоколадный фондан" [level=3] [ref=e181]
          - paragraph [ref=e182]: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 170 г
          - strong [ref=e184]: 640,00 ₽
          - button "Выбрать блюдо" [ref=e185] [cursor=pointer]
      - generic [ref=e187]:
        - img "Лимонад юдзу" [ref=e188]
        - generic [ref=e189]:
          - heading "Лимонад юдзу" [level=3] [ref=e190]
          - paragraph [ref=e191]: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 400 мл
          - strong [ref=e193]: 390,00 ₽
          - button "Выбрать блюдо" [ref=e194] [cursor=pointer]
      - generic [ref=e196]:
        - img "Капучино" [ref=e197]
        - generic [ref=e198]:
          - heading "Капучино" [level=3] [ref=e199]
          - paragraph [ref=e200]: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 250 мл
          - strong [ref=e202]: 290,00 ₽
          - button "Выбрать блюдо" [ref=e203] [cursor=pointer]
      - group [ref=e206]:
        - generic "Гости и устройства демо" [ref=e207] [cursor=pointer]
    - navigation "Основная навигация гостя" [ref=e208]:
      - button "Главная" [ref=e209] [cursor=pointer]
      - button "Меню" [ref=e214] [cursor=pointer]
      - button "Рядом" [ref=e219] [cursor=pointer]
      - button "Афиша" [ref=e223] [cursor=pointer]
      - button "Ещё" [ref=e228] [cursor=pointer]
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
> 8  |  await nav.getByRole('button',{name:'Все',exact:true}).click();await expect(page.locator('.product-card')).toHaveCount(16);
     |                                                                                                            ^ Error: expect(locator).toHaveCount(expected) failed
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
  24 |  await context.grantPermissions(['geolocation']);await context.setGeolocation({latitude:55.771,longitude:37.608});await page.goto('/demo/guest/nearby');await expect(page.getByText('Ваша геопозиция',{exact:true})).toBeVisible();await expect(page.locator('.nearby-list article').first()).toHaveAttribute('data-venue-id','ember');expect(Number(await page.locator('.nearby-list article').first().getAttribute('data-distance'))).toBeLessThan(1);
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