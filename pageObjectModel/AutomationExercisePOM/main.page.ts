import { Locator, Page, expect } from "@playwright/test";
import { productsPage } from "./products.page";

export class mainPage extends productsPage{

    page : Page;
    recommendedItemsSection : Locator;
    itemActiveLocator : Locator;
    recommendedItemsHeading : Locator;
    addToCartButton : Locator;
    


    constructor(page : Page){
        super(page);
        this.page = page;
        this.recommendedItemsSection = this.page.locator(".recommended_items");
        this.itemActiveLocator = this.recommendedItemsSection.locator(".carousel-inner .item.active");
        this.recommendedItemsHeading = this.recommendedItemsSection.getByRole("heading", {name : "RECOMMENDED ITEMS"});
        this.addToCartButton = this.itemActiveLocator.getByText("Add to cart")
    };

    async addItemFromCarousel(productNumber : number){
        await this.itemActiveLocator.getByText("Add to cart").nth(productNumber - 1).click();
        await this.dismissModalProductInCart();
    }

};