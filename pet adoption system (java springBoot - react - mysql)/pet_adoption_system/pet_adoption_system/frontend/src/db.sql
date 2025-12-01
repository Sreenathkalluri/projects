-- Create database
CREATE DATABASE IF NOT EXISTS pet_adoption_db;
USE pet_adoption_db;

-- Table: users
CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    gmail VARCHAR(255) NOT NULL,
    role ENUM('customer', 'petManager') DEFAULT 'customer'
);

-- Table: adoption_requests
CREATE TABLE IF NOT EXISTS adoption_requests (
    request_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    adopter_name VARCHAR(255),
    email VARCHAR(255),
    mobile VARCHAR(255),
    address VARCHAR(255),
    pet_type VARCHAR(255),
    pet_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'Pending',
    accepted BIT(1)
);

-- Table: dog
CREATE TABLE IF NOT EXISTS dog (
    id INT NOT NULL PRIMARY KEY,
    age INT NOT NULL,
    available BIT(1) NOT NULL,
    breed VARCHAR(255),
    image VARCHAR(255),
    name VARCHAR(255)
);

-- Table: cat
CREATE TABLE IF NOT EXISTS cat (
    id INT NOT NULL PRIMARY KEY,
    name VARCHAR(255),
    age INT,
    breed VARCHAR(255),
    image VARCHAR(255),
    available TINYINT(1) DEFAULT 1
);

-- Table: fish
CREATE TABLE IF NOT EXISTS fish (
    id INT NOT NULL PRIMARY KEY,
    name VARCHAR(255),
    age INT,
    species VARCHAR(255),
    image VARCHAR(255),
    available TINYINT(1) DEFAULT 1
);

-- Table: hamster
CREATE TABLE IF NOT EXISTS hamster (
    id INT NOT NULL PRIMARY KEY,
    age INT NOT NULL,
    available BIT(1) NOT NULL,
    breed VARCHAR(255),
    image VARCHAR(255),
    name VARCHAR(255)
);
