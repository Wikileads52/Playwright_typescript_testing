import { test, Request, expect, BrowserContext, Page } from "@playwright/test"

let webContext : BrowserContext;
let page : Page;

//Dismiss the continue shopping button in the product page
const dismissModalProductInCart = async ()=>{
    try{
        const button = page.getByRole("button", { name: "Continue Shopping" });
        await button.waitFor({ state: 'visible', timeout:3000 });
        await button.click();
    }
    catch(error)
    {
        console.log("The modal did not appear")
    };
};

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

test("Register user and delete user", async () =>{
    await page.getByRole("link", {name : " Signup / Login"}).click();
    await expect(page.getByRole("heading", {name : "New User Signup!"})).toBeVisible();
    const SignupForm = page.locator(".signup-form");
    await SignupForm.getByPlaceholder("Name").fill("John Doe");
    await SignupForm.getByPlaceholder("Email Address").fill(`fake52@gmail.com`);
    await SignupForm.getByRole("button", {name : "Signup"}).click();
    await expect(page).toHaveURL("https://www.automationexercise.com/signup");
    await expect(page.getByText("Enter Account Information")).toBeVisible();
    await page.getByRole("radio", {name : " Mr. "}).click();
    await page.getByRole("textbox", {name : "password"}).fill("Password123");
    await page.locator("#days").selectOption({value : "4"});
    await page.locator("#months").selectOption({value : "2"});
    await page.locator("#years").selectOption({value : "2000"});
    await page.getByRole("checkbox", {name : "Sign up for our newsletter!"});
    await page.getByLabel("First name ").fill("John");
    await page.getByLabel("Last name ").fill("Doe");
    await page.getByLabel("Company").first().fill("Google");
    await page.getByRole("textbox", {name : "Address * (Street address, P."}).fill("Google");
    await page.getByRole("combobox", {name : "Country"}).selectOption({value : "Canada"});
    await page.getByRole("textbox", {name : "State"}).fill("Quebec");
    await page.getByRole("textbox", {name : "City"}).fill("Montreal");
    await page.locator('#zipcode').fill("213456");
    await page.getByRole("textbox", {name : "Mobile Number"}).fill("0123456789");
    await page.getByRole("button", {name : "Create Account"}).click();
    await expect(page.getByText("Account created!")).toBeVisible();
    await page.getByRole("link", {name : "Continue"}).click();
    await expect(page.getByText("Logged in as")).toHaveText(/Logged in as \w+/);
    await page.getByRole("link", {name : " Delete Account"}).click();
    await expect(page.getByText("Account Deleted!")).toBeVisible();
    await page.getByRole("link", {name : "Continue"}).click();
    await page.close();
});

test("Login with correct credentials", async ()=>{
    await page.getByRole("link", {name : " Signup / Login"}).click();
    await expect(page.getByRole("heading", {name : "Login to your account"})).toBeVisible();
    const loginFormLocator = page.locator(".login-form");
    await loginFormLocator.getByPlaceholder("Email Address").fill(`${process.env.AUTOMATIONEXERCISE_email}`);
    await loginFormLocator.getByPlaceholder("Password").fill(`${process.env.AUTOMATIONEXERCISE_password}`);
    await loginFormLocator.getByRole("button", {name : "Login"}).click();
    await expect(page.getByText("Logged in as")).toHaveText(/Logged in as \w+/);
    await expect(page.getByRole("link", {name : "Logout"})).toBeVisible();
    await page.getByRole("link", {name : "Logout"}).click();
    await expect(page.getByRole("link", {name :" Signup / Login"})).toBeVisible();
    await page.close();
});

test("Login with incorrect credentials", async ()=>{
    await page.getByRole("link", {name : " Signup / Login"}).click();
    await expect(page.getByRole("heading", {name : "Login to your account"})).toBeVisible();
    const loginFormLocator = page.locator(".login-form");
    await loginFormLocator.getByPlaceholder("Email Address").fill(`${process.env.AUTOMATIONEXERCISE_email}`);
    await loginFormLocator.getByPlaceholder("Password").fill("&é'(-è(");
    await loginFormLocator.getByRole("button", {name : "Login"}).click();
    await expect(loginFormLocator.getByRole("paragraph")).toHaveText("Your email or password is incorrect!");
    await page.close();
});

