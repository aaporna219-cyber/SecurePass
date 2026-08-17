// =========================================================
// SecurePass - Password Analyzer
// Frontend + Backend Integration
// =========================================================


// =========================================================
// DOM Elements
// =========================================================

const passwordInput =
    document.getElementById("passwordInput");

const togglePassword =
    document.getElementById("togglePassword");

const passwordIcon =
    document.getElementById("passwordIcon");

const analyzeButton =
    document.getElementById("analyzeButton");

const analyzerError =
    document.getElementById("analyzerError");

const analysisResult =
    document.getElementById("analysisResult");

const scoreValue =
    document.getElementById("scoreValue");

const scoreCircle =
    document.getElementById("scoreCircle");

const strengthLevel =
    document.getElementById("strengthLevel");

const strengthDescription =
    document.getElementById("strengthDescription");

const passwordLength =
    document.getElementById("passwordLength");

const entropyValue =
    document.getElementById("entropyValue");

const characterPool =
    document.getElementById("characterPool");

const securityRisk =
    document.getElementById("securityRisk");

const uppercaseCheck =
    document.getElementById("uppercaseCheck");

const lowercaseCheck =
    document.getElementById("lowercaseCheck");

const numberCheck =
    document.getElementById("numberCheck");

const specialCheck =
    document.getElementById("specialCheck");

const patternResults =
    document.getElementById("patternResults");

const recommendationList =
    document.getElementById("recommendationList");


// =========================================================
// Backend Configuration
// =========================================================

const API_BASE_URL =
    "http://localhost:5000";


// =========================================================
// Common Passwords
// =========================================================

const commonPasswords = new Set([

    "password",
    "password1",
    "password123",
    "123456",
    "12345678",
    "123456789",
    "1234567890",
    "qwerty",
    "qwerty123",
    "admin",
    "admin123",
    "letmein",
    "welcome",
    "welcome123",
    "iloveyou",
    "monkey",
    "dragon",
    "football",
    "baseball",
    "abc123",
    "111111",
    "000000",
    "123123",
    "654321",
    "pass123",
    "secret",
    "changeme",
    "login"

]);


// =========================================================
// Keyboard Sequences
// =========================================================

const keyboardSequences = [

    "qwerty",
    "asdfgh",
    "zxcvbn",
    "qwertyui",
    "asdfghjk",
    "zxcvbnm"

];


// =========================================================
// Show / Hide Password
// =========================================================

if (togglePassword) {

    togglePassword.addEventListener(
        "click",
        () => {

            const isPassword =
                passwordInput.type === "password";

            passwordInput.type =
                isPassword
                    ? "text"
                    : "password";


            passwordIcon.classList.toggle(
                "bi-eye",
                !isPassword
            );

            passwordIcon.classList.toggle(
                "bi-eye-slash",
                isPassword
            );

        }
    );

}


// =========================================================
// Analyze Button
// =========================================================

if (analyzeButton) {

    analyzeButton.addEventListener(
        "click",
        analyzePassword
    );

}


// =========================================================
// Enter Key Support
// =========================================================

if (passwordInput) {

    passwordInput.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Enter") {

                event.preventDefault();

                analyzePassword();

            }

        }
    );

}


// =========================================================
// Get Authentication Token
// =========================================================

function getAuthToken() {

    const possibleKeys = [

        "token",
        "authToken",
        "accessToken",
        "jwtToken",
        "securePassToken"

    ];


    for (
        const key of possibleKeys
    ) {

        const token =
            localStorage.getItem(key);

        if (token) {

            return token;

        }

    }


    // Temporary support for testing
    // Example: window.user2Token

    if (window.user2Token) {

        return window.user2Token;

    }


    if (window.user1Token) {

        return window.user1Token;

    }


    return null;

}


// =========================================================
// Main Analyzer
// =========================================================

