import {
    getAllUsersService,
    getUserByIdService,
    createUserService,
    updateUserService,
    deleteUserService,

    getAllJobService,
    getJobByIdService,
    createJobService,
    updateJobService,
    deleteJobService,
    getJobsByUserService
} from "../models/userModels.js";


// =====================================================
// COMMON RESPONSE
// =====================================================

const handleResponse = (res, status, message, data = null, pagination = null) => {
    const response = {
        status,
        message,
        data
    };

    if (pagination) {
        response.pagination = pagination;
    }

    res.status(status).json(response);
};


// =====================================================
// USER CONTROLLERS
// =====================================================

// CREATE USER (No password required)
export const createUser = async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return handleResponse(
                res,
                400,
                "Name and email are required"
            );
        }

        const user = await createUserService(
            name,
            email
        );

        handleResponse(
            res,
            201,
            "User created successfully",
            user
        );

    } catch (error) {
        console.error("Create user error:", error.message);

        if (error.code === "23505") {
            return handleResponse(
                res,
                409,
                "Email already exists"
            );
        }

        handleResponse(
            res,
            500,
            "Failed to create user"
        );
    }
};


// GET ALL USERS (with pagination, sorting, search)
export const getAllUser = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            sort_by = "id",
            sort_order = "ASC",
            search = ""
        } = req.query;

        const { users, pagination } = await getAllUsersService({
            page,
            limit,
            sortBy: sort_by,
            sortOrder: sort_order,
            search
        });

        handleResponse(
            res,
            200,
            "All users fetched successfully",
            users,
            pagination
        );

    } catch (error) {
        console.error("Get users error:", error.message);

        handleResponse(
            res,
            500,
            "Failed to fetch users"
        );
    }
};


// GET USER BY ID
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(Number(id))) {
            return handleResponse(
                res,
                400,
                "Invalid ID format. ID must be a number"
            );
        }

        const user = await getUserByIdService(id);

        if (!user) {
            return handleResponse(
                res,
                404,
                "User not found"
            );
        }

        handleResponse(
            res,
            200,
            "User fetched successfully",
            user
        );

    } catch (error) {
        console.error("Get user error:", error.message);

        handleResponse(
            res,
            500,
            "Failed to fetch user"
        );
    }
};


// UPDATE USER
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;

        if (isNaN(Number(id))) {
            return handleResponse(
                res,
                400,
                "Invalid ID format. ID must be a number"
            );
        }

        if (!name || !email) {
            return handleResponse(
                res,
                400,
                "Name and email are required"
            );
        }

        const user = await updateUserService(
            id,
            name,
            email
        );

        if (!user) {
            return handleResponse(
                res,
                404,
                "User not found"
            );
        }

        handleResponse(
            res,
            200,
            "User updated successfully",
            user
        );

    } catch (error) {
        console.error("Update user error:", error.message);

        if (error.code === "23505") {
            return handleResponse(
                res,
                409,
                "Email already exists"
            );
        }

        handleResponse(
            res,
            500,
            "Failed to update user"
        );
    }
};


// DELETE USER
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(Number(id))) {
            return handleResponse(
                res,
                400,
                "Invalid ID format. ID must be a number"
            );
        }

        const user = await deleteUserService(id);

        if (!user) {
            return handleResponse(
                res,
                404,
                "User not found"
            );
        }

        handleResponse(
            res,
            200,
            "User deleted successfully",
            user
        );

    } catch (error) {
        console.error("Delete user error:", error.message);

        handleResponse(
            res,
            500,
            "Failed to delete user"
        );
    }
};



// =====================================================
// JOB CONTROLLERS
// =====================================================


// CREATE JOB
export const createJob = async (req, res) => {
    try {
        const {
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
        } = req.body;


        if (!user_id || !job_title || !company) {
            return handleResponse(
                res,
                400,
                "user_id, job_title and company are required"
            );
        }

        if (isNaN(Number(user_id))) {
            return handleResponse(
                res,
                400,
                "Invalid user_id. user_id must be a number"
            );
        }


        const job = await createJobService(
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
        );


        handleResponse(
            res,
            201,
            "Job created successfully",
            job
        );

    } catch (error) {
        console.error("Create job error:", error.message);

        if (error.code === "23503") {
            return handleResponse(
                res,
                404,
                "User does not exist"
            );
        }

        handleResponse(
            res,
            500,
            "Failed to create job"
        );
    }
};


