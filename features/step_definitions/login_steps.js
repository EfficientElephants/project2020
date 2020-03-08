const { Given, When, Then } = require('cucumber');
const assert = require('assert');
//const { driver } = require('../support/web_driver');
//const { driver } = require('../support/web_driver')
//const { By } = require('selenium-webdriver')

//const url = "http://localhost:3000/#/"
//const url = "https://project-2020.azurewebsites.net/"

module.exports = function () {
    this.Given(/^I am on the login page$/, async function () {
        //return driver.get(url);
        return await this.driver.get("http://localhost:3000/#/");
    });

    this.When(/^I type in a username$/, async function () {
        return this.driver.findElement({ xpath: '//*[@id="emailInput"]' }).click().setAttribute("text", "cucumber@test.com");
    });

    this.When(/^I type in a password$/, async function () {
        //return this.driver.findElement({ xpath: '//*[@id="passwordInput"]' }).click().setAttribute("text", process.env.automationPass);
        return this.driver.findElement({ xpath: '//*[@id="passwordInput"]' }).click().setAttribute("text", "automation-test");
    });

    this.When(/^I click on the login button$/, async function () {
        return this.driver.findElement({ xpath: '//*[@id="login"]' }).click();
    });

    // this.And(/^I should see Google in title$/, function() {
    //     this.driver.getTitle().then(function (title) {
    //       assert.equal(title, "Google");
    //       return title;

    this.Then(/^I should navigate to the dashboard page$/, async function () {
        this.driver.findElement({ xpath: '//*[@id="welcome"]' }).then(function (id) {
            assert.equal(id, "Welcome back, Automated Testing!");
            return title;
        })
    });
};