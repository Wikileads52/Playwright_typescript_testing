import { Locator, Page, expect } from "@playwright/test";


export class registrationPage{

    page : Page;
    registrationPageTitle : Locator;
    MrRadioButton : Locator;
    passwordLocator : Locator;
    daysLocator : Locator;
    monthsLocator : Locator;
    yearsLocator : Locator;
    newsletterCheckbox : Locator;
    firstNameLocator : Locator;
    lastNameLocator : Locator;
    companyLocator : Locator;
    address1Locator : Locator;
    countryLocator : Locator;
    stateLocator : Locator;
    cityLocator : Locator;
    zipcodeLocator : Locator;
    mobileNumberLocator : Locator;
    createAccountButton : Locator;
    creationValidationText : Locator;
    continueLinkLocator : Locator;


    constructor(page : Page)
    {
        this.page = page;
        this.registrationPageTitle = this.page.getByText("Enter Account Information");
        this.MrRadioButton = this.page.getByRole("radio", {name : " Mr. "});
        this.passwordLocator = this.page.getByRole("textbox", {name : "password"});
        this.daysLocator = this.page.locator("#days");
        this.monthsLocator = this.page.locator("#months");
        this.yearsLocator = this.page.locator("#years");
        this.newsletterCheckbox = this.page.getByRole("checkbox", {name : "Sign up for our newsletter!"});
        this.firstNameLocator = this.page.getByLabel("First name ");
        this.lastNameLocator = this.page.getByLabel("Last name ");
        this.companyLocator = this.page.getByLabel("Company").first();
        this.address1Locator  = this.page.getByRole("textbox", {name : "Address * (Street address, P."});
        this.countryLocator = this.page.getByRole("combobox", {name : "Country"});
        this.stateLocator = this.page.getByRole("textbox", {name : "State"});
        this.cityLocator = this.page.getByRole("textbox", {name : "City"});
        this.zipcodeLocator = this.page.locator('#zipcode');
        this.mobileNumberLocator = this.page.getByRole("textbox", {name : "Mobile Number"});
        this.createAccountButton = this.page.getByRole("button", {name : "Create Account"});
        this.creationValidationText = this.page.getByText("Account created!");
        this.continueLinkLocator = this.page.getByRole("link", {name : "Continue"});
    }

    async registerationNewUser(){
        await this.MrRadioButton.click();
        await this.passwordLocator.fill("Password123");
        await this.daysLocator.selectOption({value : "4"});
        await this.monthsLocator.selectOption({value : "2"});
        await this.yearsLocator.selectOption({value : "2000"});
        await this.newsletterCheckbox.click();
        await this.firstNameLocator.fill("John");
        await this.lastNameLocator.fill("Doe");
        await this.companyLocator.fill("Google");
        await this.address1Locator.fill("Google");
        await this.countryLocator.selectOption({value : "Canada"});
        await this.stateLocator.fill("Quebec");
        await this.cityLocator.fill("Montreal");
        await this.zipcodeLocator.fill("213456");
        await this.mobileNumberLocator.fill("0123456789");
        await this.createAccountButton.click();
    };


};