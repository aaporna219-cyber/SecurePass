const express = require("express");

const {
    registerUser,
    loginUser
} = require("../controllers/authController");


const router = express.Router();


// =========================================================
// Authentication Routes
// =========================================================

// Register
// POST /api/auth/register

router.post(
    "/register",
    registerUser
);


// Login
// POST /api/auth/login

router.post(
    "/login",
    loginUser
);


// =========================================================
// Export Router
// =========================================================

module.exports = router;