# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: guest-service.spec.ts >> all sixteen dishes have local photos and recipes in Guest, Waiter and Admin
- Location: tests/e2e/guest-service.spec.ts:3:1

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('.product-card img')
Expected: 16
Received: 0
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" locator('.product-card img') with timeout 5000ms
  - waiting for locator('.product-card img')
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
          - button "Текущий стол 12" [ref=e24] [cursor=pointer]:
            - generic [ref=e30]: Стол 12
          - button "Уведомления" [ref=e33] [cursor=pointer]
          - button "Профиль" [ref=e38] [cursor=pointer]
      - navigation [ref=e43]:
        - button "Главная" [ref=e44] [cursor=pointer]
        - button "Меню" [ref=e49] [cursor=pointer]
        - button "Заказ" [ref=e56] [cursor=pointer]
        - button "Счёт" [ref=e60] [cursor=pointer]
        - button "Официант" [ref=e65] [cursor=pointer]
      - generic [ref=e70]:
        - button "Назад" [ref=e71] [cursor=pointer]
        - heading "Меню" [level=2] [ref=e75]
      - generic [ref=e80]:
        - text: Поиск блюда
        - textbox "Поиск блюда" [ref=e81]:
          - /placeholder: Название или описание
      - navigation "Категории меню" [ref=e82]:
        - button "Все" [pressed] [ref=e83] [cursor=pointer]
        - button "Закуски" [ref=e85] [cursor=pointer]
        - button "Салаты" [ref=e87] [cursor=pointer]
        - button "Супы" [ref=e89] [cursor=pointer]
        - button "Горячее" [ref=e91] [cursor=pointer]
        - button "Десерты" [ref=e93] [cursor=pointer]
        - button "Напитки" [ref=e95] [cursor=pointer]
      - generic [ref=e97]:
        - img "Буррата с томатами" [ref=e98]
        - generic [ref=e99]:
          - heading "Буррата с томатами" [level=3] [ref=e100]
          - paragraph [ref=e101]: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 220 г
          - strong [ref=e103]: 890,00 ₽
          - button "Выбрать блюдо" [ref=e104] [cursor=pointer]
      - generic [ref=e106]:
        - img "Тартар из говядины" [ref=e107]
        - generic [ref=e108]:
          - heading "Тартар из говядины" [level=3] [ref=e109]
          - paragraph [ref=e110]: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 180 г
          - strong [ref=e112]: 980,00 ₽
          - button "Выбрать блюдо" [ref=e113] [cursor=pointer]
      - generic [ref=e115]:
        - img "Карпаччо из лосося" [ref=e116]
        - generic [ref=e117]:
          - heading "Карпаччо из лосося" [level=3] [ref=e118]
          - paragraph [ref=e119]: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 160 г
          - strong [ref=e121]: 1 090,00 ₽
          - button "Выбрать блюдо" [ref=e122] [cursor=pointer]
      - generic [ref=e124]:
        - img "Зелёный салат" [ref=e125]
        - generic [ref=e126]:
          - heading "Зелёный салат" [level=3] [ref=e127]
          - paragraph [ref=e128]: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 240 г
          - strong [ref=e130]: 690,00 ₽
          - button "Выбрать блюдо" [ref=e131] [cursor=pointer]
      - generic [ref=e133]:
        - img "Салат с креветками" [ref=e134]
        - generic [ref=e135]:
          - heading "Салат с креветками" [level=3] [ref=e136]
          - paragraph [ref=e137]: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 260 г
          - strong [ref=e139]: 940,00 ₽
          - button "Выбрать блюдо" [ref=e140] [cursor=pointer]
      - generic [ref=e142]:
        - img "Тёплый салат с уткой" [ref=e143]
        - generic [ref=e144]:
          - heading "Тёплый салат с уткой" [level=3] [ref=e145]
          - paragraph [ref=e146]: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 250 г
          - strong [ref=e148]: 990,00 ₽
          - button "Выбрать блюдо" [ref=e149] [cursor=pointer]
      - generic [ref=e151]:
        - img "Тыквенный крем-суп" [ref=e152]
        - generic [ref=e153]:
          - heading "Тыквенный крем-суп" [level=3] [ref=e154]
          - paragraph [ref=e155]: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 300 г
          - strong [ref=e157]: 590,00 ₽
          - button "Выбрать блюдо" [ref=e158] [cursor=pointer]
      - generic [ref=e160]:
        - img "Том ям" [ref=e161]
        - generic [ref=e162]:
          - heading "Том ям" [level=3] [ref=e163]
          - paragraph [ref=e164]: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 350 г
          - strong [ref=e166]: 890,00 ₽
          - button "Выбрать блюдо" [ref=e167] [cursor=pointer]
      - generic [ref=e169]:
        - img "Ризотто с грибами" [ref=e170]
        - generic [ref=e171]:
          - heading "Ризотто с грибами" [level=3] [ref=e172]
          - paragraph [ref=e173]: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 280 г
          - strong [ref=e175]: 990,00 ₽
          - button "Выбрать блюдо" [ref=e176] [cursor=pointer]
      - generic [ref=e178]:
        - img "Паста с креветками" [ref=e179]
        - generic [ref=e180]:
          - heading "Паста с креветками" [level=3] [ref=e181]
          - paragraph [ref=e182]: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 300 г
          - strong [ref=e184]: 1 190,00 ₽
          - button "Выбрать блюдо" [ref=e185] [cursor=pointer]
      - generic [ref=e187]:
        - img "Стейк рибай" [ref=e188]
        - generic [ref=e189]:
          - heading "Стейк рибай" [level=3] [ref=e190]
          - paragraph [ref=e191]: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 320 г
          - strong [ref=e193]: 2 890,00 ₽
          - button "Выбрать блюдо" [ref=e194] [cursor=pointer]
      - generic [ref=e196]:
        - img "Лосось на гриле" [ref=e197]
        - generic [ref=e198]:
          - heading "Лосось на гриле" [level=3] [ref=e199]
          - paragraph [ref=e200]: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 280 г
          - strong [ref=e202]: 1 690,00 ₽
          - button "Выбрать блюдо" [ref=e203] [cursor=pointer]
      - generic [ref=e205]:
        - img "Баскский чизкейк" [ref=e206]
        - generic [ref=e207]:
          - heading "Баскский чизкейк" [level=3] [ref=e208]
          - paragraph [ref=e209]: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 150 г
          - strong [ref=e211]: 590,00 ₽
          - button "Выбрать блюдо" [ref=e212] [cursor=pointer]
      - generic [ref=e214]:
        - img "Шоколадный фондан" [ref=e215]
        - generic [ref=e216]:
          - heading "Шоколадный фондан" [level=3] [ref=e217]
          - paragraph [ref=e218]: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 170 г
          - strong [ref=e220]: 640,00 ₽
          - button "Выбрать блюдо" [ref=e221] [cursor=pointer]
      - generic [ref=e223]:
        - img "Лимонад юдзу" [ref=e224]
        - generic [ref=e225]:
          - heading "Лимонад юдзу" [level=3] [ref=e226]
          - paragraph [ref=e227]: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 400 мл
          - strong [ref=e229]: 390,00 ₽
          - button "Выбрать блюдо" [ref=e230] [cursor=pointer]
      - generic [ref=e232]:
        - img "Капучино" [ref=e233]
        - generic [ref=e234]:
          - heading "Капучино" [level=3] [ref=e235]
          - paragraph [ref=e236]: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 250 мл
          - strong [ref=e238]: 290,00 ₽
          - button "Выбрать блюдо" [ref=e239] [cursor=pointer]
      - group [ref=e242]:
        - generic "Гости и устройства демо" [ref=e243] [cursor=pointer]
        - option "Новое устройство"
        - option "Гость 1 · анонимно · session-1" [selected]
    - navigation "Основная навигация гостя" [ref=e244]:
      - button "Главная" [ref=e245] [cursor=pointer]
      - button "Меню" [active] [ref=e250] [cursor=pointer]
      - button "Рядом" [ref=e255] [cursor=pointer]
      - button "Афиша" [ref=e259] [cursor=pointer]
      - button "Ещё" [ref=e264] [cursor=pointer]
