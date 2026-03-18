import { test, expect, Page, BrowserContext } from "@playwright/test";
import testData from "../utils/universityGradeTestData.json"

let webContext: BrowserContext;
let page : Page;
test.describe.configure({mode: "serial"});

test.beforeAll(async({browser})=>{
    webContext = await browser.newContext();
    page = await webContext.newPage();
    await page.goto("https://exercises.test-design.org/university-grade/");
});

test.afterEach(async()=>{
    await page.getByRole("spinbutton").first().fill("");
    await page.getByRole("spinbutton").nth(1).fill("");
    await page.getByRole("spinbutton").last().fill("");
});

test.afterAll(async()=>{
    await page.getByRole("button", {name:"Show my result"}).click()
    console.log(await page.locator('[data-harmony-id="Missing test"]').allTextContents())
    console.log(await page.locator('[data-harmony-id="result"]').allTextContents())
});

testData.forEach(data => {
    test(`Paid vacation day calculator${data.testName}`, async()=>{
        const expectedGrade: string = data.input.result;
        await page.getByRole("link", {name:"GPT algorithm"}).waitFor();
        await page.getByRole("spinbutton").first().fill(data.input.BE);
        await page.getByRole("spinbutton").nth(1).fill(data.input.LE);
        await page.getByRole("spinbutton").last().fill(data.input.WP);
        await page.getByRole("button", {name:"Calculate result"}).click({timeout: 5000});
        const courseResult: string = await page.locator("[data-harmony-id='cours result']").textContent();
        await expect(courseResult).toBe(expectedGrade);
    });
});