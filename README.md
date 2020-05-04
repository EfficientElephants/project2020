# project2020 - Expense Elephant
This is a repository for Expense Elephant, the 2019-20 Luther College Senior Project by authors Maddie Kuehn, Anna Peterson, &amp; Anna Ruble. 

Expense Elephant is a budgeting app which can be used to track income, categorize and monitor spending, and set personal goals. As the user enters in their spending &amp; income, this project includes a dashboard with data visualizations of their monthly spending breakdown and the option to begin montly spending goals in a variety of categories. The user can also track their progress over time with the ability to see the history of their spending habits. 

## Getting Started / Workflow

The production version of this project is hosted on Azure, at [https://expense-elephant.azurewebsites.net/](https://expense-elephant.azurewebsites.net/), and this version can be accessed publicly there. The production version of this project tracks with the ```deploy``` branch. Pull requests to this branch should only come from the ```master``` branch.

This project also has a published beta site, also hosted on Azure, at [https://project-2020.azurewebsites.net/](https://project-2020.azurewebsites.net/), and this beta version can be accessed publicly. All general pull requests should first be submitted to our ```master``` branch and then tested in this hosted beta version on Azure before being merged into the production 'Expense Elephant' site via the ```deploy``` branch. This is to ensure that changes made locally are also able to successfully be deployed to Azure to eliminate breaking changes to our hosted application.

To run this project on localhost, clone down this repository see the directions below.

### Prerequisites

This project is based on a MERN Stack, so for development, you will need to have Node.js and a node package installer to run it. We recommend NPM.

To confirm that you have Node installed on your computer, run the following command:
```
where node
```
You should see a path in your usr/local/bin appear. If you do not have Node.js installed, you can view Node documentation and do so [here](https://nodejs.org/en/download/).

NPM documentation/installation instructions can be found [here](https://www.npmjs.com/get-npm). 

### Installing

Once you have Node.js and NPM installed, the first thing you should do is clone down the repository and navigate to its directory.

``` git clone https://github.com/EfficientElephants/project2020.git ```

``` cd project2020 ```

Next, install the node modules/dependencies needed for the project with an NPM install: 

```npm install ```

Running this project locally also requires a database connection string to be stored in a .env file.

To start up the local server, run the following: 

```npm start```

## Testing

To test our project, we used a variety of different technologies.
* [Chai](https://www.chaijs.com/) - Javascript assertion library used in concurrency with MochaJS
* [Mocha](https://mochajs.org/) - Javascript testing framework for asynchronous testing, browser support, and test coverage reports
* [Travis CI](https://travis-ci.org/) - Testing and continuous integration tool
* [CodeCov](https://codecov.io/) - Audits & generates reports of code covered by unit tests
* [Selenium](https://www.selenium.dev/) - Front-end browser testing framework
* [Cucumber](https://cucumber.io/) - Pairs with Selenium as a front-end browser testing framework

### Unit Testing

To write unit tests, we use javascript's Mocha and Chai frameworks. Navigate to the ```test/``` directory and create a new file to write your unit tests. For contributors, it is expected that 90% of your code is covered by unit testing.

To run unit tests, enter the following command in your terminal:
```
npm test
```

### Automated UI Testing

We are utilizing Cucumber with Selenium and NodeJS for our testing automation for our front-end UI. Cucumber is a behavior-driven development testing framework, which we decided to use as it is clear and easy to understand, allows us to evaluate the logic in our testing and other scenarios quickly and efficiently should something fail, and it is effective.

These tests are stored in the [project2020-automation](https://github.com/EfficientElephants/project2020-automation) repository in the EfficientElephants organization. To write a new scenario, please include step definitions and a feature file contributed to the automation repository. 

To run automated testing, add a .env file with LambdaTest access credentials and enter the following command into your terminal.
```
$ SCENARIO={filename.feature} npm run scenario
```
Check out the [project2020-automation README](https://github.com/EfficientElephants/project2020-automation/blob/master/README.md) for more technical documentation, testing, and contributing instructions.

## Deployment

When a change is pushed to the master branch, it will automatically sync with our deployment center in Azure and will then be pushed into production on the live beta version of the application website (see the Workflow section above).

After a successful test in the hosted beta application and the beta changes have been merged into the ```deploy``` branch, the changes will be deployed out to the production "alpha" version of the app. These changes will also automatically sync in the deployment center in Azure.

## Built With

* [MongoDB](https://www.mongodb.com/) - Database hosting
* [ExpressJS](https://expressjs.com/) - Javascript API & Server framework
* [React](https://reactjs.org/) - Javascript framework for flexible front-end design and implementation
* [NodeJS](https://nodejs.org/en/) - Javascript framework for web server hosting and other core functionalities

## Contributing

To contribute, please make a new branch from master to implement changes. Then create a pull request for merging to master and the changes will be reviewed by our CI tool, testing frameworks, and our team before merging into our beta application. If it runs successfully on our beta application, then a pull request can be submitted from the ```master``` branch to the ```deploy``` branch, where more build verification checks and manual approvals will be needed before it can be merged into the alpha production version of the application.
