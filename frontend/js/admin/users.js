// =========================================================
// SecurePass - Admin Users JavaScript
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // API
    // =====================================================

    const API_URL =
        "http://localhost:5000/api/admin/users";


    // =====================================================
    // DOM Elements
    // =====================================================

    const usersTableBody =
        document.getElementById("usersTableBody");


    const loadingMessage =
        document.getElementById("loadingMessage");


    const errorMessage =
        document.getElementById("errorMessage");


    const emptyMessage =
        document.getElementById("emptyMessage");


    const tableContainer =
        document.getElementById("tableContainer");


    const refreshBtn =
        document.getElementById("refreshBtn");


    const logoutBtn =
        document.getElementById("logoutBtn");


    const userCount =
        document.getElementById("userCount");



    // =====================================================
    // Get JWT Token
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
    // Show Loading
    // =====================================================

    function showLoading() {

        if (loadingMessage) {
            loadingMessage.style.display = "block";
        }


        if (errorMessage) {
            errorMessage.style.display = "none";
        }


        if (emptyMessage) {
            emptyMessage.style.display = "none";
        }


        if (tableContainer) {
            tableContainer.style.display = "none";
        }

    }



    // =====================================================
    // Hide Loading
    // =====================================================

    function hideLoading() {

        if (loadingMessage) {
            loadingMessage.style.display = "none";
        }

    }



    // =====================================================
    // Show Error
    // =====================================================

    function showError(message) {

        hideLoading();


        if (errorMessage) {

            errorMessage.textContent =
                message;

            errorMessage.style.display =
                "block";

        }


        if (emptyMessage) {
            emptyMessage.style.display =
                "none";
        }


        if (tableContainer) {
            tableContainer.style.display =
                "none";
        }

    }



    // =====================================================
    // Show Empty
    // =====================================================

    function showEmpty() {

        hideLoading();


        if (errorMessage) {
            errorMessage.style.display =
                "none";
        }


        if (emptyMessage) {
            emptyMessage.style.display =
                "block";
        }


        if (tableContainer) {
            tableContainer.style.display =
                "none";
        }

    }



    // =====================================================
    // Escape HTML
    // =====================================================

    function escapeHtml(value) {

        const div =
            document.createElement("div");


        div.textContent =
            String(value ?? "");


        return div.innerHTML;

    }



    // =====================================================
    // Format Date
    // =====================================================

    function formatDate(value) {

        if (!value) {
            return "N/A";
        }


        const date =
            new Date(value);


        if (Number.isNaN(date.getTime())) {
            return String(value);
        }


        return date.toLocaleString();

    }



    // =====================================================
    // Role Badge
    // =====================================================

    function getRoleBadge(role) {

        const normalizedRole =
            String(role ?? "")
                .trim()
                .toLowerCase();


        if (normalizedRole === "admin") {

            return `
                <span class="badge badge-role-admin">
                    Admin
                </span>
            `;

        }


        return `
            <span class="badge badge-role-user">
                User
            </span>
        `;

    }



    // =====================================================
    // Status Badge
    // =====================================================

    function getStatusBadge(status) {

        const normalizedStatus =
            String(status ?? "active")
                .trim()
                .toLowerCase();


        if (normalizedStatus === "active") {

            return `
                <span class="badge badge-status-active">
                    Active
                </span>
            `;

        }


        if (normalizedStatus === "suspended") {

            return `
                <span class="badge badge-status-suspended">
                    Suspended
                </span>
            `;

        }


        return `
            <span class="badge badge-status-inactive">
                ${escapeHtml(status || "Inactive")}
            </span>
        `;

    }



    // =====================================================
    // Render Users
    // =====================================================

    function renderUsers(users) {

        if (!usersTableBody) {

            throw new Error(
                "Users table body was not found."
            );

        }


        usersTableBody.innerHTML = "";


        if (!Array.isArray(users) ||
            users.length === 0) {

            if (userCount) {
                userCount.textContent = "0";
            }


            showEmpty();

            return;

        }


        if (userCount) {
            userCount.textContent =
                String(users.length);
        }


        users.forEach((user) => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${escapeHtml(user.id)}
                </td>


                <td>
                    ${escapeHtml(
                        user.name || "N/A"
                    )}
                </td>


                <td>
                    ${escapeHtml(
                        user.email || "N/A"
                    )}
                </td>


                <td>
                    ${getRoleBadge(
                        user.role
                    )}
                </td>


                <td>
                    ${getStatusBadge(
                        user.status
                    )}
                </td>


                <td>
                    ${escapeHtml(
                        formatDate(
                            user.created_at
                        )
                    )}
                </td>

            `;


            usersTableBody.appendChild(row);

        });


        hideLoading();


        if (errorMessage) {
            errorMessage.style.display =
                "none";
        }


        if (emptyMessage) {
            emptyMessage.style.display =
                "none";
        }


        if (tableContainer) {
            tableContainer.style.display =
                "block";
        }

    }



    // =====================================================
    // Load Users
    // =====================================================

    async function loadUsers() {

        showLoading();


        const token =
            getToken();


        if (!token) {

            window.location.href =
                "../login.html";

            return;

        }


        try {

            console.log(
                "Loading Admin Users..."
            );


            const response =
                await fetch(
                    API_URL,
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


            const result =
                await response.json();


            console.log(
                "Admin Users Response:",
                result
            );


            if (!response.ok) {

                if (response.status === 401) {

                    throw new Error(
                        "Authentication failed. Please login again."
                    );

                }


                if (response.status === 403) {

                    throw new Error(
                        "Access denied. Admin privileges required."
                    );

                }


                throw new Error(
                    result.message ||
                    "Failed to load users."
                );

            }


            if (!result.success) {

                throw new Error(
                    result.message ||
                    "Failed to load users."
                );

            }


            const users =
                Array.isArray(result.data)
                    ? result.data
                    : [];


            renderUsers(users);

        } catch (error) {

            console.error(
                "Admin Users Error:",
                error
            );


            showError(
                error.message ||
                "Unable to load users."
            );

        }

    }



    // =====================================================
    // Logout
    // =====================================================

    function logout() {

        const keys = [
            "token",
            "authToken",
            "securePassToken",
            "securePassUser",
            "user",
            "currentUser",
            "loggedInUser",
            "securePassLoggedIn"
        ];


        keys.forEach((key) => {

            sessionStorage.removeItem(key);
            localStorage.removeItem(key);

        });


        window.location.href =
            "../login.html";

    }



    // =====================================================
    // Refresh Event
    // =====================================================

    if (refreshBtn) {

        refreshBtn.addEventListener(
            "click",
            loadUsers
        );

    }



    // =====================================================
    // Logout Event
    // =====================================================

    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            logout
        );

    }



    // =====================================================
    // Initial Load
    // =====================================================

    loadUsers();

});