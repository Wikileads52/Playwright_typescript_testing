import { Page, Locator, expect } from "@playwright/test";
import { productCards } from "./productCards";

export class productsPage {

    page: Page;
    productsSection: Locator;
    searchBar: Locator;
    searchButton: Locator;
    continueShoppingButton: Locator;
    womenProductCategory: Locator;
    menProductCategory: Locator;
    topProductCategory: Locator;
    jeansProductCategory: Locator;
    womenTopProductTitle: Locator;
    menJeansProductTitle: Locator;
    brandSection: Locator;
    poloBrand: Locator;
    poloPageTitle: Locator;
    madameBrand: Locator;
    madamePageTitle: Locator;
    ProductCards: productCards;
    mainSection: Locator;

    constructor(page: Page) {
        this.page = page;
        this.productsSection = this.page.locator(".features_items");
        this.searchBar = this.page.getByRole("textbox", { name: "Search Product" });
        this.searchButton = this.page.locator("#submit_search");
        this.continueShoppingButton = this.page.getByRole("button", { name: "Continue Shopping" });
        this.womenProductCategory = this.page.getByRole('link', { name: ' Women' });
        this.menProductCategory = this.page.getByRole('link', { name: ' Men' });
        this.topProductCategory = this.page.getByRole('link', { name: 'Tops' });
        this.jeansProductCategory = this.page.getByRole('link', { name: 'Jeans', exact: true });
        this.womenTopProductTitle = this.page.getByRole("heading", { name: "WOMEN - TOPS PRODUCTS" });
        this.menJeansProductTitle = this.page.locator('section');
        this.brandSection = this.page.locator(".brands_products").filter({ has: page.getByRole("heading", { name: "BRANDS" }) })
        this.poloBrand = this.page.locator(".brands-name").getByRole("link", { name: "Polo" });
        this.poloPageTitle = this.page.getByRole("heading", { name: "BRAND - POLO PRODUCTS" });
        this.madameBrand = this.page.locator(".brands-name").getByRole("link", { name: "MADAME" });
        this.madamePageTitle = this.page.getByRole("heading", { name: "BRAND - MADAME PRODUCTS" });
        this.ProductCards = new productCards(this.page);
        this.mainSection = this.page.locator('section');
    };

    async dismissModalProductInCart() {
        try {
            await this.continueShoppingButton.waitFor({ state: 'visible', timeout: 9000 });
            await this.continueShoppingButton.click();
        }
        catch (error) {
            console.log("The modal did not appear")
        };
    };

    async viewProductInfo(cardNumber: number) {
        await this.ProductCards.setProductCard(cardNumber);
        await this.ProductCards.productCardsViewProduct.click();
    };

    async searchNameProduct(cardNumber: number) {
        await this.ProductCards.setProductCard(cardNumber);
        const nameProduct = await this.ProductCards.productCardsNameProduct.textContent();
        await this.searchBar.fill(nameProduct);
        await this.searchButton.click();
        return nameProduct;
    };

    async searchProductByWord(search_product: string, expectedNumberProduct: number) {
        await this.searchBar.fill(search_product);
        await this.searchButton.click();
        await this.ProductCards.productCardsLocator.first().waitFor();
        await expect(this.ProductCards.productCardsLocator).toHaveCount(expectedNumberProduct);
    }

    async addMultipleProductsToCart() {
        let Wrapper = {}
        const numberCards = await this.ProductCards.productCardsLocator.count();
        for (let i = 0; i < numberCards; i++) {
            Wrapper["nameProduct" + i] = await this.ProductCards.productCardsLocator.nth(i).getByRole("paragraph").first().textContent();
            await this.ProductCards.productCardsLocator.nth(i).waitFor({ state: "visible" });
            await this.ProductCards.productCardsLocator.nth(i).getByText("Add to cart").first().click();
            await this.dismissModalProductInCart();
        }
        return numberCards;
    };

    async getNameProduct(cardNumber: number) {
        await this.ProductCards.setProductCard(cardNumber);
        const nameProduct = await this.ProductCards.productCardsNameProduct.textContent();
        return nameProduct;
    };

    async getPriceProduct(cardNumber: number) {
        await this.ProductCards.setProductCard(cardNumber);
        const priceProduct = this.ProductCards.productCardsPriceProduct.textContent();
        return priceProduct;
    };

    async addProductInCart(cardNumber: number) {
        await this.ProductCards.setProductCard(cardNumber);
        await this.ProductCards.productCardsImage.hover();
        await this.ProductCards.productCardsAddToCartButton.click();
        await this.dismissModalProductInCart();
    };

    async scrollDownandScrollUpWithButton() {
        await this.page.locator("#footer").getByRole("heading", { name: "Subscription" }).scrollIntoViewIfNeeded();
        await expect(this.page.locator("#footer").getByRole("heading", { name: "Subscription" })).toBeInViewport();
        await this.page.locator("#scrollUp").click();
        await expect(this.page.locator(".item.active").getByText("Full-Fledged practice website for Automation Engineers")).toBeInViewport();
    }

