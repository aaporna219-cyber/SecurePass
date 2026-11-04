// =========================================================
// SecurePass - Security Log Model
// =========================================================

const db = require("../config/db");


// =========================================================
// Create Security Log
// =========================================================

function createSecurityLog(
    logData,
    callback
) {

    const sql = `
        INSERT INTO security_logs
        (
            user_id,
            action,
            description,
            ip_address,
            user_agent
        )
        VALUES (?, ?, ?, ?, ?)
    `;


    const values = [

        logData.user_id || null,

        logData.action,

        logData.description || null,

        logData.ip_address || null,

        logData.user_agent || null

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
            "Create Security Log Error:",
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
    createSecurityLog
};