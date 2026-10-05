# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: guest-theme.spec.ts >> admin theme picker previews and applies to Guest, including portals
- Location: tests/e2e/guest-theme.spec.ts:13:1

# Error details

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator:  getByRole('dialog')
Expected: "ivory_gold"
Received: ""
Timeout:  5000ms

Call log:
  - Expect "toHaveAttribute" getByRole('dialog') with timeout 5000ms
  - waiting for getByRole('dialog')
    14 × locator resolved to <div role="dialog" tabindex="-1" data-state="open" id="radix-_R_thi_" data-slot="sheet-content" aria-labelledby="radix-_R_thiH1_" aria-describedby="radix-_R_thiH2_" class="fixed z-50 flex flex-col gap-4 bg-background shadow-lg transition ease-in-out data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:animate-in data-[state=open]:duration-500 inset-x-0 bottom-0 h-auto border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom _sheet_sqpyu_6…>…</div>
       - unexpected value "null"

```

```yaml
- dialog "Буррата с томатами":
  - heading "Буррата с томатами" [level=2]
  - paragraph: Меню MIRA Restaurant
  - img "Буррата с томатами — пример подачи"
  - heading "Состав блюда" [level=4]
  - paragraph: Буррата, томаты, базилик, оливковое масло
  - heading "Аллергены в демо-рецепте" [level=4]
  - paragraph: Молоко
  - text: Демонстрационный состав. Фото — пример подачи. Реальный состав и возможные следы аллергенов уточняются у кухни.
  - paragraph: 890,00 ₽ · 220 г
  - checkbox "Дополнительный соус · 90,00 ₽"
  - text: Дополнительный соус · 90,00 ₽
  - button "Уменьшить количество" [disabled]: −
  - status: "1"
  - button "Увеличить количество": +
  - text: Комментарий к блюду
  - textbox "Комментарий к блюду"
  - button "В корзину" [disabled]
  - paragraph: 890,00 ₽
  - button "Присоединиться к столу"
  - button "Close"
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
> 14 |  await page.goto('/demo/admin');await page.getByRole('button',{name:'Настройки',exact:true}).click();await page.getByLabel('Тема заведения',{exact:true}).selectOption('ivory_gold');await expect(page.locator('.theme-preview .guest-theme')).toHaveAttribute('data-theme','ivory_gold');await page.getByRole('button',{name:'Применить тему',exact:true}).click();const guest=await context.newPage();await guest.goto('/demo/guest/menu');await expect(guest.locator('.guest-theme').first()).toHaveAttribute('data-theme','ivory_gold');await guest.getByRole('button',{name:'Выбрать блюдо',exact:true}).first().click();await expect(guest.getByRole('dialog')).toHaveAttribute('data-theme','ivory_gold');expect(await guest.getByRole('dialog').evaluate(el=>getComputedStyle(el).backgroundColor)).toBe('rgb(255, 253, 248)');await guest.keyboard.press('Escape');await guest.getByRole('button',{name:'Рядом',exact:true}).click();await expect(guest.locator('.leaflet-tile-pane').first()).toHaveCSS('filter','none');
     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       ^ Error: expect(locator).toHaveAttribute(expected) failed
  15 | });
  16 | 
  17 | test('dish favorites can be saved, viewed and removed without a table session',async({page})=>{
  18 |  await page.goto('/demo/guest/home');await page.getByRole('button',{name:'Избранное: Буррата с томатами',exact:true}).click();await page.getByRole('button',{name:'Ещё',exact:true}).click();await page.getByRole('button',{name:'Избранное',exact:true}).click();await expect(page.getByRole('heading',{name:'Буррата с томатами',exact:true})).toBeVisible();await page.getByRole('button',{name:'Фото и состав',exact:true}).click();await expect(page.getByRole('dialog').getByText('Состав блюда',{exact:true})).toBeVisible();await expect(page.getByRole('button',{name:'В корзину',exact:true})).toBeDisabled();await page.keyboard.press('Escape');await page.getByRole('button',{name:'Убрать блюдо из избранного',exact:true}).click();await expect(page.getByText('Здесь появятся любимые блюда. Сохраните понравившееся на главной.',{exact:true})).toBeVisible();
  19 | });
  20 | 
```