import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';

test.beforeEach(async ({page}) =>{
    await page.goto('https://dev2.getinfo.radugi.net')
})

test.describe('Тестовое задание на вакансию тестировщика (QA)', ()=>{

    test('Проверяем что главная страница имеет верный url', async ({page})=>{
        await expect(page).toHaveURL('https://dev2.getinfo.radugi.net/login?redirect=/')
    })

    test('Форма регистрации. Ошибка ввода неверного логина или пароля', async ({page})=>{
        
         const login = new LoginPage(page)
        
         // Ввод и проверка неверного логина и пароля
         await login.enterLoginAndPassword('error_dumbledore@sct.team', '12345678qQ1')

         // Нажатие на кнопку "Войти"
         await page.getByRole('button', {name: "Login"}).click()

         // Проверяем сообщение об ошибке в модальном окне
         const notification = page.locator('.el-notification.custom-error-notification.right')
         await expect(notification).toBeVisible()

         const notificationTitle = page.locator('.el-notification__content p')
         await expect(notificationTitle).toHaveText('Bad credentials.') 
    })

    test('Форма регистрации. Успешный вход', async ({page})=>{
        const login = new LoginPage(page)
        
         // Ввод и проверка верного логина и пароля
         await login.enterLoginAndPassword('dumbledore@sct.team', '12345678qQ1')

         // Нажатие на кнопку "Войти"
         await page.getByRole('button', {name: "Login"}).click()

         
         // Нажимаем на иконку пользователя в правом верхнем углу
         await page.locator("span.el-avatar.el-avatar--circle").first().click()

         const modal = page.locator('[aria-hidden="false"][data-popper-placement="bottom-end"]')

         // Проверяем что модальное окно пользователя отображается
         await modal.isVisible()

        // Проверяем в модальном окне значение имени пользователя
         await expect(modal).toContainText('dumbledore@sct.team')


    })

    test('Форма восстановления пароля (наличие ссылки)', async ({page})=>{
        // Проверяем наличие ссылки с указанным значением
        await expect(page.getByRole('button', {name:'Forgot password?'})).toContainText('Forgot password?')
    })

    test('Доступность страницы Компания после авторизации', async ({page})=>{
        const login = new LoginPage(page)
        
         // Ввод и проверка верного логина и пароля
         await login.enterLoginAndPassword('dumbledore@sct.team', '12345678qQ1')

         // Нажатие на кнопку "Войти"
         await page.getByRole('button', {name: "Login"}).click()

        // Переходим на страницу "Компания"
         await page.getByText('The educational center').click()
         await page.getByText('Company').first().click()

        // Проверяем на странице "Компания" наличие заголовка 
         const companyPage = page.locator('.el-main h1').getByText(' Company Учебный центр Хогвардса')
         await expect(companyPage).toContainText(' Company Учебный центр Хогвардса')

    })

    test('Совпадает ли текущий авторизованный пользователь с пользователем, который указан Руководителем в компании', async ({page})=>{
        const login = new LoginPage(page)
        
         // Ввод и проверка верного логина и пароля
         await login.enterLoginAndPassword('dumbledore@sct.team', '12345678qQ1')

         // Нажатие на кнопку "Войти"
         await page.getByRole('button', {name: "Login"}).click()

         // Переходим на страницу "Компания"
         await page.getByText('The educational center').click()
         await page.getByText('Company').first().click()

         // Нажимаем на иконку пользователя в правом верхнем углу
         await page.locator("span.el-avatar.el-avatar--circle").first().click()

         const modal = page.locator('[aria-hidden="false"][data-popper-placement="bottom-end"]')

         // Проверяем что модальное окно пользователя отображается
         await modal.isVisible()

         // Проверяем в модальном окне значение имени пользователя
         await expect(modal).toContainText('dumbledore@sct.team')

         // Сохраняем значение имени пользователя из модального окна
         const modalUserName = await modal.locator('.font-bold.text-center').first().textContent()
         
         // Сохраняем значение имени пользователя из страницы "Компания"
         const companyPageUserName = await page.locator('#pane-primary a').textContent()

         // Проверяем совпадение имен
         expect(modalUserName).toEqual(companyPageUserName)

    })

})
