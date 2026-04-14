import { test, expect, request } from "@playwright/test";
import { POManager } from "../pageObjectModel/POManager";
import data from "../utils/QABrainsData.json";
import { shopPage } from "../pageObjectModel/shopPage";


test("first user E2E test", async ({ page }) => {
    const productName: string | string[] = data[1].productName;
    const poManager = new POManager(page);
    const LoginPage = poManager.getLoginPage();
    const ShopPage = poManager.getShopPage();
    const CartPage = poManager.getCartPage();
    const CheckoutPage = poManager.getCheckoutPage();
    await LoginPage.goToShop();
    await LoginPage.userLogin(process.env.QABRAINS_email, process.env.QABRAINS_password);
    await ShopPage.getProductInCart(productName);
    await expect(ShopPage.toastStatus).toBeVisible();
    await expect(ShopPage.toastStatus).toContainText("Added to cart");
    await ShopPage.goToCart();
    await CartPage.goToCheckout();
    await expect(CheckoutPage.emailField).not.toBeEditable();
    await expect(CheckoutPage.emailField).toHaveValue(process.env.QABRAINS_email!);
    await CheckoutPage.validateInformations();
    CheckoutPage.setProductName(productName);
    await expect(CheckoutPage.checkoutProductLine).toBeVisible();
    await expect(CheckoutPage.productPriceLocator).not.toBeEmpty();
    await expect(CheckoutPage.productTotalLocator).not.toBeEmpty();
    let { QuantityProductNumber, PricePerProduct, totalPerProduct } = await CheckoutPage.validatePriceOneProduct(productName);
    expect(totalPerProduct).toBe(PricePerProduct * QuantityProductNumber);
    await CheckoutPage.completeCheckout();
    await expect(CheckoutPage.completeHeading).toBeVisible();
    await expect(CheckoutPage.thanksHeading).toBeVisible();
    await expect(CheckoutPage.thanksMessage).toBeVisible();
    await ShopPage.disconnectUser();
    await page.close();
});

test("Remove the only product from the cart show empty message", async ({ page }) => {
    const productName: string = data[0].productName;
    const poManager = new POManager(page);
    const LoginPage = poManager.getLoginPage();
    const ShopPage = poManager.getShopPage();
    const CartPage = poManager.getCartPage();
    await LoginPage.goToShop();
    await LoginPage.userLogin(process.env.QABRAINS_email, process.env.QABRAINS_password);
    await ShopPage.setProductName(productName);
    await ShopPage.getProductInCart(productName);
    await expect(ShopPage.toastStatus).toBeVisible();
    await expect(ShopPage.toastStatus).toContainText("Added to cart");
    await ShopPage.goToCart();
    await CartPage.setProductName(productName);
    await CartPage.removeProduct(productName);
    await expect(CartPage.cartProductLine).toHaveCount(0);
    await expect(CartPage.yourCartIsEmptyMessage).toBeVisible();
    await expect(ShopPage.cartButtonNumber).not.toBeAttached();
    await expect(CartPage.continueShoppingButton).toBeInViewport();
    //await expect(CartPage.continueShoppingButton.locator("../..")).toHaveScreenshot("CenteredContinueButton.png");
    /* expect(await CartPage.continueShoppingButton.locator("../..").screenshot())
        .toMatchSnapshot("CenteredContinueButton.png");
     */
    await page.close();
});

test("Favorite page functions", async ({ page }) => {
    const productName: string = data[2].productName;
    const poManager = new POManager(page);
    const LoginPage = poManager.getLoginPage();
    const ShopPage = poManager.getShopPage();
    await LoginPage.goToShop();
    await LoginPage.userLogin(process.env.QABRAINS_email, process.env.QABRAINS_password);
    await ShopPage.setProductAsFavorites(productName);
    await ShopPage.goToFavoritesPage();
    await expect(ShopPage.productCard).toBeVisible();
    await page.reload({ waitUntil: "networkidle" });
    await expect(ShopPage.productCard).toBeVisible();
    await page.goto(`${process.env.QABRAINS_BASEURL}`);
    await ShopPage.goToFavoritesPage();
    await ShopPage.disconnectUser();
    await LoginPage.userLogin(process.env.QABRAINS_email, process.env.QABRAINS_password);
    await ShopPage.goToFavoritesPage();
    await expect(ShopPage.productCard).toBeVisible();
    await ShopPage.removeFromFavorites(productName);
    await expect(ShopPage.productCard).toHaveCount(0);
    await expect(ShopPage.noFavoritesMessage).toBeVisible();
    await expect(ShopPage.continueShoppingLink).toBeVisible();
    //await expect(ShopPage.continueShoppingLink.locator("../..")).toHaveScreenshot("ContinueShoppingLink.png");
    /* expect(await ShopPage.continueShoppingLink.locator("../..").screenshot())
        .toMatchSnapshot("ContinueShoppingLink.png"); */
    await page.close();
});

