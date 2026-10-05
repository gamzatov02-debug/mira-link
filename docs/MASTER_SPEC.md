# MIRA LINK DEMO v1.0

## ТЕХНИЧЕСКИЙ МАСТЕР-ПРОМТ ДЛЯ CODEX

Ты работаешь над проектом **MIRA LINK**.

Твоя задача — создать или доработать существующий проект до состояния полноценного интерактивного демонстрационного продукта:

**MIRA LINK Website + Guest Mini App + Waiter App + Admin Panel**

Это не набор макетов.

Это одна связанная демонстрационная система с единым состоянием данных, бизнес-событиями и сквозной логикой.

---

# 0. ГЛАВНОЕ ПРАВИЛО

НЕ ИЗОБРЕТАЙ БИЗНЕС-ЛОГИКУ.

Перед внесением изменений сначала изучи доступные в проекте документы и существующий код.

Приоритет источников:

1. актуальные бизнес-процессы MIRA LINK / «Умный стол»;
2. зафиксированные решения владельца продукта;
3. `MIRA_LINK_UI_TZ.md`;
4. настоящее техническое ТЗ;
5. существующая реализация проекта — только если она не противоречит пунктам 1–4.

При конфликте:

**Business Logic > UI Convenience.**

Для визуала:

**MIRA_LINK_UI_TZ.md > существующая самодеятельная стилизация.**

Рабочее историческое название «Умный стол» в пользовательском UI заменить на:

**MIRA LINK**

если только оно не встречается внутри исторической документации.

---

# 1. НЕ НАЧИНАЙ С ПЕРЕПИСЫВАНИЯ ПРОЕКТА

Сначала выполни аудит repository.

Определи:

* используемый framework;
* package manager;
* структуру каталогов;
* существующие routes;
* существующие Guest pages;
* существующий Waiter interface;
* существующую Admin Panel;
* состояние проекта;
* state management;
* используемые UI components;
* API/mock layer;
* существующие изображения;
* существующий оригинальный логотип MIRA LINK;
* дизайн-токены;
* responsive implementation;
* тесты.

Не удаляй рабочую архитектуру только ради перехода на другой стек.

Если существующий стек пригоден — продолжай в нём.

Если проект практически пустой, рекомендуемый fallback:

* Next.js App Router;
* TypeScript;
* React;
* CSS variables / Tailwind;
* Zustand либо эквивалентный лёгкий state manager;
* Zod для runtime validation;
* Vitest;
* React Testing Library;
* Playwright для E2E.

Не добавляй тяжёлые библиотеки без реальной необходимости.

---

# 2. ЛОГОТИП — ОСОБОЕ ТРЕБОВАНИЕ

Найди в repository существующий оригинальный asset логотипа / монограммы MIRA LINK.

Использовать только его.

Запрещается:

* генерировать новую монограмму;
* рисовать M CSS-линиями;
* заменять знак текстом;
* создавать похожий логотип;
* изменять пропорции;
* менять геометрию;
* менять композицию;
* применять случайные фильтры.

Если оригинального logo asset действительно нет:

НЕ ИЗОБРЕТАЙ ЕГО.

Создай технический placeholder-контейнер с явным TODO:

`MIRA LINK ORIGINAL LOGO ASSET REQUIRED`

и продолжай разработку остальных частей.

---

# 3. DESIGN SYSTEM

Использовать design tokens из актуального UI/UX-ТЗ.

Минимальная система CSS variables:

```css
--bg-primary: #041E15;
--bg-deep: #031B13;

--surface-primary: #0D3022;
--surface-raised: #123927;
--surface-top: #173D2B;

--accent-gold: #E7C27B;
--accent-gold-dark: #D9AC5D;

--text-primary: #F0EFE9;
--text-secondary: #95A99E;

--border-default: rgba(211,175,103,.24);
--border-active: rgba(231,194,123,.56);

--success: #91B38B;
```

Визуальный характер:

**Dark premium hospitality + lifestyle ecosystem.**

Не использовать:

* чистый чёрный как основной фон;
* ярко-жёлтый;
* ярко-синий основной CTA;
* неон;
* rainbow gradients;
* дешёвый glassmorphism;
* чрезмерные тени;
* marketplace-style интерфейс доставки.

Основной приём:

* глубокие зелёные поверхности;
* матовое золото;
* светлый тёплый текст;
* тонкий контур;
* большие отступы;
* качественная ресторанная фотография;
* спокойная анимация.

---

# 4. ТИПОГРАФИКА

Использовать:

```css
-apple-system,
BlinkMacSystemFont,
"SF Pro Display",
"SF Pro Text",
Inter,
Arial,
sans-serif
```

Избегать чрезмерно жирной типографики.

Premium-эффект формируется:

* пространством;
* масштабом;
* ритмом;
* цветом;
* качеством визуала;

а не `font-weight: 900`.

---

# 5. MOBILE FIRST

Guest Mini App проектируется mobile-first.

Основные viewport:

* 360;
* 375;
* 390;
* 430 px.

Критические touch targets:

не менее 44×44 px.

Не допускать горизонтального overflow, кроме специально предусмотренных горизонтальных chip rails.

Учитывать:

`safe-area-inset-bottom`

для iPhone.

---

# 6. BOTTOM NAVIGATION GUEST APP

Пять постоянных разделов:

1. Главная
2. Рядом
3. Афиша
4. Акции
5. Ещё

Не заменять их другой навигацией без отдельного требования.

Контекстные ресторанные действия:

* Меню;
* Заказ;
* Счёт;
* Официант

должны быть легко доступны непосредственно с главной страницы текущего заведения.

---

# 7. ОБЩАЯ АРХИТЕКТУРА

Проект должен логически состоять из:

```text
Marketing Website
        |
        v
     Demo Hub
        |
   -------------------------
   |           |           |
 Guest       Waiter      Admin
   |           |           |
   -------- Shared Domain ---
               |
          Demo Services
       /       |        \
     POS    Payments   Partners
```

