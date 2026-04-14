import { Locator, Page, expect } from "@playwright/test";

export class cartPage{
    page : Page
    cartProductName : Locator;
    cartProductLine : Locator;
    removeButton : Locator;
    yourCartIsEmptyMessage : Locator
    continueShoppingButton : Locator;
    checkoutButton : Locator;
    checkoutInformationBoard : Locator;
    quantityProductLocator : Locator
    plusOneButton : Locator;
    minusOneButton : Locator;

    constructor(page: Page){
        this.page = page;
        this.yourCartIsEmptyMessage = this.page.getByText("Your cart is empty.");
        this.continueShoppingButton = this.page.getByRole("button", {name: "Continue Shopping"});
        this.checkoutButton = this.page.getByRole("button", {name: "Checkout"});
        this.checkoutInformationBoard = this.page.locator("#checkout-info");
    };

    setProductName(productName : string){
        this.cartProductName = this.page.getByRole("heading", {name: `${productName}`});
        this.cartProductLine = this.page.locator(".cart-list").locator(".flex").filter({hasText:`${productName}`}).first()
        this.removeButton = this.cartProductLine.getByRole("button", {name: "Remove"});
        this.quantityProductLocator = this.cartProductLine.getByText(/^\d+$/);
        this.plusOneButton = this.cartProductLine.getByRole("button", {name : "+", exact : true});
        this.minusOneButton = this.cartProductLine.getByRole("button", {name : "-", exact: true});
    }

    async goToCheckout(){
        await this.checkoutButton.click();
        await expect(this.checkoutInformationBoard).toBeVisible()
    };

    async removeProduct(productName){
        this.setProductName(productName)
        const dialog = this.page.getByRole("dialog");
        await this.removeButton.click();
        await expect (dialog.getByRole("heading")).toHaveText("Are you absolutely sure?");
        await expect (dialog.getByRole("paragraph"))
        .toHaveText("This action cannot be undone. This will permanently delete your item from your cart.");
        await dialog.getByRole("button", {name:"Remove"}).click();
    };

    async addProductMultiple(productName, numberOfProdcucts){
        this.setProductName(productName);
        const numberOfProdcuct = numberOfProdcucts - 1;
        for(let i = 0 ; i< numberOfProdcuct; i++){
            await this.plusOneButton.click();
        };
    };

    async deleteProductMultipleUntillOne(productName, numberOfProdcucts){
        this.setProductName(productName);
        const numberOfProdcuct = numberOfProdcucts - 1;
        for(let i = 0 ; i< numberOfProdcuct ; i++){
            await this.minusOneButton.click();
        }
    }
};