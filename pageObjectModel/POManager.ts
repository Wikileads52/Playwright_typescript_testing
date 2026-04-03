import { Page } from "@playwright/test"
import { loginPage } from "../pageObjectModel/loginPage";
import { shopPage } from "../pageObjectModel/shopPage";
import { cartPage } from "../pageObjectModel/cartPage";
import { checkoutPage } from "../pageObjectModel/checkoutPage"

export class POManager{
    page : Page;
    LoginPage : loginPage;
    ShopPage : shopPage;
    CartPage : cartPage;
    CheckoutPage : checkoutPage;

    constructor(page: Page, productName :string){
        this.page = page;
        this.LoginPage = new loginPage(this.page);
        this.ShopPage = new shopPage(this.page, productName);
        this.CartPage = new cartPage(this.page, productName);
        this.CheckoutPage = new checkoutPage(this.page, productName);
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