-- Smart Campus System Database Creation Script
-- This script will be automatically executed when MySQL container starts

USE smart_campus;

-- ===== TABLE 1: STUDENT DATABASE =====
CREATE TABLE IF NOT EXISTS student (
    id INT AUTO_INCREMENT PRIMARY KEY,
    roll_no VARCHAR(50) UNIQUE NOT NULL AUTO_INCREMENT_ALIAS,
    fullname VARCHAR(100) NOT NULL,
    semester INT NOT NULL,
    phone_no VARCHAR(20),
    email VARCHAR(100),
    subject1 VARCHAR(100),
    subject2 VARCHAR(100),
    subject3 VARCHAR(100),
    subject4 VARCHAR(100),
    subject5 VARCHAR(100),
    subject6 VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_roll_no (roll_no),
    INDEX idx_semester (semester)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== TABLE 2: EXAM TABLE WITH COMPUTED COLUMNS =====
CREATE TABLE IF NOT EXISTS exam (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject1 INT DEFAULT 0,
    subject2 INT DEFAULT 0,
    subject3 INT DEFAULT 0,
    subject4 INT DEFAULT 0,
    subject5 INT DEFAULT 0,
    subject6 INT DEFAULT 0,
    total INT GENERATED ALWAYS AS (
        CAST(subject1 AS SIGNED) + 
        CAST(subject2 AS SIGNED) + 
        CAST(subject3 AS SIGNED) + 
        CAST(subject4 AS SIGNED) + 
        CAST(subject5 AS SIGNED) + 
        CAST(subject6 AS SIGNED)
    ) STORED,
    percentage DECIMAL(5,2) GENERATED ALWAYS AS (
        ROUND((
            CAST(subject1 AS SIGNED) + 
            CAST(subject2 AS SIGNED) + 
            CAST(subject3 AS SIGNED) + 
            CAST(subject4 AS SIGNED) + 
            CAST(subject5 AS SIGNED) + 
            CAST(subject6 AS SIGNED)
        ) / 600 * 100, 2)
    ) STORED,
    grade VARCHAR(2) GENERATED ALWAYS AS (
        CASE 
            WHEN (
                CAST(subject1 AS SIGNED) + 
                CAST(subject2 AS SIGNED) + 
                CAST(subject3 AS SIGNED) + 
                CAST(subject4 AS SIGNED) + 
                CAST(subject5 AS SIGNED) + 
                CAST(subject6 AS SIGNED)
            ) / 600 * 100 >= 80 THEN 'A'
            WHEN (
                CAST(subject1 AS SIGNED) + 
                CAST(subject2 AS SIGNED) + 
                CAST(subject3 AS SIGNED) + 
                CAST(subject4 AS SIGNED) + 
                CAST(subject5 AS SIGNED) + 
                CAST(subject6 AS SIGNED)
            ) / 600 * 100 >= 70 THEN 'B'
            WHEN (
                CAST(subject1 AS SIGNED) + 
                CAST(subject2 AS SIGNED) + 
                CAST(subject3 AS SIGNED) + 
                CAST(subject4 AS SIGNED) + 
                CAST(subject5 AS SIGNED) + 
                CAST(subject6 AS SIGNED)
            ) / 600 * 100 >= 60 THEN 'C'
            ELSE 'F'
        END
    ) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student(id) ON DELETE CASCADE,
    INDEX idx_student_id (student_id),
    INDEX idx_grade (grade)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== TABLE 3: ATTENDANCE & FINE TABLE =====
CREATE TABLE IF NOT EXISTS attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject1 INT DEFAULT 0,
    subject2 INT DEFAULT 0,
    subject3 INT DEFAULT 0,
    subject4 INT DEFAULT 0,
    subject5 INT DEFAULT 0,
    subject6 INT DEFAULT 0,
    dropout_subjects VARCHAR(500) GENERATED ALWAYS AS (
        CONCAT(
            IF(subject1 < 75, 'Subject1, ', ''),
            IF(subject2 < 75, 'Subject2, ', ''),
            IF(subject3 < 75, 'Subject3, ', ''),
            IF(subject4 < 75, 'Subject4, ', ''),
            IF(subject5 < 75, 'Subject5, ', ''),
            IF(subject6 < 75, 'Subject6', '')
        )
    ) STORED,
    total_fine INT GENERATED ALWAYS AS (
        (
            (IF(subject1 < 75, 1, 0)) +
            (IF(subject2 < 75, 1, 0)) +
            (IF(subject3 < 75, 1, 0)) +
            (IF(subject4 < 75, 1, 0)) +
            (IF(subject5 < 75, 1, 0)) +
            (IF(subject6 < 75, 1, 0))
        ) * 500
    ) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student(id) ON DELETE CASCADE,
    INDEX idx_student_id (student_id),
    INDEX idx_attendance (subject1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== CREATE INDEXES FOR PERFORMANCE =====
CREATE INDEX idx_student_roll ON student(roll_no);
CREATE INDEX idx_exam_total ON exam(total);
CREATE INDEX idx_attendance_fine ON attendance(total_fine);