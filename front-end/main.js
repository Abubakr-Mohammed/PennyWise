// ===============================
// 📁 main.js – Pennywise (Refactored)
// ===============================
// This file handles:
// 1. Modal interactions
// 2. Add Transaction form submission
// 3. Fetch/display all transactions
// 4. Delete transaction logic
// ===============================

// ========== ⚙️ DOM Elements ==========
const modal = document.getElementById("modal");
const openFormBtn = document.getElementById("open-form");
const closeBtn = document.querySelector(".close-button");
const form = document.querySelector(".transaction-form");
const transactionList = document.getElementById("transactions-list");
const totalBalanceEl = document.querySelector(".balance-card .card-amount");
const incomeCardEl = document.querySelector(".income-card .card-amount");
const expenseCardEl = document.querySelector(".expense-card .card-amount");
const messageBox = document.getElementById("message-box");

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

function updateTotalBalanceDisplay(balance) {
    totalBalanceEl.textContent = formatCurrency(balance);
    totalBalanceEl.classList.remove("income", "expense");
    totalBalanceEl.classList.add(balance >= 0 ? "income" : "expense");
}

function updateIncomeExpenseDisplay(income, expenses) {
    incomeCardEl.textContent = formatCurrency(income);
    incomeCardEl.className = "card-amount income";

    expenseCardEl.textContent = formatCurrency(expenses);
    expenseCardEl.className = "card-amount expense";
}

// ========== 💡 Modal Interactions ==========
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

    const desc = document.getElementById("desc").value.trim();
    const type = document.getElementById("type").value;
    const userAmount = parseFloat(document.getElementById("amount").value);
    const date = document.getElementById("date").value;

    if (!desc || isNaN(userAmount) || !date) {
        showMessage("Please fill all fields correctly.", "error");
        return;
    }

    const amount = type === "income" ? Math.abs(userAmount) : -Math.abs(userAmount);

    const transactionData = { description: desc, type, amount, date };

    try {
        const res = await fetch("http://localhost:5000/api/transactions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
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
    showMessage("Loading transactions...", "loading");

    try {
        const res = await fetch("http://localhost:5000/api/transactions");
        const data = await res.json();

        renderTransactionList(data);
        messageBox.style.display = "none";
    } catch (error) {
        showMessage("Failed to load transactions.", "error");
    }
}

function renderTransactionList(transactions) {
    transactionList.innerHTML = "";

    let total = 0;
    let income = 0;
    let expenses = 0;

    transactions.forEach((txn) => {
        total += txn.amount;
        txn.amount >= 0 ? income += txn.amount : expenses += txn.amount;
        renderTransactionItem(txn);
    });

    updateTotalBalanceDisplay(total);
    updateIncomeExpenseDisplay(income, expenses);
}

function renderTransactionItem(txn) {
    const li = document.createElement("li");
    li.dataset.id = txn._id;
    li.innerHTML = `
        ${txn.description}
        <span class="card-amount ${txn.amount >= 0 ? "income" : "expense"}">
            ${formatCurrency(txn.amount)}
        </span>
        <button class="delete-btn" onclick="deleteTransaction('${txn._id}')">🗑</button>
    `;
    transactionList.appendChild(li);
}

// ========== ❌ Delete Transaction ==========
async function deleteTransaction(transactionId) {
    try {
        const res = await fetch(`http://localhost:5000/api/transactions/${transactionId}`, {
            method: "DELETE",
        });

        if (!res.ok) throw new Error("Failed to delete transaction");

        await loadTransactions();
    } catch (error) {
        console.error("Error deleting transaction:", error);
        showMessage("Failed to delete transaction.", "error");
    }
}

// ========== 🚀 Initialize ==========
function initApp() {
    handleModalEvents();
    form.addEventListener("submit", addTransaction);
    loadTransactions();
}

// ========== 🔃 On Page Load ==========
window.addEventListener("DOMContentLoaded", initApp);
