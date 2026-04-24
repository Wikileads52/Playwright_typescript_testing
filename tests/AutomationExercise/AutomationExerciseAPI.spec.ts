import { test, expect, request } from "@playwright/test";
import { faker } from "@faker-js/faker";

test("@AutomationExerciseAPI GET product list", async ({request}) =>{
    const response = await request.get("https://automationexercise.com/api/productsList");
    const listProducts = await response.json();
    console.log(listProducts);
    expect(listProducts.responseCode).toBe(200)
});

test("@AutomationExerciseAPI POST to all products list failure", async ({request})=>{
    const response = await request.post("https://automationexercise.com/api/productsList",
        {
            data : {
                products: [
                    {
                        id : "44",
                        name : "Chainmail Shirt",
                        price : "Rs. 2000",
                        brand : "H&M",
                        category : [Object]
                    }
                ]
            }
        }
    );
    const body = await response.json();
    expect(body.responseCode).toBe(405)
    expect(body.message).toBe("This request method is not supported.");
});

test("@AutomationExerciseAPI GET all brands list", async ({request})=>{
    const response = await request.get("https://automationexercise.com/api/brandsList");
    const body = await response.json();
    console.log(body.brands.length)
});

test(" @AutomationExerciseAPI PUT to all brands list", async({request})=>{
    const response = await request.put("https://automationexercise.com/api/brandsList");
    const body = await response.json();
    console.log(body);
    expect(body.responseCode).toBe(405);
    expect(body.message).toBe("This request method is not supported.");
});

test("@AutomationExerciseAPI POST To Search Product", async({request})=>{
    const response = await request.post("https://automationexercise.com/api/searchProduct",
        {form: 
            {search_product: 'jeans'}
        },);
    const body = await response.json();
    console.log(body);
    expect(body.responseCode).toBe(200);
});

test("@AutomationExerciseAPI POST To Search Product without search_product parameter", async({request})=>{
    const reponse = await request.post("https://automationexercise.com/api/searchProduct");
    const body = await reponse.json();
    expect(body.responseCode).toBe(400)
})

test("@AutomationExerciseAPI POST To Verify Login with valid details", async({request})=>{
    const response = await request.post("https://automationexercise.com/api/verifyLogin",
        {form :
            {
            email : `${process.env.AUTOMATIONEXERCISE_email}`,
            password : `${process.env.AUTOMATIONEXERCISE_password}`
        }
    },
    );
    const body = await response.json()
    console.log(body);
    expect(body.responseCode).toBe(200);
    expect(body.message).toBe("User exists!")
});

test("@AutomationExerciseAPI POST To Verify Login without email parameter", async ({request})=>{
    const response = await request.post("https://automationexercise.com/api/verifyLogin",
        {form :
            {
            email :"",
            password : `${process.env.AUTOMATIONEXERCISE_password}`
        }
    },
    );
    const body = await response.json()
    console.log(body);
    expect(body.responseCode).toBe(404);
    expect(body.message).toBe("User not found!")
});

test.describe.serial("@AutomationExerciseAPI Create and delete user account", () =>{
    let credentials : {email : string, password : string};
    async function createRandomUser(request){
        const email = faker.internet.email();
        const password = faker.internet.password();
        const response = await request.post("https://automationexercise.com/api/createAccount",
            {
                form: {
                    name : faker.person.fullName(),
                    email : email,
                    password: password,
                    title: faker.person.prefix(),
                    birth_date : "12",
                    birth_month : faker.date.month(),
                    birth_year : "2000",
                    firstname : faker.person.firstName(),
                    lastname : faker.person.lastName(),
                    company : faker.company.name(),
                    address1 : faker.location.streetAddress(),
                    country : "Canada",
                    zipcode : faker.location.zipCode(),
                    state : faker.location.state(),
                    city : faker.location.city(),
                    mobile_number : faker.phone.number({style: 'human'})
                }
            }
        );
    const body = await response.json()
    console.log(body);
    return{email, password}
    };
    test("POST To Create/Register User Account", async ({request}) => {
        
        credentials = await createRandomUser(request);
        console.log(credentials);
    });

    test("DELETE METHOD To Delete User Account", async({request})=>{
        const response = await request.delete("https://automationexercise.com/api/deleteAccount",
            {
                form:{
                    email : `${credentials.email}`,
                    password : `${credentials.password}`
                }
            }
        )
    const body = await response.json();
    console.log(body)
    expect(body.responseCode).toBe(200);
    expect(body.message).toBe("Account deleted!")
    });
});

test("@AutomationExerciseAPI PUT METHOD To Update User Account", async({request})=>{
    const response = await request.put("https://automationexercise.com/api/updateAccount",
        {form:{
            name : faker.person.fullName(),
                    email : `${process.env.AUTOMATIONEXERCISE_email}`,
                    password : `${process.env.AUTOMATIONEXERCISE_password}`,
                    title: faker.person.prefix('male'),
                    birth_date : "12",
                    birth_month : faker.date.month(),
                    birth_year : "2000",
                    firstname : faker.person.firstName(),
                    lastname : faker.person.lastName(),
                    company : faker.company.name(),
                    address1 : faker.location.streetAddress(),
                    country : "Canada",
                    zipcode : faker.location.zipCode(),
                    state : faker.location.state(),
                    city : faker.location.city(),
                    mobile_number : faker.phone.number({style: 'human'})
        }
        }
    ); 
    const body = await response.json();
    console.log(body)
    expect(body.responseCode).toBe(200);
    expect(body.message).toBe("User updated!")
});



test("@AutomationExerciseAPI PUT METHOD To Update User faker42", async({request})=>{
    const response = await request.put("https://automationexercise.com/api/updateAccount",
        {form:{
            name : faker.person.fullName(),
                    email : `${process.env.AUTOMATIONEXERCISE_email}`,
                    password : `${process.env.AUTOMATIONEXERCISE_password}`,
                    title: "Mr",
                    birth_date : "12",
                    birth_month : faker.date.month(),
                    birth_year : "2000",
                    firstname : "John",
                    lastname : "Doe",
                    company : "Google",
                    address1 : "Google",
                    country : "Canada",
                    zipcode : "213456",
                    state : "Quebec",
                    city : "Montreal",
                    mobile_number : "0123456789"
        }
        }
    ); 
    const body = await response.json();
    console.log(body)
    expect(body.responseCode).toBe(200);
    expect(body.message).toBe("User updated!")
});


test("@AutomationExerciseAPI GET user account detail by email", async ({request}) =>{
    const response = await request.get("https://automationexercise.com/api/getUserDetailByEmail",
        {params:{
                email : `${process.env.AUTOMATIONEXERCISE_email}`}
});
    const body = await response.json();
    console.log(body);
    expect(body.responseCode).toBe(200);
});