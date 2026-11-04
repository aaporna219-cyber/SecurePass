// =========================================================
// SecurePass - Admin Middleware
// =========================================================

// Check whether logged-in user is an administrator

const adminMiddleware = (req, res, next) => {

    try {

        // authMiddleware should set req.user
        if (!req.user) {

            return res.status(401).json({
                success: false,
                message: "Authentication required."
            });

        }


        // Get role safely
        const role =
            String(req.user.role || "")
                .trim()
                .toLowerCase();


        // Allow only admin users
        if (role !== "admin") {

            return res.status(403).json({
                success: false,
                message: "Access denied. Admin privileges required."
            });

        }


        // User is admin
        next();

    } catch (error) {

        console.error(
            "Admin Middleware Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Authorization check failed."
        });

    }

};


// =========================================================
// Export Middleware
// =========================================================

module.exports = adminMiddleware;