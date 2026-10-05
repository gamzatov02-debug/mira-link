# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: nearby.spec.ts >> Nearby fallback, search and map selection share six venues
- Location: tests/e2e/nearby.spec.ts:13:1

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('.nearby-list article')
Expected: 6
Received: 0
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" locator('.nearby-list article') with timeout 5000ms
  - waiting for locator('.nearby-list article')
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
        - banner [ref=e35]:
          - heading "Рядом с вами" [level=2] [ref=e36]
          - paragraph [ref=e37]: Места рядом с вами
        - region "Местоположение" [ref=e38]:
          - text: Демо-область · Москва
          - paragraph [ref=e39]: Разрешите доступ к геопозиции, чтобы увидеть места рядом с вами
          - generic [ref=e40]:
            - button "Разрешить" [ref=e41] [cursor=pointer]
            - button "Демо-режим" [active] [ref=e43] [cursor=pointer]
        - generic [ref=e49]:
          - text: Найти место…
          - textbox "Найти место…" [ref=e50]:
            - /placeholder: Ресторан, кухня или блюдо
        - navigation "Фильтры заведений" [ref=e51]:
          - button "Все" [pressed] [ref=e52] [cursor=pointer]
          - button "Рестораны" [ref=e54] [cursor=pointer]
          - button "Кофе" [ref=e56] [cursor=pointer]
          - button "Кафе" [ref=e58] [cursor=pointer]
          - button "Доставка" [ref=e60] [cursor=pointer]
          - button "Акции" [ref=e62] [cursor=pointer]
        - region "Карта заведений рядом" [ref=e64]:
          - generic [ref=e65]:
            - generic:
              - generic:
                - button "Открыть MIRA Restaurant" [ref=e66] [cursor=pointer]:
                  - generic [ref=e67]: ●
                - button "Открыть Garden Café" [ref=e68] [cursor=pointer]:
                  - generic [ref=e69]: ●
                - button "Открыть Family Kitchen" [ref=e70] [cursor=pointer]:
                  - generic [ref=e71]: ●
                - button "Открыть Leaf Café" [ref=e72] [cursor=pointer]:
                  - generic [ref=e73]: ●
                - button "Открыть Atelier" [ref=e74] [cursor=pointer]:
                  - generic [ref=e75]: ●
                - button "Открыть Ember Grill" [ref=e76] [cursor=pointer]:
                  - generic [ref=e77]: ●
              - generic:
                - img:
                  - generic [ref=e78] [cursor=pointer]
            - generic:
              - generic [ref=e79]:
                - button "Zoom in" [ref=e80] [cursor=pointer]: +
                - button "Zoom out" [ref=e81] [cursor=pointer]: −
              - generic [ref=e82]:
                - link "Leaflet" [ref=e83] [cursor=pointer]:
                  - /url: https://leafletjs.com
                - text: "| ©"
                - link "OpenStreetMap" [ref=e88] [cursor=pointer]:
                  - /url: https://www.openstreetmap.org/copyright
          - generic [ref=e89]: Демо-карта Москвы · расположение заведений условное.
        - heading "Заведения рядом 6" [level=3] [ref=e90]
        - paragraph [ref=e91]: Демонстрационные заведения в Москве. Расстояния рассчитаны от демо-точки.
        - generic [ref=e92]:
          - generic [ref=e93]:
            - generic [ref=e94]:
              - img "MIRA Restaurant" [ref=e95]
              - generic [ref=e96]:
                - generic [ref=e97]: Вечер в MIRA
                - heading "MIRA Restaurant" [level=3] [ref=e98]
                - paragraph [ref=e99]: Современная кухня
                - generic [ref=e100]: Закрыто
                - button "Открыть" [ref=e103] [cursor=pointer]
            - generic [ref=e105]:
              - button "На карте" [ref=e106] [cursor=pointer]
              - button "Доставка" [ref=e108] [cursor=pointer]
          - generic [ref=e110]:
            - generic [ref=e111]:
              - img "Garden Café" [ref=e112]
              - generic [ref=e113]:
                - generic [ref=e114]: Сезонная коллекция десертов
                - heading "Garden Café" [level=3] [ref=e115]
                - paragraph [ref=e116]: Кофе и завтраки
                - generic [ref=e117]: Открыто
                - button "Открыть" [ref=e120] [cursor=pointer]
            - generic [ref=e122]:
              - button "На карте" [ref=e123] [cursor=pointer]
              - button "Доставка" [ref=e125] [cursor=pointer]
          - generic [ref=e127]:
            - generic [ref=e128]:
              - img "Family Kitchen" [ref=e129]
              - generic [ref=e130]:
                - heading "Family Kitchen" [level=3] [ref=e131]
                - paragraph [ref=e132]: Семейный ресторан
                - generic [ref=e133]: Открыто
                - button "Открыть" [ref=e136] [cursor=pointer]
            - generic [ref=e138]:
              - button "На карте" [ref=e139] [cursor=pointer]
              - button "Доставка" [ref=e141] [cursor=pointer]
          - generic [ref=e143]:
            - generic [ref=e144]:
              - img "Leaf Café" [ref=e145]
              - generic [ref=e146]:
                - generic [ref=e147]: Новое сезонное меню
                - heading "Leaf Café" [level=3] [ref=e148]
                - paragraph [ref=e149]: Кафе
                - generic [ref=e150]: Открыто
                - button "Открыть" [ref=e153] [cursor=pointer]
            - generic [ref=e155]:
              - button "На карте" [ref=e156] [cursor=pointer]
              - button "Доставка" [ref=e158] [cursor=pointer]
          - generic [ref=e160]:
            - generic [ref=e161]:
              - img "Atelier" [ref=e162]
              - generic [ref=e163]:
                - generic [ref=e164]: Ужин с шефом по субботам
                - heading "Atelier" [level=3] [ref=e165]
                - paragraph [ref=e166]: Авторская кухня
                - generic [ref=e167]: Закрыто
                - button "Открыть" [ref=e170] [cursor=pointer]
            - button "На карте" [ref=e173] [cursor=pointer]
          - generic [ref=e175]:
            - generic [ref=e176]:
              - img "Ember Grill" [ref=e177]
              - generic [ref=e178]:
                - heading "Ember Grill" [level=3] [ref=e179]
                - paragraph [ref=e180]: Гриль-ресторан
                - generic [ref=e181]: Закрыто
                - button "Открыть" [ref=e184] [cursor=pointer]
            - generic [ref=e186]:
              - button "На карте" [ref=e187] [cursor=pointer]
              - button "Доставка" [ref=e189] [cursor=pointer]
      - group [ref=e192]:
        - generic "Гости и устройства демо" [ref=e193] [cursor=pointer]
    - navigation "Основная навигация гостя" [ref=e194]:
      - button "Главная" [ref=e195] [cursor=pointer]
      - button "Меню" [ref=e200] [cursor=pointer]
      - button "Рядом" [ref=e205] [cursor=pointer]
      - button "Афиша" [ref=e209] [cursor=pointer]
      - button "Ещё" [ref=e214] [cursor=pointer]
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
> 15 |  await expect(page.locator('.nearby-list article')).toHaveCount(6);await expect(page.locator('.mira-map-pin')).toHaveCount(6);
     |                                                     ^ Error: expect(locator).toHaveCount(expected) failed
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