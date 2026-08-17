// =========================================================
// SecurePass - Dashboard
// =========================================================


// =========================================================
// Get Logged-in User
// =========================================================

function getLoggedInUser() {

    const localUser =
        localStorage.getItem("securePassUser");

    const sessionUser =
        sessionStorage.getItem("securePassUser");


    if (localUser) {

        try {

            return JSON.parse(localUser);

        } catch (error) {

            console.error(
                "Invalid local user data."
            );

            localStorage.removeItem(
                "securePassUser"
            );

            localStorage.removeItem(
                "securePassLoggedIn"
            );

        }

    }


    if (sessionUser) {

        try {

            return JSON.parse(sessionUser);

        } catch (error) {

            console.error(
                "Invalid session user data."
            );

            sessionStorage.removeItem(
                "securePassUser"
            );

            sessionStorage.removeItem(
                "securePassLoggedIn"
            );

        }

    }


    return null;

}


// =========================================================
// Protect Dashboard
// =========================================================

function checkAuthentication() {

    const user =
        getLoggedInUser();


    if (!user) {

        window.location.href =
            "login.html";

        return null;

    }


    return user;

}


// =========================================================
// Display User Information
// =========================================================

function displayUserInformation(user) {

    const userName =
        document.getElementById("userName");

    const accountName =
        document.getElementById("accountName");

    const accountEmail =
        document.getElementById("accountEmail");

    const accountRole =
        document.getElementById("accountRole");


    if (userName) {

        userName.textContent =
            user.name || "User";

    }


    if (accountName) {

        accountName.textContent =
            user.name || "Not available";

    }


    if (accountEmail) {

        accountEmail.textContent =
            user.email || "Not available";

    }


    if (accountRole) {

        const role =
            user.role || "user";


        accountRole.textContent =
            role === "admin"
                ? "Administrator"
                : "User";


        accountRole.classList.remove(
            "text-bg-primary",
            "text-bg-danger"
        );


        if (role === "admin") {

            accountRole.classList.add(
                "text-bg-danger"
            );

        } else {

            accountRole.classList.add(
                "text-bg-primary"
            );

        }

    }

}


// =========================================================
// Logout
// =========================================================

function logoutUser() {

    localStorage.removeItem(
        "securePassUser"
    );

    localStorage.removeItem(
        "securePassLoggedIn"
    );


    sessionStorage.removeItem(
        "securePassUser"
    );

    sessionStorage.removeItem(
        "securePassLoggedIn"
    );


    window.location.href =
        "login.html";

}


// =========================================================
// Initialize Dashboard
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const user =
            checkAuthentication();


        if (!user) {
            return;
        }


        displayUserInformation(user);

    }
);