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
const transactionList = document.getElementById("transactions-list");
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

  // Extract values from form
  
  const desc = document.getElementById("desc").value;
  const type = document.getElementById("type").value; // income or expense
  const userAmount = parseFloat(document.getElementById("amount").value); // converts "amount" to a number
  const date = document.getElementById("date").value;
  // Adjust amount sign based on income/expense
  const amount = type === "income" ? Math.abs(userAmount) : -Math.abs(userAmount);

  const transactionData = 
  {
    description: desc,
    type,
    amount,
    date,
  };  

  
  //Send data to backend using fetch POST
  try {
    const res = await fetch("http://localhost:5000/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transactionData),
    });

    if (!res.ok) {
      throw new Error("Failed to add the recent transaction");
    }

    await loadTransactions();   // Refresh the transaction list after adding a new one
  } catch (error) {
    console.error("Error adding the recent transaction:", error);
  }


  // Reset form and close modal
  form.reset();
  modal.style.display = "none"; 

  

});

// ========== ✅ Task B: Load Transactions from API ==========
async function loadTransactions() {
  try {
    const res = await fetch("http://localhost:5000/transactions");
    const data = await res.json();

    // Clear old transactions
    transactionList.innerHTML = "";

    let total = 0;

    data.forEach((txn) => {
      total += txn.amount;

      const li = document.createElement("li");
      li.innerHTML = `
        ${txn.desc}
        <span class="card-amount ${txn.amount >= 0 ? "income" : "expense"}">
          ${formatCurrency(txn.amount)}
        </span>
      `;

      transactionList.appendChild(li);
    });

    updateTotalBalanceDisplay(total);
  } catch (error) {
    console.error("Failed to load transactions:", error);
  }
}

// ========== ✅ Task C: Delete Transaction ==========
async function deleteTransaction(transactionId) {
  // Send DELETE request to API
  try {
    const res = await fetch(`http://localhost:5000/transactions/${transactionId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Failed to delete the recent transaction");
    }

    // Reload transactions after deletion
    await loadTransactions();
  } catch (error) {
    console.error("Error deleting the transaction:", error);
  }
  // Refresh list or remove item from DOM
  const transactionItem = document.querySelector(`li[data-id="${transactionId}"]`);
  if (transactionItem) {
    transactionItem.remove();
  }


}

// ========== 🚀 On Page Load ==========
window.addEventListener("DOMContentLoaded", () => {
  const initial = parseFloat(totalBalanceEl.textContent.replace(/[+$,]/g, ""));
  updateTotalBalanceDisplay(initial);
  loadTransactions(); // Load data from backend
});
