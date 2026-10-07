import {test,expect} from '@playwright/test';

test.beforeEach(async({page})=>{
 await page.addInitScript(()=>{localStorage.clear();sessionStorage.clear()});
 await page.setViewportSize({width:390,height:844});
 await page.goto('/demo/guest/promotions');
});

test('Guest Promotions presents commercial offers and hands off to the canonical Menu without a table session',async({page})=>{
 await expect(page.getByRole('heading',{name:'Акции',exact:true})).toBeVisible();
 await expect(page.getByText('Специальные предложения')).toBeVisible();
 await expect(page.getByText('Вечер в MIRA',{exact:true})).toHaveCount(0);
 await expect(page.getByText('Сезонное предложение сентября',{exact:true})).toHaveCount(0);
 await expect(page.getByText(/Получайте 5% всегда/)).toHaveCount(0);
 await expect(page.getByRole('navigation',{name:'Категории акций'}).getByRole('button')).toHaveCount(4);
 await expect(page.getByRole('navigation',{name:'Основная навигация гостя'})).toBeVisible();
 await expect(page.getByRole('button',{name:'Открыть акцию: Обед в MIRA'})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBe(0);

 await page.getByRole('button',{name:'Скидки',exact:true}).click();
 await expect(page.getByRole('button',{name:'Открыть акцию: −20% на десерты по будням'})).toBeVisible();
 await expect(page.getByText('Обед в MIRA',{exact:true})).toHaveCount(0);
 await page.getByRole('button',{name:'Комбо',exact:true}).click();
 await page.getByRole('button',{name:'Открыть акцию: Обед в MIRA'}).click();
 await expect(page.getByRole('heading',{name:'Обед в MIRA',exact:true})).toBeVisible();
 await expect(page.getByText('Условия',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Посмотреть подходящие блюда',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Меню',exact:true})).toBeVisible();
 await expect(page.getByRole('button',{name:'Открыть: Тыквенный крем-суп',exact:true})).toBeVisible();
 await expect(page.getByText('Начните цифровое посещение')).toHaveCount(0);
});

test('Gift filter opens full conditions for an anonymous Guest',async({page})=>{
 await page.getByRole('button',{name:'Подарки',exact:true}).click();
 await page.getByRole('button',{name:'Открыть акцию: Десерт в подарок'}).click();
 await expect(page.getByRole('heading',{name:'Десерт в подарок',exact:true})).toBeVisible();
 await expect(page.getByText('Минимальная сумма заказа — 2 000 ₽.')).toBeVisible();
 await expect(page.getByText('Один подарок на один заказ.')).toBeVisible();
});
