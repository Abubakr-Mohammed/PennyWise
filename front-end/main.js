// ===============================
// 📁 main.js – Pennywise (Template)
// ===============================
// This file handles:
// 1. Modal interactions (open/close)
// 2. Add Transaction form submission (Task A)
// 3. Fetch/display all transactions (Task B)
// 4. Delete transaction logic (Task C)

// ========== ⚙️ DOM Elements ==========
const modal = document.getElementById("modal");
const openFormBtn = document.getElementById("open-form");
const closeBtn = document.querySelector(".close-button");
const form = document.querySelector(".transaction-form");
const transactionList = document.querySelector(".transaction-card ul");
const totalBalanceEl = document.querySelector(".balance-card .card-amount");

// ========== 🧠 Utility: Format Currency ==========
function formatCurrency(amount) {
  const prefix = amount >= 0 ? "+" : "-";
  return `${prefix}$${Math.abs(amount).toFixed(2)}`;
}

// ========== 🧠 Utility: Update Total Balance ==========
function updateTotalBalanceDisplay(balance) {
  totalBalanceEl.textContent = formatCurrency(balance);
  totalBalanceEl.classList.remove("income", "expense");
  totalBalanceEl.classList.add(balance >= 0 ? "income" : "expense");
}

// ========== 💡 Modal Lightbox Toggle ==========
openFormBtn.addEventListener("click", (e) => {
  e.preventDefault();
  modal.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// ========== ✅ Task A: Handle Add Transaction ==========
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // TODO: Extract values from form
  // TODO: Adjust amount sign based on income/expense
  // TODO: Send data to backend using fetch POST
  // TODO: Optionally update the UI or reload transactions

  form.reset();
  modal.style.display = "none";
});

// ========== ✅ Task B: Load Transactions from API ==========
async function loadTransactions() {
  // TODO: Use fetch() to get transactions from backend
  // TODO: Clear existing list
  // TODO: Loop through and append transactions
  // TODO: Update total balance based on fetched data
}

// ========== ✅ Task C: Delete Transaction ==========
async function deleteTransaction(transactionId) {
  // TODO: Send DELETE request to API
  // TODO: Refresh list or remove item from DOM
}

// ========== 🚀 On Page Load ==========
window.addEventListener("DOMContentLoaded", () => {
  const initial = parseFloat(totalBalanceEl.textContent.replace(/[+$,]/g, ""));
  updateTotalBalanceDisplay(initial);
  loadTransactions(); // Load data from backend
});
