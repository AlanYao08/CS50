-- Keep a log of any SQL queries you execute as you solve the mystery.

-- Find description of crime
SELECT description
FROM crime_scene_reports
WHERE month = 7 AND day = 28 AND year = 2021
AND street = "Humphrey Street";
-- Theft of the CS50 duck took place at 10:15am at the Humphrey Street bakery. Interviews were conducted today with three witnesses who were present at the time – each of their interview transcripts mentions the bakery.

-- Read interview transcripts
SELECT transcript
FROM interviews
WHERE month = 7 AND day = 28 AND year = 2021;
-- As the thief was leaving the bakery, they called someone who talked to them for less than a minute. In the call, I heard the thief say that they were planning to take the earliest flight out of Fiftyville tomorrow. The thief then asked the person on the other end of the phone to purchase the flight ticket.
-- I don't know the thief's name, but it was someone I recognized. Earlier this morning, before I arrived at Emma's bakery, I was walking by the ATM on Leggett Street and saw the thief there withdrawing some money.
-- Sometime within ten minutes of the theft, I saw the thief get into a car in the bakery parking lot and drive away. If you have security footage from the bakery parking lot, you might want to look for cars that left the parking lot in that time frame.

-- Find phone calls
SELECT caller, receiver, duration
FROM phone_calls
WHERE month = 7 AND day = 28 AND year = 2021 AND duration < 60;
--(389) 555-5198

-- Find flight
SELECT hour, minute, id
FROM flights
WHERE month = 7 AND day = 29 AND year = 2021 AND origin_airport_id = (SELECT id FROM airports WHERE city = "Fiftyville");
-- Flight is id 36

-- Find passengers
SELECT passport_number
FROM passengers
WHERE flight_id = 36;
-- Passport 7214083635, 1695452385, 5773159633, 1540955065, 8294398571, 1988161715, 9878712108, 8496433585

-- Find atm transactions
SELECT account_number
FROM atm_transactions
WHERE month = 7 AND day = 28 AND year = 2021 AND transaction_type = "withdraw" AND atm_location = "Leggett Street";

SELECT person_id
FROM bank_accounts
WHERE account_number = (SELECT account_number FROM atm_transactions WHERE month = 7 AND day = 28 AND year = 2021 AND transaction_type = "withdraw" AND atm_location = "Leggett Street");

-- Read security footage
SELECT license_plate
FROM bakery_security_logs
WHERE month = 7 AND day = 28 AND year = 2021 AND hour = 10 AND minute >= 5 AND minute <= 25 AND activity = "exit";
-- License Plates 5P2BI95, 94KL13X, 6P58WS2, 4328GD8, G412CB7, L93JTIZ, 322W7JE, 0NTHK55

-- Find criminal
SELECT name
FROM people
WHERE passport_number IN (SELECT passport_number FROM passengers WHERE flight_id = 36)
AND license_plate IN (SELECT license_plate FROM bakery_security_logs WHERE month = 7 AND day = 28 AND year = 2021 AND hour = 10 AND minute >= 5 AND minute <= 25 AND activity = "exit")
AND phone_number IN (SELECT caller FROM phone_calls WHERE month = 7 AND day = 28 AND year = 2021 AND duration < 60)
AND id = 467400;
-- Luca