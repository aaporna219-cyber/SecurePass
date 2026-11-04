// =========================================================
// SecurePass - Admin Controller
// =========================================================

const db = require("../config/db");


// =========================================================
// Get Admin Dashboard Statistics
// =========================================================

const getDashboardStats = async (req, res) => {
    try {

        const [usersResult] = await db.pool.query(
            "SELECT COUNT(*) AS totalUsers FROM users"
        );

        // Password analysis history is stored in password_history
        const [analysesResult] = await db.pool.query(
            "SELECT COUNT(*) AS totalAnalyses FROM password_history"
        );

        const [logsResult] = await db.pool.query(
            "SELECT COUNT(*) AS totalLogs FROM security_logs"
        );

        res.status(200).json({
            success: true,
            data: {
                totalUsers:
                    Number(usersResult[0].totalUsers) || 0,

                totalAnalyses:
                    Number(analysesResult[0].totalAnalyses) || 0,

                totalLogs:
                    Number(logsResult[0].totalLogs) || 0
            }
        });

    } catch (error) {

        console.error(
            "Admin Dashboard Stats Error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to load admin dashboard statistics.",
            error: error.message
        });
    }
};


// =========================================================
// Get All Users
// =========================================================

const getAllUsers = async (req, res) => {
    try {

        const [users] = await db.pool.query(
            `
            SELECT
                id,
                name,
                email,
                role,
                status,
                created_at
            FROM users
            ORDER BY id DESC
            `
        );

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });

    } catch (error) {

        console.error(
            "Get All Users Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to load users.",
            error: error.message
        });
    }
};


// =========================================================
// Get All Password Analyses
// =========================================================

const getAllAnalyses = async (req, res) => {
    try {

        // User analyses are stored in password_history
        const [analyses] = await db.pool.query(
            `
            SELECT
                id,
                user_id,
                score,
                strength_level,
                password_length,
                entropy,
                character_pool,
                has_uppercase,
                has_lowercase,
                has_numbers,
                has_special,
                created_at
            FROM password_history
            ORDER BY id DESC
            `
        );

        res.status(200).json({
            success: true,
            count: analyses.length,
            data: analyses
        });

    } catch (error) {

        console.error(
            "Get All Analyses Error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to load password analyses.",
            error: error.message
        });
    }
};


// =========================================================
// Get All Security Logs
// =========================================================

const getAllLogs = async (req, res) => {
    try {

        const [logs] = await db.pool.query(
            `
            SELECT
                id,
                user_id,
                action,
                description,
                ip_address,
                created_at
            FROM security_logs
            ORDER BY id DESC
            `
        );

        res.status(200).json({
            success: true,
            count: logs.length,
            data: logs
        });

    } catch (error) {

        console.error(
            "Get All Security Logs Error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to load security logs.",
            error: error.message
        });
    }
};


// =========================================================
// Export Controller Functions
// =========================================================

module.exports = {
    getDashboardStats,
    getAllUsers,
    getAllAnalyses,
    getAllLogs
};