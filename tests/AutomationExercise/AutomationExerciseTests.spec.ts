import { test, expect, BrowserContext, Page } from "@playwright/test";
import { POManager } from "../../pageObjectModel/AutomationExercisePOM/POManager";
import {faker} from "@faker-js/faker";

let webContext : BrowserContext;
let page : Page;

test.beforeEach(async({browser})=>{
    webContext = await browser.newContext();
    page = await webContext.newPage();
    await page.goto("https://www.automationexercise.com");
    //intercept the google adds on the website and abort the display to get more consistent tests
    await page.route('**/*.{google-analytics.com,googlesyndication.com,doubleclick.net}**', route => route.abort());
    if (await page.getByRole("button", {name : "Manage options"}).isVisible()){
        await page.getByRole("button", {name : "Manage options"}).click();
        await page.getByRole("button", {name : "Confirm choices"}).click();}
    await expect(page.locator("#header")).toBeVisible();
    await expect(page.locator("#slider")).toBeVisible();
    await expect(page.locator("section").nth(1)).toBeVisible();
    await expect(page.locator("#footer")).toBeVisible();
});

test("@AutomationExercise Register user and delete user", async () =>{
  const fakeEmail = faker.internet.exampleEmail({allowSpecialCharacters: true });
  const fakeName = faker.person.fullName();
  console.log(fakeEmail, fakeName);
  const poManager = new POManager(page);
  const BasePage = poManager.getBasePage();
  const LoginPage = poManager.getLoginPage();
  const registrationPage = poManager.getRegistrationPage();
  await BasePage.goToSignUpPage();
  await expect(LoginPage.userSignupHeading).toBeVisible();
  await LoginPage.beginUserRegistration(fakeName, fakeEmail);
  await expect(page).toHaveURL("https://www.automationexercise.com/signup");
  await expect(registrationPage.registrationPageTitle).toBeVisible();
  await registrationPage.registerationNewUser();
  await expect(registrationPage.creationValidationText).toBeVisible();
  await registrationPage.continueLinkLocator.click();
  await expect(BasePage.loggedAsLocator).toHaveText(/Logged in as \w+/);
  await BasePage.deleteUser();
  await page.close();
});

test("@AutomationExercise Login with correct credentials", async ()=>{
  const poManager = new POManager(page);
  const BasePage = poManager.getBasePage();
  const LoginPage = poManager.getLoginPage();
  await BasePage.goToSignUpPage();
  await expect(page.getByRole("heading", {name : "Login to your account"})).toBeVisible();
  await LoginPage.userLogin(process.env.AUTOMATIONEXERCISE_email, process.env.AUTOMATIONEXERCISE_password);
  await expect(BasePage.loggedAsLocator).toHaveText(/Logged in as \w+/);
  await expect(BasePage.logoutButton).toBeVisible();
  await BasePage.logoutUser();
  await expect(BasePage.signupLoginButton).toBeVisible();
  await page.close();
});

test("@AutomationExercise Login with incorrect credentials", async ()=>{
  const poManager = new POManager(page);
  const BasePage = poManager.getBasePage();
  const LoginPage = poManager.getLoginPage();
  await BasePage.goToSignUpPage();
  await expect(page.getByRole("heading", {name : "Login to your account"})).toBeVisible();
  await LoginPage.userLogin(process.env.AUTOMATIONEXERCISE_email, "fdgdsd#sdf21§");
  await expect(LoginPage.userLoginErrorMessage).toHaveText("Your email or password is incorrect!");
  await page.close();
});

test("@AutomationExercise Try to register with preexisting email address", async ()=>{
  const poManager = new POManager(page);
  const BasePage = poManager.getBasePage();
  const LoginPage = poManager.getLoginPage();
  await BasePage.goToSignUpPage();
  await expect(LoginPage.userSignupHeading).toBeVisible();
  await LoginPage.beginUserRegistration(faker.person.fullName(), process.env.AUTOMATIONEXERCISE_email);
  await expect(LoginPage.userSignupErrorMessage).toHaveText("Email Address already exist!");
  await page.close();
});