Guest, Waiter и Admin НЕ должны иметь три независимых mock-state.

---

# 8. DOMAIN LAYER

Создай отдельный domain layer.

UI не должен напрямую хаотично изменять данные.

Минимальные сущности:

```ts
Venue
Table
Session
Guest
User
Employee
Waiter
Role

Menu
Category
Product
Modifier

Order
OrderItem
CommonOrder

Bill
Split
PaymentPart
Payment
FinancialSplit

Tip
AdditionalTip
PlatformCommission

BonusAccount
BonusTransaction

Promotion
PromoCode

Booking
Review

StaffCall
Notification

POSState
AnalyticsState
```

---

# 9. ОСНОВНЫЕ СВЯЗИ

Обязательная модель:

```text
Venue
  └─ Tables

Table
  └─ 0..1 Active Session

Session
  ├─ Guests
  ├─ Orders
  ├─ CommonOrder
  ├─ Bill
  ├─ StaffCalls
  └─ Payments

Guest
  └─ 0..N Orders

Order
  └─ 1..N OrderItems

OrderItem
  └─ belongs to one Guest

Bill
  └─ Split

Split
  └─ PaymentParts

PaymentPart
  └─ Payment / Payments according to scenario

Online Payment
  └─ FinancialSplit
```

Дополнительные чаевые существуют отдельно от Restaurant Session.

---

# 10. SESSION — КЛЮЧЕВАЯ СУЩНОСТЬ

Одна Session:

**одно посещение одной компании за конкретным столом.**

Несколько заказов внутри Session:

НЕ являются несколькими посещениями.

Table одновременно имеет максимум:

**одну активную Session.**

Создай соответствующий invariant:

```ts
assertSingleActiveSessionPerTable()
```

---

# 11. ORDER ≠ SESSION

Order — операционная сущность внутри Session.

Один Guest может создать:

```text
Order 1
Order 2
Order 3
...
```

в рамках одной Session.

Все они агрегируются в CommonOrder.

---

# 12. COMMON ORDER

CommonOrder является агрегированным представлением всех Orders Session.

Не создавай его как независимый несвязанный mock.

Он должен вычисляться из актуального state.

---

# 13. BILL

Bill — финансовое отражение текущей Session.

Не смешивать:

```text
CommonOrder
```

и:

```text
Bill
```

в одну сущность.

---

# 14. SPLIT ≠ FINANCIAL SPLIT

Это критическое правило.

## Split

Отвечает на вопрос:

**КТО ИЗ ГОСТЕЙ СКОЛЬКО ДОЛЖЕН ОПЛАТИТЬ?**

Выполняется до Payment.

## FinancialSplit

Отвечает на вопрос:

**КУДА ПОШЛИ ДЕНЬГИ ПОСЛЕ УСПЕШНОГО PAYMENT?**

Например:

```text
Основная сумма → Venue
Tips → Waiter
Commission → MIRA LINK
```

Не называть оба процесса одной сущностью.

Не использовать один reducer.

---

# 15. STATUS MODEL

Не использовать:

```ts
status: "ready"
```

для всей Restaurant Session.

Минимум должны существовать отдельно:

```ts
executionStatus
financialStatus
```

Пример execution:

```ts
"created"
"submitted"
"accepted"
"in_progress"
"ready"
"served"
"completed"
"cancelled"
"error"
```

Пример financial:

```ts
"unpaid"
"partially_paid"
"paid"
"refund_pending"
"partially_refunded"
"refunded"
"force_closed_with_balance"
```

Отображаемые русские labels вынести отдельно от domain values.

---

# 16. PRICE SNAPSHOT

До создания Order:

цена берётся из актуального Menu/POS state.

После оформления OrderItem:

цена фиксируется.

Создай:

```ts
unitPriceSnapshot
```

и при необходимости:

```ts
modifierPriceSnapshot
```

Изменение цены в POS не должно менять существующий оформленный OrderItem.

---

# 17. AUTH MODEL

Guest restaurant flow не требует регистрации.

Создай два состояния:

```ts
anonymousGuest
registeredUser
```

Anonymous Guest может:

* открыть меню;
* присоединиться к Session;
* сделать заказ;
* сделать дозаказ;
* видеть CommonOrder;
* открыть Bill;
* участвовать в Split;
* оплатить онлайн;
* выбрать наличную оплату;
* оставить Tips;
* оставить Additional Tip;
* вызвать Waiter;
* вызвать Admin;
* пользоваться доступными restaurant services.

Anonymous Guest:

НЕ получает cashback;

НЕ использует Bonus balance;

НЕ оставляет Review;

НЕ получает постоянную account history.

---

# 18. TEMP GUEST ID

При входе без авторизации создать:

```ts
guestSessionId
```

Этот идентификатор:

* существует внутри Restaurant Session;
* не является User ID;
* не превращается автоматически в permanent account;
* не должен связываться с будущим аккаунтом после завершения Session без отдельного утверждённого механизма.

---

# 19. QR / NFC ENTRY

В Demo реальную камеру подключать необязательно.

Создать действие:

**Сканировать QR стола №12**

Оно должно вызывать ту же domain command, которую в production вызвал бы QR/NFC.

Например:

```ts
enterTableByToken(tableToken)
```

Не создавай отдельную упрощённую demo-логику.

---

# 20. TABLE ENTRY

Если Table свободен:

```text
Scan
→ resolve Venue/Table
→ verify no active Session
→ create Session
→ create Guest
→ join Guest to Session
```

---

# 21. ACTIVE SESSION PROTECTION

Если Table уже имеет active Session:

НЕ показывать новому устройству содержимое заказа автоматически.

Показать:

**За этим столом уже есть активная сессия**

Действия:

**Я с этой компанией**

**Позвать официанта**

**Позвать администратора**

До явного подтверждения участия запрещено отдавать:

* CommonOrder;
* Bill;
* participants;
* позиции других гостей;
* суммы;
* персональные данные.

