const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const Customer = require("../models/Customer");
const protect = require("../middleware/auth");

// All transaction routes require login
router.use(protect);


// ─── GET /api/transactions/:customerId ───────────────────────────────────────
// Get all transactions for a specific customer (newest first)
router.get("/:customerId", async (req, res) => {
  try {
    // Make sure the customer actually exists
    const customer = await Customer.findById(req.params.customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found." });
    }

    const transactions = await Transaction.find({ customer: req.params.customerId })
      .sort({ date: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// ─── POST /api/transactions/:customerId ──────────────────────────────────────
// Add a new transaction for a customer
// Body: { date, goldOut, goldIn, silverOut, silverIn, cashOut, cashIn, metalDepositGold, metalDepositSilver, notes }
router.post("/:customerId", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found." });
    }

    const {
      date,
      goldOut, goldIn,
      silverOut, silverIn,
      cashOut, cashIn,
      metalDepositGold, metalDepositSilver,
      notes,
    } = req.body;

    if (!date) {
      return res.status(400).json({ message: "Transaction date is required." });
    }

    // Make sure at least one value is non-zero
    const values = [goldOut, goldIn, silverOut, silverIn, cashOut, cashIn, metalDepositGold, metalDepositSilver];
    const hasValue = values.some((v) => parseFloat(v) > 0);
    if (!hasValue) {
      return res.status(400).json({ message: "At least one transaction value must be greater than 0." });
    }

    const transaction = await Transaction.create({
      customer: req.params.customerId,
      date:     new Date(date),
      goldOut:           parseFloat(goldOut)           || 0,
      goldIn:            parseFloat(goldIn)            || 0,
      silverOut:         parseFloat(silverOut)         || 0,
      silverIn:          parseFloat(silverIn)          || 0,
      cashOut:           parseFloat(cashOut)           || 0,
      cashIn:            parseFloat(cashIn)            || 0,
      metalDepositGold:  parseFloat(metalDepositGold)  || 0,
      metalDepositSilver:parseFloat(metalDepositSilver)|| 0,
      notes: notes || "",
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// ─── DELETE /api/transactions/entry/:transactionId ───────────────────────────
// Delete a single transaction entry
router.delete("/entry/:transactionId", async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.transactionId);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found." });
    }

    res.json({ message: "Transaction deleted." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// ─── GET /api/transactions/:customerId/summary ───────────────────────────────
// Get the calculated balance summary for one customer
router.get("/:customerId/summary", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found." });
    }

    const transactions = await Transaction.find({ customer: req.params.customerId });

    let goldPending   = customer.opening.goldPending;
    let silverPending = customer.opening.silverPending;
    let cashAdvance   = customer.opening.cashAdvance;
    let metalGold     = customer.opening.metalGold;
    let metalSilver   = customer.opening.metalSilver;

    transactions.forEach((tx) => {
      goldPending   += tx.goldOut   - tx.goldIn;
      silverPending += tx.silverOut - tx.silverIn;
      cashAdvance   += tx.cashOut   - tx.cashIn;
      metalGold     += tx.metalDepositGold;
      metalSilver   += tx.metalDepositSilver;
    });

    res.json({
      customerId:   customer._id,
      customerName: customer.name,
      balances: {
        goldPending:   Math.round(goldPending   * 1000) / 1000,
        silverPending: Math.round(silverPending * 1000) / 1000,
        cashAdvance:   Math.round(cashAdvance   * 100)  / 100,
        metalGold:     Math.round(metalGold     * 1000) / 1000,
        metalSilver:   Math.round(metalSilver   * 1000) / 1000,
      },
      totalTransactions: transactions.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


module.exports = router;
