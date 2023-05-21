Feature: TC04
    @positive
    Scenario: Verify the progress bar
        Given Go to url
        Then Navigate to 'Widgets'
        Then Click on 'Progress Bar'
        Then Click on 'Start' button
        And Validate progress bar