import {
    signupService,
    loginService,
    logoutService
} from "../services/authService.js";

export async function signupController(req, res, next) {
    try {
        const { name, email, password } = req.body;

        const user = await signupService(
            name,
            email,
            password
        );

        return res.status(201).json({
            status: 201,
            message: "Signup successful",
            user
        });
    } catch (error) {
        if (error.message === "USER_ALREADY_EXISTS") {
            return res.status(409).json({
                status: 409,
                message: "User with this email already exists"
            });
        }
        next(error);
    }
}

export async function loginController(req, res, next) {
    try {
        const { email, password } = req.body;

        const result = await loginService(
            email,
            password
        );

        if (!result) {
            return res.status(401).json({
                status: 401,
                message: "Invalid email or password"
            });
        }

        res.cookie(
            "session_id",
            result.sessionId,
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
            }
        );

        return res.status(200).json({
            status: 200,
            message: "Login successful",
            user: result.user
        });
    } catch (error) {
        next(error);
    }
}

export async function logoutController(req, res, next) {
    try {
        const sessionId = req.cookies?.session_id;

        await logoutService(sessionId);

        res.clearCookie("session_id");

        return res.status(200).json({
            status: 200,
            message: "Logout successful"
        });
    } catch (error) {
        next(error);
    }
}

export async function getMeController(req, res) {
    return res.status(200).json({
        status: 200,
        message: "Current authenticated user",
        user: req.user
    });
}
