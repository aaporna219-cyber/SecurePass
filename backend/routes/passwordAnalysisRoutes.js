// =========================================================
// SecurePass - Password Analysis Routes
// =========================================================

const express = require("express");

const {
    analyzeAndSavePassword
} = require("../controllers/passwordAnalysisController");

const authMiddleware =
    require("../middleware/authMiddleware");

const router = express.Router();


// =========================================================
// Analyze Password + Save History
// =========================================================

router.post(
    "/analyze-save",
    authMiddleware,
    analyzeAndSavePassword
);


// =========================================================
// Export
// =========================================================

module.exports = router;