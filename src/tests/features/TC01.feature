Feature: TC01
    Background:
        Given Go to url
        Then Navigate to 'Elements'
        Then Click on 'Web Tables'

    @positive
    Scenario: Scenario A - Verify user can enter new data into the table
        Then Click on 'Add' button
        Then Enter below inupt field
            | First Name | Last Name | Age | Email         | Salary | Department |
            | Alden      | Cantrell  | 30  | test@test.com | 12345  | QA         |
        Then Click on 'Submit' button
        And Validate user data in web table

    @positive
    Scenario: Scenario B - Verify user can edit the row in a table
        Then Click on edit icon in the row of the web table that contains firsname 'Alden'
        Then Enter below inupt field
            | First Name | Last Name |
            | Test       | BV        |
        Then Click on 'Submit' button
        And Validate changed user data in web table