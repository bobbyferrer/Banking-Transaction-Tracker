// Version 3: Add and Delete Transactions

class TransactionManager {
  constructor() {
    this.transactions = [];

    // DOM Elements
    this.transactionForm = document.getElementById("transactionForm");
    this.transactionType = document.getElementById("transactionType");
    this.transactionAmount = document.getElementById("transactionAmount");
    this.transactionsContainer = document.getElementById(
      "transactionsContainer"
    );

    // Event Listeners
    this.transactionForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.addTransaction();
    });

    // Event Delegation for Delete
    this.transactionsContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("delete-btn")) {
        const id = Number(e.target.dataset.id);
        this.deleteTransaction(id);
      }
    });

    console.log("TransactionManager ready (Add + Delete).");
  }

  addTransaction() {
    const type = this.transactionType.value;
    const amount = parseFloat(this.transactionAmount.value);

    if (!type || isNaN(amount) || amount <= 0) {
      alert("Please enter a valid transaction.");
      return;
    }

    const transaction = {
      id: Date.now(),
      type,
      amount,
    };

    this.transactions.unshift(transaction);
    this.renderTransactions();
    this.transactionForm.reset();
  }

  deleteTransaction(id) {
    this.transactions = this.transactions.filter((tx) => tx.id !== id);
    this.renderTransactions();
  }

  renderTransactions() {
    this.transactionsContainer.innerHTML = "";

    if (this.transactions.length === 0) {
      this.transactionsContainer.innerHTML = `
          <div class="empty-state text-center text-muted p-4">
            <i class="bi bi-receipt display-4"></i>
            <p>No transactions yet</p>
          </div>
        `;
      return;
    }

    this.transactions.forEach((tx) => {
      const div = document.createElement("div");
      div.className = `d-flex justify-content-between align-items-center border p-3 mb-2 rounded ${
        tx.type === "deposit" ? "border-success" : "border-danger"
      }`;

      div.innerHTML = `
          <div>
            <strong>${tx.type.toUpperCase()}</strong>: ₱${tx.amount.toFixed(2)}
          </div>
          <button class="btn btn-sm btn-danger delete-btn" data-id="${tx.id}">
            <i class="bi bi-trash"></i> Delete
          </button>
        `;

      this.transactionsContainer.appendChild(div);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.transactionManager = new TransactionManager();
});
