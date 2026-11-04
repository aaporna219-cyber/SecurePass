const userModel = require("../models/userModel");

const {
    hashPassword,
    comparePassword
} = require("../utils/bcryptHelper");

const jwt = require("jsonwebtoken");

const {
    createSecurityLog
} = require("../models/securityLogModel");


// =========================================================
// JWT Token Generator
// =========================================================

function generateToken(user) {

    if (!process.env.JWT_SECRET) {

        throw new Error(
            "JWT_SECRET is not configured in .env"
        );

    }

    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
        },

        process.env.JWT_SECRET,

        {
            expiresIn:
                process.env.JWT_EXPIRES_IN || "1d"
        }
    );
}


// =========================================================
// Security Log Helper
// =========================================================

function logSecurityEvent(
    req,
    userId,
    action,
    description
) {

    createSecurityLog(
        {
            user_id: userId || null,

            action: action,

            description: description,

            ip_address:
                req.ip ||
                req.headers["x-forwarded-for"] ||
                req.socket?.remoteAddress ||
                null,

            user_agent:
                req.headers["user-agent"] ||
                null
        },

        (error) => {

            if (error) {

                console.error(
                    "Security Log Error:",
                    error.message
                );

            }

        }
    );
}


// =========================================================
// Register User
// =========================================================

async function registerUser(req, res) {

    try {

        const {
            name,
            email,
            password,
            confirmPassword
        } = req.body;


        // ---------------------------------------------
        // Required Fields
        // ---------------------------------------------

        if (
            !name ||
            !email ||
            !password ||
            !confirmPassword
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "All fields are required"

            });

        }


        // ---------------------------------------------
        // Clean Input
        // ---------------------------------------------

        const cleanName =
            name.trim();

        const cleanEmail =
            email.trim().toLowerCase();


        // ---------------------------------------------
        // Name Validation
        // ---------------------------------------------

        if (
            cleanName.length < 2
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Name must contain at least 2 characters"

            });

        }


        // ---------------------------------------------
        // Email Validation
        // ---------------------------------------------

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (
            !emailPattern.test(cleanEmail)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please enter a valid email address"

            });

        }


        // ---------------------------------------------
        // Password Confirmation
        // ---------------------------------------------

        if (
            password !== confirmPassword
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Passwords do not match"

            });

        }


        // ---------------------------------------------
        // Password Length
        // ---------------------------------------------

        if (
            password.length < 8
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Password must contain at least 8 characters"

            });

        }


        // ---------------------------------------------
        // Existing User Check
        // ---------------------------------------------

        const existingUser =
            await userModel.findUserByEmail(
                cleanEmail
            );


        if (existingUser) {

            return res.status(409).json({

                success: false,

                message:
                    "An account with this email already exists"

            });

        }


        // ---------------------------------------------
        // Hash Password
        // ---------------------------------------------

        const hashedPassword =
            await hashPassword(password);


        // ---------------------------------------------
        // Create User
        // ---------------------------------------------

        const userId =
            await userModel.createUser(
                cleanName,
                cleanEmail,
                hashedPassword
            );


        // ---------------------------------------------
        // Registration Log
        // ---------------------------------------------

        logSecurityEvent(
            req,
            userId,
            "REGISTER",
            `New user registered with email: ${cleanEmail}`
        );


        // ---------------------------------------------
        // Success
        // ---------------------------------------------

        return res.status(201).json({

            success: true,

            message:
                "Registration successful",

            userId: userId

        });

    } catch (error) {

        console.error(
            "Registration Error:",
            error.message
        );


        return res.status(500).json({

            success: false,

            message:
                "Internal server error"

        });

    }

}


// =========================================================
// Login User
// =========================================================

async function loginUser(req, res) {

    try {

        const {
            email,
            password
        } = req.body;


        // ---------------------------------------------
        // Required Fields
        // ---------------------------------------------

        if (
            !email ||
            !password
        ) {

            logSecurityEvent(
                req,
                null,
                "LOGIN_FAILED",
                "Login attempt failed because email or password was missing."
            );

            return res.status(400).json({

                success: false,

                message:
                    "Email and password are required"

            });

        }


        // ---------------------------------------------
        // Clean Email
        // ---------------------------------------------

        const cleanEmail =
            email.trim().toLowerCase();


        // ---------------------------------------------
        // Find User
        // ---------------------------------------------

        const user =
            await userModel.findUserByEmail(
                cleanEmail
            );


        // ---------------------------------------------
        // User Not Found
        // ---------------------------------------------

        if (!user) {

            logSecurityEvent(
                req,
                null,
                "LOGIN_FAILED",
                `Failed login attempt for unknown email: ${cleanEmail}`
            );

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password"

            });

        }


        // ---------------------------------------------
        // Account Status
        // ---------------------------------------------

        if (
            user.status !== "active"
        ) {

            logSecurityEvent(
                req,
                user.id,
                "LOGIN_FAILED",
                "Login attempt blocked because the account is inactive or blocked."
            );

            return res.status(403).json({

                success: false,

                message:
                    "Your account is currently blocked"

            });

        }


        // ---------------------------------------------
        // Password Check
        // ---------------------------------------------

        const passwordMatch =
            await comparePassword(
                password,
                user.password
            );


        if (!passwordMatch) {

            logSecurityEvent(
                req,
                user.id,
                "LOGIN_FAILED",
                "Login failed because the password was incorrect."
            );

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password"

            });

        }


        // ---------------------------------------------
        // Update Last Login
        // ---------------------------------------------

        await userModel.updateLastLogin(
            user.id
        );


        // ---------------------------------------------
        // Generate Token
        // ---------------------------------------------

        const token =
            generateToken(user);


        // ---------------------------------------------
        // Successful Login Log
        // ---------------------------------------------

        logSecurityEvent(
            req,
            user.id,
            "LOGIN",
            `User logged in successfully: ${cleanEmail}`
        );


        // ---------------------------------------------
        // Success Response
        // ---------------------------------------------

        return res.status(200).json({

            success: true,

            message:
                "Login successful",

            token: token,

            user: {

                id: user.id,

                name: user.name,

                email: user.email,

                role: user.role

            }

        });

    } catch (error) {

        console.error(
            "Login Error:",
            error.message
        );


        return res.status(500).json({

            success: false,

            message:
                "Internal server error"

        });

    }

}


// =========================================================
// Logout User
// =========================================================

async function logoutUser(req, res) {

    try {

        const userId =
            req.user?.id || null;


        const email =
            req.user?.email || "unknown user";


        logSecurityEvent(
            req,
            userId,
            "LOGOUT",
            `User logged out: ${email}`
        );


        return res.status(200).json({

            success: true,

            message:
                "Logout successful"

        });

    } catch (error) {

        console.error(
            "Logout Error:",
            error.message
        );


        return res.status(500).json({

            success: false,

            message:
                "Internal server error"

        });

    }

}


// =========================================================
// Export Controllers
// =========================================================

module.exports = {

    registerUser,

    loginUser,

    logoutUser

};