// Version 2: Add Transaction (in memory)

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

    // Event Listener
    this.transactionForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.addTransaction();
    });

    console.log("TransactionManager ready (Add only).");
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

    this.transactions.unshift(transaction); // Add to the top of array
    this.renderTransactions();
    this.transactionForm.reset(); // Clear the form
  }

  renderTransactions() {
    this.transactionsContainer.innerHTML = ""; // Clear first

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
      div.className = `border p-3 mb-2 rounded ${
        tx.type === "deposit"
          ? "bg-light border-success"
          : "bg-light border-danger"
      }`;

      div.innerHTML = `
          <strong>${tx.type.toUpperCase()}</strong>: ₱${tx.amount.toFixed(2)}
        `;

      this.transactionsContainer.appendChild(div);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.transactionManager = new TransactionManager();
});
