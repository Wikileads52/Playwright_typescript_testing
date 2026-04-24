import { Page, Locator } from "@playwright/test";

export class productCards{

    page : Page;
    productCardsLocator : Locator;
    productCardsViewProduct : Locator;
    productCardsAddToCartButton : Locator;
    productCardsNameProduct : Locator;
    productCardsPriceProduct : Locator;
    productCardsImage : Locator;


    constructor(page: Page)
    {
        this.page = page;
        this.productCardsLocator = this.page.locator(".col-sm-4 .product-image-wrapper");
    };

    async setProductCard( cardNumber : number )
    {
        this.productCardsViewProduct = this.page.getByRole("link", {name : " View Product"}).nth(cardNumber - 1);
        this.productCardsAddToCartButton = this.productCardsLocator.nth(cardNumber - 1).getByText("Add to cart").first();
        this.productCardsNameProduct = this.productCardsLocator.nth(cardNumber - 1).getByRole("paragraph").nth(1);
        this.productCardsPriceProduct = this.productCardsLocator.nth(cardNumber - 1).getByRole("heading").nth(1);
        this.productCardsImage = this.productCardsLocator.nth(cardNumber - 1).getByRole("img");
    };


};