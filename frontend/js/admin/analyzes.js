// =========================================================
// SecurePass - Admin Analyses JavaScript
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // API
    // =====================================================

    const API_URL =
        "http://localhost:5000/api/admin/analyses";


    // =====================================================
    // DOM Elements
    // =====================================================

    const tableBody =
        document.querySelector("#analysesTableBody") ||
        document.querySelector("#analysisTableBody") ||
        document.querySelector("#tableBody") ||
        document.querySelector("tbody");


    const loadingElement =
        document.getElementById("loadingState") ||
        document.getElementById("loading") ||
        document.querySelector(".loading");


    const errorElement =
        document.getElementById("errorState") ||
        document.getElementById("errorMessage") ||
        document.querySelector(".alert-danger");


    const emptyElement =
        document.getElementById("emptyState") ||
        document.getElementById("emptyMessage");


    const countElement =
        document.getElementById("analysisCount") ||
        document.getElementById("totalAnalyses") ||
        document.getElementById("resultCount");


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
    // Show Loading
    // =====================================================

    function showLoading() {

        if (loadingElement) {
            loadingElement.classList.remove("d-none");
        }


        if (errorElement) {
            errorElement.classList.add("d-none");
        }


        if (emptyElement) {
            emptyElement.classList.add("d-none");
        }

    }


    // =====================================================
    // Hide Loading
    // =====================================================

    function hideLoading() {

        if (loadingElement) {
            loadingElement.classList.add("d-none");
        }

    }


    // =====================================================
    // Show Error
    // =====================================================

    function showError(message) {

        if (loadingElement) {
            loadingElement.classList.add("d-none");
        }


        if (emptyElement) {
            emptyElement.classList.add("d-none");
        }


        if (errorElement) {

            errorElement.textContent =
                message;

            errorElement.classList.remove("d-none");

        } else {

            console.error(
                "Admin Analyses Error:",
                message
            );

        }

    }


    // =====================================================
    // Show Empty
    // =====================================================

    function showEmpty() {

        if (loadingElement) {
            loadingElement.classList.add("d-none");
        }


        if (errorElement) {
            errorElement.classList.add("d-none");
        }


        if (emptyElement) {
            emptyElement.classList.remove("d-none");
        }

    }


    // =====================================================
    // Escape HTML
    // =====================================================

    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    // =====================================================
    // Format Date
    // =====================================================

    function formatDate(dateValue) {

        if (!dateValue) {
            return "N/A";
        }


        const date =
            new Date(dateValue);


        if (Number.isNaN(date.getTime())) {
            return String(dateValue);
        }


        return date.toLocaleString();

    }


    // =====================================================
    // Strength Badge
    // =====================================================

    function getStrengthBadge(strength) {

        const value =
            String(strength || "")
                .trim()
                .toLowerCase();


        let badgeClass =
            "text-bg-secondary";


        if (value === "very strong") {

            badgeClass =
                "text-bg-success";

        } else if (value === "strong") {

            badgeClass =
                "text-bg-primary";

        } else if (value === "medium") {

            badgeClass =
                "text-bg-warning";

        } else if (value === "weak") {

            badgeClass =
                "text-bg-danger";

        } else if (value === "very weak") {

            badgeClass =
                "text-bg-dark";

        }


        return `
            <span class="badge ${badgeClass}">
                ${escapeHTML(strength || "Unknown")}
            </span>
        `;

    }


    // =====================================================
    // Boolean Display
    // =====================================================

    function showCheck(value) {

        const isTrue =
            value === true ||
            value === 1 ||
            value === "1" ||
            String(value).toLowerCase() === "true";


        if (isTrue) {

            return `
                <span class="text-success fw-semibold">
                    <i class="bi bi-check-circle-fill"></i>
                    Yes
                </span>
            `;

        }


        return `
            <span class="text-danger fw-semibold">
                <i class="bi bi-x-circle-fill"></i>
                No
            </span>
        `;

    }


    // =====================================================
    // Render Analyses
    // =====================================================

    function renderAnalyses(analyses) {

        if (!tableBody) {

            throw new Error(
                "Analysis table body was not found in the page."
            );

        }


        tableBody.innerHTML = "";


        if (!Array.isArray(analyses) ||
            analyses.length === 0) {

            showEmpty();


            if (countElement) {
                countElement.textContent = "0";
            }


            return;
        }


        if (countElement) {
            countElement.textContent =
                String(analyses.length);
        }


        analyses.forEach((analysis) => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${escapeHTML(analysis.id)}
                </td>

                <td>
                    ${escapeHTML(analysis.user_id)}
                </td>

                <td>
                    <strong>
                        ${escapeHTML(analysis.score)}
                    </strong>
                </td>

                <td>
                    ${getStrengthBadge(
                        analysis.strength_level
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        analysis.password_length
                    )}
                </td>

                <td>
                    ${Number(
                        analysis.entropy ?? 0
                    ).toFixed(2)}
                </td>

                <td>
                    ${escapeHTML(
                        analysis.character_pool
                    )}
                </td>

                <td>
                    ${showCheck(
                        analysis.has_uppercase
                    )}
                </td>

                <td>
                    ${showCheck(
                        analysis.has_lowercase
                    )}
                </td>

                <td>
                    ${showCheck(
                        analysis.has_numbers
                    )}
                </td>

                <td>
                    ${showCheck(
                        analysis.has_special
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        formatDate(
                            analysis.created_at
                        )
                    )}
                </td>

            `;


            tableBody.appendChild(row);

        });


        hideLoading();


        if (errorElement) {
            errorElement.classList.add("d-none");
        }


        if (emptyElement) {
            emptyElement.classList.add("d-none");
        }

    }


    // =====================================================
    // Load Admin Analyses
    // =====================================================

    async function loadAnalyses() {

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
                "Loading Admin Analyses..."
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
                "Admin Analyses Response:",
                result
            );


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Failed to load password analyses."
                );

            }


            if (
                !result.success
            ) {

                throw new Error(
                    result.message ||
                    "Failed to load password analyses."
                );

            }


            const analyses =
                Array.isArray(result.data)
                    ? result.data
                    : [];


            renderAnalyses(
                analyses
            );


        } catch (error) {

            console.error(
                "Admin Analyses Error:",
                error
            );


            showError(
                error.message ||
                "Unable to load password analyses."
            );

        }

    }


    // =====================================================
    // Logout
    // =====================================================

    function logout() {

        sessionStorage.removeItem(
            "token"
        );

        sessionStorage.removeItem(
            "authToken"
        );

        sessionStorage.removeItem(
            "securePassToken"
        );

        sessionStorage.removeItem(
            "securePassUser"
        );

        sessionStorage.removeItem(
            "user"
        );

        sessionStorage.removeItem(
            "currentUser"
        );

        sessionStorage.removeItem(
            "loggedInUser"
        );

        sessionStorage.removeItem(
            "securePassLoggedIn"
        );


        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "authToken"
        );

        localStorage.removeItem(
            "securePassToken"
        );

        localStorage.removeItem(
            "securePassUser"
        );

        localStorage.removeItem(
            "user"
        );

        localStorage.removeItem(
            "currentUser"
        );

        localStorage.removeItem(
            "loggedInUser"
        );

        localStorage.removeItem(
            "securePassLoggedIn"
        );


        window.location.href =
            "../login.html";

    }


    // =====================================================
    // Logout Event
    // =====================================================

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            logout
        );

    }


    // =====================================================
    // Start
    // =====================================================

    loadAnalyses();

});