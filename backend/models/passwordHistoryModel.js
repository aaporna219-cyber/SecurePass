// =========================================================
// SecurePass - Password History Model
// =========================================================

const db = require("../config/db");


// =========================================================
// Create Password History
// =========================================================

function createPasswordHistory(
    historyData,
    callback
) {

    const sql = `
        INSERT INTO password_history
        (
            user_id,
            score,
            strength_level,
            password_length,
            entropy,
            character_pool,
            has_uppercase,
            has_lowercase,
            has_numbers,
            has_special
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;


    const values = [

        historyData.user_id,

        historyData.score,

        historyData.strength_level,

        historyData.password_length,

        historyData.entropy,

        historyData.character_pool,

        historyData.has_uppercase,

        historyData.has_lowercase,

        historyData.has_numbers,

        historyData.has_special

    ];


    db.pool.query(
        sql,
        values
    )
    .then(([result]) => {

        callback(
            null,
            result
        );

    })
    .catch((error) => {

        console.error(
            "Create Password History Error:",
            error
        );

        callback(
            error,
            null
        );

    });

}


// =========================================================
// Get User Password History
// =========================================================

function getPasswordHistory(
    userId,
    callback
) {

    const sql = `
        SELECT
            id,
            score,
            strength_level,
            password_length,
            entropy,
            character_pool,
            has_uppercase,
            has_lowercase,
            has_numbers,
            has_special,
            created_at
        FROM password_history
        WHERE user_id = ?
        ORDER BY created_at DESC
    `;


    db.pool.query(
        sql,
        [userId]
    )
    .then(([results]) => {

        callback(
            null,
            results
        );

    })
    .catch((error) => {

        console.error(
            "Get Password History Error:",
            error
        );

        callback(
            error,
            null
        );

    });

}


// =========================================================
// Delete Single History
// =========================================================

function deletePasswordHistory(
    historyId,
    userId,
    callback
) {

    const sql = `
        DELETE FROM password_history
        WHERE id = ?
        AND user_id = ?
    `;


    db.pool.query(
        sql,
        [
            historyId,
            userId
        ]
    )
    .then(([result]) => {

        callback(
            null,
            result
        );

    })
    .catch((error) => {

        console.error(
            "Delete Password History Error:",
            error
        );

        callback(
            error,
            null
        );

    });

}


// =========================================================
// Delete All User History
// =========================================================

function deleteAllPasswordHistory(
    userId,
    callback
) {

    const sql = `
        DELETE FROM password_history
        WHERE user_id = ?
    `;


    db.pool.query(
        sql,
        [userId]
    )
    .then(([result]) => {

        callback(
            null,
            result
        );

    })
    .catch((error) => {

        console.error(
            "Delete All Password History Error:",
            error
        );

        callback(
            error,
            null
        );

    });

}


// =========================================================
// Export
// =========================================================

module.exports = {

    createPasswordHistory,

    getPasswordHistory,

    deletePasswordHistory,

    deleteAllPasswordHistory

};