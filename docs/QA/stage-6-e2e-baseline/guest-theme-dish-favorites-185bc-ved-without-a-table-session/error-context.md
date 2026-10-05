# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: guest-theme.spec.ts >> dish favorites can be saved, viewed and removed without a table session
- Location: tests/e2e/guest-theme.spec.ts:17:1

# Error details

```
Test timeout of 45000ms exceeded.
```

```
Error: locator.click: Test timeout of 45000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Избранное: Буррата с томатами', exact: true })

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
      - region "Ресторан" [ref=e34]:
        - img "MIRA Restaurant · 1" [ref=e35]
        - generic [ref=e36]:
          - text: РЕСТОРАН
          - heading "MIRA Restaurant" [level=2] [ref=e37]
          - paragraph [ref=e38]: Современная кухня. Время для вашего вечера.
        - button "Открыть меню" [ref=e39] [cursor=pointer]
        - generic [ref=e43]:
          - generic [ref=e44]: 1/4
          - button "Предыдущий слайд" [ref=e45] [cursor=pointer]
          - button "Следующий слайд" [ref=e48] [cursor=pointer]
      - navigation "Быстрые действия" [ref=e51]:
        - button "Меню — быстрое действие" [ref=e52] [cursor=pointer]:
          - generic [ref=e58]: Меню
          - generic [ref=e59]: Блюда и напитки
        - button "Заказ" [ref=e60] [cursor=pointer]:
          - generic [ref=e64]: Ваши позиции
        - button "Счёт" [ref=e65] [cursor=pointer]:
          - generic [ref=e70]: Оплата за столом
        - button "Официант" [ref=e71] [cursor=pointer]:
          - generic [ref=e76]: Команда рядом
        - button "Split" [ref=e77] [cursor=pointer]:
          - generic [ref=e84]: Разделить счёт
        - button "Чаевые" [ref=e85] [cursor=pointer]:
          - generic [ref=e89]: Поблагодарить
        - button "Пауэрбанк" [ref=e90] [cursor=pointer]:
          - generic [ref=e96]: Зарядка рядом
        - button "Такси" [ref=e97] [cursor=pointer]:
          - generic [ref=e103]: Поездка домой
      - generic [ref=e104]:
        - generic [ref=e107]:
          - strong [ref=e108]: Вечер в MIRA
          - generic [ref=e109]: Предложения вашего ресторана
        - img "Десерт ресторана" [ref=e110]
        - button "Посмотреть акции" [ref=e111] [cursor=pointer]
      - generic [ref=e114]:
        - generic [ref=e115]:
          - heading "Популярное" [level=2] [ref=e116]
          - button "Смотреть всё →" [ref=e117] [cursor=pointer]
        - generic [ref=e119]:
          - generic [ref=e120]:
            - img "Буррата с томатами" [ref=e121]
            - generic [ref=e122]:
              - 'button "В избранное: Буррата с томатами" [ref=e123] [cursor=pointer]'
              - heading "Буррата с томатами" [level=3] [ref=e127]
              - paragraph [ref=e128]: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 220 г
              - strong [ref=e130]: 890 ₽
              - button "Выбрать блюдо" [ref=e131] [cursor=pointer]
          - generic [ref=e133]:
            - img "Тартар из говядины" [ref=e134]
            - generic [ref=e135]:
              - 'button "В избранное: Тартар из говядины" [ref=e136] [cursor=pointer]'
              - heading "Тартар из говядины" [level=3] [ref=e140]
              - paragraph [ref=e141]: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 180 г
              - strong [ref=e143]: 980 ₽
              - button "Выбрать блюдо" [ref=e144] [cursor=pointer]
          - generic [ref=e146]:
            - img "Карпаччо из лосося" [ref=e147]
            - generic [ref=e148]:
              - 'button "В избранное: Карпаччо из лосося" [ref=e149] [cursor=pointer]'
              - heading "Карпаччо из лосося" [level=3] [ref=e153]
              - paragraph [ref=e154]: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 160 г
              - strong [ref=e156]: 1 090 ₽
              - button "Выбрать блюдо" [ref=e157] [cursor=pointer]
          - generic [ref=e159]:
            - img "Зелёный салат" [ref=e160]
            - generic [ref=e161]:
              - 'button "В избранное: Зелёный салат" [ref=e162] [cursor=pointer]'
              - heading "Зелёный салат" [level=3] [ref=e166]
              - paragraph [ref=e167]: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 240 г
              - strong [ref=e169]: 690 ₽
              - button "Выбрать блюдо" [ref=e170] [cursor=pointer]
          - generic [ref=e172]:
            - img "Салат с креветками" [ref=e173]
            - generic [ref=e174]:
              - 'button "В избранное: Салат с креветками" [ref=e175] [cursor=pointer]'
              - heading "Салат с креветками" [level=3] [ref=e179]
              - paragraph [ref=e180]: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 260 г
              - strong [ref=e182]: 940 ₽
              - button "Выбрать блюдо" [ref=e183] [cursor=pointer]
          - generic [ref=e185]:
            - img "Тёплый салат с уткой" [ref=e186]
            - generic [ref=e187]:
              - 'button "В избранное: Тёплый салат с уткой" [ref=e188] [cursor=pointer]'
              - heading "Тёплый салат с уткой" [level=3] [ref=e192]
              - paragraph [ref=e193]: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 250 г
              - strong [ref=e195]: 990 ₽
              - button "Выбрать блюдо" [ref=e196] [cursor=pointer]
      - generic [ref=e198]:
        - generic [ref=e199]: ВАШЕ ЦИФРОВОЕ ПОСЕЩЕНИЕ
        - heading "Начните цифровое посещение" [level=3] [ref=e200]
        - paragraph [ref=e201]: Отсканируйте QR, чтобы открыть стол №12 и познакомиться с меню.
        - generic [ref=e202]:
          - generic [ref=e203]: Войти как демо-пользователь Алексей
          - switch "Войти как демо-пользователь Алексей" [ref=e204] [cursor=pointer]
        - button "Сканировать QR стола №12" [ref=e205] [cursor=pointer]
      - group [ref=e208]:
        - generic "Гости и устройства демо" [ref=e209] [cursor=pointer]
    - navigation "Основная навигация гостя" [ref=e210]:
      - button "Главная" [ref=e211] [cursor=pointer]
      - button "Меню" [ref=e216] [cursor=pointer]
      - button "Рядом" [ref=e221] [cursor=pointer]
      - button "Афиша" [ref=e225] [cursor=pointer]
      - button "Ещё" [ref=e230] [cursor=pointer]
```

