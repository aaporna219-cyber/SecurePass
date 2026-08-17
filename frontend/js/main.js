// =========================================================
// SecurePass - Main JavaScript
// =========================================================


// =========================================================
// Initialize Application
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

    loadComponent(
        "navbarContainer",
        "components/navbar.html"
    );

    loadComponent(
        "footerContainer",
        "components/footer.html"
    );

});


// =========================================================
// Load HTML Component
// =========================================================

async function loadComponent(
    containerId,
    filePath
) {

    const container =
        document.getElementById(containerId);


    if (!container) {
        return;
    }


    try {

        const response =
            await fetch(filePath);


        if (!response.ok) {

            throw new Error(
                `Failed to load ${filePath}`
            );

        }


        const html =
            await response.text();


        container.innerHTML =
            html;


        // Navbar specific setup

        if (containerId === "navbarContainer") {

            setupNavbar();

            setActiveNavigation();

        }


    } catch (error) {

        console.error(
            "Component Loading Error:",
            error.message
        );

    }

}


// =========================================================
// Get Logged-in User
// =========================================================

function getCurrentUser() {

    const localUser =
        localStorage.getItem(
            "securePassUser"
        );


    const sessionUser =
        sessionStorage.getItem(
            "securePassUser"
        );


    if (localUser) {

        try {

            return JSON.parse(
                localUser
            );

        } catch (error) {

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

            return JSON.parse(
                sessionUser
            );

        } catch (error) {

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
// Setup Navbar
// =========================================================

function setupNavbar() {

    const currentUser =
        getCurrentUser();


    const publicNavItems =
        document.querySelectorAll(
            "[data-public-nav]"
        );


    const guestNavItems =
        document.querySelectorAll(
            "[data-guest-nav]"
        );


    const authNavItems =
        document.querySelectorAll(
            "[data-auth-nav]"
        );


    const isLoggedIn =
        currentUser !== null;


    // -----------------------------------------
    // Public Navigation
    // -----------------------------------------

    publicNavItems.forEach((item) => {

        item.classList.toggle(
            "d-none",
            isLoggedIn
        );

    });


    // -----------------------------------------
    // Guest Buttons
    // -----------------------------------------

    guestNavItems.forEach((item) => {

        item.classList.toggle(
            "d-none",
            isLoggedIn
        );

    });


    // -----------------------------------------
    // Authenticated Navigation
    // -----------------------------------------

    authNavItems.forEach((item) => {

        item.classList.toggle(
            "d-none",
            !isLoggedIn
        );

    });


    // -----------------------------------------
    // Logout Button
    // -----------------------------------------

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            handleLogout
        );

    }

}


// =========================================================
// Logout
// =========================================================

function handleLogout() {

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
// Set Active Navigation
// =========================================================

function setActiveNavigation() {

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();


    const navLinks =
        document.querySelectorAll(
            "#securePassNavbar [data-page]"
        );


    navLinks.forEach((link) => {

        const href =
            link.getAttribute("href");


        if (!href) {
            return;
        }


        const linkPage =
            href
                .split("/")
                .pop()
                .toLowerCase();


        if (
            linkPage === currentPage
        ) {

            link.classList.add(
                "active"
            );

        }

    });

}