import pool from "../config/db.js";


// =====================================================
// USER SERVICES
// =====================================================

// GET ALL USERS (with pagination, sorting, filtering)
export const getAllUsersService = async ({
    page = 1,
    limit = 10,
    sortBy = "id",
    sortOrder = "ASC",
    search = ""
} = {}) => {
    const allowedSortColumns = {
        id: "id",
        name: "name",
        email: "email",
        created_at: "created_at"
    };

    const cleanSortBy = allowedSortColumns[String(sortBy).toLowerCase()] || "id";
    const cleanSortOrder = String(sortOrder).toUpperCase() === "DESC" ? "DESC" : "ASC";

    const parsedPage = Math.max(1, parseInt(page) || 1);
    const parsedLimit = Math.max(1, Math.min(100, parseInt(limit) || 10));
    const offset = (parsedPage - 1) * parsedLimit;

    const conditions = [];
    const values = [];

    if (search && String(search).trim() !== "") {
        values.push(`%${String(search).trim()}%`);
        conditions.push(`(name ILIKE $${values.length} OR email ILIKE $${values.length})`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Count total matches
    const countResult = await pool.query(
        `SELECT COUNT(*) AS total FROM users ${whereClause}`,
        values
    );
    const total = parseInt(countResult.rows[0].total, 10);

    // Fetch paginated data
    const dataValues = [...values, parsedLimit, offset];
    const dataQuery = `
        SELECT id, name, email, created_at
        FROM users
        ${whereClause}
        ORDER BY ${cleanSortBy} ${cleanSortOrder}
        LIMIT $${dataValues.length - 1} OFFSET $${dataValues.length}
    `;

    const result = await pool.query(dataQuery, dataValues);

    return {
        users: result.rows,
        pagination: {
            page: parsedPage,
            limit: parsedLimit,
            totalUsers: total,
            totalPages: Math.ceil(total / parsedLimit) || 1
        }
    };
};


// GET USER BY ID
export const getUserByIdService = async (id) => {
    const result = await pool.query(
        `SELECT id, name, email, created_at
         FROM users
         WHERE id = $1`,
        [id]
    );

    return result.rows[0];
};


// CREATE USER (No password)
export const createUserService = async (name, email) => {
    const result = await pool.query(
        `INSERT INTO users (name, email)
         VALUES ($1, $2)
         RETURNING id, name, email, created_at`,
        [name, email]
    );

    return result.rows[0];
};


// UPDATE USER
export const updateUserService = async (id, name, email) => {
    const result = await pool.query(
        `UPDATE users
         SET name = $1,
             email = $2
         WHERE id = $3
         RETURNING id, name, email, created_at`,
        [name, email, id]
    );

    return result.rows[0];
};


// DELETE USER
export const deleteUserService = async (id) => {
    const result = await pool.query(
        `DELETE FROM users
         WHERE id = $1
         RETURNING id, name, email`,
        [id]
    );

    return result.rows[0];
};



// =====================================================
// JOB SERVICES
// =====================================================

// GET ALL JOBS (with pagination, sorting, filtering)
export const getAllJobService = async ({
    page = 1,
    limit = 10,
    sortBy = "id",
    sortOrder = "DESC",
    search = "",
    userId = null,
    applicationStatus = null,
    jobType = null,
    workMode = null,
    minSalary = null,
    maxSalary = null
} = {}) => {
    const allowedSortColumns = {
        id: "id",
        user_id: "user_id",
        job_title: "job_title",
        company: "company",
        location: "location",
        job_type: "job_type",
        work_mode: "work_mode",
        salary_min: "salary_min",
        salary_max: "salary_max",
        application_status: "application_status",
        application_date: "application_date",
        created_at: "created_at"
    };

    const cleanSortBy = allowedSortColumns[String(sortBy).toLowerCase()] || "id";
    const cleanSortOrder = String(sortOrder).toUpperCase() === "ASC" ? "ASC" : "DESC";

    const parsedPage = Math.max(1, parseInt(page) || 1);
    const parsedLimit = Math.max(1, Math.min(100, parseInt(limit) || 10));
    const offset = (parsedPage - 1) * parsedLimit;

    const conditions = [];
    const values = [];

    if (userId && !isNaN(Number(userId))) {
        values.push(Number(userId));
        conditions.push(`user_id = $${values.length}`);
    }

    if (search && String(search).trim() !== "") {
        values.push(`%${String(search).trim()}%`);
        conditions.push(`(job_title ILIKE $${values.length} OR company ILIKE $${values.length} OR location ILIKE $${values.length})`);
    }

    if (applicationStatus && String(applicationStatus).trim() !== "") {
        values.push(String(applicationStatus).trim());
        conditions.push(`application_status = $${values.length}`);
    }

    if (jobType && String(jobType).trim() !== "") {
        values.push(String(jobType).trim());
        conditions.push(`job_type = $${values.length}`);
    }

    if (workMode && String(workMode).trim() !== "") {
        values.push(String(workMode).trim());
        conditions.push(`work_mode = $${values.length}`);
    }

    if (minSalary !== null && minSalary !== undefined && !isNaN(Number(minSalary))) {
        values.push(Number(minSalary));
        conditions.push(`salary_min >= $${values.length}`);
    }

    if (maxSalary !== null && maxSalary !== undefined && !isNaN(Number(maxSalary))) {
        values.push(Number(maxSalary));
        conditions.push(`salary_max <= $${values.length}`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Count total matches
    const countResult = await pool.query(
        `SELECT COUNT(*) AS total FROM jobs ${whereClause}`,
        values
    );
    const total = parseInt(countResult.rows[0].total, 10);

    // Fetch paginated data
    const dataValues = [...values, parsedLimit, offset];
    const dataQuery = `
        SELECT *
        FROM jobs
        ${whereClause}
        ORDER BY ${cleanSortBy} ${cleanSortOrder}
        LIMIT $${dataValues.length - 1} OFFSET $${dataValues.length}
    `;

    const result = await pool.query(dataQuery, dataValues);

    return {
        jobs: result.rows,
        pagination: {
            page: parsedPage,
            limit: parsedLimit,
            totalJobs: total,
            totalPages: Math.ceil(total / parsedLimit) || 1
        }
    };
};


// GET JOB BY ID
export const getJobByIdService = async (id) => {
    const result = await pool.query(
        `SELECT *
         FROM jobs
         WHERE id = $1`,
        [id]
    );

    return result.rows[0];
};


// CREATE JOB
export const createJobService = async (
    user_id,
    job_title,
    company,
    location,
    job_type,
    work_mode,
    salary_min,
    salary_max,
    currency,
    qualification_required,
    skills_required,
    job_description,
    job_url,
    application_status,
    application_date,
    interview_date,
    notes
) => {
    const result = await pool.query(
        `INSERT INTO jobs (
            user_id,
            job_title,
            company,
            location,
            job_type,
            work_mode,
            salary_min,
            salary_max,
            currency,
            qualification_required,
            skills_required,
            job_description,
            job_url,
            application_status,
            application_date,
            interview_date,
            notes
        )
        VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9,
            $10, $11, $12, $13, $14, $15, $16, $17
        )
        RETURNING *`,
        [
            user_id,
            job_title,
            company,
            location,
            job_type,
            work_mode,
            salary_min,
            salary_max,
            currency,
            qualification_required,
            skills_required,
            job_description,
            job_url,
            application_status,
            application_date,
            interview_date,
            notes
        ]
    );

    return result.rows[0];
};


// UPDATE JOB
export const updateJobService = async (
    id,
    job_title,
    company,
    location,
    job_type,
    work_mode,
    salary_min,
    salary_max,
    currency,
    qualification_required,
    skills_required,
    job_description,
    job_url,
    application_status,
    application_date,
    interview_date,
    notes
) => {
    const result = await pool.query(
        `UPDATE jobs
         SET
            job_title = $1,
            company = $2,
            location = $3,
            job_type = $4,
            work_mode = $5,
            salary_min = $6,
            salary_max = $7,
            currency = $8,
            qualification_required = $9,
            skills_required = $10,
            job_description = $11,
            job_url = $12,
            application_status = $13,
            application_date = $14,
            interview_date = $15,
            notes = $16,
            updated_at = NOW()
         WHERE id = $17
         RETURNING *`,
        [
            job_title,
            company,
            location,
            job_type,
            work_mode,
            salary_min,
            salary_max,
            currency,
            qualification_required,
            skills_required,
            job_description,
            job_url,
            application_status,
            application_date,
            interview_date,
            notes,
            id
        ]
    );

    return result.rows[0];
};


// DELETE JOB
export const deleteJobService = async (id) => {
    const result = await pool.query(
        `DELETE FROM jobs
         WHERE id = $1
         RETURNING *`,
        [id]
    );

    return result.rows[0];
};


// =====================================================
// GET JOBS BY USER
// =====================================================

export const getJobsByUserService = async (userId, options = {}) => {
    return getAllJobService({ ...options, userId });
};