import { Page, Locator, expect,  } from "@playwright/test";

export class shopPage{

    page : Page;
    productCard: Locator;
    productImageLink : Locator;
    productDescriptionLink : Locator;
    productAddButton : Locator;
    toastStatus : Locator;
    cartButton : Locator;
    cartButtonNumber : Locator;
    searchComboBox : Locator;
    productFavoriteButton : Locator;
    profileButton : Locator;
    cartProductName : Locator;

    constructor (page: Page, productName: string){
        this.page = page;
        this.productCard = this.page.getByText(`${productName}`)
        .locator("xpath=ancestor::div[contains(@class,'relative group')]");
        this.productImageLink = this.productCard.getByRole("link").first();
        this.productDescriptionLink = this.productCard.getByRole("link").nth(1);
        this.productFavoriteButton = this.productCard.getByRole("button").first();
        this.productAddButton = this.productCard.getByRole("button").last();
        this.toastStatus = this.page.locator("[data-title]");
        this.cartButton = this.page.locator('#ecommerce-header').getByRole('button')
        .first();
        this.cartButtonNumber = this.page.locator('#ecommerce-header')
        .locator(".bg-qa-clr");
        this.searchComboBox = this.page.getByRole("combobox");
        this.profileButton = this.page.getByRole('button', { name: 'test@qabrains.com' });
        this.cartProductName = this.page.getByRole("heading", {name: `${productName}`});
    };
    async getProductInCart(){
        await this.productAddButton.click();
        await expect(this.cartButtonNumber).toHaveText('1');
        await expect(this.page.locator("[data-title]")).toContainText("Added to cart");
    };
    async goToCart(){
        await this.cartButton.click();
        await expect(this.cartProductName).toBeVisible();
    };
};