import { test, expect, Page, BrowserContext } from "@playwright/test"
import testData from "../utils/paidVacationCalculator.json"

let webContext: BrowserContext;
let page : Page;
test.describe.configure({mode: "serial"});

test.beforeAll(async({browser})=>{
    webContext = await browser.newContext();
    page = await webContext.newPage();
    await page.goto("https://exercises.test-design.org/paid-vacation-days/");
});

test.afterEach(async()=>{
    await page.getByRole("spinbutton").first().fill("");
    await page.getByRole("spinbutton").last().fill("");
});

test.afterAll(async()=>{
    await page.getByRole("button", {name:"Show my result"}).click()
    console.log(await page.locator('[data-harmony-id="Missing test"]').allTextContents())
    console.log(await page.locator('[data-harmony-id="result"]').allTextContents())
});
testData.forEach(data => {
    test(`Paid vacation day calculator${data.testName}`, async()=>{
        const expectedDays: string = data.input.expectedDays;
        await page.getByRole("link", {name:"GPT algorithm"}).waitFor();
        await page.getByRole("spinbutton").first().fill(data.input.age);
        await page.getByRole("spinbutton").last().fill(data.input.yearsOfService);
        await page.getByRole("button", {name:"Next test"}).click({timeout: 5000});
        const paidVacationDays: string = await page.locator("[data-harmony-id='Vacation days']").textContent();
        await expect(paidVacationDays).toBe(expectedDays);
});
});