test("@AutomationExercise Testing Contact Us form", async ()=>{
  const poManager = new POManager(page);
  const BasePage = poManager.getBasePage();
  const ContactUsPage = poManager.getContactUsPage();
  await BasePage.goToContactUsPage();
  await expect(ContactUsPage.contactUsPageTitle).toBeVisible();
  await ContactUsPage.fillContactUsForm();
  await expect(ContactUsPage.contactUsSuccessMessage).toContainText("Success! Your details have been submitted successfully.");
  await page.keyboard.press("ArrowDown", {delay : 1000});
  await BasePage.goToHome();
  await expect(page).toHaveURL("https://www.automationexercise.com");
  await page.close();
});

test("@AutomationExercise Verify test case page", async ()=>{
  const poManager = new POManager(page);
  const BasePage = poManager.getBasePage();
  await BasePage.goToTestCasesPage()
  await expect(page).toHaveURL("https://www.automationexercise.com/test_cases");
  page.close()
});

test("@AutomationExercise Verify products page and product detail page", async()=>{
  const poManager = new POManager(page);
  const BasePage = poManager.getBasePage();
  const ProductsPage = poManager.getProductsPage()
  await BasePage.goToProductsPage();
  await expect(page).toHaveURL("https://www.automationexercise.com/products");
  await expect(ProductsPage.productsSection).toBeVisible();
  await ProductsPage.viewProductInfo(1);
  await expect(ProductsPage.mainSection).toMatchAriaSnapshot(ProductsPage.blueTopSectionSnapShot);
  page.close()
});

test("@AutomationExercise Search product", async ()=>{
  const poManager = new POManager(page);
  const BasePage = poManager.getBasePage();
  const ProductsPage = poManager.getProductsPage()
  await BasePage.goToProductsPage();
  await expect(page).toHaveURL("https://www.automationexercise.com/products");
  await expect(ProductsPage.productsSection).toBeVisible();
  const nameProduct = await ProductsPage.searchNameProduct(1);
  await expect(ProductsPage.ProductCards.productCardsLocator).toHaveCount(1);
  await expect(ProductsPage.ProductCards.productCardsNameProduct).toContainText(nameProduct);
  page.close()
});

test("@AutomationExercise Verify Subscription in home page", async ()=>{
    const poManager = new POManager(page);
    const BasePage = poManager.getBasePage();
    await expect(BasePage.subscriptionFooterTitle).toBeVisible();
    await BasePage.userSubscription();
    await expect(BasePage.subscriptionMessage).toContainText("You have been successfully subscribed!");
    page.close();
});

test("@AutomationExercise Verify subscription in cart page", async ()=>{
    const poManager = new POManager(page);
    const BasePage = poManager.getBasePage();
    await BasePage.goToCart();
    await expect(page).toHaveURL("https://www.automationexercise.com/view_cart");
    await expect(BasePage.subscriptionFooterTitle).toBeVisible();
    await BasePage.userSubscription();
    await expect(BasePage.subscriptionMessage).toContainText("You have been successfully subscribed!");
    page.close()
});

test("@AutomationExercise Add products in Cart", async ()=>{
    const poManager = new POManager(page);
    const BasePage = poManager.getBasePage();
    const ProductsPage = poManager.getProductsPage();
    const CartPage = poManager.getCartPage();
    await BasePage.goToProductsPage();
    await expect(page).toHaveURL("https://www.automationexercise.com/products");
    await expect(ProductsPage.productsSection).toBeVisible();
    const priceProduct1 = await ProductsPage.getPriceProduct(1);
    const nameProduct1 = await ProductsPage.getNameProduct(1);
    await ProductsPage.addProductInCart(1);
    const priceProduct2 = await ProductsPage.getPriceProduct(2);
    const nameProduct2 = await ProductsPage.getNameProduct(2);
    await ProductsPage.addProductInCart(2);
    await BasePage.goToCart();
    await expect(CartPage.cartRow).toHaveCount(2);
    await expect(CartPage.cartProductDescription.filter({hasText : `${nameProduct1}`})).toContainText(`${nameProduct1}`);
    await expect(CartPage.cartProductDescription.filter({hasText : `${nameProduct2}`})).toContainText(`${nameProduct2}`);
    await CartPage.setCartProductRow(1);
    await expect(CartPage.cartProductPrice).toContainText(`${priceProduct1}`);
    await expect(CartPage.cartProductQuantity).toContainText("1");
    const total1 = await CartPage.calculateProductTotal(1);
    await expect(CartPage.cartProductTotal).toContainText(`Rs. ${total1}`);
    await CartPage.setCartProductRow(2);
    await expect(CartPage.cartProductPrice).toContainText(`${priceProduct2}`);  
    await expect(CartPage.cartProductQuantity).toContainText("1");
    const total2 = await CartPage.calculateProductTotal(2);
    await expect(page.locator(".cart_total").nth(1)).toContainText(`Rs. ${total2}`);
    page.close()
});

