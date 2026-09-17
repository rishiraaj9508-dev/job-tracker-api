import pool from "../config/db.js";

export async function createUserRepository(name, email, passwordHash) {
    const result = await pool.query(
        `
        INSERT INTO users (name, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, name, email, created_at
        `,
        [name, email, passwordHash]
    );

    return result.rows[0];
}

export async function findUserByEmailRepository(email) {
    const result = await pool.query(
        `
        SELECT id, name, email, password_hash, created_at
        FROM users
        WHERE email = $1
        `,
        [email]
    );

    return result.rows[0];
}

export async function findUserByIdRepository(id) {
    const result = await pool.query(
        `
        SELECT id, name, email, created_at
        FROM users
        WHERE id = $1
        `,
        [id]
    );

    return result.rows[0];
}

export async function createSessionRepository(sessionId, userId, expiresAt) {
    const result = await pool.query(
        `
        INSERT INTO sessions (id, user_id, expires_at)
        VALUES ($1, $2, $3)
        RETURNING id, user_id, expires_at
        `,
        [sessionId, userId, expiresAt]
    );

    return result.rows[0];
}

export async function findSessionRepository(sessionId) {
    const result = await pool.query(
        `
        SELECT 
            sessions.id,
            sessions.user_id,
            sessions.expires_at,
            users.name,
            users.email
        FROM sessions
        JOIN users
            ON sessions.user_id = users.id
        WHERE sessions.id = $1
        `,
        [sessionId]
    );

    return result.rows[0];
}

export async function deleteSessionRepository(sessionId) {
    await pool.query(
        `
        DELETE FROM sessions
        WHERE id = $1
        `,
        [sessionId]
    );
}
