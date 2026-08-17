-- =========================================================
-- SecurePass - Password Strength & Security Analyzer
-- Database Setup
-- =========================================================

-- Create Database
CREATE DATABASE IF NOT EXISTS securepass_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE securepass_db;


-- =========================================================
-- TABLE 1: users
-- Stores registered user information
-- =========================================================

CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(150) NOT NULL UNIQUE,

    password VARCHAR(255) NOT NULL,

    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',

    status ENUM('active', 'blocked') NOT NULL DEFAULT 'active',

    last_login DATETIME NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);


-- =========================================================
-- TABLE 2: password_analysis
-- Stores password analysis results.
-- IMPORTANT:
-- Raw passwords are NEVER stored in this table.
-- =========================================================

CREATE TABLE IF NOT EXISTS password_analysis (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id INT UNSIGNED NOT NULL,

    score DECIMAL(5,2) NOT NULL DEFAULT 0.00,

    strength ENUM(
        'Very Weak',
        'Weak',
        'Medium',
        'Strong',
        'Very Strong'
    ) NOT NULL,

    password_length SMALLINT UNSIGNED NOT NULL,

    entropy DECIMAL(10,2) NOT NULL DEFAULT 0.00,

    has_uppercase BOOLEAN NOT NULL DEFAULT FALSE,

    has_lowercase BOOLEAN NOT NULL DEFAULT FALSE,

    has_number BOOLEAN NOT NULL DEFAULT FALSE,

    has_special_character BOOLEAN NOT NULL DEFAULT FALSE,

    common_password BOOLEAN NOT NULL DEFAULT FALSE,

    pattern_risk BOOLEAN NOT NULL DEFAULT FALSE,

    analysis_summary TEXT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_analysis_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- =========================================================
-- TABLE 3: security_logs
-- Stores security-related activities.
-- =========================================================

CREATE TABLE IF NOT EXISTS security_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id INT UNSIGNED NULL,

    action VARCHAR(100) NOT NULL,

    description VARCHAR(500) NULL,

    ip_address VARCHAR(45) NULL,

    user_agent VARCHAR(500) NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_security_log_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);


-- =========================================================
-- INDEXES
-- =========================================================

CREATE INDEX idx_users_role
ON users(role);

CREATE INDEX idx_users_status
ON users(status);

CREATE INDEX idx_analysis_user
ON password_analysis(user_id);

CREATE INDEX idx_analysis_created
ON password_analysis(created_at);

CREATE INDEX idx_security_logs_user
ON security_logs(user_id);

CREATE INDEX idx_security_logs_created
ON security_logs(created_at);

CREATE INDEX idx_security_logs_action
ON security_logs(action);