    async scrollDownandScrollUpNoButton() {
        await this.page.locator("#footer").getByRole("heading", { name: "Subscription" }).scrollIntoViewIfNeeded();
        await expect(this.page.locator("#footer").getByRole("heading", { name: "Subscription" })).toBeInViewport();
        await this.page.locator(".item.active").getByText("Full-Fledged practice website for Automation Engineers").scrollIntoViewIfNeeded();
        await expect(this.page.locator(".item.active").getByText("Full-Fledged practice website for Automation Engineers")).toBeInViewport();
    }

    womenTopSectionSnapShot = `
      - heading "Women - Tops Products" [level=2]
      - img "ecommerce website products"
      - heading /Rs\\. \\d+/ [level=2]
      - paragraph: Blue Top
      - link " Add to cart":
        - /url: javascript:void();
      - heading /Rs\\. \\d+/ [level=2]
      - paragraph: Blue Top
      - link " Add to cart":
        - /url: javascript:void();
      - list:
        - listitem:
          - link " View Product":
            - /url: /product_details/1
      - img "ecommerce website products"
      - heading /Rs\\. \\d+/ [level=2]
      - paragraph: Winter Top
      - link " Add to cart":
        - /url: javascript:void();
      - heading /Rs\\. \\d+/ [level=2]
      - paragraph: Winter Top
      - link " Add to cart":
        - /url: javascript:void();
      - list:
        - listitem:
          - link " View Product":
            - /url: /product_details/5
      - img "ecommerce website products"
      - heading /Rs\\. \\d+/ [level=2]
      - paragraph: Summer White Top
      - link " Add to cart":
        - /url: javascript:void();
      - heading /Rs\\. \\d+/ [level=2]
      - paragraph: Summer White Top
      - link " Add to cart":
        - /url: javascript:void();
      - list:
        - listitem:
          - link " View Product":
            - /url: /product_details/6
      - img "ecommerce website products"
      - heading /Rs\\. \\d+/ [level=2]
      - paragraph: Madame Top For Women
      - link " Add to cart":
        - /url: javascript:void();
      - heading /Rs\\. \\d+/ [level=2]
      - paragraph: Madame Top For Women
      - link " Add to cart":
        - /url: javascript:void();
      - list:
        - listitem:
          - link " View Product":
            - /url: /product_details/7
      - img "ecommerce website products"
      - heading /Rs\\. \\d+/ [level=2]
      - paragraph: Fancy Green Top
      - link " Add to cart":
        - /url: javascript:void();
      - heading /Rs\\. \\d+/ [level=2]
      - paragraph: Fancy Green Top
      - link " Add to cart":
        - /url: javascript:void();
      - list:
        - listitem:
          - link " View Product":
            - /url: /product_details/8
      - img "ecommerce website products"
      - heading /Rs\\. \\d+/ [level=2]
      - paragraph: Lace Top For Women
      - link " Add to cart":
        - /url: javascript:void();
      - heading /Rs\\. \\d+/ [level=2]
      - paragraph: Lace Top For Women
      - link " Add to cart":
        - /url: javascript:void();
      - list:
        - listitem:
          - link " View Product":
            - /url: /product_details/42
      `

    menJeansSectionSnapShot = `
      - heading "Men - Jeans Products" [level=2]
      - img "ecommerce website products"
      - heading /Rs\\. \\d+/ [level=2]
      - paragraph: Soft Stretch Jeans
      - link " Add to cart":
        - /url: javascript:void();
      - heading /Rs\\. \\d+/ [level=2]
      - paragraph: Soft Stretch Jeans
      - link " Add to cart":
        - /url: javascript:void();
      - list:
        - listitem:
          - link " View Product":
            - /url: /product_details/33
      - img "ecommerce website products"
      - heading /Rs\\. \\d+/ [level=2]
      - paragraph: Regular Fit Straight Jeans
      - link " Add to cart":
        - /url: javascript:void();
      - heading /Rs\\. \\d+/ [level=2]
      - paragraph: Regular Fit Straight Jeans
      - link " Add to cart":
        - /url: javascript:void();
      - list:
        - listitem:
          - link " View Product":
            - /url: /product_details/35
      - img "ecommerce website products"
      - heading /Rs\\. \\d+/ [level=2]
      - paragraph: Grunt Blue Slim Fit Jeans
      - link " Add to cart":
        - /url: javascript:void();
      - heading /Rs\\. \\d+/ [level=2]
      - paragraph: Grunt Blue Slim Fit Jeans
      - link " Add to cart":
        - /url: javascript:void();
      - list:
        - listitem:
          - link " View Product":
            - /url: /product_details/37
      `

    blueTopSectionSnapShot = `
    - img "ecommerce website products"
    - heading "Blue Top" [level=2]
    - paragraph: "Category: Women > Tops"
    - img "ecommerce website products"
    - text: /Rs\\. \\d+ Quantity:/
    - spinbutton: "1"
    - button " Add to cart"
    - paragraph: "Availability: In Stock"
    - paragraph: "Condition: New"
    - paragraph: "Brand: Polo"
    `

};