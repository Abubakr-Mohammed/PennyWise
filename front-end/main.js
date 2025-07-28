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
const incomeCardEl = document.querySelector(".income-card .card-amount");
const expenseCardEl = document.querySelector(".expense-card .card-amount");


// ========== 🛠️ Helper Function: Reusable UI message handler to avoid repeating code ==========
const messageBox = document.getElementById("message-box");

function showMessage(msg, type = "success", duration = 3000) {
  messageBox.textContent = msg; // the box content should be the message
  messageBox.className = `message-box ${type}`; // the accompanying type chooses which CSS style to use, success is just the default value
  messageBox.style.display = "block";
  if (type != "loading") {
    setTimeout(() => {
      messageBox.style.display = "none";
    }, duration);
  }
}

// ========== 🛠️ Helper Function: To update the Expense and Income display ==========
function updateIncomeExpenseDisplay(income, expenses) {
  incomeCardEl.textContent = formatCurrency(income);
  incomeCardEl.classList.remove("expense"); // Reset previous style, then apply correct class (applies the right style) to the Income card
  incomeCardEl.classList.add("income");

  expenseCardEl.textContent = formatCurrency(expenses);
  expenseCardEl.classList.remove("income"); // Same concept applies to expense card as income card
  expenseCardEl.classList.add("expense");
}


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
  showMessage("Submitting transaction...", "loading");

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
    showMessage("Transaction added successfully!", "success");
  } catch (error) {
    showMessage("Something went wrong while adding transaction.", "error");
  }


  // Reset form and close modal
  form.reset();
  modal.style.display = "none"; 

  

});

// ========== ✅ Task B: Load Transactions from API ==========
async function loadTransactions() {
  showMessage("Loading transactions...", "loading");
  try {
    const res = await fetch("http://localhost:5000/transactions");
    const data = await res.json();

    // Clear old transactions
    transactionList.innerHTML = "";

    let total = 0;
    let totalIncome = 0;
    let totalExpenses = 0;

    data.forEach((txn) => {
      total += txn.amount;

      if (txn.amount >= 0){
        totalIncome += txn.amount;
      } else {
        totalExpenses += txn.amount;
      }

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
    updateIncomeExpenseDisplay(totalIncome, totalExpenses);

    messageBox.style.display = "none";
  } catch (error) {
    showMessage("Failed to load transactions.", "error");
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