test("Add multiple products in the cart", async ({ page }) => {
    const productName1: string = data[0].productName;
    const productName2: string = data[1].productName;
    const productName3: string = data[2].productName;
    const poManager = new POManager(page);
    const LoginPage = poManager.getLoginPage();
    const ShopPage = poManager.getShopPage();
    const CartPage = poManager.getCartPage();
    const CheckoutPage = poManager.getCheckoutPage();
    await LoginPage.goToShop();
    await LoginPage.userLogin(process.env.QABRAINS_email, process.env.QABRAINS_password);
    await ShopPage.getProductInCart(productName1);
    await ShopPage.getProductInCart(productName2);
    await ShopPage.getProductInCart(productName3);
    await ShopPage.goToCart();
    await CartPage.removeProduct(productName2);
    CartPage.setProductName(productName2)
    await expect(CartPage.cartProductLine).toHaveCount(0);
    await CartPage.goToCheckout();
    await CheckoutPage.validateInformations();
    CheckoutPage.setProductName(productName1);
    let { QuantityProductNumber, PricePerProduct, totalPerProduct } = await CheckoutPage.validatePriceOneProduct(productName3);
    expect(totalPerProduct).toBe(PricePerProduct * QuantityProductNumber);
    await CheckoutPage.validatePriceOneProduct(productName1);
    expect(totalPerProduct).toBe(PricePerProduct * QuantityProductNumber);
    await CheckoutPage.completeCheckout();
    await CheckoutPage.continueButton.click();
});

test("One product Multiple times in cart", async ({ page }) => {
    const poManager = new POManager(page);
    const LoginPage = poManager.getLoginPage();
    const ShopPage = poManager.getShopPage();
    const CartPage = poManager.getCartPage();
    const CheckoutPage = poManager.getCheckoutPage();
    await LoginPage.goToShop();
    await LoginPage.userLogin(process.env.QABRAINS_email, process.env.QABRAINS_password);
    await ShopPage.getProductInCart(data[0].productName);
    await ShopPage.goToCart();
    await CartPage.addProductMultiple(data[0].productName, data[0].numberOfProdcucts);
    expect(Number(await CartPage.quantityProductLocator.allTextContents()))
        .toBe(data[0].numberOfProdcucts);
    await CartPage.goToCheckout();
    await CheckoutPage.validateInformations();
    await CheckoutPage.validatePriceOneProduct(data[0].productName);
    let { itemTotal, taxTotal, priceTotal } = await CheckoutPage.validateTaxTotal();
    expect(taxTotal).toBe(itemTotal * 0.05);
    expect(priceTotal).toBe(itemTotal + taxTotal);
    await CheckoutPage.completeCheckout();
    await expect(CheckoutPage.thanksMessage).toBeVisible();
    await ShopPage.disconnectUser();
});

test("Delete product Multiple times in cart", async ({ page }) => {
    const poManager = new POManager(page);
    const LoginPage = poManager.getLoginPage();
    const ShopPage = poManager.getShopPage();
    const CartPage = poManager.getCartPage();
    const CheckoutPage = poManager.getCheckoutPage();
    await LoginPage.goToShop();
    await LoginPage.userLogin(process.env.QABRAINS_email, process.env.QABRAINS_password);
    await ShopPage.getProductInCart(data[0].productName);
    await ShopPage.goToCart();
    await CartPage.addProductMultiple(data[0].productName, data[0].numberOfProdcucts);
    await CartPage.deleteProductMultipleUntillOne(data[0].productName, data[0].numberOfProdcucts);
    await CartPage.goToCheckout();
    await CheckoutPage.validateInformations();
    await CheckoutPage.validatePriceOneProduct(data[0].productName);
    let { itemTotal, taxTotal, priceTotal } = await CheckoutPage.validateTaxTotal();
    expect(taxTotal).toBe(itemTotal * 0.05);
    expect(priceTotal).toBe(itemTotal + taxTotal);
    await CheckoutPage.completeCheckout();
    await expect(CheckoutPage.thanksMessage).toBeVisible();
    await ShopPage.disconnectUser();
});

test("Verify order in product page", async ({ page }) => {
    let listprices: number[] = [];
    const poManager = new POManager(page);
    const LoginPage = poManager.getLoginPage();
    const ShopPage = poManager.getShopPage();
    await LoginPage.goToShop();
    await LoginPage.userLogin(process.env.QABRAINS_email, process.env.QABRAINS_password);
    await ShopPage.setOrderLowToHigh();
    await expect(page.getByText(/^\$\d+(\.\d{2})?$/).first()).toHaveText("$45.00");
    let numberofdollarsigns = await page.getByText(/^\$\d+(\.\d{2})?$/).count();
    for (let i = 0; i < numberofdollarsigns; i++) {
        listprices.push(Number((await page.getByText(/^\$\d+(\.\d{2})?$/).nth(i).textContent()).replace("$", "").trim()));
    };
    for (let i = 0; i < listprices.length - 1; i++) {
        expect(listprices[i]).toBeLessThanOrEqual(listprices[i + 1]);
    };
    listprices = [];
    await ShopPage.setOrderHighToLow();
    await expect(page.getByText(/^\$\d+(\.\d{2})?$/).first()).toHaveText("$256.45");
    numberofdollarsigns = await page.getByText(/^\$\d+(\.\d{2})?$/).count();
    for (let i = 0; i < numberofdollarsigns; i++) {
        listprices.push(Number((await page.getByText(/^\$\d+(\.\d{2})?$/).nth(i).textContent()).replace("$", "").trim()));
    };
    for (let i = 0; i < listprices.length - 1; i++) {
        expect(listprices[i]).toBeGreaterThanOrEqual(listprices[i + 1]);
    };
});