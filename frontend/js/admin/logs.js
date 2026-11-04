// =========================================================
// SecurePass - Admin Logs JavaScript
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

    const API_URL =
        "http://localhost:5000/api/admin/logs";


    // =====================================================
    // Elements
    // =====================================================

    const tableBody =
        document.getElementById("logsTableBody") ||
        document.getElementById("logsTable");

    const loadingState =
        document.getElementById("loadingState");

    const errorState =
        document.getElementById("errorState");

    const emptyState =
        document.getElementById("emptyState");

    const refreshButton =
        document.getElementById("refreshButton");

    const logoutButton =
        document.getElementById("logoutButton");


    // =====================================================
    // Get Token
    // =====================================================

    function getToken() {

        const keys = [
            "token",
            "authToken",
            "securePassToken"
        ];

        for (const key of keys) {

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
    // Escape HTML
    // =====================================================

    function escapeHTML(value) {

        if (
            value === null ||
            value === undefined
        ) {
            return "";
        }

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    // =====================================================
    // Format Date
    // =====================================================

    function formatDate(value) {

        if (!value) {
            return "-";
        }

        const date =
            new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return escapeHTML(value);
        }

        return date.toLocaleString();
    }


    // =====================================================
    // Action Badge
    // =====================================================

    function getActionBadge(action) {

        const value =
            String(action || "Unknown");

        const lowerValue =
            value.toLowerCase();


        if (
            lowerValue.includes("login") ||
            lowerValue.includes("success")
        ) {

            return `
                <span class="badge bg-success">
                    ${escapeHTML(value)}
                </span>
            `;
        }


        if (
            lowerValue.includes("logout")
        ) {

            return `
                <span class="badge bg-secondary">
                    ${escapeHTML(value)}
                </span>
            `;
        }


        if (
            lowerValue.includes("fail") ||
            lowerValue.includes("error") ||
            lowerValue.includes("denied")
        ) {

            return `
                <span class="badge bg-danger">
                    ${escapeHTML(value)}
                </span>
            `;
        }


        if (
            lowerValue.includes("analy") ||
            lowerValue.includes("password")
        ) {

            return `
                <span class="badge bg-primary">
                    ${escapeHTML(value)}
                </span>
            `;
        }


        return `
            <span class="badge bg-dark">
                ${escapeHTML(value)}
            </span>
        `;
    }


    // =====================================================
    // Show Loading
    // =====================================================

    function showLoading() {

        if (loadingState) {
            loadingState.classList.remove("d-none");
        }

        if (errorState) {
            errorState.classList.add("d-none");
        }

        if (emptyState) {
            emptyState.classList.add("d-none");
        }

        if (tableBody) {
            tableBody.innerHTML = "";
        }
    }


    // =====================================================
    // Show Error
    // =====================================================

    function showError(message) {

        if (loadingState) {
            loadingState.classList.add("d-none");
        }

        if (emptyState) {
            emptyState.classList.add("d-none");
        }

        if (errorState) {

            errorState.classList.remove("d-none");

            const messageElement =
                errorState.querySelector(
                    "#errorMessage"
                ) ||
                errorState.querySelector(
                    ".error-message"
                );

            if (messageElement) {

                messageElement.textContent =
                    message;

            } else {

                errorState.textContent =
                    message;
            }

        } else {

            console.error(
                "Admin Logs Error:",
                message
            );
        }
    }


    // =====================================================
    // Show Empty
    // =====================================================

    function showEmpty() {

        if (loadingState) {
            loadingState.classList.add("d-none");
        }

        if (errorState) {
            errorState.classList.add("d-none");
        }

        if (emptyState) {
            emptyState.classList.remove("d-none");
        }

        if (tableBody) {
            tableBody.innerHTML = "";
        }
    }


    // =====================================================
    // Render Logs
    // =====================================================

    function renderLogs(logs) {

        if (!tableBody) {

            console.error(
                "Logs table body not found."
            );

            return;
        }


        if (
            !Array.isArray(logs) ||
            logs.length === 0
        ) {

            showEmpty();
            return;
        }


        tableBody.innerHTML =
            logs.map(log => {

                return `
                    <tr>

                        <td>
                            ${escapeHTML(
                                log.id ?? "-"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                log.user_id ?? "-"
                            )}
                        </td>

                        <td>
                            ${getActionBadge(
                                log.action
                            )}
                        </td>

                        <td class="text-break">
                            ${escapeHTML(
                                log.description || "-"
                            )}
                        </td>

                        <td>
                            <span class="font-monospace">
                                ${escapeHTML(
                                    log.ip_address || "-"
                                )}
                            </span>
                        </td>

                        <td>
                            ${formatDate(
                                log.created_at
                            )}
                        </td>

                    </tr>
                `;

            }).join("");


        if (loadingState) {
            loadingState.classList.add("d-none");
        }

        if (errorState) {
            errorState.classList.add("d-none");
        }

        if (emptyState) {
            emptyState.classList.add("d-none");
        }
    }


    // =====================================================
    // Load Logs
    // =====================================================

    async function loadLogs() {

        showLoading();


        const token =
            getToken();


        if (!token) {

            window.location.href =
                "../login.html";

            return;
        }


        try {

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


            if (
                response.status === 401 ||
                response.status === 403
            ) {

                throw new Error(
                    result.message ||
                    "Admin access required."
                );
            }


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Failed to load security logs."
                );
            }


            if (!result.success) {

                throw new Error(
                    result.message ||
                    "Failed to load security logs."
                );
            }


            const logs =
                Array.isArray(result.data)
                    ? result.data
                    : [];


            renderLogs(logs);


        } catch (error) {

            console.error(
                "Load Logs Error:",
                error
            );


            showError(
                error.message ||
                "Unable to load security logs."
            );
        }
    }


    // =====================================================
    // Logout
    // =====================================================

    function logout() {

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("securePassToken");

        sessionStorage.removeItem("securePassUser");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("currentUser");
        sessionStorage.removeItem("loggedInUser");


        localStorage.removeItem("token");
        localStorage.removeItem("authToken");
        localStorage.removeItem("securePassToken");

        localStorage.removeItem("securePassUser");
        localStorage.removeItem("user");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("loggedInUser");


        window.location.href =
            "../login.html";
    }


    // =====================================================
    // Events
    // =====================================================

    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            loadLogs
        );
    }


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            logout
        );
    }


    // =====================================================
    // Initial Load
    // =====================================================

    loadLogs();

});