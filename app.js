/**
 * Banking Transaction Tracker Application
 *
 * This application demonstrates Object-Oriented Programming concepts
 * with a TransactionManager class that handles all banking operations.
 *
 * Features:
 * - Add/Delete transactions
 * - Real-time balance calculation
 * - LocalStorage persistence
 * - Customer data loading from API
 * - Responsive Bootstrap UI
 */

class TransactionManager {
  constructor() {
    // Initialize properties
    this.transactions = [];
    this.currentBalance = 0;
    this.customer = null;

    // Bind DOM elements
    this.initializeElements();

    // Set up event listeners
    this.setupEventListeners();

    // Load existing data
    this.loadFromStorage();

    // Initial render
    this.render();

    console.log("TransactionManager initialized successfully");
  }

  /**
   * Initialize DOM element references
   * This method caches frequently used DOM elements for better performance
   */
  initializeElements() {
    // Form elements
    this.transactionForm = document.getElementById("transactionForm");
    this.transactionType = document.getElementById("transactionType");
    this.transactionAmount = document.getElementById("transactionAmount");

    // Display elements
    this.currentBalanceElement = document.getElementById("currentBalance");
    this.transactionsContainer = document.getElementById(
      "transactionsContainer"
    );

    // Customer elements
    this.loadCustomerBtn = document.getElementById("loadCustomerBtn");
    this.customerName = document.getElementById("customerName");
    this.customerEmail = document.getElementById("customerEmail");
    this.customerPhoto = document.getElementById("customerPhoto");

    // Loading spinner
    this.loadingSpinner =
      this.loadCustomerBtn.querySelector(".loading-spinner");
  }

