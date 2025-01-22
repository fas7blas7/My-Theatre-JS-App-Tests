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
            await page.goto(host);
            await page.click("text=Register");
            await page.waitForSelector('form');
            let random = Math.floor(Math.random() *10000);
            user.email = `user_email${random}@bv.bg`;

            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);
            await page.locator('#repeatPassword').fill(user.confirmPass);

            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes("/users/register") && response.status() == 200),
                page.click('[type="submit"]')
            ])
            let userData = await response.json();

            expect(response.ok()).toBeTruthy();
            expect(userData.email).toBe(user.email);
            expect(userData.password).toBe(user.password);
        })
        test ("User login makes correct api call", async () => {
            await page.goto(host);
            await page.click('text=Login');
            await page.waitForSelector('form');

            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);
            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes("/users/login") && response.status() == 200),
                page.click('[type="submit"]')
            ])
            let userData = await response.json();

            expect(response.ok()).toBeTruthy();
            expect(userData.email).toBe(user.email);
            expect(userData.password).toBe(user.password);
        })

        test ('logout makes correct api call', async () => {
            await page.goto(host);
            await page.click('text=Login');
            await page.waitForSelector('form');
            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);
            await page.click('[type="submit"]');
            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes("/users/logout") && response.status() == 204),
                page.click('nav >> text=Logout')
            ])
            expect(response.ok()).toBeTruthy();
            await page.waitForSelector('nav >> text=Login');
            expect(page.url()).toBe(host + '/');
        })
    });

    describe("navbar", () => {
        test('navigation for logged in user', async () => {
            await page.goto(host);
            await page.click('text=Login');
            await page.waitForSelector('form');
            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);
            await page.click('[type="submit"]');

            await expect(page.locator('nav >> text=Theater')).toBeVisible();
            await expect(page.locator('nav >> text=Create Event')).toBeVisible();
            await expect(page.locator('nav >> text=Profile')).toBeVisible();
            await expect(page.locator('nav >> text=Logout')).toBeVisible();
            await expect(page.locator('nav >> text=Login')).toBeHidden();
            await expect(page.locator('nav >> text=Register')).toBeHidden();
        })
        test('navigation for guest user', async()=>{
            await page.goto(host);
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
        
        test('create makes correct api call', async () => {
            await page.click('a[href="/create"]');
            await page.waitForSelector('form');
            await page.locator('#title').fill("random title");
            await page.locator('#date').fill("random date");
            await page.locator('#author').fill("random author");
            await page.locator('#description').fill("random description");
            await page.locator('#imageUrl').fill("C:\Users\skyli\Desktop\Exam Front End Test Automation 2\Task-2 Resources\images\To-kill-a-mockingbird.jpg");

            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes("/data/theaters") && response.status() == 200),
                page.click('[type="submit"]')
            ])
            let EventData = await response.json();

            expect(response.ok()).toBeTruthy();
            expect(EventData.title).toEqual("random title");
            expect(EventData.date).toEqual("random date");
            expect(EventData.author).toEqual("random author");
            expect(EventData.description).toEqual("random description");
            expect(EventData.imageUrl).toEqual("C:\Users\skyli\Desktop\Exam Front End Test Automation 2\Task-2 Resources\images\To-kill-a-mockingbird.jpg");
        })
        test('edit makes correct api call', async () => {
            await page.click('nav >> text=Profile');
            await page.locator('text=Details').first().click();
            await page.click('text=Edit');
            await page.waitForSelector('form');

            await page.fill('#description', "Edited description");
            await page.fill('#imageUrl', "https://media.entertainmentearth.com/assets/images/f9551447c87542f8bf84954fa811338flg.jpg");

            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes("/data/theaters") && response.status() == 200),
                page.click('[type="submit"]')
            ])
            let EventData = await response.json();

            expect(response.ok()).toBeTruthy;
            expect(EventData.title).toEqual("random title");
            expect(EventData.date).toEqual("random date");
            expect(EventData.author).toEqual("random author");
            expect(EventData.description).toEqual("Edited description");
            expect(EventData.imageUrl).toEqual("https://media.entertainmentearth.com/assets/images/f9551447c87542f8bf84954fa811338flg.jpg");
        })

        test('delete makes correct api call', async () => {
            await page.click('nav >> text=Profile');
            await page.locator('text=Details').first().click();

            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes("/data/theaters") && response.status() == 200),
                page.on('dialog', dialog => dialog.accept()),
                await page.click('text=Delete')
            ]);
            expect(response.ok()).toBeTruthy();
        })
    })
})