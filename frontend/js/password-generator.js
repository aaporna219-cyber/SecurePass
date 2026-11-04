// =========================================================
// SecurePass - Password Generator
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // Get Elements
    // =====================================================

    const lengthInput =
        document.getElementById("passwordLength") ||
        document.getElementById("length");

    const uppercaseCheckbox =
        document.getElementById("includeUppercase") ||
        document.getElementById("uppercase");

    const lowercaseCheckbox =
        document.getElementById("includeLowercase") ||
        document.getElementById("lowercase");

    const numbersCheckbox =
        document.getElementById("includeNumbers") ||
        document.getElementById("numbers");

    const specialCheckbox =
        document.getElementById("includeSpecial") ||
        document.getElementById("includeSymbols") ||
        document.getElementById("special") ||
        document.getElementById("symbols");

    const generateButton =
        document.getElementById("generateButton") ||
        document.getElementById("generatePassword");

    const copyButton =
        document.getElementById("copyButton") ||
        document.getElementById("copyPassword");

    const generatedPassword =
        document.getElementById("generatedPassword") ||
        document.getElementById("passwordOutput");

    const generatorError =
        document.getElementById("generatorError");

    const strengthText =
        document.getElementById("generatorStrength") ||
        document.getElementById("strengthText");

    // =====================================================
    // Character Sets
    // =====================================================

    const UPPERCASE =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    const LOWERCASE =
        "abcdefghijklmnopqrstuvwxyz";

    const NUMBERS =
        "0123456789";

    const SPECIAL =
        "!@#$%^&*()_+-=[]{}|;:,.<>?";



    // =====================================================
    // Generate Secure Random Character
    // =====================================================

    function getRandomCharacter(characters) {

        const randomArray =
            new Uint32Array(1);

        window.crypto.getRandomValues(randomArray);

        return characters[
            randomArray[0] % characters.length
        ];
    }



    // =====================================================
    // Shuffle Password
    // =====================================================

    function shuffleArray(array) {

        for (
            let i = array.length - 1;
            i > 0;
            i--
        ) {

            const randomArray =
                new Uint32Array(1);

            window.crypto.getRandomValues(randomArray);

            const j =
                randomArray[0] % (i + 1);

            [
                array[i],
                array[j]
            ] = [
                array[j],
                array[i]
            ];
        }

        return array;
    }



    // =====================================================
    // Validate Generator Settings
    // =====================================================

    function validateSettings() {

        const length =
            parseInt(
                lengthInput?.value || 12,
                10
            );

        const useUppercase =
            uppercaseCheckbox
                ? uppercaseCheckbox.checked
                : true;

        const useLowercase =
            lowercaseCheckbox
                ? lowercaseCheckbox.checked
                : true;

        const useNumbers =
            numbersCheckbox
                ? numbersCheckbox.checked
                : true;

        const useSpecial =
            specialCheckbox
                ? specialCheckbox.checked
                : true;


        if (
            Number.isNaN(length) ||
            length < 6 ||
            length > 100
        ) {

            showError(
                "Password length must be between 6 and 100."
            );

            return null;
        }


        if (
            !useUppercase &&
            !useLowercase &&
            !useNumbers &&
            !useSpecial
        ) {

            showError(
                "Please select at least one character type."
            );

            return null;
        }


        const selectedTypes = [];

        if (useUppercase) {
            selectedTypes.push(UPPERCASE);
        }

        if (useLowercase) {
            selectedTypes.push(LOWERCASE);
        }

        if (useNumbers) {
            selectedTypes.push(NUMBERS);
        }

        if (useSpecial) {
            selectedTypes.push(SPECIAL);
        }


        if (selectedTypes.length > length) {

            showError(
                "Password length is too short for the selected character types."
            );

            return null;
        }


        return {
            length,
            selectedTypes
        };
    }



    // =====================================================
    // Generate Password
    // =====================================================

    function generatePassword() {

        clearError();

        const settings =
            validateSettings();

        if (!settings) {
            return;
        }

        const {
            length,
            selectedTypes
        } = settings;


        const passwordCharacters = [];


        // -------------------------------------------------
        // Guarantee one character from each selected type
        // -------------------------------------------------

        selectedTypes.forEach(
            (characterSet) => {

                passwordCharacters.push(
                    getRandomCharacter(characterSet)
                );

            }
        );


        // -------------------------------------------------
        // Combine all selected character sets
        // -------------------------------------------------

        const allCharacters =
            selectedTypes.join("");


        // -------------------------------------------------
        // Fill remaining characters
        // -------------------------------------------------

        while (
            passwordCharacters.length < length
        ) {

            passwordCharacters.push(
                getRandomCharacter(allCharacters)
            );

        }


        // -------------------------------------------------
        // Shuffle Password
        // -------------------------------------------------

        shuffleArray(passwordCharacters);


        const password =
            passwordCharacters.join("");


        // -------------------------------------------------
        // Display Password
        // -------------------------------------------------

        if (generatedPassword) {

            generatedPassword.value =
                password;

            generatedPassword.textContent =
                password;
        }


        // -------------------------------------------------
        // Copy Button Enable
        // -------------------------------------------------

        if (copyButton) {

            copyButton.disabled = false;
        }


        // -------------------------------------------------
        // Display Strength
        // -------------------------------------------------

        updateStrength(
            password
        );
    }



    // =====================================================
    // Password Strength
    // =====================================================

    function calculateStrength(password) {

        let score = 0;


        // Length
        if (password.length >= 8) {
            score += 1;
        }

        if (password.length >= 12) {
            score += 1;
        }

        if (password.length >= 16) {
            score += 1;
        }


        // Character types
        if (/[A-Z]/.test(password)) {
            score += 1;
        }

        if (/[a-z]/.test(password)) {
            score += 1;
        }

        if (/[0-9]/.test(password)) {
            score += 1;
        }

        if (/[^A-Za-z0-9]/.test(password)) {
            score += 1;
        }


        return score;
    }



    // =====================================================
    // Update Strength Display
    // =====================================================

    function updateStrength(password) {

        if (!strengthText) {
            return;
        }


        const score =
            calculateStrength(password);


        let message = "";


        if (score <= 3) {

            message = "Weak";

        } else if (score <= 5) {

            message = "Medium";

        } else {

            message = "Strong";
        }


        strengthText.textContent =
            message;
    }



    // =====================================================
    // Copy Password
    // =====================================================

    async function copyGeneratedPassword() {

        if (!generatedPassword) {
            return;
        }


        const password =
            generatedPassword.value ||
            generatedPassword.textContent ||
            "";


        if (!password.trim()) {

            showError(
                "Please generate a password first."
            );

            return;
        }


        try {

            await navigator.clipboard.writeText(
                password
            );


            const originalText =
                copyButton
                    ? copyButton.innerHTML
                    : "";


            if (copyButton) {

                copyButton.innerHTML =
                    '<i class="bi bi-check2 me-1"></i> Copied!';

                copyButton.disabled = true;


                setTimeout(() => {

                    copyButton.innerHTML =
                        originalText;

                    copyButton.disabled =
                        false;

                }, 1500);
            }


        } catch (error) {

            // Fallback for browsers where
            // navigator.clipboard is unavailable

            try {

                const temporaryInput =
                    document.createElement("textarea");

                temporaryInput.value =
                    password;

                document.body.appendChild(
                    temporaryInput
                );

                temporaryInput.select();

                document.execCommand(
                    "copy"
                );

                document.body.removeChild(
                    temporaryInput
                );


                if (copyButton) {

                    const originalText =
                        copyButton.innerHTML;

                    copyButton.innerHTML =
                        '<i class="bi bi-check2 me-1"></i> Copied!';


                    setTimeout(() => {

                        copyButton.innerHTML =
                            originalText;

                    }, 1500);
                }


            } catch (fallbackError) {

                showError(
                    "Unable to copy password."
                );
            }
        }
    }



    // =====================================================
    // Show Error
    // =====================================================

    function showError(message) {

        if (generatorError) {

            generatorError.textContent =
                message;

            generatorError.classList.remove(
                "d-none"
            );

            return;
        }

        console.error(
            "Password Generator Error:",
            message
        );
    }



    // =====================================================
    // Clear Error
    // =====================================================

    function clearError() {

        if (generatorError) {

            generatorError.textContent = "";

            generatorError.classList.add(
                "d-none"
            );
        }
    }



    // =====================================================
    // Generate Button Event
    // =====================================================

    if (generateButton) {

        generateButton.addEventListener(
            "click",
            generatePassword
        );
    }



    // =====================================================
    // Copy Button Event
    // =====================================================

    if (copyButton) {

        copyButton.addEventListener(
            "click",
            copyGeneratedPassword
        );
    }



    // =====================================================
    // Enter Key Support
    // =====================================================

    if (lengthInput) {

        lengthInput.addEventListener(
            "keydown",
            (event) => {

                if (event.key === "Enter") {

                    generatePassword();
                }
            }
        );
    }



    // =====================================================
    // Length Input Validation
    // =====================================================

    if (lengthInput) {

        lengthInput.addEventListener(
            "input",
            () => {

                let value =
                    parseInt(
                        lengthInput.value,
                        10
                    );


                if (Number.isNaN(value)) {
                    return;
                }


                if (value < 6) {

                    lengthInput.value = 6;

                } else if (value > 100) {

                    lengthInput.value = 100;
                }
            }
        );
    }



    // =====================================================
    // Generate First Password Automatically
    // =====================================================

    if (generatedPassword) {

        generatePassword();
    }


});