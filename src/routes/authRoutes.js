import express from "express";
import {
    signupController,
    loginController,
    logoutController,
    getMeController
} from "../controllers/authController.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import {
    signupSchema,
    loginSchema,
    validateRequest
} from "../middlewares/authValidation.js";

const router = express.Router();

// Public routes with validation
router.post("/signup", validateRequest(signupSchema), signupController);
router.post("/login", validateRequest(loginSchema), loginController);

// Protected routes
router.post("/logout", requireAuth, logoutController);
router.get("/me", requireAuth, getMeController);

export default router;
