// ===============================
// 📁 main.js – Pennywise (Refactored)
// ===============================
// This file handles:
// 1. Modal interactions
// 2. Add Transaction form submission
// 3. Fetch/display all transactions
// 4. Delete transaction logic
// ===============================

// ===============================
// 📊 Charts View Logic – Pennywise
// ===============================
// Purpose of this section:
// 1. Allow user to switch between "Home" and "Charts" views.
// 2. Fetch financial data from the backend to feed into charts.
// 3. Render Pie & Bar charts using Chart.js with dynamic data.
// ===============================

// ========== ⚙️ DOM Elements ==========
const modal = document.getElementById("modal");
const openFormBtn = document.getElementById("open-form"); // Grab references to buttons or elements in HTML
const closeBtn = document.querySelector(".close-button");
const form = document.querySelector(".transaction-form");
const transactionList = document.getElementById("transactions-list");
const incomeCardEl = document.querySelector(".income-card .card-amount");
const expenseCardEl = document.querySelector(".expense-card .card-amount");
const messageBox = document.getElementById("message-box");
const viewBalanceBtn = document.getElementById("view-balance-btn");
const lightbox = document.getElementById("balance-lightbox");
const closeLightboxBtn = document.getElementById("close-lightbox-btn");
const balanceJsonOutput = document.getElementById("balance-json-output");
const logoutBtn = document.getElementById("logout-btn");
//These are to grab references to buttons and view containers from the HTML.
// These are used to switch between Home and Charts views.
const chartsBtn = document.getElementById("Charts-btn"); // Button to open Charts view
const homeBtn = document.getElementById("home-btn");      // Button to go back Home
const homeView = document.getElementById("home-view");    // Home screen container
const chartsView = document.getElementById("charts-view");// Charts screen container

// ========== 📈 Chart.js Variables ==========
// We'll store Chart.js instances here so we can destroy them before re-rendering
// (prevents overlapping data when the user revisits the Charts page)
let pieChartInstance = null;
let barChartInstance = null;

// ========== 🔄 Show Charts View ==========
// When the user clicks the "Charts" button:
// 1. Hide the Home view.
// 2. Show the Charts view.
// 3. Fetch fresh data from the backend and render charts.
chartsBtn.addEventListener("click", async (e) => {
    e.preventDefault(); // Prevents any default link/button behavior

    // Step 1: Switch views
    homeView.classList.add("hidden");
    chartsView.classList.remove("hidden");

    try {
        // Step 2: Fetch data for each chart
        const pieData = await getPieChartData();
        const barData = await getBarChartData();

        // Step 3: Render both charts
        renderPieChart(pieData);
        renderBarChart(barData);
    } catch (err) {
        console.error("Error loading chart data:", err);
        showMessage("Failed to load charts.", "error"); // Show user-friendly error
    }
});

// ========== 🏠 Go Back Home ==========
// When the "Home" button is clicked, we hide Charts view and show Home view again.
homeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    chartsView.classList.add("hidden");
    homeView.classList.remove("hidden");
});

// ========== 📊 Fetch Pie Chart Data ==========
// This gets the last 5 transactions from the backend and calculates
// the percentage split between Income and Expenses.
async function getPieChartData() {
    const token = localStorage.getItem("token");
    const res = await fetch("http://127.0.0.1:5000/api/transactions?limit=5", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!Array.isArray(data)) {
        throw new Error("Invalid pie chart data response");
    }

    let incomeTotal = 0;
    let expenseTotal = 0;

    data.forEach(txn => {
        if (txn.amount >= 0) incomeTotal += txn.amount;
        else expenseTotal += Math.abs(txn.amount);
    });

    const total = incomeTotal + expenseTotal || 1;
    return {
        incomePercent: ((incomeTotal / total) * 100).toFixed(2),
        expensePercent: ((expenseTotal / total) * 100).toFixed(2)
    };
}

// ========== 📊 Fetch Bar Chart Data ==========
async function getBarChartData() {
    const token = localStorage.getItem("token");
    const res = await fetch("http://127.0.0.1:5000/api/transactions/grouped/month", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!Array.isArray(data)) {
        throw new Error("Invalid bar chart data response");
    }

    return data; // already [{ month: "Jan", balance: 1200 }, ...]
}

