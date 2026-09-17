import { getSessionService } from "../services/authService.js";

export async function requireAuth(req, res, next) {
    try {
        const sessionId = req.cookies?.session_id;

        if (!sessionId) {
            return res.status(401).json({
                status: 401,
                message: "Authentication required. Please sign in."
            });
        }

        const session = await getSessionService(sessionId);

        if (!session) {
            return res.status(401).json({
                status: 401,
                message: "Invalid or expired session. Please sign in again."
            });
        }

        req.user = {
            id: session.user_id,
            name: session.name,
            email: session.email
        };

        next();
    } catch (error) {
        next(error);
    }
}