```

# Test source

```ts
  1  | import {test,expect} from '@playwright/test';
  2  | 
  3  | test('all sixteen dishes have local photos and recipes in Guest, Waiter and Admin',async({page,request})=>{
  4  |  test.setTimeout(90000);
  5  |  for(let i=1;i<=16;i++){const response=await request.get(i===1?'/images/burrata.png':`/images/menu/p${i}.png`);expect(response.ok()).toBe(true);expect(response.headers()['content-type']).toContain('image/')}
> 6  |  await page.goto('/demo/guest/home');await page.getByRole('button',{name:'Сканировать QR стола №12',exact:true}).click();await page.getByRole('button',{name:'Меню',exact:true}).click();await expect(page.locator('.product-card img')).toHaveCount(16);
     |                                                                                                                                                                                                                                          ^ Error: expect(locator).toHaveCount(expected) failed
  7  |  await page.getByRole('button',{name:'Выбрать блюдо',exact:true}).nth(1).click();await expect(page.getByRole('dialog').getByText('Состав блюда',{exact:true})).toBeVisible();await expect(page.getByRole('dialog').locator('img')).toHaveJSProperty('complete',true);await page.keyboard.press('Escape');
  8  |  await page.goto('/demo/waiter');await page.getByRole('button',{name:'Меню для показа гостю',exact:true}).click();await expect(page.locator('.staff-product img')).toHaveCount(16);await page.getByLabel('Поиск в меню сотрудника',{exact:true}).fill('Рибай');await page.getByRole('button',{name:'Фото и состав',exact:true}).click();await expect(page.getByRole('dialog').getByText(/Говяжий рибай, сливочное масло/)).toBeVisible();await page.keyboard.press('Escape');
  9  |  await page.goto('/demo/admin');await page.getByRole('button',{name:'Меню',exact:true}).click();await expect(page.locator('.admin-content .dish-image')).toHaveCount(16);await page.getByRole('button',{name:'Показать фото и состав',exact:true}).nth(15).click();await expect(page.getByRole('dialog').getByText(/Эспрессо, молоко/)).toBeVisible();
  10 | });
  11 | 
  12 | test('waiter order joins the current session and leaves the guest cart intact',async({page,context})=>{
  13 |  await page.setViewportSize({width:390,height:844});await page.goto('/demo/guest/home');await page.getByRole('button',{name:'Сканировать QR стола №12',exact:true}).click();await page.getByRole('button',{name:'Меню',exact:true}).click();await page.getByRole('button',{name:'Выбрать блюдо',exact:true}).first().click();await page.getByRole('button',{name:'В корзину',exact:true}).click();
  14 |  const waiter=await context.newPage();await waiter.setViewportSize({width:390,height:844});await waiter.goto('/demo/waiter');await waiter.getByRole('button',{name:'Оформить заказ за гостя',exact:true}).click();await waiter.getByLabel('Гость для заказа',{exact:true}).selectOption({label:'Гость 1'});await waiter.getByLabel('Поиск в меню сотрудника',{exact:true}).fill('Рибай');await waiter.getByRole('button',{name:'Фото и состав',exact:true}).click();await expect(waiter.getByRole('button',{name:'Добавить в заказ официанта',exact:true})).toBeDisabled();await waiter.getByRole('radio',{name:/Medium/}).check();await waiter.getByLabel('Количество порций',{exact:true}).fill('2');await waiter.getByLabel('Пожелания к блюду',{exact:true}).fill('Без соли');await waiter.getByRole('button',{name:'Добавить в заказ официанта',exact:true}).click();await waiter.getByRole('button',{name:'Оформить заказ официантом',exact:true}).click();await expect(waiter.locator('.order-item').filter({hasText:'Стейк рибай × 2'})).toBeVisible();await waiter.getByRole('button',{name:'Подтвердить iiko',exact:true}).click();
  15 |  await page.getByRole('button',{name:/^Заказ/}).click();await expect(page.getByText('Буррата с томатами × 1',{exact:true})).toBeVisible();await expect(page.locator('.order-item').filter({hasText:'Стейк рибай × 2'})).toBeVisible();await expect(page.getByText('Принят кухней',{exact:true})).toBeVisible();
  16 |  const admin=await context.newPage();await admin.goto('/demo/admin');await expect(admin.locator('.order-item').filter({hasText:'Стейк рибай × 2'})).toBeVisible();
  17 |  await page.getByRole('button',{name:'Счёт',exact:true}).click();await expect(page.locator('.split-disclosure')).not.toHaveAttribute('open','');await expect(page.getByRole('button',{name:'Свои позиции',exact:true})).not.toBeVisible();await page.screenshot({path:'.test-runtime/split-collapsed.png',fullPage:true});await page.locator('.split-disclosure>summary').click();await expect(page.getByRole('button',{name:'Свои позиции',exact:true})).toBeVisible();await page.getByRole('button',{name:'Свои позиции',exact:true}).click();await page.getByRole('button',{name:'Оплатить онлайн',exact:true}).click();await page.getByRole('button',{name:'Симулировать успешную оплату',exact:true}).click();await expect(page.getByText('Оплачен',{exact:true})).toBeVisible();
  18 |  expect(await waiter.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  19 | });
  20 | 
  21 | test('waiter opens a free table without guest registration',async({page})=>{
  22 |  await page.goto('/demo/waiter');await page.getByRole('button',{name:'Оформить заказ за гостя',exact:true}).click();await page.getByLabel('Стол для заказа',{exact:true}).selectOption('7');await page.getByLabel('Имя или обозначение гостя',{exact:true}).fill('Гость у окна');await page.getByLabel('Поиск в меню сотрудника',{exact:true}).fill('Буррата');await page.getByRole('button',{name:'Фото и состав',exact:true}).click();await page.getByRole('button',{name:'Добавить в заказ официанта',exact:true}).click();await page.getByRole('button',{name:'Оформить заказ официантом',exact:true}).click();await expect(page.getByText('Стол 7 · Гость у окна',{exact:true})).toBeVisible();await page.goto('/demo/admin');await page.getByRole('button',{name:'Зал и столы',exact:true}).click();await expect(page.locator('.table-card').filter({has:page.getByRole('heading',{name:'Стол 7',exact:true})})).toContainText('1 гостей');
  23 | });
  24 | 
  25 | test('nearby map markers open venue details, including when map tiles are offline',async({page})=>{
  26 |  await page.route('https://tile.openstreetmap.org/**',route=>route.abort());await page.setViewportSize({width:360,height:800});await page.goto('/demo/guest/nearby');await expect(page.locator('.welcome-card')).toHaveCount(0);await expect(page.locator('.leaflet-container')).toBeVisible();await expect(page.locator('.mira-map-pin')).toHaveCount(6);await page.getByRole('button',{name:'Открыть MIRA Restaurant',exact:true}).click();await page.getByRole('button',{name:'Открыть заведение',exact:true}).click();await expect(page.getByRole('dialog')).toBeVisible();await expect(page.getByRole('dialog').locator('.leaflet-container')).toBeVisible();await expect(page.getByRole('dialog').getByText('Демо-карта Москвы · расположение заведений условное.',{exact:true})).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:'.test-runtime/venue-map-offline.png',fullPage:true});
  27 | });
  28 | 
```