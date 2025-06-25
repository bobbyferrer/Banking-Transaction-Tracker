// Version 5: Add/Delete + Balance + localStorage

class TransactionManager {
  constructor() {
    this.transactions = this.loadFromStorage();
    this.currentBalance = 0;

    // DOM Elements
    this.transactionForm = document.getElementById("transactionForm");
    this.transactionType = document.getElementById("transactionType");
    this.transactionAmount = document.getElementById("transactionAmount");
    this.transactionsContainer = document.getElementById(
      "transactionsContainer"
    );
    this.currentBalanceElement = document.getElementById("currentBalance");

    // Event Listeners
    this.transactionForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.addTransaction();
    });

    this.transactionsContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("delete-btn")) {
        const id = Number(e.target.dataset.id);
        this.deleteTransaction(id);
      }
    });

    // Initial render
    this.updateBalance();
    this.renderTransactions();
    console.log("TransactionManager with localStorage ready.");
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
    this.saveToStorage();
    this.updateBalance();
    this.renderTransactions();
    this.transactionForm.reset();
  }

  deleteTransaction(id) {
    this.transactions = this.transactions.filter((tx) => tx.id !== id);
    this.saveToStorage();
    this.updateBalance();
    this.renderTransactions();
  }

  updateBalance() {
    let total = 0;

    this.transactions.forEach((tx) => {
      if (tx.type === "deposit") {
        total += tx.amount;
      } else {
        total -= tx.amount;
      }
    });

    this.currentBalance = total;
    this.renderBalance();
  }

  renderBalance() {
    const formatted = this.formatCurrency(this.currentBalance);
    this.currentBalanceElement.textContent = formatted;
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
      this.renderBalance();
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

  saveToStorage() {
    localStorage.setItem("transactions", JSON.stringify(this.transactions));
  }

  loadFromStorage() {
    const data = localStorage.getItem("transactions");
    return data ? JSON.parse(data) : [];
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(Math.abs(amount));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.transactionManager = new TransactionManager();
});