async function analyzePassword() {

    const password =
        passwordInput.value;


    clearError();


    if (!password) {

        showError(
            "Please enter a password to analyze."
        );

        analysisResult.classList.add(
            "d-none"
        );

        return;

    }


    // Disable button during request

    analyzeButton.disabled = true;

    const originalButtonHTML =
        analyzeButton.innerHTML;

    analyzeButton.innerHTML = `
        <span
            class="spinner-border spinner-border-sm me-2"
            role="status"
        ></span>
        Analyzing...
    `;


    try {

        const token =
            getAuthToken();


        let response;


        // =====================================================
        // Authenticated User
        // Analyze + Save History
        // =====================================================

        if (token) {

            response =
                await fetch(
                    `${API_BASE_URL}/api/password-analysis/analyze-save`,
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                "Bearer " + token

                        },

                        body: JSON.stringify({

                            password: password

                        })

                    }
                );

        }


        // =====================================================
        // Guest User
        // Analyze Only
        // =====================================================

        else {

            response =
                await fetch(
                    `${API_BASE_URL}/api/password/analyze`,
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body: JSON.stringify({

                            password: password

                        })

                    }
                );

        }


        const data =
            await response.json();


        // =====================================================
        // Backend Error
        // =====================================================

        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "Password analysis failed."
            );

        }


        // =====================================================
        // Backend Analysis
        // =====================================================

        const backendAnalysis =
            data.analysis;


        // =====================================================
        // Local Pattern Detection
        // =====================================================

        const patterns =
            detectPatterns(password);


        // =====================================================
        // Normalize Backend Result
        // =====================================================

        const analysis = {

            password: password,

            length:
                backendAnalysis.passwordLength,

            hasUppercase:
                backendAnalysis.hasUppercase,

            hasLowercase:
                backendAnalysis.hasLowercase,

            hasNumber:
                backendAnalysis.hasNumbers,

            hasSpecial:
                backendAnalysis.hasSpecial,

            characterPoolSize:
                backendAnalysis.characterPool,

            entropy:
                Number(
                    backendAnalysis.entropy
                ),

            score:
                Number(
                    backendAnalysis.score
                ),

            strength: {

                level:
                    backendAnalysis.strengthLevel,

                description:
                    getStrengthDescription(
                        backendAnalysis.strengthLevel
                    )

            },

            patterns:
                patterns,

            recommendations:
                Array.isArray(
                    backendAnalysis.suggestions
                )
                    ? backendAnalysis.suggestions
                    : generateRecommendations({
                        length:
                            backendAnalysis.passwordLength,

                        hasUppercase:
                            backendAnalysis.hasUppercase,

                        hasLowercase:
                            backendAnalysis.hasLowercase,

                        hasNumber:
                            backendAnalysis.hasNumbers,

                        hasSpecial:
                            backendAnalysis.hasSpecial,

                        entropy:
                            Number(
                                backendAnalysis.entropy
                            ),

                        patterns:
                            patterns,

                        score:
                            Number(
                                backendAnalysis.score
                            )
                    })

        };


        // =====================================================
        // Display Result
        // =====================================================

        displayAnalysis(
            analysis
        );


        // =====================================================
        // Success Message
        // =====================================================

        if (token && data.historyId) {

            console.log(
                "Password analysis saved successfully."
            );

            console.log(
                "History ID:",
                data.historyId
            );

        } else {

            console.log(
                "Password analyzed successfully."
            );

        }


    } catch (error) {

        console.error(
            "Password Analyzer Error:",
            error
        );


        showError(
            error.message ||
            "Unable to analyze password. Please try again."
        );


        analysisResult.classList.add(
            "d-none"
        );


    } finally {

        // Restore button

        analyzeButton.disabled = false;

        analyzeButton.innerHTML =
            originalButtonHTML;

    }

}


// =========================================================
// Strength Description
// =========================================================

function getStrengthDescription(
    level
) {

    switch (level) {

        case "Very Weak":

            return "This password is highly vulnerable and should be replaced.";


        case "Weak":

            return "This password needs significant improvement.";


        case "Medium":

            return "This password has some security features but can be improved.";


        case "Strong":

            return "This is a reasonably strong password.";


        case "Very Strong":

            return "This password has strong length and character diversity.";


        default:

            return "Password strength has been analyzed.";

    }

}


// =========================================================
// Detect Password Patterns
// =========================================================

