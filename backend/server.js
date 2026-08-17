const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { testDatabaseConnection } = require("./config/db");

const authRoutes =
    require("./routes/authRoutes");

const passwordAnalyzerRoutes = require("./routes/passwordAnalyzerRoutes");

const passwordAnalysisRoutes =
    require("./routes/passwordAnalysisRoutes");

const passwordHistoryRoutes =
    require("./routes/passwordHistoryRoutes");


const app = express();


// =========================================================
// Middleware
// =========================================================

// Allow frontend requests
app.use(cors());

// Accept JSON data
app.use(express.json());

// Accept form data
app.use(
    express.urlencoded({
        extended: true
    })
);


// =========================================================
// API Routes
// =========================================================

// Authentication routes
app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/password",
    passwordAnalyzerRoutes
);

app.use(
    "/api/password-analysis",
    passwordAnalysisRoutes
);
// Password History routes
app.use(
    "/api/password-history",
    passwordHistoryRoutes
);


// =========================================================
// Home Route
// =========================================================

app.get("/", (req, res) => {

    res.status(200).json({

        success: true,

        message:
            "SecurePass Backend Server is Running"

    });

});


// =========================================================
// Health Check Route
// =========================================================

app.get("/api/health", (req, res) => {

    res.status(200).json({

        success: true,

        server: "running",

        database: "configured"

    });

});


// =========================================================
// 404 Handler
// =========================================================

app.use((req, res) => {

    res.status(404).json({

        success: false,

        message:
            "API route not found"

    });

});


// =========================================================
// Server Configuration
// =========================================================

const PORT =
    process.env.PORT || 5000;


// =========================================================
// Start Server
// =========================================================

async function startServer() {

    try {

        await testDatabaseConnection();


        app.listen(
            PORT,
            () => {

                console.log(
                    "----------------------------------------"
                );

                console.log(
                    "SecurePass Backend Server Started"
                );

                console.log(
                    `Server running on port ${PORT}`
                );

                console.log(
                    `http://localhost:${PORT}`
                );

                console.log(
                    "----------------------------------------"
                );

            }
        );

    } catch (error) {

        console.error(
            "Failed to start server:"
        );

        console.error(
            error.message
        );

        process.exit(1);

    }

}


startServer();