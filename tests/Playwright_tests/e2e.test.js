const { test, describe, beforeEach, afterEach, beforeAll, afterAll, expect } = require('@playwright/test');
const { chromium } = require('playwright');

const host = 'http://localhost:3000'; // Application host (NOT service host - that can be anything)

let browser;
let context;
let page;

let user = {
    email : "",
    password : "123456",
    confirmPass : "123456",
};

describe("e2e tests", () => {
    beforeAll(async () => {
        browser = await chromium.launch();
    });

    afterAll(async () => {
        await browser.close();
    });

    beforeEach(async () => {
        context = await browser.newContext();
        page = await context.newPage();
    });

    afterEach(async () => {
        await page.close();
        await context.close();
    });

    
    describe("authentication", () => {
        test("register makes correct api call", async () => {
            //arrange
            await page.goto(host);
            await page.click("text=Register");
            await page.waitForSelector('form');
            let random = Math.floor(Math.random()*10000);
            user.email = `abv${random}@abv.bg`;

            //act
            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);
            await page.locator('#repeatPassword').fill(user.confirmPass);
            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes("/users/register") && response.status() == 200),
                page.click('[type="submit"]')
            ])
            let userData = await response.json();

            //assert
            await expect(response.ok()).toBeTruthy();
            expect(userData.email).toBe(user.email);
            expect(userData.password).toBe(user.password);
        })

        test("login makes correct API call", async()=>{
            //arrange
            await page.goto(host);
            await page.click('text=Login');
            await page.waitForSelector('form');

            //act
            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);
            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes("/users/login") && response.status() == 200),
                page.click('[type="submit"]')
            ])
            let userData = await response.json();


            //assert
            await expect(response.ok()).toBeTruthy();
            expect(userData.email).toBe(user.email);
            expect(userData.password).toBe(user.password);
        })

        test('logout makes correct api call', async () => {
            //arrange
            await page.goto(host);
            await page.click('text=Login');
            await page.waitForSelector('form');
            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);
            await page.click('[type="submit"]');

            //act 
            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes("/users/logout") && response.status() == 204 ),
                page.click('nav >> text=Logout')
            ])

            expect(response.ok()).toBeTruthy();
            await page.waitForSelector('nav >> text=Login')
            expect(page.url()).toBe(host + '/');
        })
    });

    describe("navbar", () => {
        test("logged user should see correct navigation buttons", async()=>{
            //arrange
            await page.goto(host);

            //act
            await page.click('text=Login');
            await page.waitForSelector('form');
            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);
            await page.click('[type="submit"]');

            //assert
            await expect(page.locator('nav >> text=Theater')).toBeVisible();
            await expect(page.locator('nav >> text=Create Event')).toBeVisible();
            await expect(page.locator('nav >> text=Profile')).toBeVisible();
            await expect(page.locator('nav >> text=Logout')).toBeVisible();
            await expect(page.locator('nav >> text=Login')).toBeHidden();
            await expect(page.locator('nav >> text=Register')).toBeHidden();
        })

        test("guest user should see correct navigation buttons", async ()=>{
            //act
            await page.goto(host);

            //assert
            await expect(page.locator('nav >> text=Theater')).toBeVisible();
            await expect(page.locator('nav >> text=Create Event')).toBeHidden();
            await expect(page.locator('nav >> text=Profile')).toBeHidden();
            await expect(page.locator('nav >> text=Logout')).toBeHidden();
            await expect(page.locator('nav >> text=Login')).toBeVisible();
            await expect(page.locator('nav >> text=Register')).toBeVisible();
        })
    });

    describe("CRUD", () => {
        beforeEach(async () =>{
            await page.goto(host);
            await page.click('text=Login');
            await page.waitForSelector('form');
            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);
            await page.click('[type="submit"]');
        })

        test('Create makes correct API call', async()=>{
            //arrange
            await page.click('nav >> text=Create Event');
            await page.waitForSelector("form");

            //act
            await page.fill("#title", "Random title");
            await page.fill("#date", "Random date");
            await page.fill("#author", "Random author");
            await page.fill("#description", "Random description");
            await page.fill("#imageUrl", "/images/Moulin-Rouge!-The-Musical.jpg");
            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes("/data/theaters") && response.status() == 200 ),
                page.click('[type="submit"]')
            ]);
            let eventData = await response.json();

            //assert
            expect(response.ok()).toBeTruthy();
            expect(eventData.title).toEqual("Random title");
            expect(eventData.author).toEqual("Random author");
            expect(eventData.date).toEqual("Random date");
            expect(eventData.description).toEqual("Random description");
            expect(eventData.imageUrl).toEqual("/images/Moulin-Rouge!-The-Musical.jpg");
        })

        test('edit makes correct API call', async () => {
            //arrange
            await page.click("nav >> text=Profile");
            await page.locator("text=Details").first().click();
            await page.click("text=Edit");
            await page.waitForSelector('form');

            //act
            await page.fill("#title", "Random edited_title");
            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes("/data/theaters") && response.status() == 200 ),
                page.click('[type="submit"]')
            ]);
            let eventData = await response.json();

            //assert
            expect(response.ok()).toBeTruthy();
            expect(eventData.title).toEqual("Random edited_title");
            expect(eventData.author).toEqual("Random author");
            expect(eventData.date).toEqual("Random date");
            expect(eventData.description).toEqual("Random description");
            expect(eventData.imageUrl).toEqual("/images/Moulin-Rouge!-The-Musical.jpg");
        })

        test("delete makes correct API call", async()=>{
            //arrange
            await page.click("nav >> text=Profile");
            await page.locator("text=Details").first().click();

            //act
            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes("/data/theaters") && response.status() == 200 ),
                page.on('dialog', dialog => dialog.accept()),
                page.click('text=delete')
            ]);

            //assert
            expect(response.ok()).toBeTruthy();
        })
    })
})