function detectPatterns(
    password
) {

    const patterns = [];


    const lowerPassword =
        password.toLowerCase();


    // Common Password

    if (
        commonPasswords.has(
            lowerPassword
        )
    ) {

        patterns.push(
            "This is a commonly used password."
        );

    }


    // Sequential Numbers

    if (
        /0123|1234|2345|3456|4567|5678|6789|7890/
            .test(lowerPassword)
    ) {

        patterns.push(
            "Sequential numbers detected."
        );

    }


    // Reverse Sequential Numbers

    if (
        /9876|8765|7654|6543|5432|4321|3210/
            .test(lowerPassword)
    ) {

        patterns.push(
            "Reverse number sequence detected."
        );

    }


    // Keyboard Patterns

    for (
        const sequence of keyboardSequences
    ) {

        if (
            lowerPassword.includes(
                sequence
            )
        ) {

            patterns.push(
                "Keyboard pattern detected."
            );

            break;

        }

    }


    // Repeated Characters

    if (
        /(.)\1{2,}/.test(password)
    ) {

        patterns.push(
            "Repeated characters detected."
        );

    }


    // Repeated Groups

    if (
        /^(.+)\1+$/.test(password) &&
        password.length >= 4
    ) {

        patterns.push(
            "Repeated password pattern detected."
        );

    }


    // Date-like Pattern

    if (
        /^(19|20)\d{2}/.test(password) ||
        /\d{2}[/-]\d{2}/.test(password)
    ) {

        patterns.push(
            "Possible date pattern detected."
        );

    }


    // Only Numbers

    if (
        /^\d+$/.test(password)
    ) {

        patterns.push(
            "Password contains only numbers."
        );

    }


    // Only Letters

    if (
        /^[A-Za-z]+$/.test(password)
    ) {

        patterns.push(
            "Password contains only letters."
        );

    }


    return patterns;

}


// =========================================================
// Generate Recommendations
// =========================================================

function generateRecommendations(
    data
) {

    const recommendations = [];


    const {

        length,

        hasUppercase,

        hasLowercase,

        hasNumber,

        hasSpecial,

        entropy,

        patterns,

        score

    } = data;


    if (length < 12) {

        recommendations.push(
            "Use at least 12 characters. Longer passwords are generally harder to guess."
        );

    }


    if (!hasUppercase) {

        recommendations.push(
            "Add uppercase letters to increase character diversity."
        );

    }


    if (!hasLowercase) {

        recommendations.push(
            "Add lowercase letters to increase character diversity."
        );

    }


    if (!hasNumber) {

        recommendations.push(
            "Add numbers to increase the possible character combinations."
        );

    }


    if (!hasSpecial) {

        recommendations.push(
            "Add special characters such as !, @, #, or $."
        );

    }


    if (entropy < 50) {

        recommendations.push(
            "Increase password length and character diversity to improve estimated entropy."
        );

    }


    if (
        patterns &&
        patterns.length > 0
    ) {

        recommendations.push(
            "Avoid predictable sequences, repeated characters, keyboard patterns, and common passwords."
        );

    }


    if (score >= 80) {

        recommendations.push(
            "Good job! Continue using unique passwords for different accounts."
        );

    }


    if (
        recommendations.length === 0
    ) {

        recommendations.push(
            "Your password has a good combination of length and character diversity."
        );

    }


    return recommendations;

}


// =========================================================
// Display Analysis
// =========================================================

function displayAnalysis(
    analysis
) {

    analysisResult.classList.remove(
        "d-none"
    );


    // =====================================================
    // Score
    // =====================================================

    scoreValue.textContent =
        analysis.score;


    strengthLevel.textContent =
        analysis.strength.level;


    strengthDescription.textContent =
        analysis.strength.description;


    // =====================================================
    // Statistics
    // =====================================================

    passwordLength.textContent =
        analysis.length;


    entropyValue.textContent =
        Number(
            analysis.entropy
        ).toFixed(2);


    characterPool.textContent =
        analysis.characterPoolSize;


    // =====================================================
    // Security Risk
    // =====================================================

    securityRisk.textContent =
        getSecurityRisk(
            analysis.score
        );


    // =====================================================
    // Character Checks
    // =====================================================

    updateCharacterCheck(

        uppercaseCheck,

        analysis.hasUppercase,

        "Uppercase"

    );


    updateCharacterCheck(

        lowercaseCheck,

        analysis.hasLowercase,

        "Lowercase"

    );


    updateCharacterCheck(

        numberCheck,

        analysis.hasNumber,

        "Numbers"

    );


    updateCharacterCheck(

        specialCheck,

        analysis.hasSpecial,

        "Special Characters"

    );


    // =====================================================
    // Pattern Results
    // =====================================================

    displayPatterns(
        analysis.patterns
    );


    // =====================================================
    // Recommendations
    // =====================================================

    displayRecommendations(
        analysis.recommendations
    );


    // =====================================================
    // Score Circle
    // =====================================================

    updateScoreCircle(
        analysis.score
    );

}


