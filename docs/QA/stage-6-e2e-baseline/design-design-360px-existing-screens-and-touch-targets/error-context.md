# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: design.spec.ts >> design: 360px, existing screens and touch targets
- Location: tests/e2e/design.spec.ts:3:38

# Error details

```
Error: /demo/full-cycle

expect(received).toEqual(expected) // deep equality

- Expected  -  1
+ Received  + 11

- Array []
+ Array [
+   "Открыть меню ",
+   "Смотреть всё →",
+   "Выбрать блюдо",
+   "Выбрать блюдо",
+   "Выбрать блюдо",
+   "Выбрать блюдо",
+   "Выбрать блюдо",
+   "Выбрать блюдо",
+   "Оформить →",
+ ]
```

# Page snapshot

```yaml
- group "Демонстрация MIRA LINK" [ref=f5e2]:
  - banner [ref=f5e3]:
    - link "Вернуться на сайт" [ref=f5e4] [cursor=pointer]:
      - /url: /
      - generic [ref=f5e5]:
        - img "Монограмма MIRA LINK" [ref=f5e6]
        - generic [ref=f5e7]:
          - text: MIRA LINK
          - generic [ref=f5e8]: PEOPLE · TASTE · TECHNOLOGY
    - generic [ref=f5e9]: ДЕМО · без реальных заказов и платежей
    - navigation "Режимы демо" [ref=f5e10]:
      - link "Все режимы" [ref=f5e11] [cursor=pointer]:
        - /url: /demo
      - link "Гость" [ref=f5e12] [cursor=pointer]:
        - /url: /demo/guest/welcome
      - link "Официант" [ref=f5e13] [cursor=pointer]:
        - /url: /demo/waiter
      - link "Администратор" [ref=f5e14] [cursor=pointer]:
        - /url: /demo/admin
      - link "Полный цикл" [ref=f5e15] [cursor=pointer]:
        - /url: /demo/full-cycle
      - button "Сбросить демо" [ref=f5e16] [cursor=pointer]
  - main [ref=f5e18]:
    - generic [ref=f5e19]:
      - heading "Полный цикл" [level=1] [ref=f5e20]
      - generic [ref=f5e21]:
        - generic [ref=f5e22]: Пройти сценарий
        - switch "Пройти сценарий" [checked] [ref=f5e23] [cursor=pointer]
    - generic [ref=f5e24]:
      - strong [ref=f5e38]: Шаг 2 из 12
      - paragraph [ref=f5e39]: Откройте «Гости и устройства демо», нажмите «Новое устройство» и подтвердите присоединение
    - generic [ref=f5e40]:
      - generic [ref=f5e41]:
        - generic [ref=f5e42]: 01 / ГОСТЬ
        - generic [ref=f5e44]:
          - generic [ref=f5e45]:
            - generic [ref=f5e46]:
              - generic [ref=f5e47]:
                - img "Монограмма MIRA LINK" [ref=f5e48]
                - generic [ref=f5e49]: MIRA LINK
              - generic [ref=f5e50]:
                - button "Текущий стол 12" [ref=f5e51] [cursor=pointer]:
                  - generic [ref=f5e57]: Стол 12
                - button "Уведомления" [ref=f5e60] [cursor=pointer]
                - button "Профиль" [ref=f5e65] [cursor=pointer]
            - region "Ресторан" [ref=f5e70]:
              - img "MIRA Restaurant · 1" [ref=f5e71]
              - generic [ref=f5e72]:
                - text: РЕСТОРАН
                - heading "MIRA Restaurant" [level=2] [ref=f5e73]
                - paragraph [ref=f5e74]: Современная кухня. Время для вашего вечера.
              - button "Открыть меню" [ref=f5e75] [cursor=pointer]
              - generic [ref=f5e79]:
                - generic [ref=f5e80]: 1/4
                - button "Предыдущий слайд" [ref=f5e81] [cursor=pointer]
                - button "Следующий слайд" [ref=f5e84] [cursor=pointer]
            - navigation "Быстрые действия" [ref=f5e87]:
              - button "Меню — быстрое действие" [ref=f5e88] [cursor=pointer]:
                - generic [ref=f5e94]: Меню
                - generic [ref=f5e95]: Блюда и напитки
              - button "Заказ" [ref=f5e96] [cursor=pointer]:
                - generic [ref=f5e100]: Ваши позиции
              - button "Счёт" [ref=f5e101] [cursor=pointer]:
                - generic [ref=f5e106]: Оплата за столом
              - button "Официант" [ref=f5e107] [cursor=pointer]:
                - generic [ref=f5e112]: Команда рядом
              - button "Split" [ref=f5e113] [cursor=pointer]:
                - generic [ref=f5e120]: Разделить счёт
              - button "Чаевые" [ref=f5e121] [cursor=pointer]:
                - generic [ref=f5e125]: Поблагодарить
              - button "Пауэрбанк" [ref=f5e126] [cursor=pointer]:
                - generic [ref=f5e132]: Зарядка рядом
              - button "Такси" [ref=f5e133] [cursor=pointer]:
                - generic [ref=f5e139]: Поездка домой
            - generic [ref=f5e140]:
              - generic [ref=f5e143]:
                - strong [ref=f5e144]: Вечер в MIRA
                - generic [ref=f5e145]: Предложения вашего ресторана
              - img "Десерт ресторана" [ref=f5e146]
              - button "Посмотреть акции" [ref=f5e147] [cursor=pointer]
            - generic [ref=f5e150]:
              - generic [ref=f5e151]:
                - heading "Популярное" [level=2] [ref=f5e152]
                - button "Смотреть всё →" [ref=f5e153] [cursor=pointer]
              - generic [ref=f5e155]:
                - generic [ref=f5e156]:
                  - img "Буррата с томатами" [ref=f5e157]
                  - generic [ref=f5e158]:
                    - 'button "В избранное: Буррата с томатами" [ref=f5e159] [cursor=pointer]'
                    - heading "Буррата с томатами" [level=3] [ref=f5e163]
                    - paragraph [ref=f5e164]: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 220 г
                    - strong [ref=f5e166]: 890 ₽
                    - button "Выбрать блюдо" [ref=f5e167] [cursor=pointer]
                - generic [ref=f5e169]:
                  - img "Тартар из говядины" [ref=f5e170]
                  - generic [ref=f5e171]:
                    - 'button "В избранное: Тартар из говядины" [ref=f5e172] [cursor=pointer]'
                    - heading "Тартар из говядины" [level=3] [ref=f5e176]
                    - paragraph [ref=f5e177]: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 180 г
                    - strong [ref=f5e179]: 980 ₽
                    - button "Выбрать блюдо" [ref=f5e180] [cursor=pointer]
                - generic [ref=f5e182]:
                  - img "Карпаччо из лосося" [ref=f5e183]
                  - generic [ref=f5e184]:
                    - 'button "В избранное: Карпаччо из лосося" [ref=f5e185] [cursor=pointer]'
                    - heading "Карпаччо из лосося" [level=3] [ref=f5e189]
                    - paragraph [ref=f5e190]: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 160 г
                    - strong [ref=f5e192]: 1 090 ₽
                    - button "Выбрать блюдо" [ref=f5e193] [cursor=pointer]
                - generic [ref=f5e195]:
                  - img "Зелёный салат" [ref=f5e196]
                  - generic [ref=f5e197]:
                    - 'button "В избранное: Зелёный салат" [ref=f5e198] [cursor=pointer]'
                    - heading "Зелёный салат" [level=3] [ref=f5e202]
                    - paragraph [ref=f5e203]: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 240 г
                    - strong [ref=f5e205]: 690 ₽
                    - button "Выбрать блюдо" [ref=f5e206] [cursor=pointer]
                - generic [ref=f5e208]:
                  - img "Салат с креветками" [ref=f5e209]
                  - generic [ref=f5e210]:
                    - 'button "В избранное: Салат с креветками" [ref=f5e211] [cursor=pointer]'
                    - heading "Салат с креветками" [level=3] [ref=f5e215]
                    - paragraph [ref=f5e216]: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 260 г
                    - strong [ref=f5e218]: 940 ₽
                    - button "Выбрать блюдо" [ref=f5e219] [cursor=pointer]
                - generic [ref=f5e221]:
                  - img "Тёплый салат с уткой" [ref=f5e222]
                  - generic [ref=f5e223]:
                    - 'button "В избранное: Тёплый салат с уткой" [ref=f5e224] [cursor=pointer]'
                    - heading "Тёплый салат с уткой" [level=3] [ref=f5e228]
                    - paragraph [ref=f5e229]: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 250 г
                    - strong [ref=f5e231]: 990 ₽
                    - button "Выбрать блюдо" [ref=f5e232] [cursor=pointer]
            - group [ref=f5e235]:
              - generic "Гости и устройства демо" [ref=f5e236] [cursor=pointer]
              - option "Новое устройство"
              - option "Гость 1 · анонимно · session-1" [selected]
          - generic "Корзина" [ref=f5e237]:
            - img "Буррата с томатами — пример подачи" [ref=f5e239]
            - generic [ref=f5e240]:
              - strong [ref=f5e241]: Ваш заказ
              - generic [ref=f5e242]: 1 поз. · 890 ₽
            - button "Оформить →" [ref=f5e243] [cursor=pointer]
          - navigation "Основная навигация гостя" [ref=f5e245]:
            - button "Главная" [ref=f5e246] [cursor=pointer]
            - button "Меню" [ref=f5e251] [cursor=pointer]
            - button "Рядом" [ref=f5e256] [cursor=pointer]
            - button "Афиша" [ref=f5e260] [cursor=pointer]
            - button "Ещё" [ref=f5e265] [cursor=pointer]
      - generic [ref=f5e269]:
        - generic [ref=f5e270]:
          - text: 02 / ОФИЦИАНТ
          - generic [ref=f5e271]: 0 заказов
        - generic [ref=f5e272]:
          - generic [ref=f5e273]: РАБОЧАЯ СМЕНА · 12:00–00:00
          - heading "Александр" [level=2] [ref=f5e274]
          - paragraph [ref=f5e275]: Столы 7, 8, 9, 10, 11, 12 · 0 заказов в работе
          - generic [ref=f5e276]:
            - generic [ref=f5e277]:
              - text: Готовы к подаче
              - strong [ref=f5e278]: "0"
            - generic [ref=f5e279]:
              - text: Личные чаевые
              - strong [ref=f5e280]: 0,00 ₽
          - group [ref=f5e281]:
            - generic "Мои столы · 6" [ref=f5e282] [cursor=pointer]
          - region "Меню и заказ официанта" [ref=f5e283]:
            - generic [ref=f5e284]:
              - button "Оформить заказ за гостя" [ref=f5e285] [cursor=pointer]
              - button "Меню для показа гостю" [ref=f5e287] [cursor=pointer]
          - heading "Вызовы" [level=3] [ref=f5e289]
          - generic [ref=f5e290]: Активных вызовов нет. Обращения гостей появятся здесь.
          - heading "Наличные" [level=3] [ref=f5e295]
          - generic [ref=f5e296]: Нет оплат, ожидающих подтверждения.
          - heading "Заказы" [level=3] [ref=f5e301]
          - navigation "Фильтр заказов" [ref=f5e302]:
            - button "Все заказы" [pressed] [ref=f5e303] [cursor=pointer]
            - button "Новые" [ref=f5e305] [cursor=pointer]
            - button "Готовы к подаче" [ref=f5e307] [cursor=pointer]
            - button "Ошибка POS" [ref=f5e309] [cursor=pointer]
          - generic [ref=f5e311]: Новые заказы появятся здесь автоматически.
      - generic [ref=f5e316]:
        - generic [ref=f5e317]:
          - text: 03 / АДМИНИСТРАТОР
          - generic [ref=f5e318]: 1 посещений
        - generic [ref=f5e319]:
          - navigation "Разделы администратора" [ref=f5e320]:
            - button "Обзор" [ref=f5e321] [cursor=pointer]
            - button "Операции" [ref=f5e328] [cursor=pointer]
            - button "Заказы" [ref=f5e336] [cursor=pointer]
            - button "Зал и столы" [ref=f5e340] [cursor=pointer]
            - button "Меню" [ref=f5e344] [cursor=pointer]
            - button "Бронирования" [ref=f5e351] [cursor=pointer]
            - button "Сотрудники" [ref=f5e355] [cursor=pointer]
            - button "Гости" [ref=f5e362] [cursor=pointer]
            - button "Лояльность" [ref=f5e367] [cursor=pointer]
            - button "Акции" [ref=f5e371] [cursor=pointer]
            - button "Промокоды" [ref=f5e376] [cursor=pointer]
            - button "Отзывы" [ref=f5e380] [cursor=pointer]
            - button "Платежи" [ref=f5e384] [cursor=pointer]
            - button "Чаевые" [ref=f5e389] [cursor=pointer]
            - button "Аналитика" [ref=f5e393] [cursor=pointer]
            - button "Коммуникации" [ref=f5e397] [cursor=pointer]
            - button "Интеграции" [ref=f5e402] [cursor=pointer]
            - button "Тариф" [ref=f5e406] [cursor=pointer]
            - button "Настройки" [ref=f5e410] [cursor=pointer]
            - button "Сеть" [ref=f5e415] [cursor=pointer]
          - generic [ref=f5e421]:
            - generic [ref=f5e422]: КАБИНЕТ ЗАВЕДЕНИЯ
            - heading "Обзор" [level=2] [ref=f5e423]
            - generic [ref=f5e424]:
              - generic [ref=f5e425]:
                - text: Выручка
                - strong [ref=f5e426]: 0,00 ₽
              - generic [ref=f5e427]:
                - text: Посещения
                - strong [ref=f5e428]: "1"
              - generic [ref=f5e429]:
                - text: Заказы
                - strong [ref=f5e430]: "0"
              - generic [ref=f5e431]:
                - text: Средний чек
                - strong [ref=f5e432]: 0,00 ₽
              - generic [ref=f5e433]:
                - text: Активные столы
                - strong [ref=f5e434]: "1"
              - generic [ref=f5e435]:
                - text: Онлайн
                - strong [ref=f5e436]: 0,00 ₽
              - generic [ref=f5e437]:
                - text: Наличные
                - strong [ref=f5e438]: 0,00 ₽
              - generic [ref=f5e439]:
                - text: Чаевые
                - strong [ref=f5e440]: 0,00 ₽
              - generic [ref=f5e441]:
                - text: Доп. чаевые
                - strong [ref=f5e442]: 0,00 ₽
              - generic [ref=f5e443]:
                - text: Начислено бонусов
                - strong [ref=f5e444]: 0,00 ₽
              - generic [ref=f5e445]:
                - text: Списано бонусов
                - strong [ref=f5e446]: 0,00 ₽
              - generic [ref=f5e447]:
                - text: Вызовы
                - strong [ref=f5e448]: "0"
              - generic [ref=f5e449]:
                - text: Ошибки
                - strong [ref=f5e450]: "0"
              - generic [ref=f5e451]:
                - text: Неоплачено
                - strong [ref=f5e452]: 0,00 ₽
            - heading "Последние заказы" [level=3] [ref=f5e453]
            - generic [ref=f5e454]: Новые заказы появятся здесь автоматически.
    - group [ref=f5e459]:
      - generic "Журнал событий · 2" [ref=f5e460] [cursor=pointer]
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
> 11 |   const short=await page.locator('button:visible').evaluateAll(buttons=>buttons.filter(b=>b.getAttribute('role')!=='switch'&&b.getBoundingClientRect().height<43.5).map(b=>b.textContent));expect(short,route).toEqual([]);
     |                                                                                                                                                                                                                ^ Error: /demo/full-cycle
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
  42 |  await expect(page.locator('.dish-image').first()).toHaveJSProperty('complete',true);
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