test("@AutomationExercise Verify Product quantity in Cart", async ()=>{
    const poManager = new POManager(page);
    const BasePage = poManager.getBasePage();
    const ProductsPage = poManager.getProductsPage();
    const ProductPage = poManager.getProductPage();
    const CartPage = poManager.getCartPage();
    await BasePage.goToProductsPage();
    await expect(page).toHaveURL("https://www.automationexercise.com/products");
    await expect(ProductsPage.productsSection).toBeVisible();
    await ProductsPage.viewProductInfo(1);
    const quantity = await ProductPage.chooseProductQuantity(4)
    await BasePage.goToCart();
    await CartPage.setCartProductRow(1);
    await expect(CartPage.cartProductQuantity).toContainText(quantity);
    page.close()
});

test("@AutomationExercise Place order: Register while checkout", async ()=>{
    const poManager = new POManager(page);
    const BasePage = poManager.getBasePage();
    const LoginPage = poManager.getLoginPage();
    const registrationPage = poManager.getRegistrationPage()
    const MainPage = poManager.getMainPage();
    const CartPage = poManager.getCartPage();
    const CheckoutPage = poManager.getCheckoutPage();
    const fakeName = faker.person.fullName();
    const fakeEmail = faker.internet.exampleEmail({allowSpecialCharacters: true })
    await MainPage.addProductInCart(1);
    await BasePage.goToCart();
    await CartPage.goToCheckOut();
    await CartPage.dialogLoginButton.click();
    await expect(LoginPage.userSignupHeading).toBeVisible();
  await LoginPage.beginUserRegistration(fakeName, fakeEmail);
  await expect(page).toHaveURL("https://www.automationexercise.com/signup");
  await expect(registrationPage.registrationPageTitle).toBeVisible();
  await registrationPage.registerationNewUser();
  await expect(registrationPage.creationValidationText).toBeVisible();
  await registrationPage.continueLinkLocator.click();
  await expect(BasePage.loggedAsLocator).toHaveText(/Logged in as \w+/);
    await BasePage.goToCart();
    await CartPage.goToCheckOut();
    await expect (CheckoutPage.yourDeliveryAddressName).toContainText("Mr. John Doe");
    await expect (CheckoutPage.yourDeliveryAddressCompany).toContainText("Google");
    await expect (CheckoutPage.yourDeliveryAddress).toContainText("Google");
    await expect (CheckoutPage.yourDeliveryAddressLocation).toContainText("Montreal Quebec 213456");
    await expect (CheckoutPage.yourDeliveryAddressCountry).toContainText("Canada");
    await expect (CheckoutPage.yourDeliveryAddressPhone).toContainText("0123456789");
    await expect (CheckoutPage.yourBillingAddressName).toContainText("Mr. John Doe");
    await expect (CheckoutPage.yourBillingAddressCompany).toContainText("Google");
    await expect (CheckoutPage.yourBillingAddress).toContainText("Google");
    await expect (CheckoutPage.yourBillingAddressLocation).toContainText("Montreal Quebec 213456");
    await expect (CheckoutPage.yourBillingAddressCountry).toContainText("Canada");
    await expect (CheckoutPage.yourBillingAddressPhone).toContainText("0123456789");
    await CheckoutPage.orderCheckout();
    await CheckoutPage.fillCreditCardInfo();
    await expect(CheckoutPage.orderSuccessMessage).toBeVisible();
    await BasePage.deleteUser();
    page.close();
});