// =========================================================
// Character Check UI
// =========================================================

function updateCharacterCheck(
    element,
    exists,
    label
) {

    if (exists) {

        element.innerHTML = `

            <i
                class="bi bi-check-circle-fill text-success me-2"
            ></i>

            ${label}

            <span
                class="badge text-bg-success float-end"
            >
                Found
            </span>

        `;

    } else {

        element.innerHTML = `

            <i
                class="bi bi-x-circle-fill text-danger me-2"
            ></i>

            ${label}

            <span
                class="badge text-bg-danger float-end"
            >
                Missing
            </span>

        `;

    }

}


// =========================================================
// Pattern Results UI
// =========================================================

function displayPatterns(
    patterns
) {

    if (
        !patterns ||
        patterns.length === 0
    ) {

        patternResults.innerHTML = `

            <div class="text-success">

                <i
                    class="bi bi-check-circle-fill me-2"
                ></i>

                No obvious weak patterns detected.

            </div>

        `;

        return;

    }


    patternResults.innerHTML = `

        <ul
            class="list-group list-group-flush"
        >

            ${patterns
                .map(
                    (pattern) => `

                        <li
                            class="list-group-item px-0"
                        >

                            <i
                                class="bi bi-exclamation-triangle-fill text-warning me-2"
                            ></i>

                            ${escapeHTML(pattern)}

                        </li>

                    `
                )
                .join("")}

        </ul>

    `;

}


// =========================================================
// Recommendations UI
// =========================================================

function displayRecommendations(
    recommendations
) {

    recommendationList.innerHTML =
        "";


    recommendations.forEach(
        (recommendation) => {

            const li =
                document.createElement(
                    "li"
                );


            li.className =
                "list-group-item px-0";


            li.innerHTML = `

                <i
                    class="bi bi-lightbulb-fill text-success me-2"
                ></i>

                ${escapeHTML(
                    recommendation
                )}

            `;


            recommendationList.appendChild(
                li
            );

        }
    );

}


// =========================================================
// Security Risk
// =========================================================

function getSecurityRisk(
    score
) {

    if (score < 20) {

        return "Critical";

    }


    if (score < 40) {

        return "High";

    }


    if (score < 60) {

        return "Moderate";

    }


    if (score < 80) {

        return "Low";

    }


    return "Very Low";

}


// =========================================================
// Score Circle
// =========================================================

function updateScoreCircle(
    score
) {

    scoreCircle.classList.remove(

        "border-danger",

        "border-warning",

        "border-info",

        "border-success"

    );


    if (score < 40) {

        scoreCircle.classList.add(
            "border-danger"
        );

    }

    else if (score < 60) {

        scoreCircle.classList.add(
            "border-warning"
        );

    }

    else if (score < 80) {

        scoreCircle.classList.add(
            "border-info"
        );

    }

    else {

        scoreCircle.classList.add(
            "border-success"
        );

    }

}


// =========================================================
// Error Handling
// =========================================================

function showError(
    message
) {

    analyzerError.textContent =
        message;


    analyzerError.classList.remove(
        "d-none"
    );

}


// =========================================================
// Clear Error
// =========================================================

function clearError() {

    analyzerError.textContent =
        "";


    analyzerError.classList.add(
        "d-none"
    );

}


// =========================================================
// Escape HTML
// =========================================================

function escapeHTML(
    value
) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}