test("Try to register with preexisting email address", async ()=>{
    await page.getByRole("link", {name : " Signup / Login"}).click();
    await expect(page.getByRole("heading", {name : "New User Signup!"})).toBeVisible();
    const SignupForm = page.locator(".signup-form");
    await SignupForm.getByPlaceholder("Name").fill("John Doe");
    await SignupForm.getByPlaceholder("Email Address").fill(`${process.env.AUTOMATIONEXERCISE_email}`);
    await SignupForm.getByRole("button", {name : "Signup"}).click();
    await expect(SignupForm.getByRole("paragraph")).toHaveText("Email Address already exist!");
    await page.close();
});

test("Testing Contact Us form", async ()=>{
    await page.getByRole("link", {name : " Contact us"}).click();
    await expect(page.getByRole("heading", {name : " Contact us"})).toBeVisible();
    const contactUsFormLocator = page.locator(".contact-form").nth(1);
    await contactUsFormLocator.getByRole("textbox", { name: "Name" }).fill(`John Doe`);
    await contactUsFormLocator.getByPlaceholder("Email").fill(`${process.env.AUTOMATIONEXERCISE_email}`);
    await contactUsFormLocator.getByRole('textbox', { name: 'Subject' }).fill("testing");
    await contactUsFormLocator.getByRole('textbox', { name: 'Your Message Here' }).fill("testing here and waiting");
    await page.keyboard.press("ArrowDown", {delay : 2000});
    page.on('dialog', async dialog => {
        await expect(dialog.message()).toContain("Press OK to proceed!");
        dialog.accept()
    });
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.locator(".status")).toContainText("Success! Your details have been submitted successfully.");
    await page.keyboard.press("ArrowDown", {delay : 1000});
    await page.getByRole("link", {name : "Home"}).nth(1).click();
    await expect(page).toHaveURL("https://www.automationexercise.com");
    await page.close();
});

test("Verify test case page", async ()=>{
    await page.getByRole("link", {name : "Test Cases"}).click();
    await expect(page).toHaveURL("https://www.automationexercise.com/test_cases");
});

test("Verify products page and product detail page", async()=>{
    await page.getByRole("link", {name : " Products"}).click();
    await expect(page).toHaveURL("https://www.automationexercise.com/products");
    await expect(page.locator(".features_items")).toBeVisible();
    const productCards = page.getByRole("link", {name : " View Product"}).locator("../..");
    await page.getByRole("link", {name : " View Product"}).first().click();
    await expect(page.locator('section')).toMatchAriaSnapshot(`
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
      `);
});

test("Search product", async ()=>{
    await page.getByRole("link", {name : " Products"}).click();
    await expect(page).toHaveURL("https://www.automationexercise.com/products");
    await expect(page.locator(".features_items")).toBeVisible();
    const productCards = page.getByRole("link", {name : " View Product"}).locator("../../../..");
    const nameProduct = await productCards.first().getByRole("paragraph").nth(1).textContent();
    await page.getByRole("textbox", {name : "Search Product"}).fill(nameProduct);
    await page.locator("#submit_search").click();
    await expect(productCards).toHaveCount(1);
    await expect(productCards).toContainText(nameProduct);
});

test("Verify Subscription in home page", async ()=>{
    await expect(page.locator("#footer").getByRole("heading", {name : "Subscription"})).toBeVisible();
    await page.getByRole("textbox", {name : "Your email address"}).fill(process.env.AUTOMATIONEXERCISE_email);
    await page.locator('#subscribe').click();
    await expect(page.locator("#footer").getByText("You have been successfully subscribed!")).toContainText("You have been successfully subscribed!");
});

test("Verify subscription in cart page", async ()=>{
    await page.getByRole("link", {name : "Cart"}).click();
    await expect(page).toHaveURL("https://www.automationexercise.com/view_cart");
    await expect(page.locator("#footer").getByRole("heading", {name : "Subscription"})).toBeVisible();
    await page.getByRole("textbox", {name : "Your email address"}).fill(process.env.AUTOMATIONEXERCISE_email);
    await page.locator('#subscribe').click();
    await expect(page.locator("#footer").getByText("You have been successfully subscribed!")).toContainText("You have been successfully subscribed!");
});

