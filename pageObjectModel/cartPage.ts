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


    constructor(page: Page, productName : string){
        this.page = page
        this.cartProductName = this.page.getByRole("heading", {name: `${productName}`});
        this.cartProductLine = this.page.locator(".cart-list").locator(".flex").filter({hasText:`${productName}`}).first()
        this.removeButton = this.cartProductLine.getByRole("button", {name: "Remove"});
        this.yourCartIsEmptyMessage = this.page.getByText("Your cart is empty.");
        //this.removeButton = this.cartProductName.locator("..").getByRole("button", {name: "Remove"});
        this.continueShoppingButton = this.page.getByRole("button", {name: "Continue Shopping"});
        this.checkoutButton = this.page.getByRole("button", {name: "Checkout"});
        this.checkoutInformationBoard = this.page.locator("#checkout-info");
    };

    async goToCheckout(){
        await this.checkoutButton.click();
        await expect(this.checkoutInformationBoard).toBeVisible()
    };


    async removebutton(){
        const dialog = this.page.getByRole("dialog");
        await this.removeButton.click();
        await expect (dialog.getByRole("heading")).toHaveText("Are you absolutely sure?");
        await expect (dialog.getByRole("paragraph"))
        .toHaveText("This action cannot be undone. This will permanently delete your item from your cart.");
        await dialog.getByRole("button", {name:"Remove"}).click();  
        await expect(this.yourCartIsEmptyMessage).toBeVisible();
    };





};