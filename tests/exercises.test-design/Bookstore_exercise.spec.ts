import { test, expect, Page, BrowserContext } from "@playwright/test"
import testData from "../../utils/exercises.test-design_TestData/testDataBookstore.json"

let webContext: BrowserContext;
let page : Page;
test.describe.configure({mode: "serial"});

test.beforeAll(async({browser})=>{
    webContext = await browser.newContext();
    page = await webContext.newPage();
    await page.goto("https://exercises.test-design.org/online-book-store/");
});

test.afterEach(async()=>{
    await page.getByRole("textbox").first().fill("");
    await page.getByRole("textbox").last().fill("");
    await page.getByRole("checkbox").setChecked(false);
});

test.afterAll(async()=>{
    await page.getByRole("button", {name:"Show my result"}).click()
    console.log(await page.locator('[data-harmony-id="Missing test"]').allTextContents())
    console.log(await page.locator('[data-harmony-id="result"]').allTextContents())
});
for(const data of testData){
test(`Online book store ${data.testName}`, async()=>{
    const expectedPrice: string = data.input.expectedPrice;
    await page.getByRole("link", {name:"GPT algorithm"}).waitFor();
    await page.getByRole("textbox").first().fill(data.input.newBookPrice);
    await page.getByRole("textbox").last().fill(data.input.oldBookPrice);
    await page.getByRole("checkbox").setChecked(data.input.VIPCustomer);
    await page.getByRole("button", {name:"Next test"}).click({timeout: 5000});
    const totalPrice: string = await page.locator("[data-harmony-id='Total price']").textContent();
    await expect(totalPrice).toBe(expectedPrice);
});
};