-- ====================================================================
-- SEED DATA SCRIPT FOR PGADMIN
-- Run this entire script in pgAdmin Query Tool (F5)
-- Database: mydatabase123
-- Default password for all sample users: Password123!
-- ====================================================================

-- 1. Ensure tables exist
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Ensure password_hash column is present
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(64) PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_title VARCHAR(150) NOT NULL,
    company VARCHAR(150) NOT NULL,
    location VARCHAR(150),
    job_type VARCHAR(50) CHECK (job_type IN ('Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance')),
    work_mode VARCHAR(50) CHECK (work_mode IN ('Remote', 'Hybrid', 'On-site')),
    salary_min INTEGER,
    salary_max INTEGER,
    currency VARCHAR(10) DEFAULT 'INR',
    qualification_required TEXT,
    skills_required TEXT,
    job_description TEXT,
    job_url TEXT,
    application_status VARCHAR(50) DEFAULT 'Saved' CHECK (application_status IN ('Saved', 'Applied', 'Interview', 'Technical Round', 'Offer', 'Rejected', 'Withdrawn')),
    application_date DATE,
    interview_date TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ====================================================================
-- 2. INSERT OR UPDATE SAMPLE USERS (Default Password: Password123!)
-- ====================================================================
INSERT INTO users (name, email, password_hash)
VALUES
    ('Aarav Sharma', 'aarav.sharma@example.com', '$2b$10$1y0DcNEviv0pYdakpvXZsuTPz8QJn9xHpHJ9J3iIprb5sML0L4jY.'),
    ('Priya Patel', 'priya.patel@example.com', '$2b$10$1y0DcNEviv0pYdakpvXZsuTPz8QJn9xHpHJ9J3iIprb5sML0L4jY.'),
    ('Rohan Verma', 'rohan.verma@example.com', '$2b$10$1y0DcNEviv0pYdakpvXZsuTPz8QJn9xHpHJ9J3iIprb5sML0L4jY.'),
    ('Sneha Iyer', 'sneha.iyer@example.com', '$2b$10$1y0DcNEviv0pYdakpvXZsuTPz8QJn9xHpHJ9J3iIprb5sML0L4jY.'),
    ('Vikram Malhotra', 'vikram.malhotra@example.com', '$2b$10$1y0DcNEviv0pYdakpvXZsuTPz8QJn9xHpHJ9J3iIprb5sML0L4jY.'),
    ('Ananya Das', 'ananya.das@example.com', '$2b$10$1y0DcNEviv0pYdakpvXZsuTPz8QJn9xHpHJ9J3iIprb5sML0L4jY.')
ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash;

-- Ensure any existing users also have default password_hash
UPDATE users 
SET password_hash = '$2b$10$1y0DcNEviv0pYdakpvXZsuTPz8QJn9xHpHJ9J3iIprb5sML0L4jY.'
WHERE password_hash IS NULL;

-- ====================================================================
-- 3. INSERT SAMPLE JOBS (Linked dynamically by user email)
-- ====================================================================
INSERT INTO jobs (
    user_id, job_title, company, location, job_type, work_mode,
    salary_min, salary_max, currency, application_status,
    application_date, interview_date, notes
)
SELECT 
    u.id,
    'Senior Backend Engineer',
    'Google',
    'Bangalore, India',
    'Full-time',
    'Hybrid',
    2400000,
    3800000,
    'INR',
    'Interview',
    CURRENT_DATE - INTERVAL '10 days',
    NOW() + INTERVAL '2 days',
    'System design interview scheduled for round 2.'
FROM users u WHERE u.email = 'aarav.sharma@example.com'
LIMIT 1;

INSERT INTO jobs (
    user_id, job_title, company, location, job_type, work_mode,
    salary_min, salary_max, currency, application_status,
    application_date, interview_date, notes
)
SELECT 
    u.id,
    'Node.js Microservices Lead',
    'Amazon',
    'Hyderabad, India',
    'Full-time',
    'On-site',
    2800000,
    4200000,
    'INR',
    'Technical Round',
    CURRENT_DATE - INTERVAL '14 days',
    NOW() + INTERVAL '4 days',
    'Coding round passed. AWS architecture assessment coming up.'
