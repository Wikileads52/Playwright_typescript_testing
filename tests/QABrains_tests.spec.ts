import { test, expect, request, Page } from "@playwright/test";
import { POManager} from "../pageObjectModel/POManager";


test("first user E2E test", async ({ page }) => {
    const productName: string = process.env.QABrains_product_one
    const poManager = new POManager(page, productName);
    const LoginPage = poManager.getLoginPage();
    const ShopPage = poManager.getShopPage();
    const CartPage = poManager.getCartPage();
    const CheckoutPage = poManager.getCheckoutPage();
    await LoginPage.goToShop();
    await LoginPage.firstUserLogin();
    await ShopPage.getProductInCart();
    await expect(ShopPage.toastStatus).toBeVisible();
    await expect(ShopPage.toastStatus).toContainText("Added to cart");
    await ShopPage.goToCart();
    await CartPage.goToCheckout();
    await expect(CheckoutPage.emailField).not.toBeEditable();
    await expect(CheckoutPage.emailField).toHaveValue(process.env.QABrains_email!);
    await CheckoutPage.validateInformations();
    await expect(CheckoutPage.checkoutProductLine).toBeVisible();
    await CheckoutPage.completeCheckout();
    await expect(CheckoutPage.CompleteHeading).toBeVisible();
    await expect(CheckoutPage.thanksHeading).toBeVisible();
    await expect(CheckoutPage.thanksMessage).toBeVisible();
    await page.close();
});

test("remove product from the cart", async ({page}) => {

});