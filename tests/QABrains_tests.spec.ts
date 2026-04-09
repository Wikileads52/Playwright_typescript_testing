import { test, expect, request } from "@playwright/test";
import { POManager} from "../pageObjectModel/POManager";
import TestData from "../utils/QABrainsData.json";
const data = TestData 

test("first user E2E test", async ({ page }) => {
    const productName: string = data[1].productName;
    const poManager = new POManager(page);
    const LoginPage = poManager.getLoginPage();
    const ShopPage = poManager.getShopPage();
    const CartPage = poManager.getCartPage();
    const CheckoutPage = poManager.getCheckoutPage();
    await LoginPage.goToShop();
    await LoginPage.firstUserLogin();
    await ShopPage.getProductInCart(productName);
    await expect(ShopPage.toastStatus).toBeVisible();
    await expect(ShopPage.toastStatus).toContainText("Added to cart");
    await ShopPage.goToCart();
    await CartPage.goToCheckout();
    await expect(CheckoutPage.emailField).not.toBeEditable();
    await expect(CheckoutPage.emailField).toHaveValue(process.env.QABrains_email!);
    await CheckoutPage.validateInformations();
    CheckoutPage.setProductName(productName);
    await expect(CheckoutPage.checkoutProductLine).toBeVisible();
    await expect(CheckoutPage.productPriceLocator).not.toBeEmpty();
    await expect(CheckoutPage.productTotalLocator).not.toBeEmpty();
    let { QuantityProductNumber, PricePerProduct, totalPerProduct } = await CheckoutPage.validatePriceOneProduct(productName);
    expect(totalPerProduct).toBe(PricePerProduct * QuantityProductNumber);
    await CheckoutPage.completeCheckout();
    await expect(CheckoutPage.CompleteHeading).toBeVisible();
    await expect(CheckoutPage.thanksHeading).toBeVisible();
    await expect(CheckoutPage.thanksMessage).toBeVisible();
    await ShopPage.disconnectUser();
    await page.close();
});

test("Remove the only product from the cart show empty message", async ({page}) => {
    const productName: string = data[0].productName;
    const poManager = new POManager(page);
    const LoginPage = poManager.getLoginPage();
    const ShopPage = poManager.getShopPage();
    const CartPage = poManager.getCartPage();
    await LoginPage.goToShop();
    await LoginPage.firstUserLogin();
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
    expect(await CartPage.continueShoppingButton.locator("../..").screenshot())
    .toMatchSnapshot("CenteredContinueButton.png");
    //await page.close()
});

test("Favorite page functions", async ({page}) =>{
    const productName : string = data[2].productName;
    const poManager = new POManager(page);
    const LoginPage = poManager.getLoginPage();
    const ShopPage = poManager.getShopPage();
    await LoginPage.goToShop();
    await LoginPage.firstUserLogin();
    await ShopPage.setProductName(productName);
    await ShopPage.setProductAsFavorites(productName);
    await ShopPage.goToFavoritesPage();
    await expect(ShopPage.productCard).toBeVisible();
    await ShopPage.removeFromFavorites(productName);
    await expect(ShopPage.productCard).toHaveCount(0);
    await expect(ShopPage.noFavoritesMessage).toBeVisible();
    await expect(ShopPage.continueShoppingLink).toBeVisible();
    expect(await ShopPage.continueShoppingLink.locator("../..").screenshot())
    .toMatchSnapshot("ContinueShoppingLink.png");
});

test("Add multiple products in the cart", async ({page})=>{
    const productName1 : string = data[0].productName;
    const productName2 : string = data[1].productName;
    const productName3 : string = data[2].productName;
    const poManager = new POManager(page);
    const LoginPage = poManager.getLoginPage();
    const ShopPage = poManager.getShopPage();
    const CartPage = poManager.getCartPage();
    const CheckoutPage = poManager.getCheckoutPage();
    await LoginPage.goToShop();
    await LoginPage.firstUserLogin();
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