Feature: Login

  Scenario: Valid Login
    Given user opens login page
    When user enters valid credentials
    Then dashboard should be visible

