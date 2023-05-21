Feature: API

    # I have some problem with https://demoqa.com/swagger/ - net::ERR_INTERNET_DISCONNECTED
    # It test cases will be example how will look implementation
    # It also can be use with data table
    @positive
    Scenario: Creation of user account
        Then Send account POST request and validate
