// Version 1: OOP Structure and DOM Setup

class TransactionManager {
  constructor() {
    // Initialize empty data
    this.transactions = [];

    // Connect to DOM
    this.transactionForm = document.getElementById("transactionForm");
    this.transactionType = document.getElementById("transactionType");
    this.transactionAmount = document.getElementById("transactionAmount");
    this.transactionsContainer = document.getElementById(
      "transactionsContainer"
    );

    // Set up form listener
    this.transactionForm.addEventListener("submit", (e) => {
      e.preventDefault();
      console.log("Form submitted!");
    });

    console.log("TransactionManager initialized.");
  }
}

// Start the app
document.addEventListener("DOMContentLoaded", () => {
  window.transactionManager = new TransactionManager();
});
