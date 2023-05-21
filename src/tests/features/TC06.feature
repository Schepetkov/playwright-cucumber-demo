Feature: TC06
    @positive
    Scenario: Verify user can drag and drop
        Given Go to url
        Then Navigate to 'Interactions'
        Then Click on 'Droppable'
        Then Drag the Drag Me box to Drop Here area
        And Validate darg and drop actions