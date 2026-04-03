import { Locator, Page, expect } from "@playwright/test";

export class checkoutPage{

    page : Page;
    emailField : Locator;
    firstNameField : Locator;
    lastNameField : Locator;
    zipCodeField : Locator;
    continueButton : Locator;
    checkoutYourInformationTitle : Locator;
    cancelButton : Locator;
    finishButton : Locator;
    checkoutProductLine : Locator;
    thanksHeading : Locator;
    thanksMessage : Locator;
    CompleteHeading : Locator;

    constructor(page, productName: string){
        this.page = page
        this.emailField = this.page.getByRole("textbox").first();
        this.firstNameField = this.page.getByPlaceholder("Ex. John");
        this.lastNameField = this.page.getByPlaceholder("Ex. Doe");
        this.zipCodeField = this.page.getByRole("textbox").nth(3);
        this.continueButton = this.page.getByRole("button", {name : "Continue"});
        this.checkoutYourInformationTitle = this.page.getByRole("heading" , {name : "Checkout: Your Information"});
        this.cancelButton = this.page.getByRole("button", {name : "Cancel"});
        this.checkoutProductLine = this.page.locator(".cart-list").locator(".flex").filter({hasText:`${productName}`}).first();
        this.finishButton = this.page.getByRole("button", {name : "Finish"});
        this.thanksHeading = this.page.getByRole("heading", {name : "Thank you for your order!"})
        this.thanksMessage = this.page.getByRole("paragraph").filter({hasText : "Your order has been dispatched, and will arrive just as fast as the pony can get there!"});
        this.CompleteHeading = this.page.getByRole("heading", {name : "Checkout: Complete!"});
    };

    async validateInformations(){
        await this.firstNameField.fill("Marco");
        await this.lastNameField.fill("Polo");
        await this.zipCodeField.fill("123456");
        await this.continueButton.click();
    };
    async completeCheckout(){
        await this.finishButton.click();
    }


};