import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

import {
    createUserRepository,
    findUserByEmailRepository,
    createSessionRepository,
    findSessionRepository,
    deleteSessionRepository
} from "../repositories/authRepository.js";

export async function signupService(name, email, password) {
    const existingUser = await findUserByEmailRepository(email);

    if (existingUser) {
        throw new Error("USER_ALREADY_EXISTS");
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await createUserRepository(
        name,
        email,
        passwordHash
    );

    return user;
}

export async function loginService(email, password) {
    const user = await findUserByEmailRepository(email);

    if (!user || !user.password_hash) {
        return null;
    }

    const passwordCorrect = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!passwordCorrect) {
        return null;
    }

    const sessionId = uuidv4();

    // 7 days session lifetime
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

    await createSessionRepository(
        sessionId,
        user.id,
        expiresAt
    );

    return {
        sessionId,
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    };
}

export async function getSessionService(sessionId) {
    if (!sessionId) {
        return null;
    }

    const session = await findSessionRepository(sessionId);

    if (!session) {
        return null;
    }

    if (new Date(session.expires_at) < new Date()) {
        await deleteSessionRepository(sessionId);
        return null;
    }

    return session;
}

export async function logoutService(sessionId) {
    if (!sessionId) {
        return;
    }

    await deleteSessionRepository(sessionId);
}
