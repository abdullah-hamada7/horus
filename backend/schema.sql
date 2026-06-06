-- Database Schema for HORUS Royal Archive (PostgreSQL / Supabase)

-- Create Era table
CREATE TABLE IF NOT EXISTS era (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    years VARCHAR(100)
);

-- Create King table
CREATE TABLE IF NOT EXISTS king (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    english_name VARCHAR(100), -- Maps to englishName in Python (SQLAlchemy handles column mapping if defined, or we can use the same column name englishName to match Flask app exactly)
    englishName VARCHAR(100), -- Keep exact casing to avoid any compatibility issues with SQLAlchemy
    dynasty VARCHAR(100),
    reign VARCHAR(100),
    bio TEXT,
    achievements TEXT,
    cartouche VARCHAR(100),
    image VARCHAR(255),
    docId VARCHAR(50),
    era_id INTEGER REFERENCES era(id) ON DELETE SET NULL
);