// GET ALL JOBS (with pagination, sorting, filtering)
export const getAllJob = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            sort_by = "id",
            sort_order = "DESC",
            search = "",
            user_id = null,
            status = null,
            job_type = null,
            work_mode = null,
            salary_min = null,
            salary_max = null
        } = req.query;

        const { jobs, pagination } = await getAllJobService({
            page,
            limit,
            sortBy: sort_by,
            sortOrder: sort_order,
            search,
            userId: user_id,
            applicationStatus: status,
            jobType: job_type,
            workMode: work_mode,
            minSalary: salary_min,
            maxSalary: salary_max
        });

        handleResponse(
            res,
            200,
            "All jobs fetched successfully",
            jobs,
            pagination
        );

    } catch (error) {
        console.error("Get jobs error:", error.message);

        handleResponse(
            res,
            500,
            "Failed to fetch jobs"
        );
    }
};


// GET JOB BY ID
export const getJobById = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(Number(id))) {
            return handleResponse(
                res,
                400,
                "Invalid ID format. ID must be a number"
            );
        }

        const job = await getJobByIdService(id);

        if (!job) {
            return handleResponse(
                res,
                404,
                "Job not found"
            );
        }

        handleResponse(
            res,
            200,
            "Job fetched successfully",
            job
        );

    } catch (error) {
        console.error("Get job error:", error.message);

        handleResponse(
            res,
            500,
            "Failed to fetch job"
        );
    }
};


// UPDATE JOB
export const updateJob = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(Number(id))) {
            return handleResponse(
                res,
                400,
                "Invalid ID format. ID must be a number"
            );
        }

        const {
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
        } = req.body;


        if (!job_title || !company) {
            return handleResponse(
                res,
                400,
                "job_title and company are required"
            );
        }


        const job = await updateJobService(
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
        );


        if (!job) {
            return handleResponse(
                res,
                404,
                "Job not found"
            );
        }


        handleResponse(
            res,
            200,
            "Job updated successfully",
            job
        );

    } catch (error) {
        console.error("Update job error:", error.message);

        handleResponse(
            res,
            500,
            "Failed to update job"
        );
    }
};


// DELETE JOB
export const deleteJob = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(Number(id))) {
            return handleResponse(
                res,
                400,
                "Invalid ID format. ID must be a number"
            );
        }

        const job = await deleteJobService(id);

        if (!job) {
            return handleResponse(
                res,
                404,
                "Job not found"
            );
        }

        handleResponse(
            res,
            200,
            "Job deleted successfully",
            job
        );

    } catch (error) {
        console.error("Delete job error:", error.message);

        handleResponse(
            res,
            500,
            "Failed to delete job"
        );
    }
};


// =====================================================
// GET JOBS BY USER
// =====================================================

export const getJobsByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        if (isNaN(Number(userId))) {
            return handleResponse(
                res,
                400,
                "Invalid User ID format. User ID must be a number"
            );
        }

        const {
            page = 1,
            limit = 10,
            sort_by = "id",
            sort_order = "DESC",
            search = "",
            status = null,
            job_type = null,
            work_mode = null,
            salary_min = null,
            salary_max = null
        } = req.query;

        const { jobs, pagination } = await getJobsByUserService(userId, {
            page,
            limit,
            sortBy: sort_by,
            sortOrder: sort_order,
            search,
            applicationStatus: status,
            jobType: job_type,
            workMode: work_mode,
            minSalary: salary_min,
            maxSalary: salary_max
        });

        handleResponse(
            res,
            200,
            "User jobs fetched successfully",
            jobs,
            pagination
        );

    } catch (error) {
        console.error("Get user jobs error:", error.message);

        handleResponse(
            res,
            500,
            "Failed to fetch user jobs"
        );
    }
};