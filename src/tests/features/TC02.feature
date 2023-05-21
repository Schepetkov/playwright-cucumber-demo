Feature: TC02
    @positive
    Scenario: Verify broken image
        Given Go to url
        Then Navigate to 'Elements'
        Then Click on 'Broken Links - Images'
        #always fail, because the image is broken
        And Validate image is not broken