test("@AutomationExercise Place order: Register before checkout", async ()=> {
  const poManager = new POManager(page);
    const BasePage = poManager.getBasePage();
    const LoginPage = poManager.getLoginPage();
    const registrationPage = poManager.getRegistrationPage()
    const MainPage = poManager.getMainPage();
    const CartPage = poManager.getCartPage();
    const CheckoutPage = poManager.getCheckoutPage();
    const fakeName = faker.person.fullName();
    const fakeEmail = faker.internet.exampleEmail({allowSpecialCharacters: true })
    await BasePage.goToSignUpPage();
    await LoginPage.beginUserRegistration(fakeName, fakeEmail);
    await registrationPage.registerationNewUser();  
  await expect(registrationPage.creationValidationText).toBeVisible();
  await registrationPage.continueLinkLocator.click();
  await expect(BasePage.loggedAsLocator).toHaveText(/Logged in as \w+/);
    await MainPage.addProductInCart(1);
    await BasePage.goToCart();
    await CartPage.goToCheckOut();
    await expect (CheckoutPage.yourDeliveryAddressName).toContainText("Mr. John Doe");
    await expect (CheckoutPage.yourDeliveryAddressCompany).toContainText("Google");
    await expect (CheckoutPage.yourDeliveryAddress).toContainText("Google");
    await expect (CheckoutPage.yourDeliveryAddressLocation).toContainText("Montreal Quebec 213456");
    await expect (CheckoutPage.yourDeliveryAddressCountry).toContainText("Canada");
    await expect (CheckoutPage.yourDeliveryAddressPhone).toContainText("0123456789");
    await expect (CheckoutPage.yourBillingAddressName).toContainText("Mr. John Doe");
    await expect (CheckoutPage.yourBillingAddressCompany).toContainText("Google");
    await expect (CheckoutPage.yourBillingAddress).toContainText("Google");
    await expect (CheckoutPage.yourBillingAddressLocation).toContainText("Montreal Quebec 213456");
    await expect (CheckoutPage.yourBillingAddressCountry).toContainText("Canada");
    await expect (CheckoutPage.yourBillingAddressPhone).toContainText("0123456789");
    await CheckoutPage.orderCheckout();
    await CheckoutPage.fillCreditCardInfo();
    await expect(CheckoutPage.orderSuccessMessage).toBeVisible();
    await BasePage.deleteUser();
    page.close();
});


test("@AutomationExercise Place order: Login before checkout", async ()=>{
  const poManager = new POManager(page);
  const BasePage = poManager.getBasePage();
    const LoginPage = poManager.getLoginPage();
    const MainPage = poManager.getMainPage();
    const CartPage = poManager.getCartPage();
    const CheckoutPage = poManager.getCheckoutPage();
  await BasePage.goToSignUpPage();
  await LoginPage.userLogin(process.env.AUTOMATIONEXERCISE_email, process.env.AUTOMATIONEXERCISE_password);
  await expect(BasePage.loggedAsLocator).toHaveText(/Logged in as \w+/);
  await MainPage.addProductInCart(1);
  await BasePage.goToCart();
  await CartPage.goToCheckOut();
  await expect (CheckoutPage.yourDeliveryAddressName).toContainText("Mr. John Doe");
    await expect (CheckoutPage.yourDeliveryAddressCompany).toContainText("Google");
    await expect (CheckoutPage.yourDeliveryAddress).toContainText("Google");
    await expect (CheckoutPage.yourDeliveryAddressLocation).toContainText("Montreal Quebec 213456");
    await expect (CheckoutPage.yourDeliveryAddressCountry).toContainText("Canada");
    await expect (CheckoutPage.yourDeliveryAddressPhone).toContainText("0123456789");
    await expect (CheckoutPage.yourBillingAddressName).toContainText("Mr. John Doe");
    await expect (CheckoutPage.yourBillingAddressCompany).toContainText("Google");
    await expect (CheckoutPage.yourBillingAddress).toContainText("Google");
    await expect (CheckoutPage.yourBillingAddressLocation).toContainText("Montreal Quebec 213456");
    await expect (CheckoutPage.yourBillingAddressCountry).toContainText("Canada");
    await expect (CheckoutPage.yourBillingAddressPhone).toContainText("0123456789");
    await CheckoutPage.orderCheckout();
    await CheckoutPage.fillCreditCardInfo();
    await expect(CheckoutPage.orderSuccessMessage).toBeVisible();
    page.close();
});

test("@AutomationExercise Remove product from cart", async ()=>{
  const poManager = new POManager(page);
  const BasePage = poManager.getBasePage();
    const MainPage = poManager.getMainPage();
    const CartPage = poManager.getCartPage();
    const priceProduct = await MainPage.getPriceProduct(1);
    const nameProduct = await MainPage.getNameProduct(1);
    await MainPage.addProductInCart(1);
    await BasePage.goToCart();
    await expect(CartPage.cartRow).toHaveCount(1);
    CartPage.setCartProductRow(1)
    await expect(CartPage.cartProductDescription.filter({hasText : `${nameProduct}`})).toContainText(`${nameProduct}`);
    await expect.soft(CartPage.cartProductPrice).toContainText(`${priceProduct}`);
    await CartPage.deleteCartProduct(1);
    await expect(CartPage.cartProductDescription).toHaveCount(0);
    await expect(CartPage.cartSection).toMatchAriaSnapshot(CartPage.emptyCartSnapShot);
    page.close();
});