После:

```text
Я с этой компанией
```

создать Guest внутри существующей Session.

---

# 22. STORE ARCHITECTURE

State management разделить минимум на:

```text
Domain State
UI State
Demo Simulator State
```

Domain State является source of truth.

UI State содержит только:

* открытые modals;
* tabs;
* selection;
* active route;
* temporary form state.

Не хранить финансовую истину в UI state.

---

# 23. COMMANDS И EVENTS

Все значимые действия проводить через явные domain commands/events.

Например:

```ts
createSession()
joinSession()
createOrder()
submitOrder()
addOrderItem()
createStaffCall()
acceptStaffCall()
completeStaffCall()

applyPromotion()
applyPromoCode()
redeemBonuses()

createSplit()
updateSplit()

createPaymentIntent()
confirmOnlinePayment()
failOnlinePayment()

requestCashPayment()
confirmCashPaymentFromPOS()

accrueCashback()

addAdditionalTip()

setProductStopList()

createBooking()

closeSession()
forceCloseSession()
```

---

# 24. EVENT LOG

Создай Demo Event Log.

Пример:

```text
08:41:03 SESSION_CREATED
08:41:26 GUEST_JOINED
08:42:15 ORDER_CREATED
08:42:20 ORDER_SUBMITTED
08:42:21 POS_ORDER_CONFIRMED
08:44:02 STAFF_CALL_CREATED
08:44:11 STAFF_CALL_ACCEPTED
08:51:16 PAYMENT_SUCCEEDED
08:51:16 BONUS_ACCRUED
```

Event Log нужен:

* для отладки;
* для Full Cycle Demo;
* для контроля связности интерфейсов.

В пользовательском режиме его можно показывать как аккуратную демонстрационную панель «Что сейчас произошло».

---

# 25. СИНХРОНИЗАЦИЯ МЕЖДУ ЭКРАНАМИ

Если Guest, Waiter и Admin показываются в одном browser context — использовать один shared store.

Если пользователь открывает их разными tabs/windows:

использовать:

```ts
BroadcastChannel
```

или аналогичный browser-safe механизм.

Действие в Guest tab должно без ручной перезагрузки отражаться в Waiter/Admin tab.

---

# 26. PERSISTENCE

Demo state можно сохранять локально для удобства.

При этом обязательно иметь:

**Сбросить демо**

Reset должен восстанавливать детерминированный seed.

Не использовать случайные стартовые значения, которые мешают повторяемости тестов.

---

# 27. DEMO SEED

Создать детерминированное демонстрационное заведение.

Например:

```text
MIRA Restaurant
Table №12
Waiter: Александр
```

Дополнительно:

не менее 12 столов;

несколько menu categories;

не менее 12–20 блюд;

несколько modifier groups;

несколько promotions;

несколько events;

несколько nearby venues.

---

# 28. GUEST ROUTES

Организовать маршруты примерно так:

```text
/demo/guest/welcome
/demo/guest/venue/:venueId
/demo/guest/menu
/demo/guest/dish/:productId
/demo/guest/cart
/demo/guest/order
/demo/guest/bill
/demo/guest/split
/demo/guest/payment
/demo/guest/payment/success
/demo/guest/staff-call

/demo/guest/nearby
/demo/guest/venue/:venueId/about
/demo/guest/events
/demo/guest/events/:eventId
/demo/guest/promos
/demo/guest/bonuses
/demo/guest/powerbank
/demo/guest/taxi
/demo/guest/notifications
/demo/guest/history
/demo/guest/profile
/demo/guest/favorites
/demo/guest/booking
/demo/guest/wifi
```

Если существующий router уже построен иначе, не ломай его без необходимости — сохрани логически эквивалентную структуру.

---

# 29. GUEST HOME

Главная текущего Venue:

Header;

Hero photo;

Venue description;

Table №12;

четыре основных действия:

```text
Меню
Заказ
Счёт
Официант
```

Популярное;

Powerbank;

Taxi;

Promotions;

Events;

Nearby;

Bonuses.

---

# 30. MENU

Поддержать:

* Search;
* Categories;
* Product cards;
* price;
* weight;
* availability;
* Stop List;
* modifiers.

Если Product в Stop List:

его нельзя добавить в новый Cart.

Существующий оформленный OrderItem остаётся неизменным.

---

# 31. DISH

Поддержать:

* hero image;
* description;
* ingredients;
* price;
* quantity;
* required modifiers;
* optional modifiers;
* comment.

Если обязательный modifier не выбран:

CTA disabled;

показывать понятное объяснение.

---

# 32. CART

Cart относится к Guest.

До submit:

можно:

* менять количество;
* удалять;
* менять доступные modifiers;
* добавлять комментарий.

После Submit:

создаётся Order.

Не превращать Cart в Order заранее.

---

# 33. ORDER SUBMIT

После Submit:

```text
Guest:
"Заказ отправлен"

Waiter:
New Order

Admin:
New Order

Demo POS:
receives order
```

---

# 34. POS SIMULATOR

Создай demo adapter:

```ts
POSAdapter
```

Интерфейс должен позволять в дальнейшем заменить mock реальной интеграцией.

Пример:

```ts
interface POSAdapter {
  syncMenu(): Promise<MenuSyncResult>
  submitOrder(order: Order): Promise<POSOrderResult>
  getOrderStatus(orderId: string): Promise<POSOrderStatus>
  confirmCashPayment(paymentId: string): Promise<POSPaymentResult>
}
```

Demo implementation:

```ts
DemoPOSAdapter
```

---

# 35. POS IS SOURCE OF TRUTH

По предусмотренным бизнес-процессам POS/iiko является source of truth для:

* Menu;
* Categories;
* Modifiers;
* prices;
* Stop List;
* execution state;
* подтверждения наличной оплаты;
* закрытия ресторанного чека там, где это относится к POS.

Не создавай вторую противоречащую истину внутри frontend.

---

# 36. POS ERROR

