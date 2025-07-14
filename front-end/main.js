// ===============================
// 📁 main.js – Pennywise
// ===============================
// This file handles user interactions, form submissions,
// and server API calls for the Pennywise finance tracker.
// Replace /api/transactions with your actual API endpoint.

// ========== ⚙️ Global DOM Elements ==========
const model = document.getElementById("model");
const closeBtn = document.querySelector(".close-button");
const form = document.querySelector(".transaction-form");
const transactionList = document.querySelector(".transaction-card ul");
const totalBalanceEl = document.querySelector(".balance-card .card-amount");

// ========== 🧠 Utility: Format currency with sign ==========
function formatCurrency(amount) {
  const prefix = amount >= 0 ? "+" : "-";
  return `${prefix}$${Math.abs(amount).toFixed(2)}`;
}

// ========== 🧠 Utility: Update Total Balance Color ==========
function updateTotalBalanceDisplay(balance) {
  totalBalanceEl.textContent = formatCurrency(balance);
  totalBalanceEl.classList.remove("income", "expense");
  totalBalanceEl.classList.add(balance >= 0 ? "income" : "expense");
}

// ========== ✅ model / Lightbox Logic ==========
document.querySelectorAll("a").forEach(link => {
  if (link.textContent.trim() === "Add Transaction") {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      model.style.display = "flex";
    });
  }
});

closeBtn.addEventListener("click", () => {
  model.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === model) {
    model.style.display = "none";
  }
});

// ========== ✅ Task A: Handle the Add Transaction Form Submission ==========
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // 🔢 Extract form values
  const desc = document.getElementById("desc").value;
  const type = document.getElementById("type").value;
  const rawAmount = parseFloat(document.getElementById("amount").value);
  const date = document.getElementById("date").value;

  // ➕ Make amount always positive then adjust sign by type
  const amount = type === "expense" ? -Math.abs(rawAmount) : Math.abs(rawAmount);

  const transactionData = {
    description: desc,
    type,
    amount,
    date
  };

  // ✅ TODO: Use fetch() to POST this data to your backend
  // Example (uncomment and replace URL):
  /*
  try {
    const response = await fetch('/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactionData),
    });

    const result = await response.json();
    // Optionally re-fetch all transactions or append it to DOM manually

  } catch (error) {
    console.error('Error adding transaction:', error);
  }
  */

  // 🔄 Clear form & close model
  form.reset();
  model.style.display = "none";

  // ✅ Optional: Re-fetch transactions or update DOM directly
});

// ========== ✅ Task B: Fetch and Display All Transactions ==========
async function loadTransactions() {
  // ✅ TODO: Use fetch() to GET all transactions from your backend
  // Example placeholder:
  /*
  try {
    const response = await fetch('/api/transactions');
    const transactions = await response.json();

    // Clear existing list
    transactionList.innerHTML = "";

    // Loop and render each transaction
    transactions.forEach(tx => {
      const li = document.createElement("li");
      const span = document.createElement("span");

      span.textContent = formatCurrency(tx.amount);
      span.classList.add("card-amount", tx.amount >= 0 ? "income" : "expense");

      li.textContent = tx.description;
      li.appendChild(span);

      // ✅ TODO: Add a delete button/icon with event listener
      // Call deleteTransaction(tx.id) when clicked

      transactionList.appendChild(li);
    });

    // ✅ TODO: Optionally update balance total
    // updateTotalBalanceDisplay(computedBalance);

  } catch (err) {
    console.error("Error loading transactions:", err);
  }
  */
}

// ========== ✅ Task C: Delete Transaction Feature ==========
async function deleteTransaction(transactionId) {
  // ✅ TODO: Use fetch() to DELETE the transaction by ID
  /*
  try {
    await fetch(`/api/transactions/${transactionId}`, {
      method: 'DELETE',
    });

    // Optionally re-fetch or remove the deleted item from DOM
    loadTransactions();

  } catch (err) {
    console.error("Error deleting transaction:", err);
  }
  */
}

// ========== 🚀 INIT ==========
window.addEventListener("DOMContentLoaded", () => {
  // Format starting balance on page load
  const current = parseFloat(totalBalanceEl.textContent.replace(/[+$,]/g, ""));
  updateTotalBalanceDisplay(current);

  // ✅ Load transactions from backend
  loadTransactions();
});
