import { test, expect, Page, Locator } from "@playwright/test";

test("Proton rocket image visible", async ({page})=>{
    await page.goto("https://demos.bellatrix.solutions/blog/");
    const isLoaded = await page.locator('[data-href="/wiki/File:Proton_Zvezda_crop.jpg"]')
    .evaluate(img => { 
        const image = img as HTMLImageElement
        return image.complete && image.naturalWidth > 0});
        expect(isLoaded).toBe(false);
});