Реализовать Demo сценарий:

```text
Order Submitted
→ POS timeout/error
→ executionStatus = error
```

Guest видит:

**Ошибка передачи заказа**

Actions:

**Повторить**

**Позвать официанта**

Если затем POS сообщает, что исходный Order всё-таки принят:

система должна обработать это идемпотентно;

НЕ создать новый Order;

НЕ отправить дубль.

Используй stable idempotency key.

---

# 37. WAITER ROUTES

Минимум:

```text
/demo/waiter
/demo/waiter/table/:tableId
/demo/waiter/orders/:orderId
/demo/waiter/calls
/demo/waiter/tips
```

---

# 38. WAITER HOME

Показывать:

* Employee;
* Venue;
* Shift;
* assigned zone;
* New Orders;
* Staff Calls;
* My Tables;
* Ready;
* Awaiting Payment;
* Cash Pending;
* Notifications.

---

# 39. TABLE MAP

Не менее 12 столов.

Для каждого:

* table number;
* active Session;
* guests;
* amount;
* execution state;
* financial state;
* StaffCall badge;
* unpaid remainder.

Цвет не должен быть единственным носителем статуса.

---

# 40. WAITER ORDER

Показывать:

* Table;
* Guest;
* Order ID;
* items;
* modifiers;
* comments;
* price snapshot;
* created time.

Официант работает только в рамках предусмотренных прав.

---

# 41. STAFF CALL

Guest создаёт:

```ts
StaffCall
```

Например:

```ts
{
  type: "waiter",
  status: "created"
}
```

Waiter сразу получает событие.

После Accept:

```ts
status = "accepted"
```

Guest видит:

**Официант уже идёт**

После завершения:

```ts
status = "completed"
```

---

# 42. ADMIN CALL

Вызов администратора — отдельный тип StaffCall.

Не превращать его в обычный waiter call.

---

# 43. COMMON ORDER SCREEN

После подтверждённого joining Session Guest может видеть:

* собственные позиции;
* позиции остальных участников;
* total;
* owner каждой позиции.

Пометки:

```text
Вы
Гость 2
Гость 3
```

---

# 44. DOZAKAZ

Один Guest может сделать новый Order после первого Order.

Все Orders принадлежат той же Session.

---

# 45. ORDER AFTER PAYMENT

Обязательный edge case.

Guest уже успешно оплатил предыдущую PaymentPart.

Затем создаёт новый Order.

Результат:

* старый Payment не изменяется;
* old FinancialSplit не пересчитывается;
* создаётся новый Order;
* Bill получает новый unpaid remainder;
* необходим новый Payment;
* Session остаётся той же, если посещение продолжается.

Создай E2E test.

---

# 46. BILL CALCULATIONS

Не дублировать расчёты в компонентах.

Создай domain selectors/services:

```ts
calculateCommonOrder()
calculateBill()
calculateUnpaidBalance()
calculateGuestOwnItems()
calculatePaymentPart()
calculateAverageCheck()
```

Округление денежных значений должно быть централизовано.

Для денег не использовать небезопасную floating-point арифметику.

Хранить сумму в минимальных денежных единицах:

```ts
kopecks: number
```

либо использовать безопасный money type.

---

# 47. SPLIT

Split работает только с неоплаченным остатком.

Уже оплаченная сумма:

НЕ перераспределяется.

Варианты UI могут включать предусмотренные продуктом способы:

* свои позиции;
* по блюдам;
* поровну;
* указать сумму;
* один Guest оплачивает остаток целиком.

Не допускать:

```text
sum(paymentParts) > unpaid balance
```

и отрицательных частей.

---

# 48. CONCURRENT SPLIT

Предусмотреть защиту от конкурентного выбора одной и той же неоплаченной позиции несколькими Guest.

В demo это можно реализовать state-level locking/reservation.

UI должен сразу отражать:

**Выбрано другим участником**

где это применимо.

---

# 49. ONE GUEST PAYS ALL

Action:

**Оплатить весь оставшийся счёт**

назначает текущему плательщику весь unpaid remainder.

Не меняет ownership OrderItems.

---

# 50. PROMOTIONS

Promotion применяется согласно бизнес-условиям.

Promotion и PromoCode — разные сущности.

Не объединять их.

---

# 51. PROMOCODE

PromoCode:

* персональный;
* применяется Guest, который его ввёл;
* не распространяется автоматически на остальных;
* один PromoCode на соответствующий Order/платёжный сценарий согласно бизнес-правилу.

Если плательщик оплачивает весь остаток и применяет допустимый PromoCode:

применение должно следовать утверждённой логике плательщика, а не автоматически копироваться другим Guest.

---

# 52. BONUSES

Только Registered User.

Курс:

```text
1 bonus = 1 ₽
```

Global max redemption:

```text
50%
```

Venue может установить:

```text
20%
30%
40%
50%
```

Нельзя установить больше глобального максимума.

---

# 53. BONUS LIMIT

Фактическое списание ограничено одновременно:

* platform max;
* venue max;
* bonus balance;
* обязательством конкретного Guest;
* соответствующей расчётной базой бизнес-правил.

Никогда не допускай отрицательный bonus balance.

---

# 54. BONUS CASHBACK

Venue задаёт cashback rate.

Минимальное значение текущей бизнес-модели:

```text
5%
```

Начисление Registered User выполняется:

**сразу после подтверждённой успешной оплаты его части.**

Не ждать закрытия всей Table Session.

---

# 55. CASHBACK BASE

Tips не входят в базу начисления cashback.

При Cash payment начисление происходит только после POS confirmation.

Anonymous Guest cashback не получает.

---

# 56. TIPS

Initial Tips формируются внутри текущего payment flow.

Presets:

```text
0%
10%
15%
20%
25%
custom
```

Каждый Guest выбирает свои Tips самостоятельно.

Tips других Guest автоматически не распределяются.

---

# 57. ADDITIONAL TIPS

AdditionalTip — отдельная операция.

