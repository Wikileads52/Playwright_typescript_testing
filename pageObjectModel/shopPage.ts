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
    orderByAToZ : Locator;
    orderByZToA : Locator;
    orderByLowToHigh : Locator;
    orderByHighToLow : Locator;
    productFavoriteButton : Locator;
    profileButton : Locator;
    cartProductName : Locator;
    favoritesPageAccess : Locator;
    logoutMenuItem : Locator;
    noFavoritesMessage : Locator;
    favoritesTitlePage : Locator;
    continueShoppingLink : Locator;

    constructor (page: Page){
        this.page = page;
        this.toastStatus = this.page.locator("[data-title]");
        this.cartButton = this.page.locator('#ecommerce-header').getByRole('button')
        .first();
        this.cartButtonNumber = this.page.locator('#ecommerce-header')
        .locator(".bg-qa-clr");
        this.searchComboBox = this.page.getByRole("combobox");
        this.orderByAToZ = this.page.getByRole("option", {name : "A to Z (Ascending)"});
        this.orderByZToA = this.page.getByRole("option", {name : "Z to A (Descending)"});
        this.orderByLowToHigh = this.page.getByRole("option", {name : "Low to High (Price)"});
        this.orderByHighToLow = this.page.getByRole("option", {name : "High to Low (Price)"});
        this.profileButton = this.page.getByRole('button', { name: 'test@qabrains.com' });
        this.favoritesPageAccess = this.page.getByRole("menuitem", {name : "Favorites"});
        this.logoutMenuItem = this.page.getByRole("menuitem", {name : "Log out"});
        this.noFavoritesMessage = this.page.getByText("You have no favorite products");
        this.favoritesTitlePage = this.page.getByRole("heading", {name : "Favorites"});
        this.continueShoppingLink = this.page.getByRole("link", {name: "Continue Shopping"});
    };
    
    setProductName(productName : string){
        this.productCard = this.page.getByText(`${productName}`)
        .locator("xpath=ancestor::div[contains(@class,'relative group')]");
        this.productImageLink = this.productCard.getByRole("link").first();
        this.productDescriptionLink = this.productCard.getByRole("link").nth(1);
        this.productFavoriteButton = this.productCard.getByRole("button").first();
        this.productAddButton = this.productCard.getByRole("button").last();
        this.cartProductName = this.page.getByRole("heading", {name: `${productName}`});
    };

    async goToCart(){
        await this.cartButton.click();
        await expect(this.cartProductName).toBeVisible();
    };

    async setProductAsFavorites(productName){
        this.setProductName(productName);
        await this.productFavoriteButton.click();
    };

    async removeFromFavorites(productName){
        this.setProductName(productName);
        await this.productFavoriteButton.click();
    };

    async disconnectUser(){
        const dialog = this.page.getByRole("dialog");
        await this.profileButton.click();
        await expect(this.logoutMenuItem).toBeVisible();
        await this.logoutMenuItem.click();
        await expect(dialog.getByRole("heading")).toHaveText("Are you sure you want to log out?");
        await expect(dialog.getByRole("paragraph")).toHaveText("You're about to log out. Continue?");
        await dialog.getByRole("button", {name : "Logout"}).click();
        await expect(this.page).toHaveURL("https://practice.qabrains.com/ecommerce/login");
    };

    async goToFavoritesPage(){
        await this.profileButton.click();
        await expect(this.favoritesPageAccess).toBeVisible();
        await this.favoritesPageAccess.click();
        await  expect (this.favoritesTitlePage).toBeVisible();
    };

    async getProductInCart(productName){
        this.setProductName(productName);
        await this.productAddButton.click();
        await expect.soft(this.toastStatus.first()).toContainText("Added to cart")
    };

    async setOrderLowToHigh(){
        await this.searchComboBox.click();
        await this.orderByLowToHigh.click();
    };
    
    async setOrderHighToLow(){
        await this.searchComboBox.click();
        await this.orderByHighToLow.click();
    };


};