# Test source

```ts
  1  | import {test,expect} from '@playwright/test';
  2  | import {getTheme,themeNames,validateTheme} from '../../lib/guest-theme';
  3  | test('all nine approved themes pass semantic contrast validation',()=>{for(const id of Object.keys(themeNames) as (keyof typeof themeNames)[])for(const result of validateTheme(getTheme(id)))expect(result.pass,`${id}: ${result.label} ${result.ratio}`).toBe(true)});
  4  | test('all themes preserve guest geometry and domain state at 390px',async({page})=>{
  5  |  await page.setViewportSize({width:390,height:844});await page.goto('/demo/guest/home');await page.getByRole('button',{name:'Сканировать QR стола №12',exact:true}).click();await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(2500);
  6  |  const selectors=['.guest-header','.restaurant-hero','.guest-quick-actions','.guest-promo','.popular-grid','.bottom-nav'];
  7  |  const geometry=()=>page.evaluate(sels=>sels.map(sel=>{const r=document.querySelector(sel)!.getBoundingClientRect();return [r.width,r.height,r.x,r.y].map(n=>Math.round(n))}),selectors);
  8  |  await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));const before=await geometry();const state=await page.evaluate(()=>localStorage.getItem('mira-link-demo-v1'));
  9  |  for(const id of Object.keys(themeNames)){await page.evaluate(id=>{localStorage.setItem('mira-venue-theme-v1',id);window.dispatchEvent(new Event('mira-theme'))},id);await expect(page.locator('.guest-theme').first()).toHaveAttribute('data-theme',id);await page.waitForTimeout(240);expect(await geometry(),id).toEqual(before);expect(await page.evaluate(()=>localStorage.getItem('mira-link-demo-v1'))).toBe(state);expect(await page.locator('.popular-dish img').first().evaluate(el=>getComputedStyle(el).filter)).toBe('none');await page.screenshot({path:`.test-runtime/theme-${id}.png`});}
  10 |  await expect(page.locator('.guest-quick-actions>button')).toHaveCount(8);expect(await page.locator('.guest-quick-actions>button').evaluateAll(els=>new Set(els.map(e=>e.getBoundingClientRect().y)).size)).toBe(2);expect(before[1][0]).toBe(366);expect(before[1][1]).toBe(170);await expect(page.getByRole('navigation',{name:'Основная навигация гостя'})).toContainText('Бонусы');
  11 | });
  12 | for(const width of [320,480])test(`guest viewport ${width}px and fixed navigation`,async({page})=>{await page.setViewportSize({width,height:844});await page.goto('/demo/guest/home');await page.getByRole('button',{name:'Сканировать QR стола №12',exact:true}).click();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);const nav=await page.locator('.bottom-nav').boundingBox();expect(nav!.x).toBeGreaterThanOrEqual(0);expect(nav!.x+nav!.width).toBeLessThanOrEqual(width);expect(nav!.y+nav!.height).toBe(844);await expect(page.locator('.guest-quick-actions>button')).toHaveCount(8)});
  13 | test('admin theme picker previews and applies to Guest, including portals',async({page,context})=>{
  14 |  await page.goto('/demo/admin');await page.getByRole('button',{name:'Настройки',exact:true}).click();await page.getByLabel('Тема заведения',{exact:true}).selectOption('ivory_gold');await expect(page.locator('.theme-preview .guest-theme')).toHaveAttribute('data-theme','ivory_gold');await page.getByRole('button',{name:'Применить тему',exact:true}).click();const guest=await context.newPage();await guest.goto('/demo/guest/menu');await expect(guest.locator('.guest-theme').first()).toHaveAttribute('data-theme','ivory_gold');await guest.getByRole('button',{name:'Выбрать блюдо',exact:true}).first().click();await expect(guest.getByRole('dialog')).toHaveAttribute('data-theme','ivory_gold');expect(await guest.getByRole('dialog').evaluate(el=>getComputedStyle(el).backgroundColor)).toBe('rgb(255, 253, 248)');await guest.keyboard.press('Escape');await guest.getByRole('button',{name:'Рядом',exact:true}).click();await expect(guest.locator('.leaflet-tile-pane').first()).toHaveCSS('filter','none');
  15 | });
  16 | 
  17 | test('dish favorites can be saved, viewed and removed without a table session',async({page})=>{
> 18 |  await page.goto('/demo/guest/home');await page.getByRole('button',{name:'Избранное: Буррата с томатами',exact:true}).click();await page.getByRole('button',{name:'Ещё',exact:true}).click();await page.getByRole('button',{name:'Избранное',exact:true}).click();await expect(page.getByRole('heading',{name:'Буррата с томатами',exact:true})).toBeVisible();await page.getByRole('button',{name:'Фото и состав',exact:true}).click();await expect(page.getByRole('dialog').getByText('Состав блюда',{exact:true})).toBeVisible();await expect(page.getByRole('button',{name:'В корзину',exact:true})).toBeDisabled();await page.keyboard.press('Escape');await page.getByRole('button',{name:'Убрать блюдо из избранного',exact:true}).click();await expect(page.getByText('Здесь появятся любимые блюда. Сохраните понравившееся на главной.',{exact:true})).toBeVisible();
     |                                                                                                                       ^ Error: locator.click: Test timeout of 45000ms exceeded.
  19 | });
  20 | 
```