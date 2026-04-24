import {Locator, Page, expect} from "@playwright/test";
import { faker } from "@faker-js/faker";
import { error } from "node:console";

export class contactUsPage{

    page : Page;
    contactUsPageTitle : Locator;
    contactUsFormLocator : Locator;
    contactUsName : Locator;
    contactUsEmail : Locator;
    contactUsSubject : Locator;
    contactUsTextEntry : Locator;
    contactUsSubmitButton : Locator;
    contactUsSuccessMessage : Locator;

    constructor(page : Page){
        this.page = page;
        this.contactUsPageTitle = this.page.getByRole("heading", {name : " Contact us"});
        this.contactUsFormLocator = this.page.locator(".contact-form").nth(1);
        this.contactUsName = this.contactUsFormLocator.getByRole("textbox", { name: "Name" });
        this.contactUsEmail = this.contactUsFormLocator.getByPlaceholder("Email");
        this.contactUsSubject = this.contactUsFormLocator.getByRole('textbox', { name: 'Subject' });
        this.contactUsTextEntry = this.contactUsFormLocator.getByRole('textbox', { name: 'Your Message Here' });
        this.contactUsSubmitButton = this.page.getByRole('button', { name: 'Submit' });
        this.contactUsSuccessMessage = this.page.locator(".status");
    }

    async fillContactUsForm()
    {
        await this.contactUsName.fill(faker.person.fullName());
        await this.contactUsEmail.fill(`${process.env.AUTOMATIONEXERCISE_email}`);
        await this.contactUsSubject.fill("testing");
        await this.contactUsTextEntry.fill("testing here and waiting");
        try {
        this.page.on('dialog', async dialog => {
                await expect(dialog.message()).toContain("Press OK to proceed!");
                dialog.accept()
            });
        await this.contactUsSubmitButton.click();
        }
        catch(error){
              console.log("The modal did not appear")
        }
    };
};