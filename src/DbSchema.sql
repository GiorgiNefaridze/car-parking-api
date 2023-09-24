CREATE DATABASE carparking;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(200) NOT NULL,
    lastname VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(200) NOT NULL,
    UNIQUE (email)
);

CREATE TYPE type AS ENUM ('sedan','hatchback','crossover','cabriolet','compartment','minivan');

CREATE TABLE cars(
    car_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    number_plate VARCHAR(255) NOT NULL,
    car_type type,
    owner_id INT REFERENCES users(id)
);