// ========== 📈 Render Pie Chart ==========
// Takes the percentage values from getPieChartData() and creates a pie chart.
function renderPieChart(data) {
    const ctx = document.getElementById("pieChart").getContext("2d");

    // Destroy old chart instance before creating a new one
    if (pieChartInstance) pieChartInstance.destroy();

    // Create new pie chart
    pieChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ["Income", "Expenses"],
            datasets: [{
                data: [data.incomePercent, data.expensePercent],
                backgroundColor: ["#22c55e", "#ef4444"] // Green for income, Red for expenses
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: "bottom" }, // Move legend to bottom for better fit
                title: { display: true, text: "Income vs Expenses (%)" }
            }
        }
    });
}

// ========== 📈 Render Bar Chart ==========
// Takes monthly balances from getBarChartData() and creates a bar chart.
function renderBarChart(data) {
    const ctx = document.getElementById("barChart").getContext("2d");

    // Destroy old chart instance before creating a new one
    if (barChartInstance) barChartInstance.destroy();

    // Create new bar chart
    barChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(item => item.month), // X-axis labels = months
            datasets: [{
                label: 'Balance',
                data: data.map(item => item.balance), // Y-axis values = balances
                backgroundColor: "#3b82f6" // Blue bars
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }, // Hide legend since label is obvious
                title: { display: true, text: "Monthly Balances" }
            },
            scales: {
                y: {
                    beginAtZero: true, // Always start Y-axis at zero
                    ticks: { callback: value => `$${value}` } // Format as currency
                }
            }
        }
    });
}

// ========== 💡 View Total Balance Lightbox/Modal Interactions ==========
viewBalanceBtn.addEventListener("click", async () => {
    balanceJsonOutput.textContent = "Loading...";
    const token = localStorage.getItem("token");

    try {
        const res = await fetch("http://127.0.0.1:5000/api/balance", {
            method: "GET",
            headers: {"Content-Type": "application/json", Authorization: `Bearer ${token}`},
        });
        const data = await res.json();
        console.log("Balance API response:", data); // 👈 DEBUG HERE

        if (data.status === "success" && typeof data.balance === "number") {
            balanceJsonOutput.textContent = `Total Balance: $${data.balance.toFixed(2)}`;
        } else {
            balanceJsonOutput.textContent = "Failed to load balance.";
            console.warn("Unexpected balance format:", data); // 👈 DEBUG
        }
    } catch (err) {
        balanceJsonOutput.textContent = "Error loading balance.";
        console.error("Error fetching balance:", err); // 👈 DEBUG
    }

    // Show lightbox
    lightbox.classList.remove("hidden");
});

closeLightboxBtn.addEventListener("click", () => {
    lightbox.classList.add("hidden");
});

// ========== 🧠 Utility: Format Currency ==========
function formatCurrency(amount) {
    const prefix = amount >= 0 ? "+" : "-";
    return `${prefix}$${Math.abs(amount).toFixed(2)}`;
}

// ========== 🛠️ UI Helper Functions ==========
function showMessage(msg, type = "success", duration = 3000) {
    messageBox.textContent = msg;
    messageBox.className = `message-box ${type}`;
    messageBox.style.display = "block";

    if (type !== "loading") {
        setTimeout(() => {
            messageBox.style.display = "none";
        }, duration);
    }
}

function updateIncomeExpenseDisplay(income, expenses) {
    incomeCardEl.textContent = formatCurrency(income);
    incomeCardEl.className = "card-amount income";

    expenseCardEl.textContent = formatCurrency(expenses);
    expenseCardEl.className = "card-amount expense";
}

// ========== 💡 Add Transaction Lightbox/Modal Interactions ==========
function openModal() {
    modal.style.display = "flex";
}

function closeModal() {
    modal.style.display = "none";
}