test("Add products in Cart", async ()=>{
    await page.getByRole("link", {name : " Products"}).click();
    await expect(page).toHaveURL("https://www.automationexercise.com/products");
    await expect(page.locator(".features_items")).toBeVisible();
    const productCards = page.getByRole("link", {name : " View Product"}).locator("../../../..");
    const priceProduct1 = await productCards.first().getByRole("heading").nth(1).textContent();
    const nameProduct1 = await productCards.first().getByRole("paragraph").nth(1).textContent();
    await productCards.first().hover();
    await productCards.first().getByText("Add to cart").first().click();
    await dismissModalProductInCart();
    const priceProduct2 = await productCards.nth(1).getByRole("heading").nth(1).textContent();
    const nameProduct2 = await productCards.nth(1).getByRole("paragraph").nth(1).textContent();
    await productCards.nth(1).hover();  
    await productCards.nth(1).getByText("Add to cart").first().click();
    await dismissModalProductInCart();
    await page.getByRole("link", {name : "Cart"}).click();
    await expect(page.locator("tr")).toHaveCount(3);
    await expect(page.locator(".cart_description").filter({hasText : `${nameProduct1}`})).toContainText(`${nameProduct1}`);
    await expect(page.locator(".cart_description").filter({hasText : `${nameProduct2}`})).toContainText(`${nameProduct2}`);
    await expect(page.locator(".cart_price").filter({hasText : `${priceProduct1}`})).toContainText(`${priceProduct1}`);
    await expect(page.locator(".cart_price").filter({hasText : `${priceProduct2}`})).toContainText(`${priceProduct2}`);
    const quantityProduct1 = await page.locator(".cart_quantity").first().textContent();
    const quantityProduct2 = await page.locator(".cart_quantity").nth(1).textContent();
    const priceProduct1Split = (await (page.locator(".cart_price").first().textContent())).split(" ");
    const priceProduct2Split = (await (page.locator(".cart_price").nth(1).textContent())).split(" ");
    const priceProduct1cart = priceProduct1Split[1];
    const priceProduct2cart = priceProduct2Split[1];
    //to verify the business logic
    const total1 = (Number(priceProduct1cart) * Number(quantityProduct1)).toString();
    const total2 = (Number(priceProduct2cart) * Number(quantityProduct2)).toString();
    await expect(page.locator(".cart_quantity").first()).toContainText("1");
    await expect(page.locator(".cart_quantity").nth(1)).toContainText("1");
    await expect.soft(page.locator(".cart_total").first()).toContainText(`Rs. ${total1}`);
    await expect.soft(page.locator(".cart_total").nth(1)).toContainText(`Rs. ${total2}`);
});

test("Verify Product quantity in Cart", async ()=>{
    await page.getByRole("link", {name : " Products"}).click();
    await expect(page).toHaveURL("https://www.automationexercise.com/products");
    await expect(page.locator(".features_items")).toBeVisible();
    await page.getByRole("link", {name : " View Product"}).first().click();
    await page.getByRole("spinbutton").fill("4");
    await page.getByRole('button', { name: ' Add to cart' }).click();
    await dismissModalProductInCart();
    await page.getByRole("link", {name : "Cart"}).click();
    await expect(page.locator(".cart_quantity").first()).toContainText("4");
});

