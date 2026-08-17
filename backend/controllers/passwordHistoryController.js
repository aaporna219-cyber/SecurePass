// =========================================================
// SecurePass - Password History Controller
// =========================================================

const passwordHistoryModel =
    require("../models/passwordHistoryModel");


// =========================================================
// Save Password Analysis
// =========================================================

function savePasswordAnalysis(
    req,
    res
) {

    try {

        // -------------------------------------------------
        // Get logged-in user
        // -------------------------------------------------

        const userId =
            req.user?.id;


        if (!userId) {

            return res.status(401).json({

                success: false,

                message:
                    "Authentication required."

            });

        }


        // -------------------------------------------------
        // Get analysis data
        // -------------------------------------------------

        const {

            score,

            strength_level,

            password_length,

            entropy,

            character_pool,

            has_uppercase,

            has_lowercase,

            has_numbers,

            has_special

        } = req.body;


        // -------------------------------------------------
        // Validate required fields
        // -------------------------------------------------

        if (
            score === undefined ||
            strength_level === undefined ||
            password_length === undefined ||
            entropy === undefined ||
            character_pool === undefined
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Required analysis data is missing."

            });

        }


        // -------------------------------------------------
        // Validate score
        // -------------------------------------------------

        if (
            !Number.isInteger(
                Number(score)
            ) ||
            Number(score) < 0 ||
            Number(score) > 100
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Score must be an integer between 0 and 100."

            });

        }


        // -------------------------------------------------
        // Validate password length
        // -------------------------------------------------

        if (
            !Number.isInteger(
                Number(password_length)
            ) ||
            Number(password_length) <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid password length."

            });

        }


        // -------------------------------------------------
        // Prepare history data
        // -------------------------------------------------

        const historyData = {

            user_id: userId,

            score: Number(score),

            strength_level:
                String(strength_level),

            password_length:
                Number(password_length),

            entropy:
                Number(entropy),

            character_pool:
                Number(character_pool),

            has_uppercase:
                Boolean(has_uppercase),

            has_lowercase:
                Boolean(has_lowercase),

            has_numbers:
                Boolean(has_numbers),

            has_special:
                Boolean(has_special)

        };


        // -------------------------------------------------
        // Save to database
        // -------------------------------------------------

        passwordHistoryModel.createPasswordHistory(

            historyData,

            (error, result) => {

                if (error) {

                    console.error(
                        "Save Password Analysis Error:",
                        error
                    );


                    return res.status(500).json({

                        success: false,

                        message:
                            "Failed to save password analysis."

                    });

                }


                return res.status(201).json({

                    success: true,

                    message:
                        "Password analysis saved successfully.",

                    historyId:
                        result.insertId

                });

            }

        );

    } catch (error) {

        console.error(
            "Password History Controller Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Internal server error."

        });

    }

}


// =========================================================
// Get Password History
// =========================================================

function getPasswordHistory(
    req,
    res
) {

    try {

        const userId =
            req.user?.id;


        if (!userId) {

            return res.status(401).json({

                success: false,

                message:
                    "Authentication required."

            });

        }


        passwordHistoryModel.getPasswordHistory(

            userId,

            (error, results) => {

                if (error) {

                    console.error(
                        "Get Password History Error:",
                        error
                    );


                    return res.status(500).json({

                        success: false,

                        message:
                            "Failed to retrieve password history."

                    });

                }


                return res.status(200).json({

                    success: true,

                    count: results.length,

                    history: results

                });

            }

        );

    } catch (error) {

        console.error(
            "Password History Controller Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Internal server error."

        });

    }

}


// =========================================================
// Delete Single History
// =========================================================

function deletePasswordHistory(
    req,
    res
) {

    try {

        const userId =
            req.user?.id;


        const historyId =
            Number(
                req.params.id
            );


        if (!userId) {

            return res.status(401).json({

                success: false,

                message:
                    "Authentication required."

            });

        }


        if (
            !Number.isInteger(historyId) ||
            historyId <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid history ID."

            });

        }


        passwordHistoryModel.deletePasswordHistory(

            historyId,

            userId,

            (error, result) => {

                if (error) {

                    console.error(
                        "Delete Password History Error:",
                        error
                    );


                    return res.status(500).json({

                        success: false,

                        message:
                            "Failed to delete password history."

                    });

                }


                if (
                    result.affectedRows === 0
                ) {

                    return res.status(404).json({

                        success: false,

                        message:
                            "Password history not found."

                    });

                }


                return res.status(200).json({

                    success: true,

                    message:
                        "Password history deleted successfully."

                });

            }

        );

    } catch (error) {

        console.error(
            "Delete Password History Controller Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Internal server error."

        });

    }

}


// =========================================================
// Delete All History
// =========================================================

function deleteAllPasswordHistory(
    req,
    res
) {

    try {

        const userId =
            req.user?.id;


        if (!userId) {

            return res.status(401).json({

                success: false,

                message:
                    "Authentication required."

            });

        }


        passwordHistoryModel.deleteAllPasswordHistory(

            userId,

            (error, result) => {

                if (error) {

                    console.error(
                        "Delete All Password History Error:",
                        error
                    );


                    return res.status(500).json({

                        success: false,

                        message:
                            "Failed to delete password history."

                    });

                }


                return res.status(200).json({

                    success: true,

                    message:
                        "All password history deleted successfully.",

                    deletedCount:
                        result.affectedRows

                });

            }

        );

    } catch (error) {

        console.error(
            "Delete All Password History Controller Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Internal server error."

        });

    }

}


// =========================================================
// Export
// =========================================================

module.exports = {

    savePasswordAnalysis,

    getPasswordHistory,

    deletePasswordHistory,

    deleteAllPasswordHistory

};