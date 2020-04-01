@SuccessfulLogin
Scenario: @The user logs in successfully.
  Given I am on the login page
  When I type in "test@test.com"
  And I type in "test"
  And I click on the login button
  Then I should navigate to the dashboard page