import { Locator, Page, expect } from "@playwright/test";

export class cartPage {

    page: Page;
    cartSection : Locator;
    cartRow: Locator;
    cartProductDescription: Locator;
    cartProductPrice: Locator;
    cartProductQuantity: Locator;
    cartProductTotal: Locator;
    cartDeleteButton : Locator;
    checkoutButton: Locator;
    dialogLoginButton : Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartSection = this.page.locator('#cart_items');
        this.cartRow = this.page.locator("tr[id^='product-']");
        this.cartProductDescription = this.page.locator(".cart_description");
        this.checkoutButton = this.page.locator("a.btn.btn-default.check_out");
        this.dialogLoginButton = this.page.getByRole('paragraph').filter({has:(page.locator("[href='/login']"))});
    };

    async setCartProductRow(rowNumber: number) {
        this.cartProductPrice = this.page.locator(".cart_price").nth(rowNumber - 1);
        this.cartProductQuantity = this.page.locator(".cart_quantity").nth(rowNumber - 1);
        this.cartProductTotal = this.page.locator(".cart_total_price").nth(rowNumber - 1);
        this.cartDeleteButton = this.page.locator('.cart_quantity_delete').nth(rowNumber - 1);
    };

    async calculateProductTotal(rowNumber: number) {
        this.setCartProductRow(rowNumber);
        const quantityProduct = await this.cartProductQuantity.textContent();
        const priceProductSplit = (await this.cartProductPrice.textContent()).split(" ");
        const priceProduct = priceProductSplit[1];
        const total = (Number(priceProduct) * Number(quantityProduct)).toString();
        return total;
    };

    async verifyProductsContainWord(numberCards ,word: string){
        for(let i = 0 ; i < numberCards ; i++){
                await expect(this.cartProductDescription.nth(i)).toContainText(word);
            };
    }

    async deleteCartProduct(rowNumber : number){
        this.setCartProductRow(rowNumber);
        await this.cartDeleteButton.click();
    };

    async goToCheckOut(){
        await this.checkoutButton.waitFor();
        await this.checkoutButton.click();
        await this.page.waitForLoadState("networkidle");
    }


    emptyCartSnapShot = `
      - list:
        - listitem:
          - link "Home":
            - /url: /
        - listitem: Shopping Cart
      - paragraph:
        - text: Cart is empty! Click
        - link "here":
          - /url: /products
        - text: to buy products.
      `
};