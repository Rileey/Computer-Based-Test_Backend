CREATE DATABASE CBT;

CREATE TABLE user(
    user_id BIGSERIAL PRIMARY KEY,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    examnumber INTEGER(255) NOT NULL UNIQUE,
    UNIQUE (email)
);