test("@AutomationExercise View category product", async()=>{
    const poManager = new POManager(page);
    const MainPage = poManager.getMainPage();
    const ProductsPage = poManager.getProductsPage();
    await MainPage.womenProductCategory.click();
    await MainPage.topProductCategory.click();
    await expect(MainPage.womenTopProductTitle).toBeVisible();
    await expect(ProductsPage.mainSection).toMatchAriaSnapshot(ProductsPage.womenTopSectionSnapShot);
    await MainPage.menProductCategory.click();
    await MainPage.jeansProductCategory.click();
    await expect(ProductsPage.mainSection).toContainText('Men - Jeans Products');
    await expect(ProductsPage.mainSection).toMatchAriaSnapshot(ProductsPage.menJeansSectionSnapShot);
    page.close();
});


test("@AutomationExercise View and cart brand product", async ()=>{
    const poManager = new POManager(page);
    const BasePage = poManager.getBasePage();
    const ProductsPage = poManager.getProductsPage();
    await BasePage.goToProductsPage();
    await expect(page).toHaveURL("https://www.automationexercise.com/products");
    await expect(ProductsPage.brandSection).toBeVisible();
    await ProductsPage.poloBrand.click();
    await expect(page).toHaveURL("https://www.automationexercise.com/brand_products/Polo");
    await expect(ProductsPage.poloPageTitle).toBeVisible();
    await ProductsPage.madameBrand.click();
    await expect(page).toHaveURL("https://www.automationexercise.com/brand_products/Madame");
    await expect(ProductsPage.madamePageTitle).toBeVisible();
    page.close();
});


test("@AutomationExercise Search product and verify cart after login", async ()=>{
    const poManager = new POManager(page);
    const BasePage = poManager.getBasePage();
    const ProductsPage = poManager.getProductsPage();
    const CartPage = poManager.getCartPage();
    const LoginPage = poManager.getLoginPage();
    await BasePage.goToProductsPage();
    await ProductsPage.searchProductByWord("Jeans", 3);
    const numberCards = await ProductsPage.addMultipleProductsToCart();
    await BasePage.goToCart();
    await CartPage.verifyProductsContainWord(numberCards ,"Jeans");
    await expect(CartPage.cartRow).toHaveCount(3);
    await BasePage.goToSignUpPage();
    await LoginPage.userLogin(process.env.AUTOMATIONEXERCISE_email, process.env.AUTOMATIONEXERCISE_password);
    await expect(BasePage.loggedAsLocator).toHaveText(/Logged in as \w+/);
    await BasePage.goToCart();
    await CartPage.verifyProductsContainWord(3, "Jeans");
    await page.close();
});

test("@AutomationExercise Add review on product", async ()=>{
    const poManager = new POManager(page);
    const BasePage = poManager.getBasePage();
    const ProductsPage = poManager.getProductsPage()
    const ProductPage = poManager.getProductPage();
    await BasePage.goToProductsPage();
    await ProductsPage.viewProductInfo(1);
    await ProductPage.fillReviewForm("John Doe", process.env.AUTOMATIONEXERCISE_email);
    await expect(ProductPage.reviewSuccessMessage).toBeVisible();
    page.close();
});

test("@AutomationExercise Add to cart from Recommended items", async ()=>{
    const poManager = new POManager(page);
    const BasePage = poManager.getBasePage();
    const MainPage = poManager.getMainPage();
    const CartPage = poManager.getCartPage()
    await MainPage.addItemFromCarousel(1);
    await BasePage.goToCart();
    await expect(CartPage.cartRow).toHaveCount(1);
    page.close();
});

test("@AutomationExercise Verify Scroll Up using 'Arrow' button and Scroll Down functionality", async ()=>{
  const poManager = new POManager(page);
    const MainPage = poManager.getMainPage();
    await MainPage.scrollDownandScrollUpWithButton();
    page.close();
});

test("@AutomationExercise Verify page scroll down and page scroll up", async ()=>{
  const poManager = new POManager(page);
    const MainPage = poManager.getMainPage();
    await MainPage.scrollDownandScrollUpNoButton();
    page.close();
});

