// @SuccessfulLogin
// Scenario: @The user logs in successfully.
//   Given I am on the login page
//   When I type in a {username}
//   And I type in a {password}
//   And I click on the login button
//   Then I should navigate to the dashboard page

const { Given, When, Then, AfterAll } = require('cucumber');
const { Builder, By, Capabilities, Key } = require('selenium-webdriver');
const { expect } = require('chai');

require("chromedriver");

// driver setup
const capabilities = Capabilities.chrome();
capabilities.set('chromeOptions', { "w3c": false });
const driver = new Builder().withCapabilities(capabilities).build();

Given('I am on the login page', async function () {
    await driver.get('http://localhost:3000/#');
    //await driver.get('https://project-2020.azurewebsites.net/#/');
});

When('I type in a {username}', async function (username) {
    const element = await driver.findElement(By.id('emailInput'));
    element.sendKeys(username, Key.TAB);
    //element.submit();
});

And('I type in a {password}', async function (password) {
    const element = await driver.findElement(By.id('passwordInput'));
    element.sendKeys(password);
    //element.submit();
});

And('I click on the login button', async function () {
    const element = await driver.findElement(By.id('login'));
    element.sendKeys(Key.RETURN);
    element.submit();
});

Then('I should navigate to the dashboard page and see {verifyName}', {timeout: 60 * 1000}, async function (verifyName) {
    const welcomeMsg = await driver.findElement(By.id('welcome'));
    //assert that welcome message displays the account name
    const isTitleStartWithCheese = welcomeMsg.toLowerCase().lastIndexOf(`${searchTerm}`, 0) === 0;
    expect(isTitleStartWithCheese).to.equal(true);
});

AfterAll('end', async function(){
    await driver.quit();
});

/////////////////////////////////////////////////////////////////

// var assert = require("assert");
// var webdriver = require("selenium-webdriver");
// require("geckodriver");
// var chrome = require('selenium-webdriver/chrome');
// var path = require('chromedriver').path;
// const serverUri = "http://localhost:3000/#";
// const appTitle = "Expense Elephant";
// var service = new chrome.ServiceBuilder(path).build();
// chrome.setDefaultService(service);
//  
// var browser = new webdriver.Builder()
//     .withCapabilities(webdriver.Capabilities.chrome())
//     .build();
//  
// /**
//  * Config for Chrome browser
//  * @type {webdriver}
//  */
//  
// function logTitle() {
//     return new Promise((resolve, reject) => {
//      browser.getTitle().then(function(title) {
//       resolve(title);
//      });
//     });
//    }
//  
// it("The user is on the log in page", function () {
//     browser.get(serverUri)
//     browser.findElement({ xpath: '//*[@id="emailInput"]' }).click().then(function() {
//    
//     return new Promise((resolve, reject) => {
//         browser
//          
//          .then(logTitle)
//          .then(title => {
//           assert.equal(title, appTitle);
//           resolve();
//          })
//          .catch(err => reject(err));
//        });
//     });
// });

// // return this.driver.findElement({ xpath: '//*[@id="passwordInput"]' }).click().setAttribute("text", "automation-test");
// // return this.driver.findElement({ xpath: '//*[@id="login"]' }).click();
// // this.driver.findElement({ xpath: '//*[@id="welcome"]' }).then(function (id) {
// //     assert.equal(id, "Welcome back, Automated Testing!");
// //     return title;

// function insertCredentials() {
//     return new Promise((resolve, reject) => {
//         browser.findElement({ xpath: '//*[@id="emailInput"]' }).setAttribute("text","cucumber@test.com")
//         browser.findElement({ xpath: '//*[@id="passwordInput"]' }).click().setAttribute("text", "automation-test");
// })
// }
//  
// it("The user is on the log in page", function () {
//         browser.get(serverUri)
//         browser.findElement({ xpath: '//*[@id="emailInput"]' }).click().setAttribute('cucumber@test.com')
//     .then(function() {
//        
//         return new Promise((resolve, reject) => {
//             browser
//              
//              .then(insertCredentials)
//              .then(title => {
//               assert.equal(title, appTitle);
//               resolve();
//              })
//              .catch(err => reject(err));
//            });
//         });
//     });