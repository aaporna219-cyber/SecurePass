const { pool } = require("../config/db");


// =========================================================
// Find User By Email
// =========================================================

async function findUserByEmail(email) {

    const [rows] = await pool.execute(
        `
        SELECT
            id,
            name,
            email,
            password,
            role,
            status,
            last_login,
            created_at,
            updated_at
        FROM users
        WHERE email = ?
        LIMIT 1
        `,
        [email]
    );

    return rows[0] || null;
}


// =========================================================
// Find User By ID
// =========================================================

async function findUserById(id) {

    const [rows] = await pool.execute(
        `
        SELECT
            id,
            name,
            email,
            role,
            status,
            last_login,
            created_at,
            updated_at
        FROM users
        WHERE id = ?
        LIMIT 1
        `,
        [id]
    );

    return rows[0] || null;
}


// =========================================================
// Create New User
// =========================================================

async function createUser(name, email, hashedPassword) {

    const [result] = await pool.execute(
        `
        INSERT INTO users
        (
            name,
            email,
            password
        )
        VALUES (?, ?, ?)
        `,
        [
            name,
            email,
            hashedPassword
        ]
    );

    return result.insertId;
}


// =========================================================
// Update Last Login
// =========================================================

async function updateLastLogin(userId) {

    await pool.execute(
        `
        UPDATE users
        SET last_login = CURRENT_TIMESTAMP
        WHERE id = ?
        `,
        [userId]
    );

}


// =========================================================
// Update User Status
// =========================================================

async function updateUserStatus(userId, status) {

    const [result] = await pool.execute(
        `
        UPDATE users
        SET status = ?
        WHERE id = ?
        `,
        [
            status,
            userId
        ]
    );

    return result.affectedRows > 0;
}


// =========================================================
// Get All Users
// =========================================================

async function getAllUsers() {

    const [rows] = await pool.execute(
        `
        SELECT
            id,
            name,
            email,
            role,
            status,
            last_login,
            created_at
        FROM users
        ORDER BY created_at DESC
        `
    );

    return rows;
}


// =========================================================
// Delete User
// =========================================================

async function deleteUser(userId) {

    const [result] = await pool.execute(
        `
        DELETE FROM users
        WHERE id = ?
        `,
        [userId]
    );

    return result.affectedRows > 0;
}


// =========================================================
// Export Functions
// =========================================================

module.exports = {
    findUserByEmail,
    findUserById,
    createUser,
    updateLastLogin,
    updateUserStatus,
    getAllUsers,
    deleteUser
};