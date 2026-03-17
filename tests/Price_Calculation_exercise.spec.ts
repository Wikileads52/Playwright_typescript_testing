import { test, expect, Page, BrowserContext } from "@playwright/test";
import TestData from "../utils/testCard.json"


let webContext: BrowserContext;
let page : Page;
test.describe.configure({mode: "serial"});

test.beforeAll(async({browser})=>{
    webContext = await browser.newContext();
    page = await webContext.newPage();
    await page.goto("https://exercises.test-design.org/price-calculation/");
});

TestData.forEach(data => {
    test(`Cart price calculations ${data.testName}`, async()=>{
        const expectedPrice: string = data.input.expectedPrice;
        await page.getByRole("textbox").first().waitFor({timeout: 5000});
        await page.getByRole("textbox").first().fill(data.input.Price);
        await page.getByRole("textbox").last().fill(data.input.Weight);
        await page.getByRole("checkbox").setChecked(data.input.creditCard);
        await page.getByRole("button", {name:"Next test"}).click({timeout: 5000});
        const totalPrice: string = await page.locator("[data-harmony-id='Total price']").textContent();
        await expect(totalPrice).toBe(expectedPrice);
    });
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