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
    productPriceLocator : Locator;
    productTotalLocator : Locator;
    productQuantityLocator : Locator
    thanksHeading : Locator;
    thanksMessage : Locator;
    CompleteHeading : Locator;

    constructor(page){
        this.page = page
        this.emailField = this.page.getByRole("textbox").first();
        this.firstNameField = this.page.getByPlaceholder("Ex. John");
        this.lastNameField = this.page.getByPlaceholder("Ex. Doe");
        this.zipCodeField = this.page.getByRole("textbox").nth(3);
        this.continueButton = this.page.getByRole("button", {name : "Continue"});
        this.checkoutYourInformationTitle = this.page.getByRole("heading" , {name : "Checkout: Your Information"});
        this.cancelButton = this.page.getByRole("button", {name : "Cancel"});
        this.finishButton = this.page.getByRole("button", {name : "Finish"});
        this.thanksHeading = this.page.getByRole("heading", {name : "Thank you for your order!"});
        this.thanksMessage = this.page.getByRole("paragraph").filter({hasText : "Your order has been dispatched, and will arrive just as fast as the pony can get there!"});
        this.CompleteHeading = this.page.getByRole("heading", {name : "Checkout: Complete!"});
    };

    setProductName(productName : string){
        this.checkoutProductLine = this.page.locator(".cart-list").locator(".flex").filter({hasText:`${productName}`}).first();
        this.productPriceLocator = this.checkoutProductLine.locator(".text-xs").filter({hasText : "Price"})
        .locator("..").locator(".font-bold");
        this.productTotalLocator = this.checkoutProductLine.locator(".text-xs").filter({hasText : "Total"})
        .locator("..").locator(".font-bold");
        this.productQuantityLocator = this.checkoutProductLine.locator(".text-xs").filter({hasText : "Quantity"})
        .locator("..").locator(".border");
    };

    async validateInformations(){
        await this.firstNameField.fill("Marco");
        await this.lastNameField.fill("Polo");
        await this.zipCodeField.fill("123456");
        await this.continueButton.click();
    };
    async completeCheckout(){
        await this.finishButton.click();
    };

    async validatePriceOneProduct(productName){
        this.setProductName(productName)
        let QuantityProductString = await this.productQuantityLocator.textContent();
        const dollarPricePerProduct = (await this.productPriceLocator.textContent()).replace("$", "").trim();
        let dollarTotalOneProduct = (await this.productTotalLocator.textContent()).replace('$', "").trim();
        let QuantityProductNumber = Number(QuantityProductString);
        const PricePerProduct = Number(dollarPricePerProduct);
        let totalPerProduct = Number(dollarTotalOneProduct)
        return {QuantityProductNumber, PricePerProduct, totalPerProduct}
    };
};