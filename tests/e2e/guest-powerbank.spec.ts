import {mkdirSync} from 'node:fs';
import {test,expect,type Page} from '@playwright/test';
import {getGuestThemePreset} from '../../lib/guest-theme';

const output='docs/QA/guest-powerbank-2-1';
mkdirSync(output,{recursive:true});

async function setScenario(page:Page,value:'one'|'none'|'active'|'return'|'error'){
 const details=page.locator('details').filter({hasText:'Состояния пауэрбанка · демо'});
 if(!(await details.getAttribute('open')))await details.locator('summary').click();
 await page.getByLabel('Сценарий пауэрбанка',{exact:true}).selectOption(value);
 await expect(page.locator('[data-powerbank-scenario]')).toHaveAttribute('data-powerbank-scenario',value);
 await details.locator('summary').click();
 await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
}

async function setTheme(page:Page,preset:'classic'|'dark'|'light'){
 await page.evaluate(({preset,palette})=>localStorage.setItem('mira-demo-guest-theme',JSON.stringify({preset,palette})),{preset,palette:getGuestThemePreset(preset)});
 await page.goto('/demo/guest/powerbank');
 await expect(page.locator('.guest-theme')).toHaveAttribute('data-theme',preset);
 await expect(page.getByRole('heading',{name:'Пауэрбанк',exact:true}).first()).toBeVisible();
}

test('Powerbank 2.1 EnerGO-only launch states and rental flow',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/demo/guest/home');
 await page.getByRole('button',{name:'Сканировать QR стола №12',exact:true}).click();
 await page.getByRole('button',{name:'Пауэрбанк',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Пауэрбанк',exact:true})).toBeVisible();
 await expect(page.getByText('Заряд всегда рядом',{exact:true})).toHaveCount(0);
 await expect(page.getByText('СЕРВИС MIRA LINK',{exact:true})).toHaveCount(0);
 await expect(page.getByText('MIRA Restaurant',{exact:true}).last()).toBeVisible();
 await expect(page.getByRole('region',{name:'Текущее заведение'}).getByText('Стол 12',{exact:true})).toHaveCount(0);
 await expect(page.getByLabel('Предложение EnerGO')).toContainText('6 доступно');
 await expect(page.getByLabel('Предложение EnerGO')).toContainText('99 ₽');
 await expect(page.getByText('Provider B',{exact:true})).toHaveCount(0);
 await expect(page.getByText('PowerGo',{exact:true})).toHaveCount(0);
 await expect(page.getByText('Рекомендуем',{exact:true})).toHaveCount(0);
 await expect(page.getByText('6 доступно',{exact:true})).toHaveCount(1);
 await expect(page.getByText('Предоставляет EnerGO',{exact:true})).toHaveCount(0);
 await expect(page.getByText('Оператор аренды',{exact:true})).toBeVisible();
 await expect(page.getByLabel('Предложение EnerGO').locator('img')).toHaveJSProperty('complete',true);
 expect(await page.getByLabel('Предложение EnerGO').locator('img').evaluate((image:HTMLImageElement)=>image.naturalWidth)).toBeGreaterThan(0);
 await expect(page.locator('.guest-shortcuts')).not.toContainText('Пауэрбанк');
 await expect(page.getByRole('navigation',{name:'Основная навигация гостя'})).toBeVisible();
 await expect(page.getByText('Готово',{exact:true})).toBeHidden({timeout:4000});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBe(0);
 await page.screenshot({path:`${output}/01-energo-only-normal-390.png`});

 await page.getByRole('button',{name:'Другие станции рядом',exact:false}).click();
 const nearby=page.getByRole('dialog');
 await expect(nearby.getByText('Garden Cafe',{exact:true})).toBeVisible();
 await expect(nearby).toContainText('EnerGO');
 await expect(nearby.getByText('Provider B',{exact:true})).toHaveCount(0);
 await page.keyboard.press('Escape');
 await expect(nearby).toBeHidden();

 const scanTerminal=page.getByLabel('Предложение EnerGO').getByRole('button',{name:'Сканировать QR терминала',exact:true});
 await expect(scanTerminal).toBeVisible();
 await scanTerminal.click();
 const scanner=page.getByRole('dialog').filter({has:page.getByRole('heading',{name:'Сканировать QR',exact:true})});
 await expect(scanner).toBeVisible();
 await page.keyboard.press('Escape');
 await expect(scanner).toBeHidden();
 await page.goto('/demo/guest/qr');
 await page.getByRole('button',{name:'Демо: QR терминала',exact:true}).click();
 const confirmation=page.getByRole('dialog');
 await expect(confirmation.getByText('99 ₽ / первый час',{exact:true})).toBeVisible();
 await expect(confirmation.getByText('Далее 50 ₽ / час',{exact:true})).toBeVisible();
 await page.screenshot({path:`${output}/02-rental-confirmation-390.png`});
 await confirmation.getByRole('button',{name:'Начать аренду',exact:true}).click();
 await expect(page.getByText('АКТИВНАЯ АРЕНДА',{exact:true})).toBeVisible();
 await expect(page.getByText('Пауэрбанк №1248',{exact:true})).toBeVisible();
 await expect(page.getByText('Готово',{exact:true})).toBeHidden({timeout:4000});
 await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
 await page.screenshot({path:`${output}/03-active-energo-rental-390.png`});

 await setScenario(page,'active');
 await page.getByRole('button',{name:'Где вернуть',exact:true}).click();
 await expect(page.getByText('СОВМЕСТИМЫЕ СТАНЦИИ',{exact:true})).toBeVisible();
 await expect(page.getByText('Garden Cafe',{exact:true})).toBeVisible();
 await expect(page.getByText('Provider B',{exact:true})).toHaveCount(0);
 await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
 await page.screenshot({path:`${output}/04-return-stations-390.png`});

 await setScenario(page,'none');
 await expect(page.getByText('Нет свободных пауэрбанков',{exact:true})).toBeVisible();
 await expect(page.getByRole('button',{name:'Найти ближайшую станцию',exact:true})).toBeVisible();
 await page.screenshot({path:`${output}/05-no-availability-390.png`});

 await setScenario(page,'error');
 await expect(page.getByText('Не удалось проверить доступность',{exact:true})).toBeVisible();
 await expect(page.getByText('6 доступно',{exact:true})).toHaveCount(0);

 await setTheme(page,'light');
 await setScenario(page,'one');
 await expect(page.getByText('Provider B',{exact:true})).toHaveCount(0);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBe(0);
 await setTheme(page,'classic');
 await setScenario(page,'one');
 await expect(page.getByText('Provider B',{exact:true})).toHaveCount(0);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBe(0);
 await setTheme(page,'dark');
 await setScenario(page,'one');
 await expect(page.getByText('Provider B',{exact:true})).toHaveCount(0);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBe(0);
 await page.screenshot({path:`${output}/06-mira-dark-390.png`});
});

test('Powerbank QR uses the canonical Guest service route',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/demo/guest/qr');
 await page.getByRole('button',{name:'Демо: QR терминала',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Пауэрбанк',exact:true}).first()).toBeVisible();
 await expect(page.getByRole('dialog').getByRole('button',{name:'Начать аренду',exact:true})).toBeVisible();
 await expect(page.getByText('Provider B',{exact:true})).toHaveCount(0);
 await page.keyboard.press('Escape');
 await expect(page.getByRole('navigation',{name:'Основная навигация гостя'})).toBeVisible();
});
