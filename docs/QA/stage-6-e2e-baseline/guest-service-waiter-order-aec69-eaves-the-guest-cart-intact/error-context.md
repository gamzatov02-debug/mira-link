# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: guest-service.spec.ts >> waiter order joins the current session and leaves the guest cart intact
- Location: tests/e2e/guest-service.spec.ts:12:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Буррата с томатами × 1', { exact: true })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText('Буррата с томатами × 1', { exact: true }) with timeout 5000ms
  - waiting for getByText('Буррата с томатами × 1', { exact: true })

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
    - button "Заказ (1)"
    - button "Счёт"
    - button "Официант"
  - heading "Ваш заказ" [level=2]
  - strong: Заказ отправлен
  - text: Статус приготовления появится здесь.
  - img "Буррата с томатами"
  - strong: Буррата с томатами
  - paragraph: 220 г
  - text: × 1
  - strong: 890,00 ₽
  - strong: Итого
  - strong: 890,00 ₽
  - button "Оформить заказ"
  - heading "Общий заказ" [level=3]
  - strong: Стол 12 · Гость 1
  - text: Принят кухней order-6 · 10:11:55 Стейк рибай × 2 Medium Без соли 5 780,00 ₽
  - group: Гости и устройства демо
  - paragraph: Заказ отправлен на кухню
  - paragraph: Статус заказа обновлён
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
  2  | 
  3  | test('all sixteen dishes have local photos and recipes in Guest, Waiter and Admin',async({page,request})=>{
  4  |  test.setTimeout(90000);
  5  |  for(let i=1;i<=16;i++){const response=await request.get(i===1?'/images/burrata.png':`/images/menu/p${i}.png`);expect(response.ok()).toBe(true);expect(response.headers()['content-type']).toContain('image/')}
  6  |  await page.goto('/demo/guest/home');await page.getByRole('button',{name:'Сканировать QR стола №12',exact:true}).click();await page.getByRole('button',{name:'Меню',exact:true}).click();await expect(page.locator('.product-card img')).toHaveCount(16);
  7  |  await page.getByRole('button',{name:'Выбрать блюдо',exact:true}).nth(1).click();await expect(page.getByRole('dialog').getByText('Состав блюда',{exact:true})).toBeVisible();await expect(page.getByRole('dialog').locator('img')).toHaveJSProperty('complete',true);await page.keyboard.press('Escape');
  8  |  await page.goto('/demo/waiter');await page.getByRole('button',{name:'Меню для показа гостю',exact:true}).click();await expect(page.locator('.staff-product img')).toHaveCount(16);await page.getByLabel('Поиск в меню сотрудника',{exact:true}).fill('Рибай');await page.getByRole('button',{name:'Фото и состав',exact:true}).click();await expect(page.getByRole('dialog').getByText(/Говяжий рибай, сливочное масло/)).toBeVisible();await page.keyboard.press('Escape');
  9  |  await page.goto('/demo/admin');await page.getByRole('button',{name:'Меню',exact:true}).click();await expect(page.locator('.admin-content .dish-image')).toHaveCount(16);await page.getByRole('button',{name:'Показать фото и состав',exact:true}).nth(15).click();await expect(page.getByRole('dialog').getByText(/Эспрессо, молоко/)).toBeVisible();
  10 | });
  11 | 
  12 | test('waiter order joins the current session and leaves the guest cart intact',async({page,context})=>{
  13 |  await page.setViewportSize({width:390,height:844});await page.goto('/demo/guest/home');await page.getByRole('button',{name:'Сканировать QR стола №12',exact:true}).click();await page.getByRole('button',{name:'Меню',exact:true}).click();await page.getByRole('button',{name:'Выбрать блюдо',exact:true}).first().click();await page.getByRole('button',{name:'В корзину',exact:true}).click();
  14 |  const waiter=await context.newPage();await waiter.setViewportSize({width:390,height:844});await waiter.goto('/demo/waiter');await waiter.getByRole('button',{name:'Оформить заказ за гостя',exact:true}).click();await waiter.getByLabel('Гость для заказа',{exact:true}).selectOption({label:'Гость 1'});await waiter.getByLabel('Поиск в меню сотрудника',{exact:true}).fill('Рибай');await waiter.getByRole('button',{name:'Фото и состав',exact:true}).click();await expect(waiter.getByRole('button',{name:'Добавить в заказ официанта',exact:true})).toBeDisabled();await waiter.getByRole('radio',{name:/Medium/}).check();await waiter.getByLabel('Количество порций',{exact:true}).fill('2');await waiter.getByLabel('Пожелания к блюду',{exact:true}).fill('Без соли');await waiter.getByRole('button',{name:'Добавить в заказ официанта',exact:true}).click();await waiter.getByRole('button',{name:'Оформить заказ официантом',exact:true}).click();await expect(waiter.locator('.order-item').filter({hasText:'Стейк рибай × 2'})).toBeVisible();await waiter.getByRole('button',{name:'Подтвердить iiko',exact:true}).click();
> 15 |  await page.getByRole('button',{name:/^Заказ/}).click();await expect(page.getByText('Буррата с томатами × 1',{exact:true})).toBeVisible();await expect(page.locator('.order-item').filter({hasText:'Стейк рибай × 2'})).toBeVisible();await expect(page.getByText('Принят кухней',{exact:true})).toBeVisible();
     |                                                                                                                             ^ Error: expect(locator).toBeVisible() failed
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