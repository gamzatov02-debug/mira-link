# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cycle.spec.ts >> three guests, partial cashback and equal split
- Location: tests/e2e/cycle.spec.ts:12:1

# Error details

```
Test timeout of 45000ms exceeded.
```

```
Error: locator.click: Test timeout of 45000ms exceeded.
Call log:
  - waiting for locator('.split-disclosure>summary')

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
          - button "Профиль" [ref=e39] [cursor=pointer]
      - navigation [ref=e44]:
        - button "Главная" [ref=e45] [cursor=pointer]
        - button "Меню" [ref=e50] [cursor=pointer]
        - button "Заказ" [ref=e57] [cursor=pointer]
        - button "Счёт" [active] [ref=e61] [cursor=pointer]
        - button "Официант" [ref=e66] [cursor=pointer]
      - generic [ref=e71]:
        - generic [ref=e72]:
          - generic [ref=e73]: Заказано
          - generic [ref=e74]: 2 670,00 ₽
        - generic [ref=e75]:
          - generic [ref=e76]: Подытог
          - generic [ref=e77]: 2 670,00 ₽
        - generic [ref=e78]:
          - strong [ref=e79]: Итого
          - strong [ref=e80]: 2 670,00 ₽
        - generic [ref=e81]:
          - generic [ref=e82]: Оплачено
          - generic [ref=e83]: 0,00 ₽
        - generic [ref=e84]:
          - generic [ref=e85]: Осталось
          - generic [ref=e86]: 2 670,00 ₽
      - generic [ref=e87]:
        - generic [ref=e88]:
          - heading "Разделение счёта" [level=3] [ref=e89]
          - paragraph [ref=e90]: Выберите позиции или способ оплаты. Расчёт выполняет текущий сервис счёта.
        - generic [ref=e91]:
          - heading "Позиции заказа" [level=3] [ref=e92]
          - generic [ref=e93]:
            - checkbox "Буррата с томатами · Гость 1 Остаток 890,00 ₽" [ref=e94] [cursor=pointer]
            - generic [ref=e96]:
              - text: Буррата с томатами · Гость 1
              - generic [ref=e97]: Остаток 890,00 ₽
          - generic [ref=e98]:
            - checkbox "Буррата с томатами · Гость 2 Остаток 890,00 ₽" [ref=e99] [cursor=pointer]
            - generic [ref=e101]:
              - text: Буррата с томатами · Гость 2
              - generic [ref=e102]: Остаток 890,00 ₽
          - generic [ref=e103]:
            - checkbox "Буррата с томатами · Гость 3 Остаток 890,00 ₽" [ref=e104] [cursor=pointer]
            - generic [ref=e106]:
              - text: Буррата с томатами · Гость 3
              - generic [ref=e107]: Остаток 890,00 ₽
        - generic [ref=e108]:
          - heading "Способ разделения" [level=3] [ref=e109]
          - generic [ref=e110]:
            - button "Свои позиции" [ref=e111] [cursor=pointer]
            - button "По блюдам" [ref=e113] [cursor=pointer]
            - button "Поровну" [ref=e115] [cursor=pointer]
            - button "Оплатить весь остаток" [ref=e117] [cursor=pointer]
          - generic [ref=e119]:
            - generic [ref=e120]: Указанная сумма, ₽
            - spinbutton "Указанная сумма, ₽" [ref=e122]
          - button "Выбрать сумму" [ref=e123] [cursor=pointer]
      - group [ref=e126]:
        - generic "Гости и устройства демо" [ref=e127] [cursor=pointer]
        - option "Новое устройство"
        - option "Гость 1 · аккаунт · session-1" [selected]
        - option "Гость 2 · анонимно · session-1"
        - option "Гость 3 · анонимно · session-1"
      - paragraph [ref=e128]: Заказ отправлен на кухню
    - navigation "Основная навигация гостя" [ref=e129]:
      - button "Главная" [ref=e130] [cursor=pointer]
      - button "Меню" [ref=e135] [cursor=pointer]
      - button "Рядом" [ref=e140] [cursor=pointer]
      - button "Афиша" [ref=e144] [cursor=pointer]
      - button "Ещё" [ref=e149] [cursor=pointer]
```

# Test source

