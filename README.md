# project2020 - Expense Elephant
This is a repository for Expense Elephant, the 2019-20 Luther College Senior Project by authors Maddie Kuehn, Anna Peterson, &amp; Anna Ruble. 

Expense Elephant is a budgeting app which can be used to track income, categorize and monitor spending, and set personal goals. As the user enters in their spending &amp; income, this project includes a dashboard with data visualizations of their monthly spending breakdown and the option to begin montly spending goals in a variety of categories. The user can also track their progress over time with the ability to see the history of their spending habits. 

## Getting Started

This project is hosted on Azure, at [https://project-2020.azurewebsites.net/](https://project-2020.azurewebsites.net/), and can be accessed publicly there.

To run this project on localhost, clone down this repository.

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
* Chai(https://www.chaijs.com/)
* Mocha(https://mochajs.org/)
* Travis CI(https://travis-ci.org/)
* CodeCov(https://codecov.io/)
* Selenium(https://www.selenium.dev/)
* Cucumber(https://cucumber.io/)

### Unit Testing

To write unit tests, we use javascript's Mocha and Chai frameworks. Navigate to the test/ directory and create a new file in the models/ subdirectory to write your unit tests. For contributors, it is expected that 90% of your code is covered by unit testing.

To run unit tests, enter the following command in your terminal:
```
npm test
```

### Automated UI Testing

For our automated user interface testing framework, we use Selenium paired with Cucumber, Gherkin, and Ruby. These tests are stored in the features/ file of this project. 

To write a new scenario, please include step definitions and a feature file. 

To run automated testing, enter the following command into your terminal.
```
npm test-automation
```

## Deployment

When a change is pushed to the master branch, it will sync with our deployment center in Azure and will be pushed into production on the live website.

## Built With

* [MongoDB](https://www.mongodb.com/)
* [ExpressJS](https://expressjs.com/)
* [React](https://reactjs.org/)
* [NodeJS](https://nodejs.org/en/)

## Contributing

To contribute, please make a new branch from master to implement changes. Then create a pull request for merging to master and the changes will be reviewed by our CI tool, testing frameworks, and our team before merging.