Допускается:

* во время Session;
* после Payment;
* после закрытия Session.

AdditionalTip:

* не создаёт Order;
* не создаёт Session;
* не открывает закрытую Session;
* не увеличивает visit count;
* не меняет average check.

---

# 58. ADDITIONAL TIP COMMISSION

Default:

```text
guestPaysCommission = true
```

Если true:

```text
Guest pays Tip + Commission
Waiter receives Tip
MIRA receives Commission
```

Если false:

```text
Guest pays Tip only
Commission withheld from Waiter Tip
Venue pays nothing
```

Не переносить эту комиссию на Venue.

---

# 59. MAIN PAYMENT COMMISSION

Commission показывать отдельной строкой.

Default checkbox:

**Поддержать сервис MIRA LINK и оплатить комиссию**

Если включён:

Guest оплачивает её сверху.

Если отключён:

Guest оплачивает основной платёж без этой комиссии;

соответствующее обязательство платформенной комиссии переносится на Venue при взаиморасчётах.

НЕ считать, что комиссия MIRA исчезла.

Commission rate хранить в Demo config.

Не hardcode как глобальное бизнес-правило.

---

# 60. PAYMENT COMPOSITION

Для каждого payer отдельно показывать:

```text
Base part
Promotion
Promo code
Bonuses
Tips
Platform commission
Final amount
```

Каждый элемент хранить отдельно.

Не делать:

```ts
total = 12345
```

без возможности объяснить его состав.

---

# 61. ONLINE PAYMENT

Demo Payment Adapter:

```ts
PaymentAdapter
DemoPaymentAdapter
```

Demo никогда не должен списывать реальные средства.

Обязательно показывать:

**ДЕМО · без реального списания средств**

После user action можно симулировать:

```text
pending
→ succeeded
```

или:

```text
pending
→ failed
```

---

# 62. FINANCIAL SPLIT

После successful online Payment:

сформировать FinancialSplit.

Например:

```text
VenueShare
WaiterTipShare
MiraCommissionShare
```

UI может показать это в демонстрационном режиме в Admin / Full Cycle.

---

# 63. CASH PAYMENT

Action:

**Оплатить наличными**

создаёт:

```text
cash payment request
```

Но:

```text
cash intent != paid
```

Guest видит:

**Ожидается подтверждение оплаты**

Waiter:

**Наличные · ожидается подтверждение**

Только событие от Demo POS:

```ts
POS_CASH_PAYMENT_CONFIRMED
```

переводит финансовую часть в paid.

---

# 64. CASH COMMISSION

При наличной оплате Commission не добавляется Guest сверху.

Соответствующее обязательство Venue учитывать отдельно в платформенных взаиморасчётах.

---

# 65. PAYMENT FAILURE

При failed Payment:

* PaymentPart остаётся unpaid;
* Session не закрывается;
* Bonus не начисляются;
* FinancialSplit не выполняется;
* пользователь может повторить действие.

---

# 66. REFUND BASE LOGIC

Предусмотреть domain support хотя бы для demo/admin.

При Refund:

* финансовый статус обновляется отдельно;
* cashback корректируется;
* bonus balance не может уйти ниже 0;
* Tips не возвращаются автоматически;
* Cash refund осуществляется Venue вне online acquiring flow.

Не придумывать новые refund policy beyond business rules.

---

# 67. SESSION CLOSE

Normal Close разрешён, когда применимые условия выполнены, включая:

```text
unpaidBalance === 0
```

и операционная часть завершена согласно бизнес-правилам.

После Close:

Table становится свободным.

---

# 68. FORCE CLOSE

Admin с соответствующим правом может:

**Принудительно закрыть**

при unpaid remainder > 0.

После подтверждения:

* Session closed;
* paid amount сохраняется;
* unpaid amount сохраняется в истории;
* unpaid amount не является revenue;
* Commission считается только в соответствии с успешно оплаченными операциями;
* Table освобождается.

Не обнулять остаток искусственно.

---

# 69. NEXT COMPANY

После закрытия предыдущей Session новое QR entry создаёт новую Session.

Новая компания не видит данные предыдущей.

---

# 70. REVIEW

Review доступен Registered User.

Anonymous Guest:

не может оставить Review.

Не более одного Review на одно посещение там, где это предусмотрено бизнес-правилом.

---

# 71. BOOKINGS

Guest Booking flow:

* Venue;
* date;
* time;
* guests;
* table/zone requirements;
* comment;
* confirmation.

Созданный Booking появляется в Admin.

---

# 72. NOTIFICATIONS

Создать два логических типа:

```ts
service
marketing
```

Service:

* Order;
* Payment;
* Booking;
* Bonuses;
* Referral events;
* Service changes;
* другие критичные пользовательские операции.

Marketing:

* Promotions;
* PromoCodes;
* personalized offers;
* Venue news;
* return invitation.

---

# 73. COMMUNICATION SETTINGS

User может включать/выключать Marketing communications.

Service notifications НЕ должны выключаться вместе с Marketing.

В Demo v1.0:

не создавать 20 отдельных marketing toggles.

Достаточно:

```text
Сервисные уведомления
Маркетинговые уведомления
```

Основной канал первого этапа:

Push.

---

# 74. PRIVACY

Admin одного Venue не получает полную ecosystem history User.

Не показывать Venue:

* историю посещения других заведений;
* полные данные других Venue;
* избыточные персональные данные;
* глобальную историю пользователя.

Использовать внутренний platform ID там, где это необходимо.

---

# 75. ADMIN ROUTES

Минимум:

```text
/demo/admin
/demo/admin/operations
/demo/admin/orders
/demo/admin/tables
/demo/admin/menu
/demo/admin/bookings
/demo/admin/staff
/demo/admin/guests
/demo/admin/loyalty
/demo/admin/promos
/demo/admin/promo-codes
/demo/admin/reviews
/demo/admin/payments
/demo/admin/tips
/demo/admin/analytics
/demo/admin/communications
/demo/admin/integrations
/demo/admin/tariff
/demo/admin/settings
/demo/admin/network
```

