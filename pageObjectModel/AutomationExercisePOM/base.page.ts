import { Locator, Page, expect } from "@playwright/test";


export class basePage{

    page : Page;
    homeButton : Locator;
    productsButton : Locator;
    cartButton : Locator;
    signupLoginButton : Locator;
    logoutButton : Locator;
    deleteUserButton : Locator;
    testCases : Locator;
    APITesting : Locator;
    contactUsButton : Locator;
    subscriptionFooterTitle : Locator;
    subscriptionFooterInput : Locator;
    subscriptionValidationButton : Locator;
    subscriptionMessage : Locator;
    loggedAsLocator : Locator;

    constructor(page: Page){
        this.page = page;
        this.homeButton = this.page.getByRole("link", {name : "Home"}).nth(1);
        this.productsButton = this.page.getByRole("link", {name : " Products"});
        this.cartButton = this.page.getByRole("link", {name : "Cart"}).first();
        this.signupLoginButton = this.page.getByRole("link", {name : " Signup / Login"});
        this.logoutButton = this.page.getByRole("link", {name : "Logout"});
        this.deleteUserButton = this.page.getByRole("link", {name : " Delete Account"});
        this.testCases = this.page.getByRole("link", {name : "Test Cases"}).first();
        this.APITesting = this.page.getByRole("link", {name : "API Testing"}).first();
        this.contactUsButton = this.page.getByRole("link", {name : " Contact us"});
        this.loggedAsLocator = this.page.getByText("Logged in as");
        this.subscriptionFooterTitle = this.page.locator("#footer").getByRole("heading", {name : "Subscription"});
        this.subscriptionFooterInput = this.page.getByRole("textbox", {name : "Your email address"});
        this.subscriptionValidationButton = this.page.locator('#subscribe');
        this.subscriptionMessage = this.page.locator("#footer").getByText("You have been successfully subscribed!");
    };

    async goToHome()
    {
        await this.homeButton.click();
    };

    async goToProductsPage()
    {
        await this.productsButton.click();
    };

    async goToCart()
    {
        await this.cartButton.click();
    };

    async goToSignUpPage()
    {
        await this.signupLoginButton.click();
    };

    async logoutUser()
    {
        await this.logoutButton.click();
    };

    async deleteUser()
    {
        await this.deleteUserButton.click();
        await expect(this.page.getByText("Account Deleted!")).toBeVisible()
        await this.page.getByRole("link", {name : "Continue"}).click()
    };

    async goToTestCasesPage()
    {
        await this.testCases.click();
    };

    async goToAPItesting()
    {
        await this.APITesting.click();
    };

    async goToContactUsPage()
    {
        await this.contactUsButton.click();
    };

    async userSubscription()
    {
        await this.subscriptionFooterInput.fill(process.env.AUTOMATIONEXERCISE_email);
        await this.subscriptionValidationButton.click();
    };
};