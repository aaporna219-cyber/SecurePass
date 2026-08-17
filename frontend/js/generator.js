// =========================================================
// SecurePass - Secure Password Generator
// =========================================================


// =========================================================
// DOM Elements
// =========================================================

const generatedPassword =
    document.getElementById("generatedPassword");

const passwordLengthSlider =
    document.getElementById("passwordLength");

const lengthValue =
    document.getElementById("lengthValue");

const includeLowercase =
    document.getElementById("includeLowercase");

const includeUppercase =
    document.getElementById("includeUppercase");

const includeNumbers =
    document.getElementById("includeNumbers");

const includeSpecial =
    document.getElementById("includeSpecial");

const generateButton =
    document.getElementById("generateButton");

const copyButton =
    document.getElementById("copyButton");

const copyMessage =
    document.getElementById("copyMessage");

const generatorError =
    document.getElementById("generatorError");

const generatedStrength =
    document.getElementById("generatedStrength");

const generatedLength =
    document.getElementById("generatedLength");

const characterTypes =
    document.getElementById("characterTypes");


// =========================================================
// Character Sets
// =========================================================

const LOWERCASE =
    "abcdefghijklmnopqrstuvwxyz";

const UPPERCASE =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const NUMBERS =
    "0123456789";

const SPECIAL =
    "!@#$%^&*()_+-=[]{}|;:,.<>?";


// =========================================================
// Update Length Display
// =========================================================

passwordLengthSlider.addEventListener(
    "input",
    () => {

        lengthValue.textContent =
            passwordLengthSlider.value;

    }
);


// =========================================================
// Generate Button
// =========================================================

generateButton.addEventListener(
    "click",
    generatePassword
);


// =========================================================
// Generate Initial Password
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        generatePassword();

    }
);


// =========================================================
// Main Password Generation
// =========================================================

function generatePassword() {

    clearGeneratorError();


    const length =
        Number(
            passwordLengthSlider.value
        );


    const selectedSets =
        getSelectedCharacterSets();


    if (selectedSets.length === 0) {

        showGeneratorError(
            "Please select at least one character type."
        );

        generatedPassword.value = "";

        resetPasswordInformation();

        return;

    }


    if (
        length < selectedSets.length
    ) {

        showGeneratorError(
            "Password length must be at least equal to the number of selected character types."
        );

        return;

    }


    const password =
        createSecurePassword(
            length,
            selectedSets
        );


    const shuffledPassword =
        secureShuffle(
            password
        );


    generatedPassword.value =
        shuffledPassword;


    updatePasswordInformation(
        shuffledPassword,
        selectedSets.length
    );

}


// =========================================================
// Get Selected Character Sets
// =========================================================

function getSelectedCharacterSets() {

    const selectedSets = [];


    if (
        includeLowercase.checked
    ) {

        selectedSets.push(
            LOWERCASE
        );

    }


    if (
        includeUppercase.checked
    ) {

        selectedSets.push(
            UPPERCASE
        );

    }


    if (
        includeNumbers.checked
    ) {

        selectedSets.push(
            NUMBERS
        );

    }


    if (
        includeSpecial.checked
    ) {

        selectedSets.push(
            SPECIAL
        );

    }


    return selectedSets;

}


// =========================================================
// Create Secure Password
// =========================================================

function createSecurePassword(
    length,
    selectedSets
) {

    let password = "";


    // ---------------------------------------------------------
    // Guarantee at least one character from every selected type
    // ---------------------------------------------------------

    selectedSets.forEach(
        (characterSet) => {

            password +=
                getSecureRandomCharacter(
                    characterSet
                );

        }
    );


    // ---------------------------------------------------------
    // Combined character pool
    // ---------------------------------------------------------

    const combinedPool =
        selectedSets.join("");


    // ---------------------------------------------------------
    // Fill remaining positions
    // ---------------------------------------------------------

    while (
        password.length < length
    ) {

        password +=
            getSecureRandomCharacter(
                combinedPool
            );

    }


    return password;

}


// =========================================================
// Secure Random Character
// =========================================================

function getSecureRandomCharacter(
    characterSet
) {

    if (
        !characterSet ||
        characterSet.length === 0
    ) {

        throw new Error(
            "Character set cannot be empty."
        );

    }


    const randomValues =
        new Uint32Array(1);


    const maxUint32 =
        0xFFFFFFFF;


    const limit =
        maxUint32 -
        (
            maxUint32 %
            characterSet.length
        );


    let randomNumber;


    // ---------------------------------------------------------
    // Rejection sampling
    // ---------------------------------------------------------

    do {

        crypto.getRandomValues(
            randomValues
        );


        randomNumber =
            randomValues[0];

    } while (
        randomNumber >= limit
    );


    return characterSet[
        randomNumber %
        characterSet.length
    ];

}


// =========================================================
// Secure Shuffle
// =========================================================

