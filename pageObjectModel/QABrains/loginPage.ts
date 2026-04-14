import { Locator, Page, expect } from "@playwright/test";


export class loginPage{

    readonly page : Page;
    readonly emailField: Locator;
    readonly passwordField: Locator;
    readonly loginButton: Locator;

    constructor(page: Page){
        this.page = page;
        this.emailField = this.page.getByRole("textbox", {name : "email"});
        this.passwordField = this.page.getByRole("textbox", {name : "password"});
        this.loginButton = this.page.getByRole("button", {name: "Login"});
    };

    async goToShop(){
        await this.page.goto(`${process.env.QABRAINS_BASEURL}/login`);
    };

    async userLogin(email, password)
    {
        await this.emailField.fill(email);
        await this.passwordField.fill(password);
        await this.loginButton.click();
        await expect (this.page.getByText('Sample Shirt NameA sample description for the product.$49.99Add to cartSample')).toBeVisible({timeout:15000});
    };
}