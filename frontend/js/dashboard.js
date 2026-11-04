// =====================================================
// SecurePass - Dashboard JavaScript
// =====================================================

const API_BASE_URL = "http://localhost:5000";

// -----------------------------------------------------
// Get authentication token
// -----------------------------------------------------
function getAuthToken() {
    return (
        sessionStorage.getItem("token") ||
        sessionStorage.getItem("authToken") ||
        sessionStorage.getItem("securePassToken") ||
        localStorage.getItem("token") ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("securePassToken")
    );
}


// -----------------------------------------------------
// Get logged-in user
// -----------------------------------------------------
function getLoggedInUser() {

    const possibleKeys = [
        "securePassUser",
        "user",
        "currentUser",
        "loggedInUser"
    ];

    for (const key of possibleKeys) {

        const data =
            sessionStorage.getItem(key) ||
            localStorage.getItem(key);

        if (data) {

            try {
                return JSON.parse(data);
            } catch (error) {
                console.error("User data parse error:", error);
            }
        }
    }

    return null;
}


// -----------------------------------------------------
// Display Account Information
// -----------------------------------------------------
function loadAccountInformation() {

    const user = getLoggedInUser();

    const nameElement = document.getElementById("accountName");
    const emailElement = document.getElementById("accountEmail");
    const roleElement = document.getElementById("accountRole");
    const welcomeElement = document.getElementById("userName");


    if (!user) {

        console.warn("No logged-in user found.");

        if (nameElement) {
            nameElement.textContent = "-";
        }

        if (emailElement) {
            emailElement.textContent = "-";
        }

        return;
    }


    // Name
    if (nameElement) {

        nameElement.textContent =
            user.name ||
            user.full_name ||
            user.username ||
            "-";
    }


    // Email
    if (emailElement) {

        emailElement.textContent =
            user.email ||
            "-";
    }


    // Role
    if (roleElement) {

        roleElement.textContent =
            user.role ||
            "User";
    }


    // Welcome name
    if (welcomeElement) {

        welcomeElement.textContent =
            user.name ||
            user.full_name ||
            user.username ||
            "User";
    }


    console.log("Dashboard User:", user);
}


// -----------------------------------------------------
// Load Password Analysis History
// -----------------------------------------------------
async function loadPasswordHistory() {

    const token = getAuthToken();

    if (!token) {

        console.warn("Authentication token not found.");

        return;
    }


    try {

        const response = await fetch(
            `${API_BASE_URL}/api/password-history`,
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );


        const data = await response.json();


        if (!response.ok) {

            console.error(
                "Password History Error:",
                data
            );

            return;
        }


        console.log(
            "Dashboard Password History:",
            data
        );


        // Store latest history in session
        sessionStorage.setItem(
            "passwordHistory",
            JSON.stringify(data.history || [])
        );


        // Optional history count
        const historyCount =
            document.getElementById("historyCount");

        if (historyCount) {

            historyCount.textContent =
                data.count || 0;
        }

    } catch (error) {

        console.error(
            "Password History Fetch Error:",
            error
        );
    }
}


// -----------------------------------------------------
// Check Authentication
// -----------------------------------------------------
function checkAuthentication() {

    const token = getAuthToken();

    if (!token) {

        console.warn(
            "No authentication token. User may not be logged in."
        );

        // Don't redirect immediately while testing.
        // This prevents dashboard from disappearing unexpectedly.

        return false;
    }

    return true;
}


// -----------------------------------------------------
// Dashboard Initialization
// -----------------------------------------------------
document.addEventListener(
    "DOMContentLoaded",
    async function () {

        console.log(
            "SecurePass Dashboard Loaded"
        );


        // Account information
        loadAccountInformation();


        // Authentication
        if (checkAuthentication()) {

            // Load history from backend
            await loadPasswordHistory();
        }

    }
);