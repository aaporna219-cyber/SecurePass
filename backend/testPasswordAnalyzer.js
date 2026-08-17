const { analyzePassword } = require("./utils/passwordAnalyzer");


// =========================================================
// Test Password Analyzer
// =========================================================

const testPasswords = [
    "abc",
    "password123",
    "Password123",
    "Password@123",
    "Secure@Password12345"
];


console.log("========================================");
console.log("SecurePass Password Analyzer Test");
console.log("========================================");


testPasswords.forEach((password, index) => {

    console.log(`\nTest ${index + 1}`);
    console.log("----------------------------------------");

    console.log("Password:", password);

    const result =
        analyzePassword(password);

    console.log("Score:", result.score);

    console.log(
        "Strength:",
        result.strengthLevel
    );

    console.log(
        "Length:",
        result.passwordLength
    );

    console.log(
        "Entropy:",
        result.entropy
    );

    console.log(
        "Character Pool:",
        result.characterPool
    );

    console.log(
        "Uppercase:",
        result.hasUppercase
    );

    console.log(
        "Lowercase:",
        result.hasLowercase
    );

    console.log(
        "Numbers:",
        result.hasNumbers
    );

    console.log(
        "Special:",
        result.hasSpecial
    );

    console.log(
        "Suggestions:",
        result.suggestions
    );

});


console.log("\n========================================");
console.log("Analyzer Test Completed");
console.log("========================================");