Feature: Booking tickets
    Scenario: Booking 1 ticket
        Given user is on page
        When user booking 1 ticket
        Then user see qr code
    Scenario: Booking 3 tickets
        Given user is on page
        When user booking 3 ticket
        Then user see 3 places in booking data
    Scenario: Booking 3 tickets
        Given user is on page
        When user try to booking ticket on disabled time
        Then user failed booking