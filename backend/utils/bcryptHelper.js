const bcrypt = require("bcrypt");


// =========================================================
// Bcrypt Configuration
// =========================================================

const SALT_ROUNDS = 12;


// =========================================================
// Hash Password
// =========================================================

async function hashPassword(password) {

    const hashedPassword = await bcrypt.hash(
        password,
        SALT_ROUNDS
    );

    return hashedPassword;
}


// =========================================================
// Compare Password
// =========================================================

async function comparePassword(password, hashedPassword) {

    const isMatch = await bcrypt.compare(
        password,
        hashedPassword
    );

    return isMatch;
}


// =========================================================
// Export Functions
// =========================================================

module.exports = {
    hashPassword,
    comparePassword
};