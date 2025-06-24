import { expect, Locator, Page } from '@playwright/test';

export class LoginPage {

    readonly page:Page
    readonly inputLoginField: Locator
    readonly inputPasswordField: Locator
    readonly signUpButton: Locator

    constructor(page: Page){
        this.page = page
        this.inputLoginField = page.locator('#sdo-login[type="text"]')
        this.inputPasswordField = page.locator('#sdo-password[type="password"]')
        this.signUpButton = page.getByRole('button', {name: "Login"})
    }
    
    // Функция ввода логина и пароля
    async enterLoginAndPassword (login: string, password: string){
        await expect(this.inputLoginField).toBeVisible()
        await this.inputLoginField.fill(login)
        const inputLoginFieldValue = await this.inputLoginField.inputValue()
        expect(inputLoginFieldValue).toEqual(login)

        await expect(this.inputPasswordField).toBeVisible()
        await this.inputPasswordField.fill(password)
        const inputPasswordFieldValue = await this.inputPasswordField.inputValue()
        expect(inputPasswordFieldValue).toEqual(password)
    }


}