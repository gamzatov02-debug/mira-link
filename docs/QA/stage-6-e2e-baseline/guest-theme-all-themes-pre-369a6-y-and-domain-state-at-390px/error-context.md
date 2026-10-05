# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: guest-theme.spec.ts >> all themes preserve guest geometry and domain state at 390px
- Location: tests/e2e/guest-theme.spec.ts:4:1

# Error details

```
Test timeout of 45000ms exceeded.
```

```
Error: locator.evaluate: Test timeout of 45000ms exceeded.
Call log:
  - waiting for locator('.popular-dish img').first()

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
      - region "Ресторан" [ref=e43]:
        - img "MIRA Restaurant · 1" [ref=e44]
        - generic [ref=e45]:
          - text: РЕСТОРАН
          - heading "MIRA Restaurant" [level=2] [ref=e46]
          - paragraph [ref=e47]: Современная кухня. Время для вашего вечера.
        - button "Открыть меню" [ref=e48] [cursor=pointer]
        - generic [ref=e52]:
          - generic [ref=e53]: 1/4
          - button "Предыдущий слайд" [ref=e54] [cursor=pointer]
          - button "Следующий слайд" [ref=e57] [cursor=pointer]
      - navigation "Быстрые действия" [ref=e60]:
        - button "Меню — быстрое действие" [ref=e61] [cursor=pointer]:
          - generic [ref=e67]: Меню
          - generic [ref=e68]: Блюда и напитки
        - button "Заказ" [ref=e69] [cursor=pointer]:
          - generic [ref=e73]: Ваши позиции
        - button "Счёт" [ref=e74] [cursor=pointer]:
          - generic [ref=e79]: Оплата за столом
        - button "Официант" [ref=e80] [cursor=pointer]:
          - generic [ref=e85]: Команда рядом
        - button "Split" [ref=e86] [cursor=pointer]:
          - generic [ref=e93]: Разделить счёт
        - button "Чаевые" [ref=e94] [cursor=pointer]:
          - generic [ref=e98]: Поблагодарить
        - button "Пауэрбанк" [ref=e99] [cursor=pointer]:
          - generic [ref=e105]: Зарядка рядом
        - button "Такси" [ref=e106] [cursor=pointer]:
          - generic [ref=e112]: Поездка домой
      - generic [ref=e113]:
        - generic [ref=e116]:
          - strong [ref=e117]: Вечер в MIRA
          - generic [ref=e118]: Предложения вашего ресторана
        - img "Десерт ресторана" [ref=e119]
        - button "Посмотреть акции" [ref=e120] [cursor=pointer]
      - generic [ref=e123]:
        - generic [ref=e124]:
          - heading "Популярное" [level=2] [ref=e125]
          - button "Смотреть всё →" [ref=e126] [cursor=pointer]
        - generic [ref=e128]:
          - generic [ref=e129]:
            - img "Буррата с томатами" [ref=e130]
            - generic [ref=e131]:
              - 'button "В избранное: Буррата с томатами" [ref=e132] [cursor=pointer]'
              - heading "Буррата с томатами" [level=3] [ref=e136]
              - paragraph [ref=e137]: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 220 г
              - strong [ref=e139]: 890 ₽
              - button "Выбрать блюдо" [ref=e140] [cursor=pointer]
          - generic [ref=e142]:
            - img "Тартар из говядины" [ref=e143]
            - generic [ref=e144]:
              - 'button "В избранное: Тартар из говядины" [ref=e145] [cursor=pointer]'
              - heading "Тартар из говядины" [level=3] [ref=e149]
              - paragraph [ref=e150]: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 180 г
              - strong [ref=e152]: 980 ₽
              - button "Выбрать блюдо" [ref=e153] [cursor=pointer]
          - generic [ref=e155]:
            - img "Карпаччо из лосося" [ref=e156]
            - generic [ref=e157]:
              - 'button "В избранное: Карпаччо из лосося" [ref=e158] [cursor=pointer]'
              - heading "Карпаччо из лосося" [level=3] [ref=e162]
              - paragraph [ref=e163]: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 160 г
              - strong [ref=e165]: 1 090 ₽
              - button "Выбрать блюдо" [ref=e166] [cursor=pointer]
          - generic [ref=e168]:
            - img "Зелёный салат" [ref=e169]
            - generic [ref=e170]:
              - 'button "В избранное: Зелёный салат" [ref=e171] [cursor=pointer]'
              - heading "Зелёный салат" [level=3] [ref=e175]
              - paragraph [ref=e176]: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 240 г
              - strong [ref=e178]: 690 ₽
              - button "Выбрать блюдо" [ref=e179] [cursor=pointer]
          - generic [ref=e181]:
            - img "Салат с креветками" [ref=e182]
            - generic [ref=e183]:
              - 'button "В избранное: Салат с креветками" [ref=e184] [cursor=pointer]'
              - heading "Салат с креветками" [level=3] [ref=e188]
              - paragraph [ref=e189]: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 260 г
              - strong [ref=e191]: 940 ₽
              - button "Выбрать блюдо" [ref=e192] [cursor=pointer]
          - generic [ref=e194]:
            - img "Тёплый салат с уткой" [ref=e195]
            - generic [ref=e196]:
              - 'button "В избранное: Тёплый салат с уткой" [ref=e197] [cursor=pointer]'
              - heading "Тёплый салат с уткой" [level=3] [ref=e201]
              - paragraph [ref=e202]: Готовим на нашей кухне из свежих продуктов. Подаём сразу после приготовления. · 250 г
              - strong [ref=e204]: 990 ₽
              - button "Выбрать блюдо" [ref=e205] [cursor=pointer]
      - group [ref=e208]:
        - generic "Гости и устройства демо" [ref=e209] [cursor=pointer]
        - option "Новое устройство"
        - option "Гость 1 · анонимно · session-1" [selected]
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
> 9  |  for(const id of Object.keys(themeNames)){await page.evaluate(id=>{localStorage.setItem('mira-venue-theme-v1',id);window.dispatchEvent(new Event('mira-theme'))},id);await expect(page.locator('.guest-theme').first()).toHaveAttribute('data-theme',id);await page.waitForTimeout(240);expect(await geometry(),id).toEqual(before);expect(await page.evaluate(()=>localStorage.getItem('mira-link-demo-v1'))).toBe(state);expect(await page.locator('.popular-dish img').first().evaluate(el=>getComputedStyle(el).filter)).toBe('none');await page.screenshot({path:`.test-runtime/theme-${id}.png`});}
     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   ^ Error: locator.evaluate: Test timeout of 45000ms exceeded.
  10 |  await expect(page.locator('.guest-quick-actions>button')).toHaveCount(8);expect(await page.locator('.guest-quick-actions>button').evaluateAll(els=>new Set(els.map(e=>e.getBoundingClientRect().y)).size)).toBe(2);expect(before[1][0]).toBe(366);expect(before[1][1]).toBe(170);await expect(page.getByRole('navigation',{name:'Основная навигация гостя'})).toContainText('Бонусы');
  11 | });
  12 | for(const width of [320,480])test(`guest viewport ${width}px and fixed navigation`,async({page})=>{await page.setViewportSize({width,height:844});await page.goto('/demo/guest/home');await page.getByRole('button',{name:'Сканировать QR стола №12',exact:true}).click();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);const nav=await page.locator('.bottom-nav').boundingBox();expect(nav!.x).toBeGreaterThanOrEqual(0);expect(nav!.x+nav!.width).toBeLessThanOrEqual(width);expect(nav!.y+nav!.height).toBe(844);await expect(page.locator('.guest-quick-actions>button')).toHaveCount(8)});
  13 | test('admin theme picker previews and applies to Guest, including portals',async({page,context})=>{
  14 |  await page.goto('/demo/admin');await page.getByRole('button',{name:'Настройки',exact:true}).click();await page.getByLabel('Тема заведения',{exact:true}).selectOption('ivory_gold');await expect(page.locator('.theme-preview .guest-theme')).toHaveAttribute('data-theme','ivory_gold');await page.getByRole('button',{name:'Применить тему',exact:true}).click();const guest=await context.newPage();await guest.goto('/demo/guest/menu');await expect(guest.locator('.guest-theme').first()).toHaveAttribute('data-theme','ivory_gold');await guest.getByRole('button',{name:'Выбрать блюдо',exact:true}).first().click();await expect(guest.getByRole('dialog')).toHaveAttribute('data-theme','ivory_gold');expect(await guest.getByRole('dialog').evaluate(el=>getComputedStyle(el).backgroundColor)).toBe('rgb(255, 253, 248)');await guest.keyboard.press('Escape');await guest.getByRole('button',{name:'Рядом',exact:true}).click();await expect(guest.locator('.leaflet-tile-pane').first()).toHaveCSS('filter','none');
  15 | });
  16 | 
  17 | test('dish favorites can be saved, viewed and removed without a table session',async({page})=>{
  18 |  await page.goto('/demo/guest/home');await page.getByRole('button',{name:'Избранное: Буррата с томатами',exact:true}).click();await page.getByRole('button',{name:'Ещё',exact:true}).click();await page.getByRole('button',{name:'Избранное',exact:true}).click();await expect(page.getByRole('heading',{name:'Буррата с томатами',exact:true})).toBeVisible();await page.getByRole('button',{name:'Фото и состав',exact:true}).click();await expect(page.getByRole('dialog').getByText('Состав блюда',{exact:true})).toBeVisible();await expect(page.getByRole('button',{name:'В корзину',exact:true})).toBeDisabled();await page.keyboard.press('Escape');await page.getByRole('button',{name:'Убрать блюдо из избранного',exact:true}).click();await expect(page.getByText('Здесь появятся любимые блюда. Сохраните понравившееся на главной.',{exact:true})).toBeVisible();
  19 | });
  20 | 
```