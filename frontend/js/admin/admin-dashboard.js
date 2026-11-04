// =========================================================
// SecurePass - Admin Dashboard JavaScript
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

    const API_BASE_URL =
        "http://localhost:5000/api/admin";

    const AUTH_API_URL =
        "http://localhost:5000/api/auth";


    // =====================================================
    // DOM Elements
    // =====================================================

    const totalUsersElement =
        document.getElementById("totalUsers");

    const totalAnalysesElement =
        document.getElementById("totalAnalyses");

    const totalLogsElement =
        document.getElementById("totalLogs");


    // Supports both IDs
    const logoutButton =
        document.getElementById("logoutButton") ||
        document.getElementById("logoutBtn");


    // =====================================================
    // Get Authentication Token
    // =====================================================

    function getToken() {

        const tokenKeys = [
            "token",
            "authToken",
            "securePassToken"
        ];


        for (const key of tokenKeys) {

            const sessionToken =
                sessionStorage.getItem(key);

            if (sessionToken) {
                return sessionToken;
            }


            const localToken =
                localStorage.getItem(key);

            if (localToken) {
                return localToken;
            }
        }


        return null;
    }


    // =====================================================
    // Clear Authentication Data
    // =====================================================

    function clearAuthenticationData() {

        // -------------------------------------------------
        // Session Storage
        // -------------------------------------------------

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("securePassToken");

        sessionStorage.removeItem("securePassUser");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("currentUser");
        sessionStorage.removeItem("loggedInUser");
        sessionStorage.removeItem("securePassLoggedIn");


        // -------------------------------------------------
        // Local Storage
        // -------------------------------------------------

        localStorage.removeItem("token");
        localStorage.removeItem("authToken");
        localStorage.removeItem("securePassToken");

        localStorage.removeItem("securePassUser");
        localStorage.removeItem("user");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("loggedInUser");
        localStorage.removeItem("securePassLoggedIn");
    }


    // =====================================================
    // Load Dashboard Statistics
    // =====================================================

    async function loadDashboardStats() {

        try {

            const token =
                getToken();


            // -------------------------------------------------
            // No Token
            // -------------------------------------------------

            if (!token) {

                window.location.href =
                    "../login.html";

                return;
            }


            // -------------------------------------------------
            // API Request
            // -------------------------------------------------

            const response =
                await fetch(
                    `${API_BASE_URL}/dashboard`,
                    {
                        method: "GET",

                        headers: {
                            "Authorization":
                                `Bearer ${token}`,

                            "Content-Type":
                                "application/json"
                        }
                    }
                );


            // -------------------------------------------------
            // Read Response
            // -------------------------------------------------

            let result;

            try {

                result =
                    await response.json();

            } catch (jsonError) {

                throw new Error(
                    "Server returned an invalid response."
                );
            }


            // -------------------------------------------------
            // HTTP Error
            // -------------------------------------------------

            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Failed to load dashboard statistics."
                );
            }


            // -------------------------------------------------
            // API Response Validation
            // -------------------------------------------------

            if (
                !result.success ||
                !result.data
            ) {

                throw new Error(
                    result.message ||
                    "Invalid dashboard response."
                );
            }


            // -------------------------------------------------
            // Total Users
            // -------------------------------------------------

            if (totalUsersElement) {

                totalUsersElement.textContent =
                    result.data.totalUsers ?? 0;
            }


            // -------------------------------------------------
            // Total Analyses
            // -------------------------------------------------

            if (totalAnalysesElement) {

                totalAnalysesElement.textContent =
                    result.data.totalAnalyses ?? 0;
            }


            // -------------------------------------------------
            // Total Logs
            // -------------------------------------------------

            if (totalLogsElement) {

                totalLogsElement.textContent =
                    result.data.totalLogs ?? 0;
            }

        } catch (error) {

            console.error(
                "Admin Dashboard Error:",
                error
            );


            // -------------------------------------------------
            // Fallback Values
            // -------------------------------------------------

            if (totalUsersElement) {
                totalUsersElement.textContent = "0";
            }

            if (totalAnalysesElement) {
                totalAnalysesElement.textContent = "0";
            }

            if (totalLogsElement) {
                totalLogsElement.textContent = "0";
            }
        }
    }


    // =====================================================
    // Admin Logout
    // =====================================================

    async function logout(event) {

        // Prevent other logout handlers
        // from running.
        if (event) {

            event.preventDefault();

            event.stopImmediatePropagation();
        }


        // -------------------------------------------------
        // Get Current Token
        // -------------------------------------------------

        const token =
            getToken();


        // -------------------------------------------------
        // Send Logout Event to Backend
        // -------------------------------------------------

        if (token) {

            try {

                const response =
                    await fetch(
                        `${AUTH_API_URL}/logout`,
                        {
                            method: "POST",

                            headers: {
                                "Authorization":
                                    `Bearer ${token}`,

                                "Content-Type":
                                    "application/json"
                            }
                        }
                    );


                // Read response safely
                try {

                    await response.json();

                } catch (jsonError) {

                    // Ignore invalid/empty response
                }

            } catch (error) {

                console.error(
                    "Admin Logout API Error:",
                    error
                );
            }
        }


        // -------------------------------------------------
        // Clear Authentication
        // -------------------------------------------------

        clearAuthenticationData();


        // -------------------------------------------------
        // Redirect
        // -------------------------------------------------

        window.location.href =
            "../login.html";
    }


    // =====================================================
    // Logout Event
    // =====================================================

    if (logoutButton) {

        /*
         * Capture phase is used here because the current
         * admin-dashboard.html still contains an older
         * inline logout handler.
         *
         * This prevents the old handler from clearing
         * storage and redirecting before the backend
         * logout API is called.
         */

        logoutButton.addEventListener(
            "click",
            logout,
            true
        );

    } else {

        console.error(
            "Admin logout button was not found."
        );
    }


    // =====================================================
    // Start Dashboard
    // =====================================================

    loadDashboardStats();

});