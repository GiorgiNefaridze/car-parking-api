CREATE DATABASE carparking;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(200) NOT NULL,
    lastname VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(200) NOT NULL,
    balance INTEGER NOT NULL DEFAULT 100,
    isAdministrator BOOLEAN NOT NULL DEFAULT false,
    UNIQUE (email)
);

CREATE TYPE type AS ENUM ('sedan','hatchback','crossover','cabriolet','compartment','minivan');

CREATE TABLE cars(
    car_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    number_plate VARCHAR(255) NOT NULL,
    car_type type,
    owner_id INT REFERENCES users(id),
    UNIQUE (number_plate)
);

CREATE TABLE parkingzone(
    parking_id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    address VARCHAR(255) NOT NULL,
    charge_per_hour INTEGER NOT NULL,
    owner_id INT REFERENCES users(id),
    UNIQUE(name,address)
);

CREATE TABLE bookingparking(
    booking_id SERIAL PRIMARY KEY,
    car_id INTEGER NOT NULL REFERENCES cars(car_id),
    owner_id INT REFERENCES users(id),
    parking_id INTEGER NOT NULL REFERENCES parkingzone(parking_id),
    UNIQUE(car_id,owner_id,parking_id)
);