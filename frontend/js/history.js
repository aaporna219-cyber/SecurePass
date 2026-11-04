// =====================================================
// SecurePass - Analysis History
// =====================================================

const API_BASE_URL = "http://localhost:5000";


// =====================================================
// Get Authentication Token
// =====================================================

function getAuthToken() {

    const possibleKeys = [

        "token",
        "authToken",
        "securePassToken"

    ];


    for (const key of possibleKeys) {

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
// DOM Elements
// =====================================================

const historyLoading =
    document.getElementById("historyLoading");

const historyError =
    document.getElementById("historyError");

const historyErrorMessage =
    document.getElementById("historyErrorMessage");

const historyEmpty =
    document.getElementById("historyEmpty");

const historyContent =
    document.getElementById("historyContent");

const historyTableBody =
    document.getElementById("historyTableBody");

const historyCount =
    document.getElementById("historyCount");



// =====================================================
// Show Loading
// =====================================================

function showLoading() {

    historyLoading.classList.remove("d-none");

    historyError.classList.add("d-none");

    historyEmpty.classList.add("d-none");

    historyContent.classList.add("d-none");

}



// =====================================================
// Show Error
// =====================================================

function showError(message) {

    historyLoading.classList.add("d-none");

    historyEmpty.classList.add("d-none");

    historyContent.classList.add("d-none");

    historyError.classList.remove("d-none");

    historyErrorMessage.textContent = message;

}



// =====================================================
// Show Empty
// =====================================================

function showEmpty() {

    historyLoading.classList.add("d-none");

    historyError.classList.add("d-none");

    historyContent.classList.add("d-none");

    historyEmpty.classList.remove("d-none");

}



// =====================================================
// Show History
// =====================================================

function showHistory(history) {

    historyLoading.classList.add("d-none");

    historyError.classList.add("d-none");

    historyEmpty.classList.add("d-none");

    historyContent.classList.remove("d-none");


    historyCount.textContent =
        history.length;



    historyTableBody.innerHTML = "";



    history.forEach(
        (item, index) => {

            const row =
                document.createElement("tr");


            // Date

            let formattedDate = "-";


            if (item.created_at) {

                const date =
                    new Date(item.created_at);


                if (!isNaN(date.getTime())) {

                    formattedDate =
                        date.toLocaleString();

                }

            }



            // Strength badge

            let strengthClass =
                "text-bg-secondary";


            const strength =
                String(
                    item.strength_level || ""
                ).toLowerCase();


            if (
                strength.includes("very strong")
            ) {

                strengthClass =
                    "text-bg-success";

            }
            else if (
                strength.includes("strong")
            ) {

                strengthClass =
                    "text-bg-success";

            }
            else if (
                strength.includes("medium") ||
                strength.includes("moderate")
            ) {

                strengthClass =
                    "text-bg-warning";

            }
            else if (
                strength.includes("weak")
            ) {

                strengthClass =
                    "text-bg-danger";

            }



            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>


                <td>
                    ${formattedDate}
                </td>


                <td>

                    <strong>
                        ${item.score ?? "-"}
                    </strong>

                </td>


                <td>

                    <span class="badge ${strengthClass}">

                        ${item.strength_level || "-"}

                    </span>

                </td>


                <td>
                    ${item.password_length ?? "-"}
                </td>


                <td>
                    ${item.entropy ?? "-"}
                </td>


                <td>
                    ${item.character_pool ?? "-"}
                </td>


                <td>

                    <div class="small">

                        <div>
                            Uppercase:
                            ${item.has_uppercase ? "✓" : "✗"}
                        </div>

                        <div>
                            Lowercase:
                            ${item.has_lowercase ? "✓" : "✗"}
                        </div>

                        <div>
                            Numbers:
                            ${item.has_numbers ? "✓" : "✗"}
                        </div>

                        <div>
                            Special:
                            ${item.has_special ? "✓" : "✗"}
                        </div>

                    </div>

                </td>

            `;


            historyTableBody.appendChild(row);

        }
    );

}



// =====================================================
// Load Password History
// =====================================================

async function loadPasswordHistory() {

    showLoading();


    const token =
        getAuthToken();


    console.log(
        "History Page Token:",
        token ? "Token found" : "No token"
    );


    if (!token) {

        showError(
            "You are not logged in. Please login again."
        );

        return;

    }



    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/password-history`,
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



        const data =
            await response.json();


        console.log(
            "History API Response:",
            data
        );



        if (!response.ok) {

            showError(
                data.message ||
                "Unable to load password history."
            );

            return;

        }



        if (
            !data.history ||
            data.history.length === 0
        ) {

            showEmpty();

            return;

        }



        showHistory(
            data.history
        );


    }
    catch (error) {

        console.error(
            "History Fetch Error:",
            error
        );


        showError(
            "Could not connect to the SecurePass server."
        );

    }

}



// =====================================================
// Page Load
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "SecurePass History Page Loaded"
        );


        loadPasswordHistory();

    }
);