---

# 76. ADMIN DASHBOARD

Показывать из реального Demo State:

* Revenue;
* Sessions / Digital Visits;
* Orders;
* Average Check;
* Active Tables;
* Online Payments;
* Cash Payments;
* Initial Tips;
* Additional Tips отдельно;
* Bonuses accrued;
* Bonuses spent;
* Staff calls;
* Problem operations.

НЕ рисовать числа, которые не связаны со state.

---

# 77. ANALYTICS SELECTORS

Создай вычисляемые selectors:

```ts
getRevenue()
getPaidAmount()
getUnpaidAmount()
getSessionCount()
getOrderCount()
getAverageCheck()
getOnlinePaymentsTotal()
getCashPaymentsTotal()
getInitialTipsTotal()
getAdditionalTipsTotal()
getBonusesAccrued()
getBonusesSpent()
```

Additional Tips:

НЕ увеличивают average check;

НЕ увеличивают visit/session count.

Unpaid amount:

НЕ считается Revenue.

---

# 78. MENU ADMIN

Admin Demo поддерживает:

* Categories;
* Products;
* Description;
* Images;
* Modifiers;
* Price;
* Availability;
* Stop List.

Если используется POS integration:

визуально указывать source of truth.

---

# 79. STOP LIST E2E

Admin:

```text
Product → Stop List ON
```

Guest:

сразу видит:

**Недоступно**

Add disabled.

Admin:

```text
Stop List OFF
```

Guest:

позиция снова доступна.

---

# 80. STAFF

Admin видит:

* Employees;
* Roles;
* Shifts;
* Assigned Tables;
* Orders;
* Response time;
* Tips.

Admin может демонстрационно переназначить Waiter Table №12.

После переназначения актуальный Waiter должен использоваться в текущем UI там, где бизнес-логика ориентируется на закреплённого официанта.

---

# 81. LOYALTY ADMIN

Настройки:

```text
Cashback rate
Bonus payment max
```

UI validation:

Cashback ниже минимально разрешённого значения не сохраняется.

Bonus max > 50% не сохраняется.

---

# 82. PROMOTION ADMIN

Созданная и опубликованная Demo Promotion должна автоматически появляться у Guest.

Не использовать отдельный hardcoded Guest mock.

---

# 83. PARTNER SERVICES

Partner services:

* Taxi;
* EnerGO;
* Wi-Fi;
* Delivery;
* другие предусмотренные интеграции

не должны притворяться реальными integration calls.

Создать adapter boundary.

Например:

```ts
TaxiAdapter
PowerbankAdapter
```

Demo implementations возвращают deterministic mock results.

---

# 84. NEARBY

Guest видит:

* venue photo;
* category;
* distance;
* rating;
* hours;
* Promotions;
* available Services.

Поддержать:

**Map / List**

В Demo допустим mock location dataset.

---

# 85. EVENTS

Events / Афиша — lifestyle layer.

Не связывать Event с текущей Session, если пользователь просто просматривает событие.

---

# 86. FULL CYCLE DEMO

Создай route:

```text
/demo/full-cycle
```

Desktop layout:

```text
Guest Phone
Waiter Phone/Tablet
Admin Desktop
```

Все три используют один state.

При action визуально подсвечивать интерфейс, в котором произошло следующее изменение.

Пример:

Guest Submit Order.

Через короткую спокойную animation:

* badge появляется в Waiter;
* Order появляется в Admin.

---

# 87. GUIDED MODE

В Full Cycle предусмотреть опциональный:

**Показать сценарий**

Он не должен автоматически «прокликивать» всё без пользователя.

Он должен подсказывать следующий шаг:

```text
Шаг 4 из 18
Оформите заказ со стороны гостя
```

После правильного действия:

переходит к следующему.

---

# 88. DEMO CONTROL CENTER

Для проверки сложных событий предусмотреть скрытую или developer-only панель:

```text
Demo Controls
```

Можно симулировать:

* POS accept;
* POS error;
* POS ready;
* online Payment success;
* Payment failure;
* cash confirmation;
* network delay;
* reset.

В публичном Full Cycle эти события можно оборачивать в понятные действия:

**Симулировать подтверждение iiko**

а не показывать техническую терминологию разработчика.

---

# 89. DEMO MODE HEADER

Guest Demo должен иметь:

```text
← Вернуться на сайт
ДЕМО · без реальных заказов и платежей
```

Production environment должен позволять отключить этот слой feature/config flag.

---

# 90. MARKETING WEBSITE

Главная `/` должна быть полноценным premium-сайтом MIRA LINK.

Секции:

```text
Header
Hero
What is MIRA LINK
Guest Experience
Restaurant Layer
Waiter
Admin
Loyalty
Payments / Split
Integrations
Lifestyle Services
Analytics
Tariffs
Interactive Demo
CTA
Footer
```

Главный CTA:

**Попробовать демо**

ведёт на Demo Hub.

---

# 91. НЕ ПОЗИЦИОНИРОВАТЬ КАК QR-МЕНЮ

Основная идея:

MIRA LINK — единая цифровая среда взаимодействия гостя с рестораном.

QR/NFC:

точка входа.

Не позиционировать весь продукт как:

**«электронное QR-меню»**.

---

# 92. DEMO HUB

Route:

```text
/demo
```

Режимы:

```text
Гость
Официант
Администратор
Полный цикл
```

Показывать краткое объяснение каждого.

---

# 93. RESET

Global action:

**Сбросить демо**

Должен сбрасывать:

* active Session;
* temporary Guests;
* Cart;
* Orders;
* Bill;
* Split;
* Payment Parts;
* Payments;
* Tips;
* Additional Tips;
* StaffCalls;
* Bonus demo changes;
* Stop List;
* temporary Promotions;
* Bookings;
* Analytics deltas;
* Simulator status.

Reset возвращает exact seed.

