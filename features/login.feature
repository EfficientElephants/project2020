#login.feature
Feature: Login testing
The user should navigate to the login page to test their ability to log in.

  @SuccessfulLogin
  Scenario: @The user logs in successfully.
    Given I am on the login page
    When I type in a username
    And I type in a password
    And I click on the login button
    Then I should navigate to the dashboard page