test("Place order: Register while checkout", async ()=>{
    const productCards = page.getByRole("link", {name : " View Product"}).locator("../../../..");
    await productCards.first().hover();
    await productCards.first().getByText("Add to cart").first().click();
    await dismissModalProductInCart();
    await page.getByRole("link", {name : "Cart"}).click();
    await page.getByText("Proceed To Checkout").click();
    await page.getByRole('link', { name: 'Register / Login' }).click();
    await expect(page.getByRole("heading", {name : "New User Signup!"})).toBeVisible();
    const SignupForm = page.locator(".signup-form");
    await SignupForm.getByPlaceholder("Name").fill("John Doe");
    await SignupForm.getByPlaceholder("Email Address").fill(`fake52@gmail.com`);
    await SignupForm.getByRole("button", {name : "Signup"}).click();
    await expect(page).toHaveURL("https://www.automationexercise.com/signup");
    await expect(page.getByText("Enter Account Information")).toBeVisible();
    await page.getByRole("radio", {name : " Mr. "}).click();
    await page.getByRole("textbox", {name : "password"}).fill("Password123");
    await page.locator("#days").selectOption({value : "4"});
    await page.locator("#months").selectOption({value : "2"});
    await page.locator("#years").selectOption({value : "2000"});
    await page.getByRole("checkbox", {name : "Sign up for our newsletter!"});
    await page.getByLabel("First name ").fill("John");
    await page.getByLabel("Last name ").fill("Doe");
    await page.getByLabel("Company").first().fill("Google");
    await page.getByRole("textbox", {name : "Address * (Street address, P."}).fill("Google");
    await page.getByRole("combobox", {name : "Country"}).selectOption({value : "Canada"});
    await page.getByRole("textbox", {name : "State"}).fill("Quebec");
    await page.getByRole("textbox", {name : "City"}).fill("Montreal");
    await page.locator('#zipcode').fill("213456");
    await page.getByRole("textbox", {name : "Mobile Number"}).fill("0123456789");
    await page.getByRole("button", {name : "Create Account"}).click();
    await expect(page.getByText("Account created!")).toBeVisible();
    await page.getByRole("link", {name : "Continue"}).click();
    await expect(page.getByText("Logged in as")).toHaveText(/Logged in as \w+/);
    await page.getByRole("link", {name : "Cart"}).first().click();
    await page.getByText("Proceed To Checkout").click();
    const yourDeliveryAddressList = await page.getByRole("list").filter({has : page.getByRole("heading", {name : "Your delivery address"}) });
    await expect (yourDeliveryAddressList.getByRole("listitem").nth(1)).toContainText("Mr. John Doe");
    await expect (yourDeliveryAddressList.getByRole("listitem").nth(2)).toContainText("Google");
    await expect (yourDeliveryAddressList.getByRole("listitem").nth(3)).toContainText("Google");
    await expect (yourDeliveryAddressList.getByRole("listitem").nth(5)).toContainText("Montreal Quebec 213456");
    await expect (yourDeliveryAddressList.getByRole("listitem").nth(6)).toContainText("Canada");
    await expect (yourDeliveryAddressList.getByRole("listitem").nth(7)).toContainText("0123456789");
    const yourBillingAddressList = await page.getByRole("list").filter({has : page.getByRole("heading", {name : "Your delivery address"}) });
    await expect (yourBillingAddressList.getByRole("listitem").nth(1)).toContainText("Mr. John Doe");
    await expect (yourBillingAddressList.getByRole("listitem").nth(2)).toContainText("Google");
    await expect (yourBillingAddressList.getByRole("listitem").nth(3)).toContainText("Google");
    await expect (yourBillingAddressList.getByRole("listitem").nth(5)).toContainText("Montreal Quebec 213456");
    await expect (yourBillingAddressList.getByRole("listitem").nth(6)).toContainText("Canada");
    await expect (yourBillingAddressList.getByRole("listitem").nth(7)).toContainText("0123456789");
    await page.getByRole("textbox").first().fill("testing checkout");
    await page.getByRole("link", {name : "Place Order"}).click();
    await expect(page).toHaveURL("https://www.automationexercise.com/payment");
    await page.getByRole("textbox").first().fill("1234567897654");
    await page.getByRole("textbox").nth(1).fill("John Doe");
    await page.getByRole("textbox", {name : "ex. 311"}).fill("312");
    await page.getByRole("textbox", {name : "MM"}).fill("12");
    await page.getByRole("textbox", {name : "YY"}).fill("2032");
    await page.getByRole("button", {name : "Pay and Confirm Order"}).click();
    await expect(page.getByRole("heading", {name : "ORDER PLACED!"})).toBeVisible();
    await expect(page.getByRole("paragraph").filter({hasText : "Congratulations! Your order has been confirmed!"})).toBeVisible();
    await page.getByRole("link", {name : " Delete Account"}).click();
    await expect(page.getByText("Account Deleted!")).toBeVisible();
    await page.getByRole("link", {name : "Continue"}).click();
});

