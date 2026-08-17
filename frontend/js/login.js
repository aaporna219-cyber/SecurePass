// =========================================================
// SecurePass - Login
// =========================================================

const API_BASE_URL = "http://localhost:5000";


// =========================================================
// DOM Elements
// =========================================================

const loginForm =
    document.getElementById("loginForm");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const rememberMe =
    document.getElementById("rememberMe");

const loginButton =
    document.getElementById("loginButton");

const loginButtonText =
    document.getElementById("loginButtonText");

const loginSpinner =
    document.getElementById("loginSpinner");

const loginError =
    document.getElementById("loginError");

const loginSuccess =
    document.getElementById("loginSuccess");

const togglePassword =
    document.getElementById("togglePassword");

const passwordIcon =
    document.getElementById("passwordIcon");


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


// =========================================================
// Show Error
// =========================================================

function showError(message) {

    loginError.textContent = message;

    loginError.classList.remove("d-none");

    loginSuccess.classList.add("d-none");

}


// =========================================================
// Show Success
// =========================================================

function showSuccess(message) {

    loginSuccess.textContent = message;

    loginSuccess.classList.remove("d-none");

    loginError.classList.add("d-none");

}


// =========================================================
// Clear Messages
// =========================================================

function clearMessages() {

    loginError.classList.add("d-none");

    loginSuccess.classList.add("d-none");

    loginError.textContent = "";

    loginSuccess.textContent = "";

}


// =========================================================
// Loading State
// =========================================================

function setLoading(isLoading) {

    loginButton.disabled = isLoading;


    if (isLoading) {

        loginButtonText.classList.add(
            "d-none"
        );

        loginSpinner.classList.remove(
            "d-none"
        );

    } else {

        loginButtonText.classList.remove(
            "d-none"
        );

        loginSpinner.classList.add(
            "d-none"
        );

    }

}


// =========================================================
// Validate Login Form
// =========================================================

function validateLoginForm() {

    const email =
        emailInput.value.trim();

    const password =
        passwordInput.value;


    // Email validation

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailPattern.test(email)) {

        showError(
            "Please enter a valid email address."
        );

        emailInput.focus();

        return false;

    }


    // Password validation

    if (!password) {

        showError(
            "Please enter your password."
        );

        passwordInput.focus();

        return false;

    }


    return true;

}


// =========================================================
// Save User Session
// =========================================================

function saveUserSession(user) {

    const userData = {

        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role

    };


    /*
     * Remember Me ON
     * → localStorage
     */

    if (rememberMe.checked) {

        localStorage.setItem(
            "securePassUser",
            JSON.stringify(userData)
        );

        localStorage.setItem(
            "securePassLoggedIn",
            "true"
        );

        return;
    }


    /*
     * Remember Me OFF
     * → sessionStorage
     */

    sessionStorage.setItem(
        "securePassUser",
        JSON.stringify(userData)
    );

    sessionStorage.setItem(
        "securePassLoggedIn",
        "true"
    );

}


// =========================================================
// Login User
// =========================================================

async function loginUser() {

    clearMessages();


    if (!validateLoginForm()) {
        return;
    }


    const email =
        emailInput.value.trim().toLowerCase();

    const password =
        passwordInput.value;


    setLoading(true);


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/auth/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok || !data.success) {

            showError(
                data.message ||
                "Invalid email or password."
            );

            return;

        }


        // Save logged-in user

        saveUserSession(data.user);


        showSuccess(
            "Login successful! Redirecting..."
        );


        /*
         * Redirect based on role
         */

        setTimeout(() => {

            if (data.user.role === "admin") {

                window.location.href =
                    "admin/dashboard.html";

            } else {

                window.location.href =
                    "dashboard.html";

            }

        }, 1000);


    } catch (error) {

        console.error(
            "Login Request Error:",
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

loginForm.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();

        loginUser();

    }
);