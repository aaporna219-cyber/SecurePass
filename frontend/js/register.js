// =========================================================
// SecurePass - Registration
// =========================================================

const API_BASE_URL = "http://localhost:5000";


// =========================================================
// DOM Elements
// =========================================================

const registerForm =
    document.getElementById("registerForm");

const nameInput =
    document.getElementById("name");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const confirmPasswordInput =
    document.getElementById("confirmPassword");

const agreeTerms =
    document.getElementById("agreeTerms");

const registerButton =
    document.getElementById("registerButton");

const registerButtonText =
    document.getElementById("registerButtonText");

const registerSpinner =
    document.getElementById("registerSpinner");

const registerError =
    document.getElementById("registerError");

const registerSuccess =
    document.getElementById("registerSuccess");

const passwordMatchMessage =
    document.getElementById("passwordMatchMessage");

const togglePassword =
    document.getElementById("togglePassword");

const passwordIcon =
    document.getElementById("passwordIcon");

const toggleConfirmPassword =
    document.getElementById("toggleConfirmPassword");

const confirmPasswordIcon =
    document.getElementById("confirmPasswordIcon");


// =========================================================
// Show / Hide Password
// =========================================================

togglePassword.addEventListener("click", () => {

    const isPassword =
        passwordInput.type === "password";


    passwordInput.type =
        isPassword ? "text" : "password";


    passwordIcon.classList.toggle(
        "bi-eye",
        !isPassword
    );

    passwordIcon.classList.toggle(
        "bi-eye-slash",
        isPassword
    );

});


toggleConfirmPassword.addEventListener("click", () => {

    const isPassword =
        confirmPasswordInput.type === "password";


    confirmPasswordInput.type =
        isPassword ? "text" : "password";


    confirmPasswordIcon.classList.toggle(
        "bi-eye",
        !isPassword
    );

    confirmPasswordIcon.classList.toggle(
        "bi-eye-slash",
        isPassword
    );

});


// =========================================================
// Password Match Check
// =========================================================

function checkPasswordMatch() {

    const password =
        passwordInput.value;

    const confirmPassword =
        confirmPasswordInput.value;


    if (!confirmPassword) {

        passwordMatchMessage.textContent = "";

        confirmPasswordInput.classList.remove(
            "is-valid",
            "is-invalid"
        );

        return false;
    }


    if (password === confirmPassword) {

        passwordMatchMessage.textContent =
            "Passwords match.";

        passwordMatchMessage.className =
            "small mb-3 text-success";

        confirmPasswordInput.classList.remove(
            "is-invalid"
        );

        confirmPasswordInput.classList.add(
            "is-valid"
        );

        return true;

    }


    passwordMatchMessage.textContent =
        "Passwords do not match.";

    passwordMatchMessage.className =
        "small mb-3 text-danger";

    confirmPasswordInput.classList.remove(
        "is-valid"
    );

    confirmPasswordInput.classList.add(
        "is-invalid"
    );

    return false;
}


passwordInput.addEventListener(
    "input",
    checkPasswordMatch
);

confirmPasswordInput.addEventListener(
    "input",
    checkPasswordMatch
);


// =========================================================
// Show Error Message
// =========================================================

function showError(message) {

    registerError.textContent = message;

    registerError.classList.remove("d-none");

    registerSuccess.classList.add("d-none");
}


// =========================================================
// Show Success Message
// =========================================================

function showSuccess(message) {

    registerSuccess.textContent = message;

    registerSuccess.classList.remove("d-none");

    registerError.classList.add("d-none");
}


// =========================================================
// Hide Messages
// =========================================================

function clearMessages() {

    registerError.classList.add("d-none");

    registerSuccess.classList.add("d-none");

    registerError.textContent = "";

    registerSuccess.textContent = "";

}


// =========================================================
// Set Loading State
// =========================================================

function setLoading(isLoading) {

    registerButton.disabled =
        isLoading;

    if (isLoading) {

        registerButtonText.classList.add(
            "d-none"
        );

        registerSpinner.classList.remove(
            "d-none"
        );

    } else {

        registerButtonText.classList.remove(
            "d-none"
        );

        registerSpinner.classList.add(
            "d-none"
        );

    }

}


// =========================================================
// Client-Side Validation
// =========================================================

function validateRegistrationForm() {

    const name =
        nameInput.value.trim();

    const email =
        emailInput.value.trim();

    const password =
        passwordInput.value;

    const confirmPassword =
        confirmPasswordInput.value;


    // Name

    if (name.length < 2) {

        showError(
            "Please enter your full name."
        );

        nameInput.focus();

        return false;
    }


    // Email

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailPattern.test(email)) {

        showError(
            "Please enter a valid email address."
        );

        emailInput.focus();

        return false;
    }


    // Password length

    if (password.length < 8) {

        showError(
            "Password must contain at least 8 characters."
        );

        passwordInput.focus();

        return false;
    }


    // Password match

    if (password !== confirmPassword) {

        showError(
            "Passwords do not match."
        );

        confirmPasswordInput.focus();

        return false;
    }


    // Terms

    if (!agreeTerms.checked) {

        showError(
            "Please confirm that you understand the SecurePass terms."
        );

        agreeTerms.focus();

        return false;
    }


    return true;
}


// =========================================================
// Register User
// =========================================================

async function registerUser() {

    clearMessages();


    if (!validateRegistrationForm()) {
        return;
    }


    const name =
        nameInput.value.trim();

    const email =
        emailInput.value.trim().toLowerCase();

    const password =
        passwordInput.value;

    const confirmPassword =
        confirmPasswordInput.value;


    setLoading(true);


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/auth/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        email,
                        password,
                        confirmPassword
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok || !data.success) {

            showError(
                data.message ||
                "Registration failed. Please try again."
            );

            return;
        }


        showSuccess(
            "Registration successful! Redirecting to login..."
        );


        registerForm.reset();

        confirmPasswordInput.classList.remove(
            "is-valid",
            "is-invalid"
        );

        passwordMatchMessage.textContent = "";


        setTimeout(() => {

            window.location.href =
                "login.html";

        }, 1500);


    } catch (error) {

        console.error(
            "Registration Request Error:",
            error
        );


        showError(
            "Unable to connect to the server. Please make sure the backend server is running."
        );

    } finally {

        setLoading(false);

    }

}


// =========================================================
// Form Submit
// =========================================================

registerForm.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();

        registerUser();

    }
);