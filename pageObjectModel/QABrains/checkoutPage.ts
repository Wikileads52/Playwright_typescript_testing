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
    completeHeading : Locator;
    priceSection : Locator;
    itemTotalLocator : Locator;
    taxLocator : Locator;
    priceTotalLocator : Locator;

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
        this.completeHeading = this.page.getByRole("heading", {name : "Checkout: Complete!"});
        this.priceSection = this.page.getByRole("heading", {name : "Price Total:"}).locator("..");
        this.itemTotalLocator = this.priceSection.getByText("Item Total : $");
        this.taxLocator = this.priceSection.getByText("Tax : $");
        this.priceTotalLocator = this.priceSection.getByRole("paragraph").filter({hasText: /^Total : \$/});

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
        let QuantityProductNumber : number = Number (await this.productQuantityLocator.textContent()!);
        const PricePerProduct : number = Number((await this.productPriceLocator.textContent()!).replace("$", "").trim());
        let totalPerProduct : number = Number ((await this.productTotalLocator.textContent()!).replace('$', "").trim());
        return {QuantityProductNumber, PricePerProduct, totalPerProduct};
    };

    async validateTaxTotal(){
        let  itemTotal : number = Number((await this.itemTotalLocator.textContent()!).replace("Item Total : $", "").trim());
        let taxTotal : number = Number((await this.taxLocator.textContent()!).replace("Tax : $", "").trim());
        let priceTotal : number = Number ((await this.priceTotalLocator.textContent()!).replace("Total : $", "").trim());
        return {itemTotal, taxTotal, priceTotal};
    };


};