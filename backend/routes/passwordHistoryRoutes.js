// =========================================================
// SecurePass - Password History Routes
// =========================================================

const express = require("express");

const router = express.Router();


// =========================================================
// Controller
// =========================================================

const passwordHistoryController =
    require("../controllers/passwordHistoryController");


// =========================================================
// Authentication Middleware
// =========================================================

const authMiddleware =
    require("../middleware/authMiddleware");


// =========================================================
// Save Password Analysis
// =========================================================

router.post(
    "/",
    authMiddleware,
    passwordHistoryController.savePasswordAnalysis
);


// =========================================================
// Get User Password History
// =========================================================

router.get(
    "/",
    authMiddleware,
    passwordHistoryController.getPasswordHistory
);


// =========================================================
// Delete All Password History
// =========================================================

router.delete(
    "/",
    authMiddleware,
    passwordHistoryController.deleteAllPasswordHistory
);


// =========================================================
// Delete Single Password History
// =========================================================

router.delete(
    "/:id",
    authMiddleware,
    passwordHistoryController.deletePasswordHistory
);


// =========================================================
// Export Router
// =========================================================

module.exports = router;