FROM users u WHERE u.email = 'aarav.sharma@example.com'
LIMIT 1;

INSERT INTO jobs (
    user_id, job_title, company, location, job_type, work_mode,
    salary_min, salary_max, currency, application_status,
    application_date, notes
)
SELECT 
    u.id,
    'Full Stack Developer',
    'Microsoft',
    'Noida, India',
    'Full-time',
    'Remote',
    2000000,
    3200000,
    'INR',
    'Offer',
    CURRENT_DATE - INTERVAL '30 days',
    'Offer received! CTC negotiation in progress.'
FROM users u WHERE u.email = 'priya.patel@example.com'
LIMIT 1;

INSERT INTO jobs (
    user_id, job_title, company, location, job_type, work_mode,
    salary_min, salary_max, currency, application_status,
    application_date, notes
)
SELECT 
    u.id,
    'Frontend Engineer (React)',
    'Razorpay',
    'Bangalore, India',
    'Full-time',
    'Hybrid',
    1600000,
    2500000,
    'INR',
    'Applied',
    CURRENT_DATE - INTERVAL '3 days',
    'Referred by senior engineer on LinkedIn.'
FROM users u WHERE u.email = 'priya.patel@example.com'
LIMIT 1;

INSERT INTO jobs (
    user_id, job_title, company, location, job_type, work_mode,
    salary_min, salary_max, currency, application_status,
    application_date, notes
)
SELECT 
    u.id,
    'Data Platform Engineer',
    'Swiggy',
    'Bangalore, India',
    'Full-time',
    'Remote',
    1800000,
    2800000,
    'INR',
    'Saved',
    NULL,
    'Need to polish Spark and Kafka portfolio projects before applying.'
FROM users u WHERE u.email = 'rohan.verma@example.com'
LIMIT 1;

INSERT INTO jobs (
    user_id, job_title, company, location, job_type, work_mode,
    salary_min, salary_max, currency, application_status,
    application_date, notes
)
SELECT 
    u.id,
    'DevOps / SRE Specialist',
    'Zomato',
    'Gurgaon, India',
    'Full-time',
    'On-site',
    2200000,
    3000000,
    'INR',
    'Rejected',
    CURRENT_DATE - INTERVAL '25 days',
    'Position filled internally.'
FROM users u WHERE u.email = 'rohan.verma@example.com'
LIMIT 1;

INSERT INTO jobs (
    user_id, job_title, company, location, job_type, work_mode,
    salary_min, salary_max, currency, application_status,
    application_date, notes
)
SELECT 
    u.id,
    'Backend Intern',
    'CRED',
    'Bangalore, India',
    'Internship',
    'On-site',
    600000,
    900000,
    'INR',
    'Applied',
    CURRENT_DATE - INTERVAL '5 days',
    'Summer internship application submitted.'
FROM users u WHERE u.email = 'sneha.iyer@example.com'
LIMIT 1;

INSERT INTO jobs (
    user_id, job_title, company, location, job_type, work_mode,
    salary_min, salary_max, currency, application_status,
    application_date, notes
)
SELECT 
    u.id,
    'Cloud Consultant',
    'TCS Digital',
    'Pune, India',
    'Contract',
    'Hybrid',
    1200000,
    1800000,
    'INR',
    'Saved',
    NULL,
    '6-month contract with extension possibility.'
FROM users u WHERE u.email = 'vikram.malhotra@example.com'
LIMIT 1;

INSERT INTO jobs (
    user_id, job_title, company, location, job_type, work_mode,
    salary_min, salary_max, currency, application_status,
    application_date, notes
)
SELECT 
    u.id,
    'Freelance Node.js Consultant',
    'US Fintech Client',
    'Remote',
    'Freelance',
    'Remote',
    1500000,
    2500000,
    'INR',
    'Applied',
    CURRENT_DATE - INTERVAL '2 days',
    'Part-time contract role (20 hrs/week).'
FROM users u WHERE u.email = 'ananya.das@example.com'
LIMIT 1;

-- ====================================================================
-- VERIFY INSERTION
-- ====================================================================
SELECT 'Users count: ' || COUNT(*) FROM users;
SELECT 'Jobs count: ' || COUNT(*) FROM jobs;
SELECT 'Sessions count: ' || COUNT(*) FROM sessions;
