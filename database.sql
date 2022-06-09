CREATE DATABASE CBT;

CREATE TABLE user(
    user_id SERIAL PRIMARY KEY AUTOINCREMENT,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    password TEXT NOT NULL,
    examnumber INTEGER(255) NOT NULL UNIQUE,
    UNIQUE (email)
);