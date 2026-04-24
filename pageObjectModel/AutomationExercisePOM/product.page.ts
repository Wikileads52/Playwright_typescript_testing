import { Locator, Page, expect } from "@playwright/test";
import { productsPage } from "./products.page";

export class productPage extends productsPage{

    page: Page;
    quantityButton : Locator;
    addToCartButton : Locator;
    reviewForm : Locator;
    reviewMail : Locator;
    reviewName : Locator;
    reviewBox : Locator;
    reviewSubmitButton : Locator;
    reviewSuccessMessage : Locator;

    constructor(page : Page){
        super(page);
        this.page = page;
        this.quantityButton = this.page.getByRole("spinbutton");
        this.addToCartButton = this.page.getByRole('button', { name: ' Add to cart' });
        this.reviewForm = this.page.locator("#review-form");
        this.reviewMail = this.reviewForm.getByRole("textbox", {name : "Email Address"});
        this.reviewName = this.page.getByRole("textbox", {name : "Your Name"});
        this.reviewBox = this.page.getByRole("textbox", {name : "Add Review Here!"});
        this.reviewSubmitButton = this.page.getByRole("button", {name : "Submit"});
        this.reviewSuccessMessage = this.page.getByText("Thank you for your review.");
    };


    async chooseProductQuantity(quantity : number){
        const quantitystring = quantity.toString()
        await this.quantityButton.fill(quantitystring);
        await this.addToCartButton.click();
        await this.dismissModalProductInCart();
        return quantitystring;
    };

    async fillReviewForm(name : string, email :string){
        await this.reviewName.fill(name);
        await this.reviewMail.fill(email);
        await this.reviewBox.fill("testing comments !");
        await this.reviewSubmitButton.click();
    };

};