test("Place order: Register before checkout", async ()=> {
    await page.getByRole("link", {name : " Signup / Login"}).click();
    await expect(page.getByRole("heading", {name : "New User Signup!"})).toBeVisible();
    const SignupForm = page.locator(".signup-form");
    await SignupForm.getByPlaceholder("Name").fill("John Doe");
    await SignupForm.getByPlaceholder("Email Address").fill(`fake52@gmail.com`);
    await SignupForm.getByRole("button", {name : "Signup"}).click();
    await expect(page).toHaveURL("https://www.automationexercise.com/signup");
    await expect(page.getByText("Enter Account Information")).toBeVisible();
    await page.getByRole("radio", {name : " Mr. "}).click();
    await page.getByRole("textbox", {name : "password"}).fill("Password123");
    await page.locator("#days").selectOption({value : "4"});
    await page.locator("#months").selectOption({value : "2"});
    await page.locator("#years").selectOption({value : "2000"});
    await page.getByRole("checkbox", {name : "Sign up for our newsletter!"});
    await page.getByLabel("First name ").fill("John");
    await page.getByLabel("Last name ").fill("Doe");
    await page.getByLabel("Company").first().fill("Google");
    await page.getByRole("textbox", {name : "Address * (Street address, P."}).fill("Google");
    await page.getByRole("combobox", {name : "Country"}).selectOption({value : "Canada"});
    await page.getByRole("textbox", {name : "State"}).fill("Quebec");
    await page.getByRole("textbox", {name : "City"}).fill("Montreal");
    await page.locator('#zipcode').fill("213456");
    await page.getByRole("textbox", {name : "Mobile Number"}).fill("0123456789");
    await page.getByRole("button", {name : "Create Account"}).click();
    await expect(page.getByText("Account created!")).toBeVisible();
    await page.getByRole("link", {name : "Continue"}).click();
    await expect(page.getByText("Logged in as")).toHaveText(/Logged in as \w+/);
    const productCards = page.getByRole("link", {name : " View Product"}).locator("../../../..");
    await productCards.first().hover();
    await productCards.first().getByText("Add to cart").first().click();
    await dismissModalProductInCart();
    await page.getByRole("link", {name : "Cart"}).click();
    await page.getByText("Proceed To Checkout").click();
    const yourDeliveryAddressList = await page.getByRole("list").filter({has : page.getByRole("heading", {name : "Your delivery address"}) });
    await expect (yourDeliveryAddressList.getByRole("listitem").nth(1)).toContainText("Mr. John Doe");
    await expect (yourDeliveryAddressList.getByRole("listitem").nth(2)).toContainText("Google");
    await expect (yourDeliveryAddressList.getByRole("listitem").nth(3)).toContainText("Google");
    await expect (yourDeliveryAddressList.getByRole("listitem").nth(5)).toContainText("Montreal Quebec 213456");
    await expect (yourDeliveryAddressList.getByRole("listitem").nth(6)).toContainText("Canada");
    await expect (yourDeliveryAddressList.getByRole("listitem").nth(7)).toContainText("0123456789");
    const yourBillingAddressList = await page.getByRole("list").filter({has : page.getByRole("heading", {name : "Your delivery address"}) });
    await expect (yourBillingAddressList.getByRole("listitem").nth(1)).toContainText("Mr. John Doe");
    await expect (yourBillingAddressList.getByRole("listitem").nth(2)).toContainText("Google");
    await expect (yourBillingAddressList.getByRole("listitem").nth(3)).toContainText("Google");
    await expect (yourBillingAddressList.getByRole("listitem").nth(5)).toContainText("Montreal Quebec 213456");
    await expect (yourBillingAddressList.getByRole("listitem").nth(6)).toContainText("Canada");
    await expect (yourBillingAddressList.getByRole("listitem").nth(7)).toContainText("0123456789");
    await page.getByRole("textbox").first().fill("testing checkout");
    await page.getByRole("link", {name : "Place Order"}).click();
    await expect(page).toHaveURL("https://www.automationexercise.com/payment");
    await page.getByRole("textbox").first().fill("1234567897654");
    await page.getByRole("textbox").nth(1).fill("John Doe");
    await page.getByRole("textbox", {name : "ex. 311"}).fill("312");
    await page.getByRole("textbox", {name : "MM"}).fill("12");
    await page.getByRole("textbox", {name : "YY"}).fill("2032");
    await page.getByRole("button", {name : "Pay and Confirm Order"}).click();
    await expect(page.getByRole("heading", {name : "ORDER PLACED!"})).toBeVisible();
    await expect(page.getByRole("paragraph").filter({hasText : "Congratulations! Your order has been confirmed!"})).toBeVisible();
    await page.getByRole("link", {name : " Delete Account"}).click();
    await expect(page.getByText("Account Deleted!")).toBeVisible();
    await page.getByRole("link", {name : "Continue"}).click();
});

