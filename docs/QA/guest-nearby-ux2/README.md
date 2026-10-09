# Guest «Рядом» / Nearby Map UX 2.0

Дата проверки: 9 октября 2026 года. Визуальная приёмка: **PENDING USER REVIEW**.

## Аудит и реализация

Сохранены существующие Nearby, canonical GuestVenueCard, Venue Detail, Venue Menu, GuestMenuProductCard, GuestProductDetail и доставка. Карта и список получают один массив отфильтрованных заведений и используют один selectedId; открытие деталей хранится отдельно как boolean. Выбор точки или карточки показывает preview и прокручивает его в видимую область над нижней навигацией.

Map Provider Adapter сохранён с приоритетом Yandex → 2GIS → branded-demo. Реальных реализаций Yandex/2GIS в реестре нет: используется явно обозначенная демонстрационная схема. Внешние SDK и сетевые тайлы не добавлялись. Маркеры соответствуют шести существующим venue IDs; единый VenueMapMarker используется и в деталях. Одиночная точка центрируется, маркеры не пересекают границы карты. Старый CSS сетки больше не используется этим провайдером.

Геолокация запрашивается по нажатию, без постоянного слежения. Отказ не мешает просмотру. Координаты каталога демонстрационные: карта не рисует местоположение пользователя и не выдаёт расчётные расстояния за реальные. Подписи адресов заменены нейтральными условными описаниями. Рейтинги и часы взяты из существующего демокаталога; статус работы вычисляется по расписанию в Europe/Moscow.

Поиск использует название, категорию, описание и названия блюд существующего меню. Фильтр доставки использует deliveryEnabled. Акции берутся из опубликованных Promotions со связью venueId; отдельный движок акций не создавался.

В просмотре меню кнопка добавления открывает существующую карточку блюда с требованием присоединиться к столу, если table context отсутствует. Она больше не наполняет локальную корзину доставки. Существующая доставка сохраняет раздельные корзины заведений, оформление демо-заявки и неизменность заказа стола.

## Результаты

| Проверка | Результат |
| --- | --- |
| MAP PROVIDER ARCHITECTURE | PASS — demo fallback, интерфейс провайдера сохранён |
| PREMIUM MAP DESIGN | PASS — реализация и внутренний просмотр; оценка пользователя ожидается |
| VENUE MARKERS | PASS — IDs совпадают со списком, границы и одиночная точка проверены |
| SELECTED VENUE PREVIEW | PASS — фото, название, категория, рейтинг, действия и закрытие |
| MAP/LIST SYNC | PASS — общий выбор и фильтры |
| SEARCH/FILTERS | PASS — включая поиск блюда, доставку, акции и пустую выдачу |
| GEOLOCATION | PASS — получение координат и отказ; ограничения демоданных сохранены |
| DEMO MODE | PASS — условная схема обозначена, реальные расстояния не заявляются |
| VENUE MENU | PASS — существующие меню и карточка блюда |
| DELIVERY HANDOFF | PASS — отдельные корзины заведений и создание демо-заявки |
| NO-TABLE BROWSING | PASS — состояние домена не меняется, вход к столу остаётся обязательным |
| BOTTOM NAV | PASS — canonical navigation, активный «Рядом», прямой вход QR |
| 390PX / 320PX / DESKTOP | PASS — 320, 390 и 1440 px |
| CLASSIC/DARK/LIGHT | PASS |
| CUSTOM / LONG NAMES | PASS — custom palette и длинное имя в presentation fixture |
| HORIZONTAL OVERFLOW | 0 px в проверенных сценариях |
| DOMAIN TESTS | 58/58 PASS |
| TARGETED E2E | 11/11 PASS; отдельно пересняты 4 визуальных сценария без анимации |
| TYPESCRIPT | PASS |
| FULL REGRESSION | NOT RUN |
| VISUAL ACCEPTANCE | PENDING USER REVIEW |

Команды:

```sh
npm run typecheck
npm test
npm run test:e2e -- tests/e2e/nearby.spec.ts tests/e2e/guest-service.spec.ts --grep 'Nearby|nearby|venue menus|anonymous venue'
npm run test:e2e -- tests/e2e/nearby.spec.ts --grep 'map, preview|responsive|marker bounds|custom palette'
git diff --check
```

Первый восстановленный запуск выявил устаревший E2E-селектор кнопки блюда. Исправлены селекторы без удаления проверок. Устранено предупреждение гидратации data-distance округлением технического атрибута; добавлено ожидание гидратации перед снимками. Vinext сообщает предупреждение оптимизатора зависимостей. При отдельном снятии скриншотов также зарегистрировано предупреждение гидратации input style (пустой style после скрытия caret средствами Playwright); оно не связано с данными расстояния. Запуск и тесты завершаются успешно.

## Domain gaps

- Нет подключённого реального картографического провайдера и достоверного источника координат заведений. Настройка ключа сама по себе не подключит провайдер без реализации адаптера.
- Каталог, рейтинги, расписания, фото и меню демонстрационные. Расстояния скрыты; отображение пользователя на нейтральной схеме намеренно отсутствует.
- Поиск по блюдам работает по существующему каталогу; внешнего поиска по реальным ресторанам нет.
- Оплата и отправка заказа из доставки остаются демонстрационными, как в существующем flow.

## QA screenshots

Все изображения получены из работающего UI, без генерации макетов.

- [01-base-classic.png](01-base-classic.png) — карта без выбора.
- [02-selected-preview.png](02-selected-preview.png) — выбранный маркер и preview, полная страница.
- [03-venue-list.png](03-venue-list.png) — каталог.
- [04-delivery-filter.png](04-delivery-filter.png) — фильтр доставки.
- [05-demo-mode.png](05-demo-mode.png) — отказ геолокации / деморежим.
- [06-light-theme.png](06-light-theme.png) — Light.
- [07-scroll-bottom-nav.png](07-scroll-bottom-nav.png) — прокрутка, последняя карточка и нижняя навигация.
- [selected-320.png](selected-320.png), [selected-390.png](selected-390.png), [selected-1440.png](selected-1440.png) — viewport со всей выбранной карточкой над навигацией.
- [custom-long-name-320.png](custom-long-name-320.png) — пользовательская палитра и длинное имя.

## Files changed

- components/nearby.tsx
- components/nearby.module.css
- components/maps/map-provider.tsx
- components/maps/map-provider.module.css
- components/venue-map.tsx
- components/guest/guest-venue-card.tsx
- components/guest/guest-venue-card.module.css
- lib/nearby.ts
- tests/domain.test.ts
- tests/e2e/nearby.spec.ts
- tests/e2e/guest-service.spec.ts
- docs/QA/guest-nearby-ux2/

Постороннее локальное изменение app/guest-design-system.css сохранено и исключено из коммита задачи. Production deploy не выполняется; push не является подтверждением deploy. Хеш коммита и результат push фиксируются в итоговом сообщении чата.
