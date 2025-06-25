// Version 7: Adds timestamp (date and time) to each transaction

class TransactionManager {
  constructor() {
    this.transactions = this.loadFromStorage();
    this.currentBalance = 0;
    this.customer = null;

    // DOM Elements
    this.transactionForm = document.getElementById("transactionForm");
    this.transactionType = document.getElementById("transactionType");
    this.transactionAmount = document.getElementById("transactionAmount");
    this.transactionsContainer = document.getElementById(
      "transactionsContainer"
    );
    this.currentBalanceElement = document.getElementById("currentBalance");

    this.loadCustomerBtn = document.getElementById("loadCustomerBtn");
    this.customerName = document.getElementById("customerName");
    this.customerEmail = document.getElementById("customerEmail");
    this.customerPhoto = document.getElementById("customerPhoto");

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

    this.loadCustomerBtn.addEventListener("click", () => {
      this.loadCustomerData();
    });

    // Initial Render
    this.updateBalance();
    this.renderTransactions();
  }

  async loadCustomerData() {
    this.loadCustomerBtn.disabled = true;
    this.loadCustomerBtn.textContent = "Loading...";

    try {
      const res = await fetch("https://randomuser.me/api/");
      const data = await res.json();
      const user = data.results[0];

      this.customer = {
        name: `${user.name.first} ${user.name.last}`,
        email: user.email,
        photo: user.picture.medium,
      };

      this.updateCustomerDisplay();
    } catch (err) {
      alert("Failed to load customer data.");
    }

    this.loadCustomerBtn.disabled = false;
    this.loadCustomerBtn.textContent = "Load Customer";
  }

  updateCustomerDisplay() {
    if (!this.customer) return;

    this.customerName.textContent = this.customer.name;
    this.customerEmail.textContent = this.customer.email;
    this.customerPhoto.src = this.customer.photo;
    this.customerPhoto.alt = this.customer.name;
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
      date: new Date().toISOString(), // ✅ Add timestamp
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
      total += tx.type === "deposit" ? tx.amount : -tx.amount;
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
            <strong>${tx.type.toUpperCase()}</strong>: ₱${tx.amount.toFixed(
        2
      )}<br>
            <small class="text-muted">${this.formatDate(
              tx.date
            )}</small> <!-- ✅ Show timestamp -->
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

  formatDate(isoString) {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };

    return new Date(isoString).toLocaleString("en-PH", options);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.transactionManager = new TransactionManager();
});
