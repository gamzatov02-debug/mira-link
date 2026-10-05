import {expect,type Page} from '@playwright/test';

export async function openWaiterWorkspace(page:Page){
 await page.goto('/demo/waiter');
 const navigation=page.getByRole('navigation',{name:'Основная навигация официанта'});
 const login=page.getByRole('button',{name:'Войти как Александр',exact:true});
 await expect(login.or(navigation)).toBeVisible();
 if(await login.isVisible())await login.click();
 const start=page.getByRole('button',{name:'Начать смену',exact:true});
 await expect(start.or(navigation)).toBeVisible();
 if(await start.isVisible())await start.click();
 await expect(navigation).toBeVisible();
 await navigation.getByRole('button',{name:'Ещё',exact:true}).click();
 const compatibility=page.getByText('Дополнительные операции демо',{exact:true});
 await expect(compatibility).toBeVisible();
 await compatibility.click();
 await expect(page.getByRole('button',{name:'Оформить заказ за гостя',exact:true})).toBeVisible();
}