```ts
  1  | import {test,expect,type Page} from '@playwright/test';
  2  | async function enter(p:Page,registered=false){await p.goto('/demo/guest/home');if(registered)await p.getByRole('switch',{name:'Войти как демо-пользователь Алексей'}).click();await p.getByRole('button',{name:'Сканировать QR стола №12'}).click()}
  3  | async function order(p:Page){await p.getByRole('button',{name:'Меню',exact:true}).click();await p.getByRole('button',{name:'Выбрать блюдо',exact:true}).first().click();await p.getByRole('button',{name:'В корзину',exact:true}).click();await p.getByRole('button',{name:/^Заказ/}).click();await p.getByRole('button',{name:'Оформить заказ',exact:true}).click();await expect(p.getByText('Заказ отправлен', {exact:true}).first()).toBeVisible()}
  4  | async function bill(p:Page){await p.getByRole('button',{name:'Счёт',exact:true}).click();await p.locator('.split-disclosure>summary').click();await p.getByRole('button',{name:'Свои позиции',exact:true}).click()}
  5  | async function online(p:Page){await p.getByRole('button',{name:'Оплатить онлайн',exact:true}).click();await p.getByRole('button',{name:'Симулировать успешную оплату',exact:true}).click();await expect(p.getByText('Успешно',{exact:true}).first()).toBeVisible()}
  6  | test('Guest → Waiter → Admin, callbacks, close and additional tips',async({page,context})=>{const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await enter(page,true);const waiter=await context.newPage();await waiter.goto('/demo/waiter');const admin=await context.newPage();await admin.goto('/demo/admin');await order(page);await expect(waiter.getByText('Буррата с томатами × 1')).toBeVisible();await expect(admin.getByText('Буррата с томатами × 1')).toBeVisible();await waiter.getByRole('button',{name:'Подтвердить iiko',exact:true}).click();await expect(page.getByText('Принят кухней',{exact:true})).toBeVisible();await page.getByRole('button',{name:'Официант',exact:true}).click();await page.getByRole('button',{name:'Позвать официанта',exact:true}).click();await waiter.getByRole('button',{name:'Принять',exact:true}).click();await expect(page.getByText('Официант уже идёт',{exact:true}).first()).toBeVisible();await bill(page);await online(page);await waiter.getByRole('button',{name:'Подано',exact:true}).click();await admin.getByRole('button',{name:'Зал и столы',exact:true}).click();await admin.getByRole('button',{name:'Закрыть посещение',exact:true}).click();await expect(admin.getByText('Свободен',{exact:true})).toHaveCount(12);await page.getByRole('button',{name:'Главная',exact:true}).first().click();await page.getByRole('button',{name:'Чаевые',exact:true}).click();await page.getByRole('button',{name:'Оставить дополнительные чаевые',exact:true}).click();await expect(admin.getByText('Свободен',{exact:true})).toHaveCount(12);await admin.getByRole('button',{name:'Чаевые',exact:true}).click();await expect(admin.getByText(/Основные .*Дополнительные/)).toContainText('300');expect(errors).toEqual([])});
  7  | test('active session protection and cross-tab stop list',async({page,context})=>{await enter(page);await order(page);const guest2=await context.newPage();await enter(guest2);await expect(guest2.getByText('За этим столом уже есть активная сессия',{exact:true})).toBeVisible();await expect(guest2.getByText('Буррата с томатами × 1')).toHaveCount(0);await guest2.getByRole('button',{name:'Я с этой компанией',exact:true}).click();await guest2.getByRole('button',{name:'Заказ',exact:true}).click();await expect(guest2.getByText('Буррата с томатами × 1')).toBeVisible();const admin=await context.newPage();await admin.goto('/demo/admin');await admin.getByRole('button',{name:'Меню',exact:true}).click();await admin.getByRole('switch',{name:'Стоп-лист',exact:true}).first().click();await page.getByRole('button',{name:'Меню',exact:true}).click();await expect(page.getByRole('button',{name:'В стоп-листе',exact:true})).toBeDisabled();await admin.getByRole('switch',{name:'Стоп-лист',exact:true}).first().click();await expect(page.getByRole('button',{name:'В стоп-листе',exact:true})).toHaveCount(0)});
  8  | test('cash remains unpaid until POS confirmation',async({page,context})=>{await enter(page);await order(page);await bill(page);await page.getByRole('button',{name:'Оплатить наличными',exact:true}).click();await expect(page.getByText('Ожидается подтверждение наличной оплаты',{exact:true})).toBeVisible();await expect(page.getByText('Не оплачен',{exact:true})).toBeVisible();const waiter=await context.newPage();await waiter.goto('/demo/waiter');await waiter.getByRole('button',{name:'Подтвердить наличные в iiko',exact:true}).click();await expect(page.getByText('Успешно',{exact:true})).toBeVisible()});
  9  | test('failed payment and reorder after payment',async({page})=>{await enter(page,true);await order(page);await bill(page);await page.getByRole('button',{name:'Оплатить онлайн',exact:true}).click();await page.getByRole('button',{name:'Симулировать ошибку',exact:true}).click();await expect(page.getByText('Не удалось оплатить',{exact:true})).toBeVisible();await online(page);await order(page);await page.getByRole('button',{name:'Счёт',exact:true}).click();await expect(page.getByText('Частично оплачен',{exact:true})).toBeVisible();await expect(page.getByText('Успешно',{exact:true})).toHaveCount(1)});
  10 | test('force close preserves debt and reset is synchronized',async({page,context})=>{await enter(page);await order(page);const admin=await context.newPage();await admin.goto('/demo/admin');await admin.getByRole('button',{name:'Зал и столы',exact:true}).click();await admin.getByRole('button',{name:'Принудительно закрыть',exact:true}).click();await admin.getByRole('button',{name:'Закрыть с сохранением долга',exact:true}).click();await expect(admin.getByText('Свободен',{exact:true})).toHaveCount(12);await page.getByRole('button',{name:'Счёт',exact:true}).click();await expect(page.getByText('Закрыт с задолженностью',{exact:true})).toBeVisible();await admin.getByRole('button',{name:'Сбросить демо',exact:true}).click();await admin.getByRole('button',{name:'Подтвердить сброс',exact:true}).click();await expect(page.getByRole('button',{name:'Сканировать QR стола №12',exact:true})).toBeVisible()});
  11 | test('booking shared with admin, mobile routes have no overflow',async({page,context})=>{await page.setViewportSize({width:390,height:844});await enter(page);await page.getByRole('button',{name:'Ещё',exact:true}).click();await page.getByRole('button',{name:'Бронь стола',exact:true}).click();await page.getByLabel('Дата',{exact:true}).fill('2026-10-01');await page.getByLabel('Время',{exact:true}).fill('19:00');await page.getByRole('button',{name:'Забронировать',exact:true}).click();const admin=await context.newPage();await admin.goto('/demo/admin');await admin.getByRole('button',{name:'Бронирования',exact:true}).click();await expect(admin.getByText('2026-10-01 · 19:00',{exact:true})).toBeVisible();for(const route of ['/','/demo','/demo/guest/home','/demo/waiter','/demo/admin','/demo/full-cycle']){await page.goto(route);await expect(page.locator('body')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),route).toBe(true)}await page.screenshot({path:'.test-runtime/mobile.png',fullPage:true})});
> 12 | test('three guests, partial cashback and equal split',async({page,context})=>{await enter(page,true);await order(page);const second=await context.newPage();await enter(second);await second.getByRole('button',{name:'Я с этой компанией',exact:true}).click();await order(second);const third=await context.newPage();await enter(third);await third.getByRole('button',{name:'Я с этой компанией',exact:true}).click();await order(third);for(const guest of [page,second,third]){await guest.getByRole('button',{name:'Счёт',exact:true}).click();await guest.locator('.split-disclosure>summary').click();await guest.getByRole('button',{name:'Поровну',exact:true}).click();await online(guest)}await expect(page.getByText('Оплачен',{exact:true})).toBeVisible();await page.getByRole('button',{name:'Главная',exact:true}).first().click();await page.getByRole('button',{name:'Бонусы',exact:true}).click();await expect(page.getByText(/accrual/)).toBeVisible()});
     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        ^ Error: locator.click: Test timeout of 45000ms exceeded.
  13 | test('POS failure and retry; anonymous limitations',async({page,context})=>{await enter(page);const admin=await context.newPage();await admin.goto('/demo/admin');await admin.getByRole('button',{name:'Интеграции',exact:true}).click();await admin.getByRole('switch',{name:'Ошибка передачи новых заказов',exact:true}).click();await order(page);const waiter=await context.newPage();await waiter.goto('/demo/waiter');await waiter.getByRole('button',{name:'Подтвердить iiko',exact:true}).click();await expect(page.getByText('Ошибка передачи заказа',{exact:true})).toBeVisible();await admin.getByRole('switch',{name:'Ошибка передачи новых заказов',exact:true}).click();await waiter.getByRole('button',{name:'Повторить передачу',exact:true}).click();await expect(page.getByText('Принят кухней',{exact:true})).toBeVisible();await bill(page);await expect(page.getByText('Бонусы доступны зарегистрированному пользователю.',{exact:true})).toBeVisible();await page.getByRole('button',{name:'Ещё',exact:true}).click();await page.getByRole('button',{name:'Отзывы',exact:true}).click();await expect(page.getByText('Отзывы доступны только зарегистрированным пользователям.',{exact:true})).toBeVisible()});
  14 | test('marketing off, service on and one guest pays all',async({page,context})=>{await enter(page,true);await page.getByRole('button',{name:'Ещё',exact:true}).click();await page.getByRole('button',{name:'Профиль',exact:true}).last().click();await page.getByRole('switch',{name:'Маркетинговые уведомления',exact:true}).click();const admin=await context.newPage();await admin.goto('/demo/admin');await admin.getByRole('button',{name:'Акции',exact:true}).click();await admin.getByLabel('Название акции',{exact:true}).fill('Особый вечер');await admin.getByRole('button',{name:'Опубликовать',exact:true}).click();await expect(page.locator('.notification').filter({hasText:'Особый вечер'})).toHaveCount(0);await order(page);await expect(page.getByText('Заказ отправлен на кухню',{exact:true})).toBeVisible();const second=await context.newPage();await enter(second);await second.getByRole('button',{name:'Я с этой компанией',exact:true}).click();await order(second);await page.getByRole('button',{name:'Счёт',exact:true}).click();await page.locator('.split-disclosure>summary').click();await page.getByRole('button',{name:'Оплатить весь остаток',exact:true}).click();await online(page);await second.getByRole('button',{name:'Счёт',exact:true}).click();await expect(second.getByText('Оплачен',{exact:true})).toBeVisible();await expect(second.getByRole('button',{name:'Оплатить онлайн',exact:true})).toHaveCount(0)});
  15 | 
```