function handleModalEvents() {
    openFormBtn.addEventListener("click", (e) => {
        e.preventDefault();
        openModal();
    });

    closeBtn.addEventListener("click", closeModal);

    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// ========== ✅ Add Transaction ==========
async function addTransaction(e) {
    e.preventDefault();
    showMessage("Submitting transaction...", "loading");

    const token = localStorage.getItem("token");

    const desc = document.getElementById("desc").value.trim();
    const type = document.getElementById("type").value;
    const userAmount = parseFloat(document.getElementById("amount").value);
    const date = document.getElementById("date").value;

    if (!desc || isNaN(userAmount) || !date) {
        showMessage("Please fill all fields correctly.", "error");
        return;
    }

    const amount = type === "income" ? Math.abs(userAmount) : -Math.abs(userAmount);

    const transactionData = {description: desc, type, amount, date};

    try {
        const res = await fetch("http://localhost:5000/api/transactions", {
            method: "POST",
            headers: {"Content-Type": "application/json", Authorization: `Bearer ${token}`},
            body: JSON.stringify(transactionData),
        });

        if (!res.ok) throw new Error("Failed to add the recent transaction");

        showMessage("Transaction added successfully!", "success");
        await loadTransactions();
        form.reset();
        closeModal();
    } catch (error) {
        showMessage("Something went wrong while adding transaction.", "error");
    }
}

// ========== 📥 Load Transactions ==========
async function loadTransactions() {
    transactionList.innerHTML = `<li>Loading transactions...</li>`;
    showMessage("Loading transactions...", "loading");

    const token = localStorage.getItem("token");

    try {
        const res = await fetch("http://127.0.0.1:5000/api/transactions", {
            method: "GET",
            headers: {Authorization: `Bearer ${token}`},
        });
        const data = await res.json();

        if (data.status === "success" && Array.isArray(data.data)) {
            if (data.data.length === 0) {
                transactionList.innerHTML = `<li>No transactions yet. Add one to get started.</li>`;
                showMessage("No transactions yet. Add one to get started!", "info");
            } else {
                renderTransactionList(data.data);
                messageBox.style.display = "none";
            }
        } else {
            showMessage("Unexpected response format.", "error");
        }
    } catch (error) {
        transactionList.innerHTML = `<li>Error loading transactions.</li>`;
        showMessage("Failed to load transactions.", "error");
    }
}

// ========== 🧾 Render All Transactions ==========
function renderTransactionList(transactions) {
    transactionList.innerHTML = "";

    let total = 0;
    let income = 0;
    let expenses = 0;

    transactions.forEach((txn) => {
        total += txn.amount;
        txn.amount >= 0 ? (income += txn.amount) : (expenses += txn.amount);
        renderTransactionItem(txn);
    });

    updateIncomeExpenseDisplay(income, expenses);
}

// ========== 📄 Render Single Transaction ==========
function renderTransactionItem(txn) {
    const li = document.createElement("li");
    li.dataset.id = txn.id; // fixed from _id to id (based on the backend)

    li.innerHTML = `
        <span>${txn.date} – ${txn.description}</span>
        <span class="card-amount ${txn.amount >= 0 ? "income" : "expense"}">
            ${formatCurrency(txn.amount)}
        </span>
        <button class="delete-btn" onclick="deleteTransaction(${txn.id})">🗑</button>
    `;

    transactionList.appendChild(li);
}

// ========== ❌ Delete Transaction ==========
async function deleteTransaction(transactionId) {
    const confirmDelete = confirm("Are you sure you want to delete this transaction?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    try {
        const res = await fetch(`http://localhost:5000/api/transactions/${transactionId}`, {
            method: "DELETE",
            headers: {"Content-Type": "application/json", Authorization: `Bearer ${token}`},
        });

        if (!res.ok) throw new Error("Failed to delete transaction");

        showMessage("Transaction deleted successfully!", "success");
        await loadTransactions();
    } catch (error) {
        console.error("Error deleting transaction:", error);
        showMessage("Failed to delete transaction.", "error");
    }
}

// ========== Logout button ==========
logoutBtn.addEventListener("click", () => {
    // Optional: Clear user session info (if using localStorage, cookies, etc.)
    // localStorage.clear();
    window.location.href = "login.html"; // adjust if different filename
});

// ========== 🚀 Initialize ==========
function initApp() {
    console.log("initApp");
    handleModalEvents();
    form.addEventListener("submit", addTransaction);
    loadTransactions();
}

// ========== 🔃 On Page Load ==========
window.addEventListener("DOMContentLoaded", initApp);
