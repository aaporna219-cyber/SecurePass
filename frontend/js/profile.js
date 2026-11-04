// =====================================================
// SecurePass - Profile
// =====================================================


function getLoggedInUser() {

    const keys = [
        "securePassUser",
        "user",
        "currentUser",
        "loggedInUser"
    ];


    for (const key of keys) {

        const sessionData =
            sessionStorage.getItem(key);

        if (sessionData) {

            try {
                return JSON.parse(sessionData);
            }
            catch (error) {
                console.error("Session user data error:", error);
            }
        }


        const localData =
            localStorage.getItem(key);

        if (localData) {

            try {
                return JSON.parse(localData);
            }
            catch (error) {
                console.error("Local user data error:", error);
            }
        }

    }


    return null;
}



// =====================================================
// Load Profile
// =====================================================

function loadProfile() {

    const user = getLoggedInUser();


    console.log("Profile User:", user);


    if (!user) {

        document.getElementById("profileName").textContent = "-";

        document.getElementById("profileEmail").textContent = "-";

        document.getElementById("profileRole").textContent = "User";

        document.getElementById("profileStatus").textContent = "Unknown";

        document.getElementById("profileId").textContent = "-";

        return;
    }



    // Name
    document.getElementById("profileName").textContent =
        user.name ||
        user.full_name ||
        user.username ||
        "-";


    // Email
    document.getElementById("profileEmail").textContent =
        user.email ||
        "-";


    // Role
    document.getElementById("profileRole").textContent =
        user.role ||
        "User";


    // Status
    document.getElementById("profileStatus").textContent =
        user.status ||
        "Active";


    // User ID
    document.getElementById("profileId").textContent =
        user.id ||
        "-";

}



// =====================================================
// Page Load
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log("SecurePass Profile Loaded");

        loadProfile();

    }
);