// =========================================================
// SecurePass - Password Analysis Controller
// =========================================================

const {
    analyzePassword
} = require("../utils/passwordAnalyzer");

const passwordHistoryModel =
    require("../models/passwordHistoryModel");


// =========================================================
// Analyze Password and Save History
// =========================================================

async function analyzeAndSavePassword(req, res) {

    try {

        // ---------------------------------------------
        // Get Password from Request
        // ---------------------------------------------

        const {
            password
        } = req.body;


        // ---------------------------------------------
        // Validate Password
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
        // Prepare History Data
        // ---------------------------------------------

        const historyData = {

            user_id: req.user.id,

            score: analysis.score,

            strength_level:
                analysis.strengthLevel,

            password_length:
                analysis.passwordLength,

            entropy:
                analysis.entropy,

            character_pool:
                analysis.characterPool,

            has_uppercase:
                analysis.hasUppercase,

            has_lowercase:
                analysis.hasLowercase,

            has_numbers:
                analysis.hasNumbers,

            has_special:
                analysis.hasSpecial

        };


        // ---------------------------------------------
        // Save Analysis History
        // ---------------------------------------------

        const result =
            await new Promise(
                (resolve, reject) => {

                    passwordHistoryModel
                        .createPasswordHistory(
                            historyData,
                            (error, result) => {

                                if (error) {

                                    reject(error);

                                    return;

                                }

                                resolve(result);

                            }
                        );

                }
            );


        // ---------------------------------------------
        // Success Response
        // ---------------------------------------------

        return res.status(201).json({

            success: true,

            message:
                "Password analyzed and saved successfully.",

            historyId: result.insertId,

            analysis: {

                score:
                    analysis.score,

                strengthLevel:
                    analysis.strengthLevel,

                passwordLength:
                    analysis.passwordLength,

                entropy:
                    analysis.entropy,

                characterPool:
                    analysis.characterPool,

                hasUppercase:
                    analysis.hasUppercase,

                hasLowercase:
                    analysis.hasLowercase,

                hasNumbers:
                    analysis.hasNumbers,

                hasSpecial:
                    analysis.hasSpecial,

                suggestions:
                    analysis.suggestions

            }

        });


    } catch (error) {

        console.error(
            "Analyze and Save Password Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to analyze and save password."

        });

    }

}


// =========================================================
// Export
// =========================================================

module.exports = {

    analyzeAndSavePassword

};