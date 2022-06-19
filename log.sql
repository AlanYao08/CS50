-- Keep a log of any SQL queries you execute as you solve the mystery.

-- Find description of crime
SELECT description FROM crime_scene_reports
WHERE month = 7 AND day = 28 AND year = 2021 AND street = "Humphrey Street";
-- Theft of the CS50 duck took place at 10:15am at the Humphrey Street bakery. Interviews were conducted today with three witnesses who were present at the time – each of their interview transcripts mentions the bakery.

-- Read interview transcripts
SELECT transcript FROM interviews
WHERE month = 7 AND day = 28 AND year = 2021 AND transcript LIKE "%bakery%";

-- First interview
-- Sometime within ten minutes of the theft, I saw the thief get into a car in the bakery parking lot and drive away. If you have security footage from the bakery parking lot, you might want to look for cars that left the parking lot in that time frame.

-- Read security footage
SELECT name FROM people
JOIN bakery_security_logs ON bakery_security_logs.license_plate = people.license_plate
WHERE month = 7 AND day = 28 AND year = 2021 AND hour = 10 AND minute >= 5 AND minute <= 25 AND activity = "exit";
-- Vanessa, Bruce, Barry, Luca, Sofia, Iman, Diana, Kelsey

-- Second interview
-- I don't know the thief's name, but it was someone I recognized. Earlier this morning, before I arrived at Emma's bakery, I was walking by the ATM on Leggett Street and saw the thief there withdrawing some money.
SELECT name FROM people
JOIN bank_accounts ON bank_accounts.person_id = people.id
JOIN atm_transactions ON atm_transactions.account_number = bank_accounts.account_number
WHERE month = 7 AND day = 28 AND year = 2021 AND transaction_type = "withdraw" AND atm_location = "Leggett Street";
-- Bruce, Diana, Brooke, Kenny, Iman, Luca, Taylor, Benista
-- Common suspects: Bruce, Luca, Iman, Diana

-- Third interview
-- As the thief was leaving the bakery, they called someone who talked to them for less than a minute. In the call, I heard the thief say that they were planning to take the earliest flight out of Fiftyville tomorrow. The thief then asked the person on the other end of the phone to purchase the flight ticket.
SELECT name FROM people
JOIN passengers ON passengers.passport_number = people.passport_number
WHERE passengers.flight_id = (
    SELECT id FROM flights
    WHERE month = 7 AND day = 29 AND year = 2021 AND origin_airport_id = (
        SELECT id FROM airports WHERE city = "Fiftyville")
    ORDER BY hour, minute
    LIMIT 1);
-- Doris, Sofia, Bruce, Edward, Kelsey, Taylor, Kenny, Luca
-- Common suspects: Bruce, Luca

-- Find phone calls
SELECT name FROM people
JOIN phone_calls ON phone_calls.caller = people.phone_number
WHERE month = 7 AND day = 28 AND year = 2021 AND duration < 60;
-- Sofia, Kelsey, Bruce, Kelsey, Taylor, Diana, Carina, Kenny, Benista
-- Thief: Bruce

-- Find flight
SELECT city FROM airports
WHERE id = (SELECT destination_airport_id FROM flights
    WHERE month = 7 AND day = 29 AND year = 2021 AND origin_airport_id = (
        SELECT id FROM airports WHERE city = "Fiftyville")
    ORDER BY hour, minute
    LIMIT 1);
-- Destination: New York City

-- Accomplice
SELECT name FROM people
WHERE phone_number = (
    SELECT receiver FROM phone_calls
    WHERE month = 7 AND day = 28 AND year = 2021 AND duration < 60 AND caller = (
        SELECT phone_number FROM people WHERE name = "Bruce"));
-- Accomplice: Robin