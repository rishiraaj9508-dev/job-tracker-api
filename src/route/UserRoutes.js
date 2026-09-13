import express from "express";

const router = express.Router();

import {
    // User controllers
    createUser,
    getAllUser,
    getUserById,
    updateUser,
    deleteUser,

    // Job controllers
    createJob,
    getAllJob,
    getJobById,
    updateJob,
    deleteJob,
    getJobsByUser

} from "../controller/userController.js";


// ==================== USER ROUTES ====================

router.post("/users", createUser);

router.get("/users", getAllUser);

router.get("/users/:id", getUserById);

router.put("/users/:id", updateUser);

router.delete("/users/:id", deleteUser);

router.get("/users/:userId/jobs", getJobsByUser);


// ==================== JOB ROUTES ====================

router.post("/jobs", createJob);

router.get("/jobs", getAllJob);

router.get("/jobs/:id", getJobById);

router.put("/jobs/:id", updateJob);

router.delete("/jobs/:id", deleteJob);



export default router;