import { Page } from "@playwright/test";
import { loginPage } from "./login.page";
import { basePage } from "./base.page";
import { contactUsPage } from "./contactUs.page";
import { registrationPage } from "./registration.page";
import { cartPage } from "./cart.page";
import { productsPage } from "./products.page";
import { productPage } from "./product.page";
import { mainPage } from "./main.page";
import { checkoutPage } from "./checkout.page";

export class POManager{

    page: Page;
    loginPage : loginPage;
    basePage : basePage;
    contactUsPage : contactUsPage;
    registrationPage : registrationPage;
    cartPage : cartPage;
    productsPage : productsPage;
    productPage : productPage;
    mainPage : mainPage;
    checkoutPage : checkoutPage;

    constructor(page : Page){
        this.page = page;
        this.loginPage = new loginPage(this.page);
        this.basePage = new basePage(this.page);
        this.contactUsPage = new contactUsPage(this.page);
        this.registrationPage = new registrationPage(this.page);
        this.cartPage = new cartPage(this.page);
        this.productsPage = new productsPage(this.page);
        this.productPage = new productPage(this.page);
        this.mainPage = new mainPage(this.page);
        this.checkoutPage = new checkoutPage(this.page);
    };

    getLoginPage(){
        return this.loginPage;
    };

    getBasePage(){
        return this.basePage;
    };

    getContactUsPage(){
        return this.contactUsPage;
    };

    getRegistrationPage(){
        return this.registrationPage;
    };

    getCartPage(){
        return this.cartPage;
    };
    
    getProductsPage(){
        return this.productsPage;
    };

    getProductPage(){
        return this.productPage;
    };

    getMainPage(){
        return this.mainPage;
    };

    getCheckoutPage(){
        return this.checkoutPage;
    }
};