---

# 94. NO DEAD BUTTONS

Если control выглядит интерактивным:

он обязан работать.

Допустимые реакции:

* navigation;
* state change;
* modal;
* bottom sheet;
* demo simulation;
* disabled state с объяснением.

Не оставлять:

```ts
onClick={() => {}}
```

или `href="#"`.

---

# 95. COMPONENT ARCHITECTURE

Не копировать компоненты на каждой странице.

Создать reusable components минимум для:

```text
MiraButton
MiraIconButton
MiraCard
MiraInput
MiraSelect
MiraChip
MiraToggle
MiraModal
MiraBottomSheet
MiraToast
MiraStatusBadge
MiraMoney
MiraEmptyState
MiraSkeleton

ProductCard
OrderItemRow
TableCard
StaffCallCard
PaymentBreakdown
BonusControl
TipSelector
DemoBadge
```

---

# 96. MONEY COMPONENT

Все денежные суммы отображлять через единый helper/component.

Не делать в разных компонентах:

```ts
price + " ₽"
```

хаотично.

Создать formatter:

```ts
formatMoney()
```

---

# 97. ACCESSIBILITY

Обязательно:

* semantic buttons;
* labels;
* aria-label icon-only;
* focus-visible;
* keyboard accessibility desktop;
* WCAG AA для основного текста;
* статус не передаётся только цветом;
* loading/success accessible announcements там, где применимо.

---

# 98. MICROINTERACTIONS

Рекомендуемые durations:

```text
160–220 ms — controls
220–320 ms — sheets/modals
300–450 ms — success
```

Easing:

```css
cubic-bezier(.2,.8,.2,1)
```

Не использовать bounce everywhere.

---

# 99. EXTERNAL API SAFETY

Demo не должен:

* отправлять реальные ресторанные заказы;
* списывать реальные деньги;
* вызывать реальное Taxi;
* запускать реальную аренду Powerbank;
* отправлять реальные Push;
* менять настоящий iiko.

Все внешние действия проходят через Demo adapters.

---

# 100. ОБЯЗАТЕЛЬНЫЕ E2E-ТЕСТЫ

Создай Playwright scenarios.

### E2E-01 — Один гость

```text
Scan QR
→ Session
→ Menu
→ Cart
→ Order
→ POS Accept
→ Bill
→ Online Payment
→ Success
→ Session close
```

---

### E2E-02 — Три гостя

```text
Guest 1 enters
Guest 2 confirms join
Guest 3 confirms join
All share one Session
Each creates own Order
CommonOrder contains all
```

---

### E2E-03 — Каждый платит за себя

Каждая позиция принадлежит Guest.

Каждый формирует собственную PaymentPart.

После всех Payments:

```text
unpaidBalance = 0
```

---

### E2E-04 — Один платит за всех

Guest 1:

**Оплатить весь остаток**

После Success:

другим Guest платить не требуется.

---

### E2E-05 — Смешанная оплата

Несколько Guest оплачивают разные части.

Сумма successful Payments:

равна закрытой части Bill.

---

### E2E-06 — Tips только одного Guest

Guest 1 = 0.

Guest 2 = Tips.

Guest 3 = 0.

FinancialSplit Guest 2 содержит Tips.

Остальные — нет.

---

### E2E-07 — Active Session Protection

Новое устройство Scan Table №12.

До подтверждения join:

не видит CommonOrder.

После:

**Я с этой компанией**

получает доступ.

---

### E2E-08 — POS Error

Order submit;

POS timeout;

Error;

Retry/late POS confirmation;

один Order;

дубля нет.

---

### E2E-09 — Cash

Guest выбирает Cash.

Financial state ещё unpaid/pending.

POS confirmation.

Только после этого Paid.

---

### E2E-10 — Bonus after Partial Table Payment

Registered Guest оплачивает свою часть.

Другие ещё не оплатили.

Cashback начисляется сразу успешному User.

Session остаётся active.

---

### E2E-11 — Order after Payment

Guest оплатил.

Создаёт новый Order.

Старый Payment неизменен.

Новый unpaid remainder > 0.

---

### E2E-12 — Additional Tip after Session Close

Session closed.

Additional Tip successful.

Session остаётся closed.

Visit count не меняется.

Average Check не меняется.

---

### E2E-13 — Stop List

Admin Stop List ON.

Guest cannot add.

Admin OFF.

Guest can add.

---

### E2E-14 — Force Close

Session имеет unpaid remainder.

Admin force closes.

Table becomes free.

Unpaid amount сохраняется.

Revenue его не включает.

---

### E2E-15 — Anonymous Restrictions

Anonymous Guest:

может заказать и заплатить;

не получает cashback;

не оставляет Review.

---

### E2E-16 — Communication Settings

Marketing OFF.

Marketing notification не создаётся/не доставляется в пользовательский поток.

Service notification продолжает работать.

---

# 101. DOMAIN UNIT TESTS

Обязательно покрыть:

```text
single active session
money calculations
split totals
paid amount immutability
bonus max
bonus non-negative
cash pending
cash confirmation
commission transfer
additional tip commission
price snapshot
stop list
session close
force close
analytics exclusions
```

---

# 102. CRITICAL INVARIANTS

Вынести бизнес-инварианты явно.

Например:

```ts
unpaidBalance >= 0

bonusBalance >= 0

venueBonusRedemptionLimit <= 0.5

oneActiveSessionPerTable === true

paidPaymentIsImmutable === true

additionalTipDoesNotOpenSession === true

cashIntentIsNotPaymentConfirmation === true

anonymousUserDoesNotEarnBonus === true
```

Не полагаться только на UI validation.

---

# 103. IDEMPOTENCY

Особенно для:

* Order submit to POS;
* Payment callback;
* Cash confirmation;
* Bonus accrual;
* Additional Tip;
* Refund.

Повторное одинаковое external event не должно:

* создавать двойной Order;
* дважды начислять Bonus;
* дважды учитывать Revenue;
* дважды создавать FinancialSplit.

