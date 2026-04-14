import { Page } from "@playwright/test"
import { loginPage } from "./loginPage";
import { shopPage } from "./shopPage";
import { cartPage } from "./cartPage";
import { checkoutPage } from "./checkoutPage"

export class POManager{
    page : Page;
    LoginPage : loginPage;
    ShopPage : shopPage;
    CartPage : cartPage;
    CheckoutPage : checkoutPage;

    constructor(page : Page){
        this.page = page;
        this.LoginPage = new loginPage(this.page);
        this.ShopPage = new shopPage(this.page);
        this.CartPage = new cartPage(this.page);
        this.CheckoutPage = new checkoutPage(this.page);
    }
    getLoginPage(){
        return this.LoginPage;
    };
    getShopPage(){
        return this.ShopPage;
    };
    getCartPage(){
        return this.CartPage;
    };
    getCheckoutPage(){
        return this.CheckoutPage;
    };
};