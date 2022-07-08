Feature: Booking tickets
    Scenario: Booking 1 ticket
        Given user is on "http://qamid.tmweb.ru/client/index.php"
        When user booking 1 ticket
        Then user see qr code
    Scenario: Booking 3 tickets
        Given user is on "http://qamid.tmweb.ru/client/index.php"
        When user booking 3 ticket
        Then user see 3 places in booking data
    Scenario: Fail booking, because all chairs are taken
        Given user is on "http://qamid.tmweb.ru/client/index.php"
        When user try to booking ticket
        Then user failed booking because all chairs are taken