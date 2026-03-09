Feature: Login Page
    As a user
    I want to log in to the application
    So that I can access my account
    Background: Navigate
        Given the application is running

    @here
    Scenario: Successful login with valid credentials
        Given I am on the login page
        When I enter valid username "user123" and password "pass123"
        And I click the login button
        Then I should be redirected to the dashboard page