  /**
   * Set up all event listeners
   * This method organizes all event handling in one place
   */
  setupEventListeners() {
    // Form submission
    this.transactionForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.addTransaction();
    });

    // Load customer button
    this.loadCustomerBtn.addEventListener("click", () => {
      this.loadCustomerData();
    });

    // Input validation
    this.transactionAmount.addEventListener("input", (e) => {
      this.validateAmountInput(e.target);
    });
  }

  /**
   * Add a new transaction
   * This method creates a transaction object and updates the system
   */
  addTransaction() {
    // Get form values
    const type = this.transactionType.value;
    const amount = parseFloat(this.transactionAmount.value);

    // Validate input
    if (!type || !amount || amount <= 0) {
      this.showAlert("Please fill in all fields with valid values", "warning");
      return;
    }

    // Check for sufficient funds on withdrawal
    if (type === "withdrawal" && amount > this.currentBalance) {
      this.showAlert("Insufficient funds for this withdrawal", "danger");
      return;
    }

    // Create transaction object
    const transaction = {
      id: this.generateUniqueId(),
      type: type,
      amount: amount,
      timestamp: new Date().toISOString(),
      displayDate: new Date().toLocaleString(),
    };

    // Add to transactions array
    this.transactions.unshift(transaction); // Add to beginning for newest first

    // Update balance
    this.updateBalance(transaction);

    // Save to localStorage
    this.saveToStorage();

    // Re-render UI
    this.render();

    // Reset form
    this.transactionForm.reset();

    // Show success message
    const actionText = type === "deposit" ? "deposited" : "withdrawn";
    this.showAlert(
      `Successfully ${actionText} $${amount.toFixed(2)}`,
      "success"
    );

    console.log("Transaction added:", transaction);
  }

  /**
   * Delete a transaction by ID
   * This method removes a transaction and recalculates the balance
   */
  deleteTransaction(transactionId) {
    // Find transaction
    const transactionIndex = this.transactions.findIndex(
      (t) => t.id === transactionId
    );

    if (transactionIndex === -1) {
      this.showAlert("Transaction not found", "danger");
      return;
    }

    const transaction = this.transactions[transactionIndex];

    // Confirm deletion
    if (
      !confirm(
        `Are you sure you want to delete this ${
          transaction.type
        } of $${transaction.amount.toFixed(2)}?`
      )
    ) {
      return;
    }

    // Remove transaction
    this.transactions.splice(transactionIndex, 1);

    // Recalculate balance from scratch
    this.recalculateBalance();

    // Save to localStorage
    this.saveToStorage();

    // Re-render UI
    this.render();

    // Show success message
    this.showAlert("Transaction deleted successfully", "info");

    console.log("Transaction deleted:", transaction);
  }

  /**
   * Update balance based on transaction
   * This method handles the balance calculation logic
   */
  updateBalance(transaction) {
    if (transaction.type === "deposit") {
      this.currentBalance += transaction.amount;
    } else if (transaction.type === "withdrawal") {
      this.currentBalance -= transaction.amount;
    }
  }

  /**
   * Recalculate balance from all transactions
   * This method is used when transactions are deleted
   */
  recalculateBalance() {
    this.currentBalance = 0;

    this.transactions.forEach((transaction) => {
      this.updateBalance(transaction);
    });
  }

  /**
   * Generate a unique ID for transactions
   * This method creates a simple unique identifier
   */
  generateUniqueId() {
    return "txn_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Load customer data from RandomUser API
   * This method demonstrates async/await and fetch API usage
   */
  async loadCustomerData() {
    try {
      // Show loading state
      this.setLoadingState(true);

      // Fetch data from API
      const response = await fetch("https://randomuser.me/api/");

      console.log(response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const user = data.results[0];

      // Create customer object
      this.customer = {
        name: `${user.name.first} ${user.name.last}`,
        email: user.email,
        photo: user.picture.large,
        phone: user.phone,
        location: `${user.location.city}, ${user.location.country}`,
      };

      // Update UI
      this.updateCustomerDisplay();

      // Save customer data
      this.saveToStorage();

      // Show success message
      this.showAlert(`Welcome, ${this.customer.name}!`, "success");

      console.log("Customer loaded:", this.customer);
    } catch (error) {
      console.error("Error loading customer data:", error);
      this.showAlert(
        "Failed to load customer data. Please try again.",
        "danger"
      );
    } finally {
      // Hide loading state
      this.setLoadingState(false);
    }
  }

  /**
   * Update customer display in UI
   * This method updates the customer information section
   */
  updateCustomerDisplay() {
    if (!this.customer) return;

    this.customerName.textContent = this.customer.name;
    this.customerEmail.textContent = this.customer.email;
    this.customerPhoto.src = this.customer.photo;
    this.customerPhoto.alt = this.customer.name;

    // Add fade-in animation
    this.customerName.parentElement.parentElement.classList.add("fade-in");
  }

  /**
   * Set loading state for customer button
   * This method manages the loading UI state
   */
  setLoadingState(isLoading) {
    if (isLoading) {
      this.loadCustomerBtn.disabled = true;
      this.loadingSpinner.style.display = "inline-block";
      this.loadCustomerBtn.innerHTML = this.loadCustomerBtn.innerHTML.replace(
        "Load Customer",
        "Loading..."
      );
    } else {
      this.loadCustomerBtn.disabled = false;
      this.loadingSpinner.style.display = "none";
      this.loadCustomerBtn.innerHTML = `
                  <i class="bi bi-person-plus me-2"></i>
                  Load Customer
              `;
    }
  }

  /**
   * Render all UI components
   * This method updates the entire user interface
   */
  render() {
    this.renderBalance();
    this.renderTransactions();
  }

  /**
   * Render the current balance
   * This method updates the balance display
   */
  renderBalance() {
    const formattedBalance = this.formatCurrency(this.currentBalance);
    this.currentBalanceElement.textContent = formattedBalance;

    // Add color coding based on balance
    this.currentBalanceElement.className = "balance-amount";
    if (this.currentBalance < 0) {
      this.currentBalanceElement.classList.add("text-danger");
    } else if (this.currentBalance > 0) {
      this.currentBalanceElement.classList.add("text-success");
    }
  }

  /**
   * Render the transactions table
   * This method creates and displays the transaction history
   */
  renderTransactions() {
    // Clear container
    this.transactionsContainer.innerHTML = "";

    // Check if there are transactions
    if (this.transactions.length === 0) {
      this.transactionsContainer.innerHTML = `
                  <div class="empty-state">
                      <i class="bi bi-receipt"></i>
                      <h6>No transactions yet</h6>
                      <p>Add your first transaction to get started</p>
                  </div>
              `;
      return;
    }

    // Create table
    const table = document.createElement("table");
    table.className = "table table-hover";

    // Create table header
    table.innerHTML = `
              <thead>
                  <tr>
                      <th>Date & Time</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Action</th>
                  </tr>
              </thead>
              <tbody id="transactionTableBody">
              </tbody>
          `;

    // Add table to container
    this.transactionsContainer.appendChild(table);

    // Get table body
    const tbody = document.getElementById("transactionTableBody");

    // Add each transaction
    this.transactions.forEach((transaction) => {
      const row = this.createTransactionRow(transaction);
      tbody.appendChild(row);
    });
  }

  /**
   * Create a table row for a transaction
   * This method generates HTML for individual transactions
   */
  createTransactionRow(transaction) {
    const row = document.createElement("tr");

    // Add CSS class based on transaction type
    row.className = `transaction-${transaction.type}`;

    // Format amount with appropriate sign and color
    const amountText =
      transaction.type === "deposit"
        ? `+${this.formatCurrency(transaction.amount)}`
        : `-${this.formatCurrency(transaction.amount)}`;

    const amountClass =
      transaction.type === "deposit" ? "amount-positive" : "amount-negative";

    // Create row HTML
    row.innerHTML = `
              <td>
                  <small class="text-muted">${transaction.displayDate}</small>
              </td>
              <td>
                  <span class="badge ${
                    transaction.type === "deposit" ? "bg-success" : "bg-danger"
                  }">
                      ${
                        transaction.type === "deposit"
                          ? "💰 Deposit"
                          : "💸 Withdrawal"
                      }
                  </span>
              </td>
              <td>
                  <span class="${amountClass}">${amountText}</span>
              </td>
              <td>
                  <button class="btn btn-danger btn-sm" onclick="transactionManager.deleteTransaction('${
                    transaction.id
                  }')">
                      <i class="bi bi-trash"></i>
                      Delete
                  </button>
              </td>
          `;

    return row;
  }

  /**
   * Format number as currency
   * This method provides consistent currency formatting
   */
  formatCurrency(amount) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(Math.abs(amount));
  }

  /**
   * Validate amount input
   * This method provides real-time input validation
   */
  validateAmountInput(input) {
    const value = parseFloat(input.value);

    if (value < 0) {
      input.value = "";
      this.showAlert("Amount cannot be negative", "warning");
    }

    if (value > 1000000) {
      input.value = "1000000";
      this.showAlert("Maximum amount is $1,000,000", "warning");
    }
  }

  /**
   * Show alert message
   * This method displays user feedback messages
   */
  showAlert(message, type = "info") {
    // Create alert element
    const alert = document.createElement("div");
    alert.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alert.style.cssText =
      "top: 20px; right: 20px; z-index: 9999; min-width: 300px;";

    alert.innerHTML = `
              ${message}
              <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
          `;

    // Add to page
    document.body.appendChild(alert);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (alert.parentNode) {
        alert.remove();
      }
    }, 5000);
  }

  /**
   * Save data to localStorage
   * This method persists application state
   */
  saveToStorage() {
    try {
      const data = {
        transactions: this.transactions,
        currentBalance: this.currentBalance,
        customer: this.customer,
        lastUpdated: new Date().toISOString(),
      };

      localStorage.setItem("bankingTransactionData", JSON.stringify(data));
      console.log("Data saved to localStorage");
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      this.showAlert("Failed to save data locally", "warning");
    }
  }

  /**
   * Load data from localStorage
   * This method restores application state
   */
  loadFromStorage() {
    try {
      const savedData = localStorage.getItem("bankingTransactionData");

      if (savedData) {
        const data = JSON.parse(savedData);

        this.transactions = data.transactions || [];
        this.currentBalance = data.currentBalance || 0;
        this.customer = data.customer || null;

        // Update customer display if customer data exists
        if (this.customer) {
          this.updateCustomerDisplay();
        }

        console.log("Data loaded from localStorage");
      }
    } catch (error) {
      console.error("Error loading from localStorage:", error);
      this.showAlert("Failed to load saved data", "warning");
    }
  }

  /**
   * Clear all data
   * This method resets the application state
   */
  clearAllData() {
    if (
      confirm(
        "Are you sure you want to clear all transaction data? This cannot be undone."
      )
    ) {
      this.transactions = [];
      this.currentBalance = 0;
      this.customer = null;

      localStorage.removeItem("bankingTransactionData");

      this.render();
      this.updateCustomerDisplay();

      this.showAlert("All data cleared successfully", "info");
    }
  }

  /**
   * Get transaction statistics
   * This method provides summary information
   */
  getStatistics() {
    const deposits = this.transactions.filter((t) => t.type === "deposit");
    const withdrawals = this.transactions.filter(
      (t) => t.type === "withdrawal"
    );

    const totalDeposits = deposits.reduce((sum, t) => sum + t.amount, 0);
    const totalWithdrawals = withdrawals.reduce((sum, t) => sum + t.amount, 0);

    return {
      totalTransactions: this.transactions.length,
      totalDeposits: totalDeposits,
      totalWithdrawals: totalWithdrawals,
      depositCount: deposits.length,
      withdrawalCount: withdrawals.length,
      currentBalance: this.currentBalance,
    };
  }
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Create global instance
  window.transactionManager = new TransactionManager();

  console.log("Banking Transaction Tracker loaded successfully");

  // Optional: Add keyboard shortcuts
  document.addEventListener("keydown", function (e) {
    // Ctrl/Cmd + Enter to submit form
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      const form = document.getElementById("transactionForm");
      if (form) {
        form.dispatchEvent(new Event("submit"));
      }
    }
  });
});

// Export for potential module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = TransactionManager;
}
