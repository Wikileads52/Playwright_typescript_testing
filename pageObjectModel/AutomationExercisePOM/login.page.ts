import { Locator, Page, expect } from "@playwright/test";


export class loginPage{

    page: Page;
    signupForm : Locator;
    loginForm : Locator;
    userSignupHeading : Locator;
    userSignupName : Locator;
    userSignupEmail : Locator;
    userSignupButton : Locator;
    userSignupErrorMessage : Locator;
    userLoginHeading : Locator;
    userLoginEmail : Locator;
    userLoginPassword : Locator;
    userLoginButton : Locator;
    userLoginErrorMessage : Locator;

    constructor(page : Page){
        this.page = page;
        this.signupForm = this.page.locator(".signup-form");
        this.loginForm = this.page.locator(".login-form");
        this.userSignupHeading = this.page.getByRole("heading", {name : "New User Signup!"});
        this.userSignupName = this.signupForm.getByPlaceholder("Name");
        this.userSignupEmail = this.signupForm.getByPlaceholder("Email Address");
        this.userSignupButton = this.signupForm.getByRole("button", {name : "Signup"});
        this.userSignupErrorMessage = this.signupForm.getByRole("paragraph");
        this.userLoginHeading = this.page.getByRole("heading", {name : "Login to your account"});
        this.userLoginEmail = this.loginForm.getByPlaceholder("Email Address");
        this.userLoginPassword = this.loginForm.getByPlaceholder("Password");
        this.userLoginButton = this.loginForm.getByRole("button", {name : "Login"});
        this.userLoginErrorMessage = this.loginForm.getByRole("paragraph");
    };

    async userLogin(email, password)
    {
        await this.userLoginEmail.fill(email);
        await this.userLoginPassword.fill(password);
        await this.userLoginButton.click();
    };

    async beginUserRegistration(name, email)
    {
        await this.userSignupName.fill(name);
        await this.userSignupEmail.fill(email);
        await this.userSignupButton.click();
    };
};