# Global Guest Header / Logo Refinement

9 октября 2026. VISUAL ACCEPTANCE: PENDING USER REVIEW.

ROOT CAUSE: GuestHeader использовал MiraMonogram, который показывал CSS-кроп непрозрачного public/brand/mira-welcome-reference.jpg. Квадрат был фоном внутри JPEG, а не подложкой Header. Исходного SVG в репозитории не было; пользователь предоставил MIRA_Monogram_Vector.svg.

| Проверка | Результат |
| --- | --- |
| BACKGROUND REMOVED | PASS — прозрачный SVG без фоновых фигур и CSS-плашек |
| ORIGINAL SVG PRESERVED | PASS — предоставленный пользователем SVG скопирован побайтно, cmp PASS; path, viewBox и золотой градиент сохранены |
| GLOBAL GUEST CONSISTENCY | PASS — единый GuestHeader на Home, Menu, Order, Bill, Waiter, Nearby, Events, Promotions, Powerbank, Delivery; Venue Detail использует тот же shell |
| HEADER ALIGNMENT | PASS — оптическая ось, отсутствие пересечений с controls; высота 64 px |
| 320PX / 375PX / 390PX / DESKTOP | PASS — ширина логотипа определяется его контейнером, символ остаётся видимым |
| CLASSIC/DARK/LIGHT/CUSTOM | PASS — исходные цвета SVG без фильтров; текст использует существующий accent token |
| HEADER CONTROLS | PASS — стол, уведомления с account gate, профиль; размеры кнопок минимум 44×44 |
| HORIZONTAL OVERFLOW | 0 px в проверенных сценариях |
| TYPESCRIPT | PASS |
| TARGETED TESTS | 6 сценариев PASS: 5 в основном прогоне, тест кнопок повторён после исправления ожиданий существующего account flow |
| FULL REGRESSION | NOT RUN |
| VISUAL ACCEPTANCE | PENDING USER REVIEW |

Изменены только GuestHeader, его CSS module, добавлен предоставленный SVG, целевой тест и QA-артефакты. Общий MiraMonogram для публичного сайта, Admin/Waiter и welcome не менялся. app/guest-design-system.css сохранён с прежними локальными изменениями и не входит в коммит этой задачи.

## Проверки

```sh
npm run typecheck
npm run test:e2e -- tests/e2e/guest-header.spec.ts
npm run test:e2e -- tests/e2e/guest-header.spec.ts --grep 'controls remain clickable'
git diff --check
```

Предоставленный SVG проверен побайтным сравнением с файлом пользователя. Визуальная проверка не является подтверждением оценки 9,8/10 — итоговая приёмка остаётся за пользователем.

## Files changed

- components/guest-home.tsx
- components/guest-header.module.css
- public/brand/mira-monogram.svg
- tests/e2e/guest-header.spec.ts
- docs/QA/guest-header-logo/

## Реальные UI-снимки

- [Home Header — 390px](home-390-classic.png)
- [Home Header — 320px](home-320-classic.png)
- [Home Header — 375px](home-375-classic.png)
- [Light Theme — 390px](home-390-light.png)
- [Desktop Demo Container — 1440px](home-1440-classic.png)

COMMIT / PUSH: хеш и результат указаны в итоговом сообщении чата. Production deploy не выполняется.
