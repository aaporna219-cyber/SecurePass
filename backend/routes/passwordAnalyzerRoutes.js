// =========================================================
// SecurePass - Password Analyzer Routes
// =========================================================

const express = require("express");

const {
    analyzePasswordController
} = require("../controllers/passwordAnalyzerController");

const router = express.Router();


// =========================================================
// Analyze Password
// =========================================================

router.post(
    "/analyze",
    analyzePasswordController
);


// =========================================================
// Export
// =========================================================

module.exports = router;