import { Page, Locator, expect } from "@playwright/test";

export class checkoutPage{

    page: Page;
    yourDeliveryAddressList : Locator;
    yourDeliveryAddressName : Locator;
    yourDeliveryAddressCompany : Locator; 
    yourDeliveryAddress : Locator;
    yourDeliveryAddressLocation : Locator;
    yourDeliveryAddressCountry : Locator;
    yourDeliveryAddressPhone : Locator;
    yourBillingAddressList : Locator;
    yourBillingAddressName : Locator;
    yourBillingAddressCompany : Locator;
    yourBillingAddress : Locator;
    yourBillingAddressLocation : Locator;
    yourBillingAddressCountry : Locator;
    yourBillingAddressPhone : Locator;
    commentBox : Locator;
    placeOrderButton : Locator;
    paymentCardNumber : Locator;
    paymentName : Locator;
    paymentCiv :Locator;
    paymentMM : Locator;
    paymentYY : Locator;
    paymentConfirmButton : Locator;
    orderSuccessHeading : Locator;
    orderSuccessMessage : Locator;

    constructor( page: Page ){
        this.page = page;
        this.yourDeliveryAddressList = this.page.locator(".address.item.box#address_delivery");
        this.yourDeliveryAddressName = this.yourDeliveryAddressList.getByRole("listitem").nth(1);
        this.yourDeliveryAddressCompany = this.yourDeliveryAddressList.getByRole("listitem").nth(2);
        this.yourDeliveryAddress = this.yourDeliveryAddressList.getByRole("listitem").nth(3);
        this.yourDeliveryAddressLocation = this.yourDeliveryAddressList.getByRole("listitem").nth(5);
        this.yourDeliveryAddressCountry = this.yourDeliveryAddressList.getByRole("listitem").nth(6);
        this.yourDeliveryAddressPhone = this.yourDeliveryAddressList.getByRole("listitem").nth(7);
        this.yourBillingAddressList = this.page.locator(".address.alternate_item.box#address_invoice");
        this.yourBillingAddressName = this.yourBillingAddressList.getByRole("listitem").nth(1);
        this.yourBillingAddressCompany = this.yourBillingAddressList.getByRole("listitem").nth(2);
        this.yourBillingAddress = this.yourBillingAddressList.getByRole("listitem").nth(3);
        this.yourBillingAddressLocation = this.yourBillingAddressList.getByRole("listitem").nth(5);
        this.yourBillingAddressCountry = this.yourBillingAddressList.getByRole("listitem").nth(6);
        this.yourBillingAddressPhone = this.yourBillingAddressList.getByRole("listitem").nth(7);
        this.commentBox = this.page.getByRole("textbox").first();
        this.placeOrderButton = this.page.getByRole("link", {name : "Place Order"});
        this.paymentCardNumber = this.page.getByRole("textbox").first();
        this.paymentName = this.page.getByRole("textbox").nth(1);
        this.paymentCiv = this.page.getByRole("textbox", {name : "ex. 311"});
        this.paymentMM = this.page.getByRole("textbox", {name : "MM"});
        this.paymentYY = this.page.getByRole("textbox", {name : "YY"});
        this.paymentConfirmButton = this.page.getByRole("button", {name : "Pay and Confirm Order"});
        this.orderSuccessHeading = this.page.getByRole("heading", {name : "ORDER PLACED!"});
        this.orderSuccessMessage = page.getByRole("paragraph").filter({hasText : "Congratulations! Your order has been confirmed!"});
    }
    
    async orderCheckout(){
        await this.commentBox.fill("testing checkout");
        await this.placeOrderButton.click();
        await expect(this.page).toHaveURL("https://www.automationexercise.com/payment");
    }

    async fillCreditCardInfo(){
        await this.paymentCardNumber.fill("1234567897654");
        await this.paymentName.fill("John Doe");
        await this.paymentCiv.fill("321");
        await this.paymentMM.fill("12");
        await this.paymentYY.fill("2027");
        await this.paymentConfirmButton.click();
        await expect (this.orderSuccessHeading).toBeVisible();
    }


};