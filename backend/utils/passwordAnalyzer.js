// =========================================================
// SecurePass - Password Analyzer
// =========================================================


// =========================================================
// Character Sets
// =========================================================

const CHARACTER_SETS = {

    lowercase: "abcdefghijklmnopqrstuvwxyz",

    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",

    numbers: "0123456789",

    special: "!@#$%^&*()_+-=[]{}|;:',.<>?/`~\\\""


};


// =========================================================
// Analyze Password
// =========================================================

function analyzePassword(password) {

    // ---------------------------------------------
    // Basic Validation
    // ---------------------------------------------

    if (typeof password !== "string") {

        throw new Error(
            "Password must be a string"
        );

    }


    if (password.length === 0) {

        return {

            score: 0,

            strengthLevel: "Very Weak",

            passwordLength: 0,

            entropy: 0,

            characterPool: 0,

            hasUppercase: false,

            hasLowercase: false,

            hasNumbers: false,

            hasSpecial: false,

            suggestions: [

                "Enter a password to analyze"

            ]

        };

    }


    // ---------------------------------------------
    // Character Checks
    // ---------------------------------------------

    const hasUppercase =
        /[A-Z]/.test(password);

    const hasLowercase =
        /[a-z]/.test(password);

    const hasNumbers =
        /[0-9]/.test(password);

    const hasSpecial =
        /[^A-Za-z0-9]/.test(password);


    // ---------------------------------------------
    // Password Length
    // ---------------------------------------------

    const passwordLength =
        password.length;


    // ---------------------------------------------
    // Calculate Character Pool
    // ---------------------------------------------

    let characterPool = 0;


    if (hasLowercase) {

        characterPool +=
            CHARACTER_SETS.lowercase.length;

    }


    if (hasUppercase) {

        characterPool +=
            CHARACTER_SETS.uppercase.length;

    }


    if (hasNumbers) {

        characterPool +=
            CHARACTER_SETS.numbers.length;

    }


    if (hasSpecial) {

        characterPool +=
            32;

    }


    // ---------------------------------------------
    // Entropy Calculation
    // Formula:
    //
    // Entropy = Length × log2(Character Pool)
    // ---------------------------------------------

    let entropy = 0;


    if (characterPool > 0) {

        entropy =
            passwordLength *
            Math.log2(characterPool);

    }


    // ---------------------------------------------
    // Round Entropy
    // ---------------------------------------------

    entropy =
        Number(entropy.toFixed(2));


    // ---------------------------------------------
    // Score Calculation
    // ---------------------------------------------

    let score = 0;


    // Length score
    if (passwordLength >= 8) {

        score += 20;

    }

    if (passwordLength >= 12) {

        score += 10;

    }

    if (passwordLength >= 16) {

        score += 10;

    }


    // Character diversity score

    if (hasLowercase) {

        score += 10;

    }


    if (hasUppercase) {

        score += 10;

    }


    if (hasNumbers) {

        score += 10;

    }


    if (hasSpecial) {

        score += 15;

    }


    // Entropy score

    if (entropy >= 40) {

        score += 5;

    }


    if (entropy >= 60) {

        score += 5;

    }


    if (entropy >= 80) {

        score += 5;

    }


    // Maximum score

    if (score > 100) {

        score = 100;

    }


    // ---------------------------------------------
    // Strength Level
    // ---------------------------------------------

    let strengthLevel;


    if (score < 30) {

        strengthLevel = "Very Weak";

    }

    else if (score < 50) {

        strengthLevel = "Weak";

    }

    else if (score < 70) {

        strengthLevel = "Medium";

    }

    else if (score < 90) {

        strengthLevel = "Strong";

    }

    else {

        strengthLevel = "Very Strong";

    }


    // ---------------------------------------------
    // Security Suggestions
    // ---------------------------------------------

    const suggestions = [];


    if (passwordLength < 8) {

        suggestions.push(
            "Use at least 8 characters"
        );

    }


    if (passwordLength < 12) {

        suggestions.push(
            "For better security, use at least 12 characters"
        );

    }


    if (!hasUppercase) {

        suggestions.push(
            "Add uppercase letters"
        );

    }


    if (!hasLowercase) {

        suggestions.push(
            "Add lowercase letters"
        );

    }


    if (!hasNumbers) {

        suggestions.push(
            "Add numbers"
        );

    }


    if (!hasSpecial) {

        suggestions.push(
            "Add special characters"
        );

    }


    if (entropy < 50) {

        suggestions.push(
            "Increase password complexity to improve entropy"
        );

    }


    if (suggestions.length === 0) {

        suggestions.push(
            "Your password has good security characteristics"
        );

    }


    // ---------------------------------------------
    // Return Analysis Result
    // ---------------------------------------------

    return {

        score,

        strengthLevel,

        passwordLength,

        entropy,

        characterPool,

        hasUppercase,

        hasLowercase,

        hasNumbers,

        hasSpecial,

        suggestions

    };

}


// =========================================================
// Export
// =========================================================

module.exports = {

    analyzePassword

};