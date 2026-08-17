// =========================================================
// SecurePass - Authentication Middleware
// =========================================================

const jwt = require("jsonwebtoken");


// =========================================================
// Protect Route
// =========================================================

function authMiddleware(req, res, next) {

    try {

        // -------------------------------------------------
        // Check Authorization Header
        // -------------------------------------------------

        const authHeader =
            req.headers.authorization;


        if (!authHeader) {

            return res.status(401).json({

                success: false,

                message:
                    "Authentication required."

            });

        }


        // -------------------------------------------------
        // Expected format:
        //
        // Authorization: Bearer TOKEN
        // -------------------------------------------------

        const parts =
            authHeader.split(" ");


        if (
            parts.length !== 2 ||
            parts[0] !== "Bearer" ||
            !parts[1]
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid authorization format."

            });

        }


        const token =
            parts[1];


        // -------------------------------------------------
        // Check JWT Secret
        // -------------------------------------------------

        if (!process.env.JWT_SECRET) {

            console.error(
                "JWT_SECRET is not configured."
            );


            return res.status(500).json({

                success: false,

                message:
                    "Authentication configuration error."

            });

        }


        // -------------------------------------------------
        // Verify Token
        // -------------------------------------------------

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        // -------------------------------------------------
        // Validate User ID
        // -------------------------------------------------

        if (
            !decoded ||
            !decoded.id
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid authentication token."

            });

        }


        // -------------------------------------------------
        // Attach User Information
        // -------------------------------------------------

        req.user = {

            id: decoded.id,

            email: decoded.email,

            role: decoded.role

        };


        // -------------------------------------------------
        // Continue Request
        // -------------------------------------------------

        next();

    } catch (error) {

        // -------------------------------------------------
        // Expired Token
        // -------------------------------------------------

        if (
            error.name === "TokenExpiredError"
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Your session has expired. Please login again."

            });

        }


        // -------------------------------------------------
        // Invalid Token
        // -------------------------------------------------

        if (
            error.name === "JsonWebTokenError"
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid authentication token."

            });

        }


        // -------------------------------------------------
        // Unexpected Error
        // -------------------------------------------------

        console.error(
            "Authentication Middleware Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Authentication error."

        });

    }

}


// =========================================================
// Export
// =========================================================

module.exports =
    authMiddleware;