test("Place order: Login before checkout", async ()=>{
    await page.getByRole("link", {name : " Signup / Login"}).click();
    await expect(page.getByRole("heading", {name : "Login to your account"})).toBeVisible();
    const loginFormLocator = page.locator(".login-form");
    await loginFormLocator.getByPlaceholder("Email Address").fill(`${process.env.AUTOMATIONEXERCISE_email}`);
    await loginFormLocator.getByPlaceholder("Password").fill(`${process.env.AUTOMATIONEXERCISE_password}`);
    await loginFormLocator.getByRole("button", {name : "Login"}).click();
    await expect(page.getByText("Logged in as")).toHaveText(/Logged in as \w+/);
    const productCards = page.getByRole("link", {name : " View Product"}).locator("../../../..");
    await productCards.first().hover();
    await productCards.first().getByText("Add to cart").first().click();
    await dismissModalProductInCart();
    await page.getByRole("link", {name : "Cart"}).click();
    await page.getByText("Proceed To Checkout").click();
    const yourDeliveryAddressList = await page.getByRole("list").filter({has : page.getByRole("heading", {name : "Your delivery address"}) });
    await expect (yourDeliveryAddressList.getByRole("listitem").nth(1)).toContainText("Mr. John Doe");
    await expect (yourDeliveryAddressList.getByRole("listitem").nth(2)).toContainText("Google");
    await expect (yourDeliveryAddressList.getByRole("listitem").nth(3)).toContainText("Google");
    await expect (yourDeliveryAddressList.getByRole("listitem").nth(5)).toContainText("Montreal Quebec 213456");
    await expect (yourDeliveryAddressList.getByRole("listitem").nth(6)).toContainText("Canada");
    await expect (yourDeliveryAddressList.getByRole("listitem").nth(7)).toContainText("0123456789");
    const yourBillingAddressList = await page.getByRole("list").filter({has : page.getByRole("heading", {name : "Your delivery address"}) });
    await expect (yourBillingAddressList.getByRole("listitem").nth(1)).toContainText("Mr. John Doe");
    await expect (yourBillingAddressList.getByRole("listitem").nth(2)).toContainText("Google");
    await expect (yourBillingAddressList.getByRole("listitem").nth(3)).toContainText("Google");
    await expect (yourBillingAddressList.getByRole("listitem").nth(5)).toContainText("Montreal Quebec 213456");
    await expect (yourBillingAddressList.getByRole("listitem").nth(6)).toContainText("Canada");
    await expect (yourBillingAddressList.getByRole("listitem").nth(7)).toContainText("0123456789");
    await page.getByRole("textbox").first().fill("testing checkout");
    await page.getByRole("link", {name : "Place Order"}).click();
    await expect(page).toHaveURL("https://www.automationexercise.com/payment");
    await page.getByRole("textbox").first().fill("1234567897654");
    await page.getByRole("textbox").nth(1).fill("John Doe");
    await page.getByRole("textbox", {name : "ex. 311"}).fill("312");
    await page.getByRole("textbox", {name : "MM"}).fill("12");
    await page.getByRole("textbox", {name : "YY"}).fill("2032");
    await page.getByRole("button", {name : "Pay and Confirm Order"}).click();
    await expect(page.getByRole("heading", {name : "ORDER PLACED!"})).toBeVisible();
    await expect(page.getByRole("paragraph").filter({hasText : "Congratulations! Your order has been confirmed!"})).toBeVisible();
    await page.locator('.cart_quantity_delete')
});
test("Remove product from cart", async ()=>{
    const productCards = page.getByRole("link", {name : " View Product"}).locator("../../../..");
    const priceProduct1 = await productCards.first().getByRole("heading").nth(1).textContent();
    const nameProduct1 = await productCards.first().getByRole("paragraph").nth(1).textContent();
    await productCards.first().hover();
    await productCards.first().getByText("Add to cart").first().click();
    await dismissModalProductInCart();
    await page.getByRole("link", {name : "Cart"}).click();
    await expect(page.locator("tr")).toHaveCount(2);
    await expect(page.locator(".cart_description").filter({hasText : `${nameProduct1}`})).toContainText(`${nameProduct1}`);
    await expect(page.locator(".cart_price").filter({hasText : `${priceProduct1}`})).toContainText(`${priceProduct1}`);
    await page.locator('.cart_quantity_delete').first().click()
    await expect(page.locator(".cart_description").filter({hasText : `${nameProduct1}`})).toHaveCount(0);
    await expect(page.locator('#cart_items')).toMatchAriaSnapshot(`
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
      `);
});

test("View category product", async()=>{
    await page.getByRole('link', { name: ' Women' }).click();
    await page.getByRole('link', { name: 'Tops' }).click();
    await expect(page.getByRole("heading", {name : "WOMEN - TOPS PRODUCTS"})).toBeVisible();
    await expect(page.locator('section')).toMatchAriaSnapshot(`
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
      `);
    await page.getByRole('link', { name: ' Men' }).click();
    await page.getByRole('link', { name: 'Jeans', exact: true }).click();
    await expect(page.locator('section')).toContainText('Men - Jeans Products');
    await expect(page.locator('section')).toMatchAriaSnapshot(`
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
      `);
});