CREATE DATABASE carparking;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(200) NOT NULL,
    lastname VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(200) NOT NULL,
    UNIQUE (email)
);