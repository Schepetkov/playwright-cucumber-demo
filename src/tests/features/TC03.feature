Feature: TC03
    @positive
    Scenario: Verify user can submit the from
        Given Go to url
        Then Navigate to 'Forms'
        Then Click on 'Practice Form'
        Then Enter data in practice form
            | First Name | Last Name | Email         | Gender | Mobile     | Date of Birth | Month of Birth | Year of Birth | Subjects         | Hobbies | Current Address | State | City  |
            | Gerimedica | BV        | test@test.com | Male   | 0123456789 | 15            | January        | 1990          | Computer Science | Reading | Netherlangs     | NCR   | Delhi |
        And Validate data is practice form