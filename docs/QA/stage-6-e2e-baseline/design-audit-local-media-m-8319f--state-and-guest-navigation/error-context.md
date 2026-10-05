# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: design.spec.ts >> audit: local media, menu empty state and guest navigation
- Location: tests/e2e/design.spec.ts:33:1

# Error details

```
Error: expect(locator).toHaveJSProperty(expected) failed

Locator: locator('.dish-image').first()
Expected: true
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toHaveJSProperty" locator('.dish-image').first() with timeout 5000ms
  - waiting for locator('.dish-image').first()

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
    - button "Текущий стол 12": Стол 12
    - button "Уведомления"
    - button "Профиль"
  - navigation:
    - button "Главная"
    - button "Меню"
    - button "Заказ"
    - button "Счёт"
    - button "Официант"
  - button "Назад"
  - heading "Меню" [level=2]
  - text: Поиск блюда
  - textbox "Поиск блюда":
    - /placeholder: Название или описание
  - navigation "Категории меню":
    - button "Все" [pressed]
    - button "Закуски"
    - button "Салаты"
    - button "Супы"
    - button "Горячее"
    - button "Десерты"
    - button "Напитки"
  - img "Буррата с томатами"
  - heading "Буррата с томатами" [level=3]
  - paragraph: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 220 г
  - strong: 890,00 ₽
  - button "Выбрать блюдо"
  - img "Тартар из говядины"
  - heading "Тартар из говядины" [level=3]
  - paragraph: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 180 г
  - strong: 980,00 ₽
  - button "Выбрать блюдо"
  - img "Карпаччо из лосося"
  - heading "Карпаччо из лосося" [level=3]
  - paragraph: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 160 г
  - strong: 1 090,00 ₽
  - button "Выбрать блюдо"
  - img "Зелёный салат"
  - heading "Зелёный салат" [level=3]
  - paragraph: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 240 г
  - strong: 690,00 ₽
  - button "Выбрать блюдо"
  - img "Салат с креветками"
  - heading "Салат с креветками" [level=3]
  - paragraph: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 260 г
  - strong: 940,00 ₽
  - button "Выбрать блюдо"
  - img "Тёплый салат с уткой"
  - heading "Тёплый салат с уткой" [level=3]
  - paragraph: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 250 г
  - strong: 990,00 ₽
  - button "Выбрать блюдо"
  - img "Тыквенный крем-суп"
  - heading "Тыквенный крем-суп" [level=3]
  - paragraph: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 300 г
  - strong: 590,00 ₽
  - button "Выбрать блюдо"
  - img "Том ям"
  - heading "Том ям" [level=3]
  - paragraph: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 350 г
  - strong: 890,00 ₽
  - button "Выбрать блюдо"
  - img "Ризотто с грибами"
  - heading "Ризотто с грибами" [level=3]
  - paragraph: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 280 г
  - strong: 990,00 ₽
  - button "Выбрать блюдо"
  - img "Паста с креветками"
  - heading "Паста с креветками" [level=3]
  - paragraph: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 300 г
  - strong: 1 190,00 ₽
  - button "Выбрать блюдо"
  - img "Стейк рибай"
  - heading "Стейк рибай" [level=3]
  - paragraph: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 320 г
  - strong: 2 890,00 ₽
  - button "Выбрать блюдо"
  - img "Лосось на гриле"
  - heading "Лосось на гриле" [level=3]
  - paragraph: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 280 г
  - strong: 1 690,00 ₽
  - button "Выбрать блюдо"
  - img "Баскский чизкейк"
  - heading "Баскский чизкейк" [level=3]
  - paragraph: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 150 г
  - strong: 590,00 ₽
  - button "Выбрать блюдо"
  - img "Шоколадный фондан"
  - heading "Шоколадный фондан" [level=3]
  - paragraph: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 170 г
  - strong: 640,00 ₽
  - button "Выбрать блюдо"
  - img "Лимонад юдзу"
  - heading "Лимонад юдзу" [level=3]
  - paragraph: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 400 мл
  - strong: 390,00 ₽
  - button "Выбрать блюдо"
  - img "Капучино"
  - heading "Капучино" [level=3]
  - paragraph: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 250 мл
  - strong: 290,00 ₽
  - button "Выбрать блюдо"
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
  2  | const guestPages=['welcome','notifications','history','favorites','home','menu','order','bill','waiter','nearby','events','promotions','more','bonuses','profile','booking','review','powerbank','taxi','wifi','delivery','tips'];
  3  | for(const width of [360,375,390,430])test(`design: ${width}px, existing screens and touch targets`,async({page})=>{
  4  |  test.setTimeout(120000);await page.setViewportSize({width,height:844});
  5  |  await page.goto('/demo/guest/home');await page.getByRole('button',{name:'Сканировать QR стола №12',exact:true}).click();await expect(page.getByRole('button',{name:'Меню',exact:true})).toBeVisible();
  6  |  await page.getByRole('button',{name:'Меню',exact:true}).click();await page.getByRole('button',{name:'Выбрать блюдо',exact:true}).first().click();await expect(page.getByRole('dialog')).toBeVisible();const dialogBox=await page.getByRole('dialog').boundingBox();expect(dialogBox!.x).toBeGreaterThanOrEqual(-1);expect(dialogBox!.x+dialogBox!.width).toBeLessThanOrEqual(width+1);expect(dialogBox!.y+dialogBox!.height).toBeLessThanOrEqual(845);await page.screenshot({path:`.test-runtime/dialog-${width}.png`});await page.getByRole('button',{name:'В корзину',exact:true}).click();
  7  |  for(const route of ['/','/demo','/demo/waiter','/demo/admin','/demo/full-cycle',...guestPages.map(p=>`/demo/guest/${p}`)]){
  8  |   await page.goto(route,{waitUntil:'domcontentloaded'});if(route!=='/')await expect(page.locator('.demo-root')).not.toHaveAttribute('disabled','');
  9  |   await page.evaluate(()=>document.fonts.ready);
  10 |   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),route).toBe(true);
  11 |   const short=await page.locator('button:visible').evaluateAll(buttons=>buttons.filter(b=>b.getAttribute('role')!=='switch'&&b.getBoundingClientRect().height<43.5).map(b=>b.textContent));expect(short,route).toEqual([]);
  12 |   if(route.includes('/guest/')||route==='/demo/full-cycle')expect(await page.locator('.guest-theme').first().evaluate(el=>getComputedStyle(el).fontFamily)).toContain('Inter');
  13 |  }
  14 |  await page.screenshot({path:`.test-runtime/redesign-${width}.png`,fullPage:true});
  15 | });
  16 | test('design: desktop Full Cycle and existing admin sections',async({page})=>{await page.setViewportSize({width:1600,height:1000});await page.goto('/demo/full-cycle');await expect(page.locator('.full-panel')).toHaveCount(3);await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:'.test-runtime/redesign-desktop.png',fullPage:true});await page.goto('/demo/admin');for(const title of ['Обзор','Операции','Заказы','Зал и столы','Меню','Бронирования','Сотрудники','Гости','Лояльность','Акции','Промокоды','Отзывы','Платежи','Чаевые','Аналитика','Коммуникации','Интеграции','Тариф','Настройки','Сеть']){await page.getByRole('button',{name:title,exact:true}).click();await expect(page.getByRole('heading',{name:title,exact:true})).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)}});
  17 | 
  18 | test('welcome: supplied brand and entry preserve demo state',async({page})=>{
  19 |  await page.setViewportSize({width:390,height:844});
  20 |  await page.goto('/demo/guest/welcome');
  21 |  await expect(page.getByRole('heading',{name:'MIRA LINK',exact:true})).toBeVisible();
  22 |  await expect(page.locator('.demo-root')).not.toHaveAttribute('disabled','');
  23 |  await page.evaluate(()=>document.fonts.ready);
  24 |  const before=await page.evaluate(()=>localStorage.getItem('mira-link-demo-v1'));
  25 |  await page.screenshot({path:'.test-runtime/reference-welcome-390.png',fullPage:true});
  26 |  await page.getByRole('button',{name:'Начать',exact:true}).click();
  27 |  await expect(page.getByRole('button',{name:'Сканировать QR стола №12',exact:true})).toBeVisible();
  28 |  expect(await page.evaluate(()=>localStorage.getItem('mira-link-demo-v1'))).toBe(before);
  29 |  await page.getByRole('button',{name:'Сканировать QR стола №12',exact:true}).click();
  30 |  await page.screenshot({path:'.test-runtime/reference-home-390.png',fullPage:true});
  31 | });
  32 | 
  33 | test('audit: local media, menu empty state and guest navigation',async({page})=>{
  34 |  await page.setViewportSize({width:390,height:844});
  35 |  await page.goto('/');
  36 |  await expect(page.locator('.marketing-hero>img')).toHaveJSProperty('complete',true);
  37 |  expect(await page.locator('.marketing-hero>img').evaluate((img:HTMLImageElement)=>img.naturalWidth)).toBeGreaterThan(0);
  38 |  await page.screenshot({path:'.test-runtime/audit-landing-mobile.png',fullPage:true});
  39 |  await page.goto('/demo/guest/home');
  40 |  await page.getByRole('button',{name:'Сканировать QR стола №12',exact:true}).click();
  41 |  await page.getByRole('button',{name:'Меню',exact:true}).click();
> 42 |  await expect(page.locator('.dish-image').first()).toHaveJSProperty('complete',true);
     |                                                    ^ Error: expect(locator).toHaveJSProperty(expected) failed
  43 |  expect(await page.locator('.dish-image').first().evaluate((img:HTMLImageElement)=>img.naturalWidth)).toBeGreaterThan(0);
  44 |  await page.getByLabel('Поиск блюда',{exact:true}).fill('неттакогоблюда');
  45 |  await expect(page.getByText('Ничего не найдено. Попробуйте другое название или категорию.',{exact:true})).toBeVisible();
  46 |  await expect(page.getByRole('button',{name:'Выбрать блюдо',exact:true})).toHaveCount(0);
  47 |  await page.getByRole('button',{name:'Уведомления',exact:true}).click();
  48 |  await expect(page.getByRole('heading',{name:'Уведомления',exact:true})).toBeVisible();
  49 |  await page.getByRole('button',{name:'Ещё',exact:true}).click();
  50 |  await page.getByRole('button',{name:'Профиль',exact:true}).last().click();await page.getByRole('button',{name:'Мои заказы и оплаты',exact:true}).click();
  51 |  await expect(page.getByText('История появится после первой оплаты.',{exact:true})).toBeVisible();
  52 |  await page.getByRole('button',{name:'Главная',exact:true}).first().click();
  53 |  await page.locator('.popular-dish img').first().scrollIntoViewIfNeeded();
  54 |  await expect(page.locator('.popular-dish img').first()).toHaveJSProperty('complete',true);
  55 |  await page.screenshot({path:'.test-runtime/audit-home-mobile.png',fullPage:true});
  56 |  await page.goto('/demo/waiter');
  57 |  await page.locator('.staff-floor summary').click();
  58 |  await expect(page.locator('.staff-tables .table-card')).toHaveCount(6);
  59 |  await page.getByRole('button',{name:'Готовы к подаче',exact:true}).click();
  60 |  await page.screenshot({path:'.test-runtime/audit-waiter-mobile.png',fullPage:true});
  61 | });
  62 | 
  63 | test('audit: venue details and nested navigation stay in the existing Guest',async({page})=>{
  64 |  await page.setViewportSize({width:360,height:800});await page.goto('/demo/guest/home');
  65 |  await page.getByRole('button',{name:'Сканировать QR стола №12',exact:true}).click();
  66 |  await page.getByRole('button',{name:'Меню',exact:true}).click();
  67 |  await expect(page.getByRole('navigation',{name:'Основная навигация гостя'}).getByRole('button',{name:'Главная',exact:true})).toHaveAttribute('aria-current','page');
  68 |  await page.getByRole('button',{name:'Рядом',exact:true}).click();
  69 |  await page.getByRole('button',{name:'Открыть',exact:true}).first().click();
  70 |  await expect(page.getByRole('dialog')).toBeVisible();
  71 |  await expect(page.getByRole('dialog').getByText('12:00–00:00',{exact:true})).toBeVisible();
  72 |  await page.getByRole('dialog').getByRole('button',{name:'Забронировать стол',exact:true}).click();
  73 |  await expect(page.getByLabel('Дата',{exact:true})).toBeVisible();
  74 |  await expect(page.getByRole('navigation',{name:'Основная навигация гостя'}).getByRole('button',{name:'Ещё',exact:true})).toHaveAttribute('aria-current','page');
  75 | });
  76 | 
```