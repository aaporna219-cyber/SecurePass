// =========================================================
// SecurePass - Login JavaScript
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

    const API_URL =
        "http://localhost:5000/api/auth/login";


    // =====================================================
    // DOM Elements
    // =====================================================

    const loginForm =
        document.getElementById("loginForm");

    const emailInput =
        document.getElementById("email");

    const passwordInput =
        document.getElementById("password");

    const togglePassword =
        document.getElementById("togglePassword");

    const passwordIcon =
        document.getElementById("passwordIcon");

    const rememberMe =
        document.getElementById("rememberMe");

    const loginError =
        document.getElementById("loginError");

    const loginSuccess =
        document.getElementById("loginSuccess");

    const loginButton =
        document.getElementById("loginButton");

    const loginButtonText =
        document.getElementById("loginButtonText");

    const loginSpinner =
        document.getElementById("loginSpinner");


    // =====================================================
    // Show / Hide Password
    // =====================================================

    if (togglePassword && passwordInput) {

        togglePassword.addEventListener(
            "click",
            () => {

                const isPassword =
                    passwordInput.type === "password";


                passwordInput.type =
                    isPassword
                        ? "text"
                        : "password";


                if (passwordIcon) {

                    passwordIcon.classList.toggle(
                        "bi-eye",
                        !isPassword
                    );

                    passwordIcon.classList.toggle(
                        "bi-eye-slash",
                        isPassword
                    );
                }


                togglePassword.setAttribute(
                    "aria-label",
                    isPassword
                        ? "Hide password"
                        : "Show password"
                );

            }
        );
    }


    // =====================================================
    // Error Message
    // =====================================================

    function showError(message) {

        if (loginError) {

            loginError.textContent =
                message;

            loginError.classList.remove(
                "d-none"
            );
        }
    }


    // =====================================================
    // Clear Error
    // =====================================================

    function clearError() {

        if (loginError) {

            loginError.textContent = "";

            loginError.classList.add(
                "d-none"
            );
        }
    }


    // =====================================================
    // Success Message
    // =====================================================

    function showSuccess(message) {

        if (loginSuccess) {

            loginSuccess.textContent =
                message;

            loginSuccess.classList.remove(
                "d-none"
            );
        }
    }


    // =====================================================
    // Clear Success
    // =====================================================

    function clearSuccess() {

        if (loginSuccess) {

            loginSuccess.textContent = "";

            loginSuccess.classList.add(
                "d-none"
            );
        }
    }


    // =====================================================
    // Loading State
    // =====================================================

    function setLoading(isLoading) {

        if (!loginButton) {
            return;
        }


        loginButton.disabled =
            isLoading;


        if (loginButtonText) {

            loginButtonText.classList.toggle(
                "d-none",
                isLoading
            );
        }


        if (loginSpinner) {

            loginSpinner.classList.toggle(
                "d-none",
                !isLoading
            );
        }
    }


    // =====================================================
    // Save Authentication Data
    // =====================================================

    function saveLoginData(token, user) {

        // Clear old authentication data
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("securePassToken");

        sessionStorage.removeItem("securePassUser");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("currentUser");
        sessionStorage.removeItem("loggedInUser");
        sessionStorage.removeItem("securePassLoggedIn");


        localStorage.removeItem("token");
        localStorage.removeItem("authToken");
        localStorage.removeItem("securePassToken");

        localStorage.removeItem("securePassUser");
        localStorage.removeItem("user");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("loggedInUser");
        localStorage.removeItem("securePassLoggedIn");


        // =================================================
        // Save Authentication Token
        // =================================================

        // Save in BOTH storages so admin dashboard
        // can always find the authentication token.

        sessionStorage.setItem(
            "token",
            token
        );

        sessionStorage.setItem(
            "authToken",
            token
        );

        sessionStorage.setItem(
            "securePassToken",
            token
        );


        localStorage.setItem(
            "token",
            token
        );

        localStorage.setItem(
            "authToken",
            token
        );

        localStorage.setItem(
            "securePassToken",
            token
        );


        // =================================================
        // Save User Information
        // =================================================

        const userData =
            JSON.stringify(user);


        sessionStorage.setItem(
            "securePassUser",
            userData
        );

        sessionStorage.setItem(
            "user",
            userData
        );

        localStorage.setItem(
            "securePassUser",
            userData
        );

        localStorage.setItem(
            "user",
            userData
        );


        // =================================================
        // Login Flag
        // =================================================

        sessionStorage.setItem(
            "securePassLoggedIn",
            "true"
        );

        localStorage.setItem(
            "securePassLoggedIn",
            "true"
        );


        // =================================================
        // Debug Information
        // =================================================

        console.log(
            "Authentication data saved successfully."
        );

        console.log(
            "Token exists:",
            !!token
        );

        console.log(
            "User:",
            user
        );
    }


    // =====================================================
    // Get User Role
    // =====================================================

    function getUserRole(user) {

        return String(
            user?.role ||
            user?.user_role ||
            "user"
        )
            .trim()
            .toLowerCase();
    }


    // =====================================================
    // Login Handler
    // =====================================================

    async function handleLogin(event) {

        event.preventDefault();

        clearError();
        clearSuccess();


        const email =
            emailInput
                ? emailInput.value.trim()
                : "";


        const password =
            passwordInput
                ? passwordInput.value
                : "";


        // =================================================
        // Validation
        // =================================================

        if (!email) {

            showError(
                "Please enter your email address."
            );

            return;
        }


        if (!password) {

            showError(
                "Please enter your password."
            );

            return;
        }


        setLoading(true);


        try {

            // =================================================
            // Login API Request
            // =================================================

            const response =
                await fetch(
                    API_URL,
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


            // =================================================
            // Read Response
            // =================================================

            let result;

            try {

                result =
                    await response.json();

            } catch (jsonError) {

                throw new Error(
                    "Server returned an invalid response."
                );
            }


            // =================================================
            // Check HTTP Response
            // =================================================

            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Invalid email or password."
                );
            }


            // =================================================
            // Check Login Success
            // =================================================

            if (!result.success) {

                throw new Error(
                    result.message ||
                    "Login failed."
                );
            }


            // =================================================
            // Get Token
            // =================================================

            const token =
                result.token ||
                result.data?.token ||
                result.data?.accessToken;


            if (!token) {

                throw new Error(
                    "Authentication token was not received."
                );
            }


            // =================================================
            // Get User
            // =================================================

            const user =
                result.user ||
                result.data?.user;


            if (!user) {

                throw new Error(
                    "User information was not received."
                );
            }


            // =================================================
            // Save Login Data
            // =================================================

            saveLoginData(
                token,
                user
            );


            // =================================================
            // Get Role
            // =================================================

            const role =
                getUserRole(user);


            showSuccess(
                "Login successful. Redirecting..."
            );


            // =================================================
            // Admin
            // =================================================

            if (role === "admin") {

                setTimeout(() => {

                    window.location.href =
                        "admin/admin-dashboard.html";

                }, 500);

                return;
            }


            // =================================================
            // Normal User
            // =================================================

            setTimeout(() => {

                window.location.href =
                    "dashboard.html";

            }, 500);


        } catch (error) {

            console.error(
                "Login Error:",
                error
            );


            showError(
                error.message ||
                "Unable to login. Please try again."
            );

        } finally {

            setLoading(false);
        }
    }


    // =====================================================
    // Submit Event
    // =====================================================

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            handleLogin
        );

    } else {

        console.error(
            "Element #loginForm was not found."
        );
    }


});