function secureShuffle(
    value
) {

    const characters =
        value.split("");


    for (
        let i = characters.length - 1;
        i > 0;
        i--
    ) {

        const randomValues =
            new Uint32Array(1);


        crypto.getRandomValues(
            randomValues
        );


        const randomIndex =
            randomValues[0] %
            (i + 1);


        [
            characters[i],
            characters[randomIndex]
        ] = [
            characters[randomIndex],
            characters[i]
        ];

    }


    return characters.join("");

}


// =========================================================
// Copy Password
// =========================================================

copyButton.addEventListener(
    "click",
    async () => {

        const password =
            generatedPassword.value;


        if (!password) {

            showGeneratorError(
                "Generate a password before copying it."
            );

            return;

        }


        try {

            await navigator.clipboard.writeText(
                password
            );


            showCopyMessage();


        } catch (error) {

            // -------------------------------------------------
            // Fallback for environments where Clipboard API
            // is unavailable
            // -------------------------------------------------

            fallbackCopy(
                password
            );

        }

    }
);


// =========================================================
// Clipboard Fallback
// =========================================================

function fallbackCopy(
    value
) {

    const temporaryInput =
        document.createElement("textarea");


    temporaryInput.value =
        value;


    temporaryInput.style.position =
        "fixed";


    temporaryInput.style.opacity =
        "0";


    document.body.appendChild(
        temporaryInput
    );


    temporaryInput.focus();

    temporaryInput.select();


    try {

        const successful =
            document.execCommand(
                "copy"
            );


        if (successful) {

            showCopyMessage();

        } else {

            showGeneratorError(
                "Unable to copy the password automatically."
            );

        }

    } catch (error) {

        showGeneratorError(
            "Unable to copy the password."
        );

    }


    document.body.removeChild(
        temporaryInput
    );

}


// =========================================================
// Show Copy Message
// =========================================================

function showCopyMessage() {

    copyMessage.classList.remove(
        "d-none"
    );


    setTimeout(
        () => {

            copyMessage.classList.add(
                "d-none"
            );

        },
        2500
    );

}


// =========================================================
// Update Password Information
// =========================================================

function updatePasswordInformation(
    password,
    selectedTypeCount
) {

    generatedLength.textContent =
        password.length;


    characterTypes.textContent =
        selectedTypeCount;


    const strength =
        calculateGeneratedStrength(
            password
        );


    generatedStrength.textContent =
        strength;


    generatedStrength.classList.remove(
        "text-danger",
        "text-warning",
        "text-info",
        "text-success"
    );


    if (
        strength === "Very Weak" ||
        strength === "Weak"
    ) {

        generatedStrength.classList.add(
            "text-danger"
        );

    } else if (
        strength === "Medium"
    ) {

        generatedStrength.classList.add(
            "text-warning"
        );

    } else if (
        strength === "Strong"
    ) {

        generatedStrength.classList.add(
            "text-info"
        );

    } else {

        generatedStrength.classList.add(
            "text-success"
        );

    }

}


// =========================================================
// Calculate Generated Password Strength
// =========================================================

function calculateGeneratedStrength(
    password
) {

    const length =
        password.length;


    const hasLowercase =
        /[a-z]/.test(password);


    const hasUppercase =
        /[A-Z]/.test(password);


    const hasNumber =
        /[0-9]/.test(password);


    const hasSpecial =
        /[^A-Za-z0-9]/.test(password);


    let poolSize = 0;


    if (hasLowercase) {

        poolSize += 26;

    }


    if (hasUppercase) {

        poolSize += 26;

    }


    if (hasNumber) {

        poolSize += 10;

    }


    if (hasSpecial) {

        poolSize += 33;

    }


    let entropy = 0;


    if (
        poolSize > 0
    ) {

        entropy =
            length *
            Math.log2(poolSize);

    }


    // ---------------------------------------------------------
    // Generated passwords are designed to be random,
    // so entropy + length are the main indicators here.
    // ---------------------------------------------------------

    if (
        length >= 20 &&
        entropy >= 100
    ) {

        return "Very Strong";

    }


    if (
        length >= 16 &&
        entropy >= 80
    ) {

        return "Very Strong";

    }


    if (
        length >= 14 &&
        entropy >= 70
    ) {

        return "Strong";

    }


    if (
        length >= 12 &&
        entropy >= 60
    ) {

        return "Strong";

    }


    if (
        length >= 10 &&
        entropy >= 45
    ) {

        return "Medium";

    }


    if (
        length >= 8
    ) {

        return "Medium";

    }


    return "Weak";

}


// =========================================================
// Error Handling
// =========================================================

function showGeneratorError(
    message
) {

    generatorError.textContent =
        message;


    generatorError.classList.remove(
        "d-none"
    );

}


// =========================================================
// Clear Error
// =========================================================

function clearGeneratorError() {

    generatorError.textContent = "";


    generatorError.classList.add(
        "d-none"
    );

}


// =========================================================
// Reset Information
// =========================================================

function resetPasswordInformation() {

    generatedStrength.textContent =
        "-";


    generatedLength.textContent =
        "0";


    characterTypes.textContent =
        "0";

}