import pool from "../config/db.js";

const createUserTable = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(150) UNIQUE NOT NULL,
                password_hash VARCHAR(255),
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);

        // Ensure password_hash exists if table was created previously without it
        await pool.query(`
            ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
        `).catch(() => {});

        // If legacy password column exists, drop NOT NULL
        await pool.query(`
            ALTER TABLE users ALTER COLUMN password DROP NOT NULL;
        `).catch(() => {});

        console.log("Users table created successfully");
    } catch (error) {
        console.error("Error creating users table:", error.message);
    }
};

const createSessionTable = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS sessions (
                id VARCHAR(64) PRIMARY KEY,
                user_id INTEGER NOT NULL
                    REFERENCES users(id)
                    ON DELETE CASCADE,
                expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `);

        console.log("Sessions table created successfully");
    } catch (error) {
        console.error("Error creating sessions table:", error.message);
    }
};

const createJobTable = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS jobs (
                id SERIAL PRIMARY KEY,

                user_id INTEGER NOT NULL
                    REFERENCES users(id)
                    ON DELETE CASCADE,

                job_title VARCHAR(150) NOT NULL,
                company VARCHAR(150) NOT NULL,

                location VARCHAR(150),

                job_type VARCHAR(50)
                    CHECK (job_type IN (
                        'Full-time',
                        'Part-time',
                        'Internship',
                        'Contract',
                        'Freelance'
                    )),

                work_mode VARCHAR(50)
                    CHECK (work_mode IN (
                        'Remote',
                        'Hybrid',
                        'On-site'
                    )),

                salary_min INTEGER,
                salary_max INTEGER,
                currency VARCHAR(10) DEFAULT 'INR',

                qualification_required TEXT,
                skills_required TEXT,

                job_description TEXT,

                job_url TEXT,

                application_status VARCHAR(50) DEFAULT 'Saved'
                    CHECK (application_status IN (
                        'Saved',
                        'Applied',
                        'Interview',
                        'Technical Round',
                        'Offer',
                        'Rejected',
                        'Withdrawn'
                    )),

                application_date DATE,
                interview_date TIMESTAMP,

                notes TEXT,

                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
        `);

        console.log("Jobs table created successfully");
    } catch (error) {
        console.error("Error creating jobs table:", error.message);
    }
};

const createTables = async () => {
    await createUserTable();
    await createJobTable();
    await createSessionTable();
};

export default createTables;
