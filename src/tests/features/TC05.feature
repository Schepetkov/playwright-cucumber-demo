Feature: TC05
    @positive
    Scenario: Verify the tooltip
        Given Go to url
        Then Navigate to 'Widgets'
        Then Click on 'Tool Tips'
        Then Hover on 'Hover me to see' button and validate text tooltip