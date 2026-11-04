// =========================================================
// SecurePass - Admin Routes
// =========================================================

const express = require("express");

const router = express.Router();


// =========================================================
// Controllers
// =========================================================

const {
    getDashboardStats,
    getAllUsers,
    getAllAnalyses,
    getAllLogs
} = require("../controllers/adminController");


// =========================================================
// Middleware
// =========================================================

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");


// =========================================================
// Admin Dashboard Statistics
// GET /api/admin/dashboard
// =========================================================

router.get(
    "/dashboard",
    authMiddleware,
    adminMiddleware,
    getDashboardStats
);


// =========================================================
// Get All Users
// GET /api/admin/users
// =========================================================

router.get(
    "/users",
    authMiddleware,
    adminMiddleware,
    getAllUsers
);


// =========================================================
// Get All Password Analyses
// GET /api/admin/analyses
// =========================================================

router.get(
    "/analyses",
    authMiddleware,
    adminMiddleware,
    getAllAnalyses
);


// =========================================================
// Get All Security Logs
// GET /api/admin/logs
// =========================================================

router.get(
    "/logs",
    authMiddleware,
    adminMiddleware,
    getAllLogs
);


// =========================================================
// Export Router
// =========================================================

module.exports = router;