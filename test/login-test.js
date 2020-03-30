// const webdriver = require('selenium-webdriver'),
//     By = webdriver.By,
//     until = webdriver.until;

// const driver = new webdriver.Builder()
//     .forBrowser('chrome')
//     .build();

// driver.get('http://localhost:3000/#');

// // driver.findElement(By.name('q')).sendKeys('webdriver');
// driver.findElement(By.xpath({ xpath: '//*[@id="emailInput"]' })).sendKeys('test@test.com');

// driver.sleep(1000).then(function() {
//   driver.findElement(By.name('q')).sendKeys(webdriver.Key.TAB);
// });

// driver.findElement(By.name('btnK')).click();

// driver.sleep(2000).then(function() {
//   driver.getTitle().then(function(title) {
//     if(title === 'webdriver - Google Search') {
//       console.log('Test passed');
//     } else {
//       console.log('Test failed');
//     }
//     driver.quit();
//   });
// });

// // //////////////////////////////////////////////////////////////////////////////////


// var assert = require('assert');
// var test = require('selenium-webdriver');
// var webdriver = require('selenium-webdriver');

// var driver;

// test.describe('Login', function() {
//     test.beforeEach(function(done) {
//         this.timeout(20000);
//         driver = new webdriver.Builder()
//                 .withCapabilities(webdriver.Capabilities.chrome()).build();
//         driver.get('http://localhost:3000/#');
//         done();
//     });

//     test.afterEach(function(done) {
//         driver.quit();
//         done();
//     });

//     test.it('Webpage should have expected title value', function(done) {
//         var promise = driver.getTitle();
//         promise.then(function(title) {
//             assert.equal(title, 'Expense Elephant');
//         });
//         done();
//     });
//})

// // //////////////////////////////////////////////////////////////////////////////////

var assert = require("assert");
var webdriver = require("selenium-webdriver");
require("geckodriver");
var chrome = require('selenium-webdriver/chrome');
var path = require('chromedriver').path;
const serverUri = "http://localhost:3000/#";
const appTitle = "Expense Elephant";
var service = new chrome.ServiceBuilder(path).build();
chrome.setDefaultService(service);
 
var browser = new webdriver.Builder()
    .withCapabilities(webdriver.Capabilities.chrome())
    .build();
 
/**
 * Config for Chrome browser
 * @type {webdriver}
 */
 
function logTitle() {
    return new Promise((resolve, reject) => {
     browser.getTitle().then(function(title) {
      resolve(title);
     });
    });
   }
 
it("The user is on the log in page", function () {
    browser.get(serverUri)
    browser.findElement({ xpath: '//*[@id="emailInput"]' }).click().then(function() {
   
    return new Promise((resolve, reject) => {
        browser
         
         .then(logTitle)
         .then(title => {
          assert.equal(title, appTitle);
          resolve();
         })
         .catch(err => reject(err));
       });
    });
});

// return this.driver.findElement({ xpath: '//*[@id="passwordInput"]' }).click().setAttribute("text", "automation-test");
// return this.driver.findElement({ xpath: '//*[@id="login"]' }).click();
// this.driver.findElement({ xpath: '//*[@id="welcome"]' }).then(function (id) {
//     assert.equal(id, "Welcome back, Automated Testing!");
//     return title;

function insertCredentials() {
    return new Promise((resolve, reject) => {
        browser.findElement({ xpath: '//*[@id="emailInput"]' }).setAttribute("text","cucumber@test.com")
        browser.findElement({ xpath: '//*[@id="passwordInput"]' }).click().setAttribute("text", "automation-test");
})
}
 
it("The user is on the log in page", function () {
        browser.get(serverUri)
        browser.findElement({ xpath: '//*[@id="emailInput"]' }).click().setAttribute('cucumber@test.com')
    .then(function() {
       
        return new Promise((resolve, reject) => {
            browser
             
             .then(insertCredentials)
             .then(title => {
              assert.equal(title, appTitle);
              resolve();
             })
             .catch(err => reject(err));
           });
        });
    });