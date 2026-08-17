// =========================================================
// SecurePass - Password Analyzer Controller
// =========================================================

const {
    analyzePassword
} = require("../utils/passwordAnalyzer");


// =========================================================
// Analyze Password
// =========================================================

function analyzePasswordController(req, res) {

    try {

        const {
            password
        } = req.body;


        // ---------------------------------------------
        // Required Field Validation
        // ---------------------------------------------

        if (
            password === undefined ||
            password === null
        ) {

            return res.status(400).json({

                success: false,

                message: "Password is required"

            });

        }


        // ---------------------------------------------
        // Password Type Validation
        // ---------------------------------------------

        if (typeof password !== "string") {

            return res.status(400).json({

                success: false,

                message: "Password must be a string"

            });

        }


        // ---------------------------------------------
        // Analyze Password
        // ---------------------------------------------

        const analysis =
            analyzePassword(password);


        // ---------------------------------------------
        // Success Response
        // ---------------------------------------------

        return res.status(200).json({

            success: true,

            message: "Password analyzed successfully",

            analysis

        });


    } catch (error) {

        console.error(
            "Password Analyzer Controller Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message: "Internal server error"

        });

    }

}


// =========================================================
// Export
// =========================================================

module.exports = {

    analyzePasswordController

};