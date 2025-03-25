-- Create the HI database if it doesn't exist
CREATE DATABASE IF NOT EXISTS HI;

-- Use the HI database
USE HI;

-- Create the subscriptors table with the specified fields
CREATE TABLE IF NOT EXISTS subscriptors (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Fecha_Alta DATETIME NOT NULL,
    Nombre VARCHAR(100) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    Status ENUM('Active', 'Inactive', 'Unsubscribed') NOT NULL DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create an index on the Email field for faster lookups
CREATE INDEX idx_email ON subscriptors(Email);

-- Create an index on the Status field to quickly filter by subscription status
CREATE INDEX idx_status ON subscriptors(Status);

-- Optional: Add sample data for testing
-- INSERT INTO subscriptors (Fecha_Alta, Nombre, Email, Status) 
-- VALUES (NOW(), 'John Doe', 'john.doe@example.com', 'Active');
