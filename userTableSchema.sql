CREATE TABLE(
    id SERIAL PRIMARY KEY,
    username VARCHAR(25) UNIQUE NOT NULL,
    password VARCHAR(50) NOT NULL,
    created_on TIMESTAMP NOT NULL,
    last_login TIMESTAMP 
);