---

# 104. FULL CYCLE ACCEPTANCE

После сборки вручную пройди сценарий:

```text
Guest 1 enters Table 12
Guest 2 joins
Guest 1 orders
Waiter sees order
Admin sees order
POS confirms
Guest sees updated state
Guest 2 orders
CommonOrder updates
Guest calls waiter
Waiter accepts
Guest sees "Официант уже идёт"
POS marks ready
Guests open Bill
Split
Promo/Bonus where applicable
Tips
Online Payment Guest 1
Cashback immediately
Guest 1 creates new order
New remainder appears
Guest 2 pays
Guest 1 pays remainder
Session closes
Analytics update
Additional Tip after closure
Session remains closed
```

Если хотя бы один переход существует только визуально и не меняет shared state:

задача не закончена.

---

# 105. VISUAL ACCEPTANCE

Проверить:

* 390 px no horizontal overflow;
* Bottom Nav does not overlap content;
* dark green dominates UI;
* gold is accent;
* existing logo asset preserved;
* all screens visually belong to one system;
* Waiter looks more operational but still MIRA LINK;
* Admin uses same brand language without превращения в тяжёлую ERP;
* no bright marketplace colors;
* no generic default component-library appearance.

---

# 106. RESPONSIVE WEBSITE

Marketing Website:

desktop first presentation quality;

Guest Demo:

phone frame 390×844 ориентировочно;

Waiter:

phone/tablet;

Admin:

desktop/tablet.

На mobile Marketing Website:

Demo Guest должен открываться как полноценный mobile screen, а не как маленький телефон внутри телефона.

---

# 107. PERFORMANCE

Не загружать десятки тяжёлых изображений upfront.

Использовать:

* image optimization;
* lazy loading;
* route-level loading;
* skeleton;
* code splitting там, где это уместно.

Не ухудшать premium UX долгими блокирующими переходами.

---

# 108. ERROR UX

Технические ошибки переводить в человеческий язык.

Не показывать Guest:

```text
500
ECONNRESET
fetch failed
```

Показывать:

**Не удалось передать заказ. Попробуйте ещё раз или позовите официанта.**

При этом developer console/event log может содержать технические детали.

---

# 109. ЧТО CODEX НЕ ИМЕЕТ ПРАВА ДОДУМЫВАТЬ

Без подтверждённого источника НЕ создавать новые бизнес-правила для:

* объединения двух столов;
* размеров реферального вознаграждения;
* постоянной ставки комиссии;
* неутверждённых tariff prices;
* downgrade active Session;
* политики доступа сети к клиентской базе других Venue;
* автоматического возврата Tips;
* новых финансовых схем;
* автоматического переноса старой задолженности на новую компанию.

Если функция визуально нужна, но бизнес-правило отсутствует:

создай нейтральный UI shell;

оставь TODO;

не превращай предположение в production rule.

---

# 110. DEFINITION OF DONE

Проект считается готовым только если одновременно выполнено:

```text
Marketing Website работает
Guest Mini App работает
Waiter App работает
Admin Panel работает
Shared Demo State работает
Cross-interface synchronization работает
Reset работает
POS Simulator работает
Payment Simulator работает
Split работает
Financial Split не смешан с Split
Cash работает правильно
Tips работают правильно
Additional Tips работают отдельно
Bonuses работают правильно
Stop List синхронизирован
Staff Calls синхронизированы
Bookings синхронизированы
Analytics рассчитывается из state
E2E tests проходят
Нет мёртвых кнопок
Нет придуманных финансовых правил
Оригинальный логотип сохранён
UI соответствует MIRA_LINK_UI_TZ
```

---

# 111. ПОРЯДОК РАБОТЫ CODEX

Работай последовательно:

**Этап A — Audit**

Изучи repository и документы.

**Этап B — Domain**

Приведи entities, state, events и calculations к этой бизнес-модели.

**Этап C — Shared Demo Engine**

Свяжи Guest / Waiter / Admin.

**Этап D — Guest**

Заверши пользовательские сценарии.

**Этап E — Waiter**

Заверши operational interface.

**Этап F — Admin**

Заверши управление и аналитику.

**Этап G — Integrations Simulation**

POS, payments, Taxi, EnerGO и другие external boundaries.

**Этап H — Full Cycle**

Создай связанный демонстрационный режим.

**Этап I — Testing**

Unit + E2E.

**Этап J — UI Polish**

Responsive, animations, accessibility, visual consistency.

Не начинай с декоративной полировки, пока бизнес-сценарий не работает end-to-end.

---

# 112. ОТЧЁТ ПО ЗАВЕРШЕНИИ

После выполнения задачи предоставь краткий технический отчёт:

```text
1. Что было в repository изначально
2. Что создано
3. Что изменено
4. Какие routes существуют
5. Как реализован shared state
6. Как Guest связан с Waiter/Admin
7. Как симулируется POS
8. Как симулируются Payments
9. Какие E2E tests реализованы
10. Какие функции остались TODO исключительно потому,
    что по ним отсутствует утверждённое бизнес-решение
```

Не заявляй функцию реализованной, если существует только её визуальный mock.

---

# 113. ФИНАЛЬНЫЙ ПРИНЦИП

Главный объект демонстрации MIRA LINK:

не страница;

не QR-код;

не меню;

не платёж.

Главный объект:

**цифровое посещение / Session.**

Вокруг одной Session должны естественно объединяться:

```text
Table
Guests
Orders
Common Order
Service
Bill
Split
Tips
Payments
Financial Split
Bonuses
Analytics
Repeat Interaction
```

Посетитель Demo должен своими действиями увидеть:

**что сделал гость → что получил официант → что увидел администратор → что произошло в POS → как сформировался платёж → как распределились средства → когда начислились бонусы → как закрылась цифровая сессия.**

Не рассказывай пользователю, как работает MIRA LINK.

**Дай ему самому пройти этот процесс.**
