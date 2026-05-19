const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer");
const Transaction = require("../models/Transaction");
const protect = require("../middleware/auth");

// All customer routes require login
router.use(protect);

// Helper: calculate current balances for a customer from their transaction history
const calculateBalances = (opening, transactions) => {
  let goldPending   = opening.goldPending;
  let silverPending = opening.silverPending;
  let cashAdvance   = opening.cashAdvance;
  let metalGold     = opening.metalGold;
  let metalSilver   = opening.metalSilver;

  transactions.forEach((tx) => {
    goldPending   += tx.goldOut   - tx.goldIn;
    silverPending += tx.silverOut - tx.silverIn;
    cashAdvance   += tx.cashOut   - tx.cashIn;
    metalGold     += tx.metalDepositGold;
    metalSilver   += tx.metalDepositSilver;
  });

  return {
    goldPending:   Math.round(goldPending   * 1000) / 1000,
    silverPending: Math.round(silverPending * 1000) / 1000,
    cashAdvance:   Math.round(cashAdvance   * 100)  / 100,
    metalGold:     Math.round(metalGold     * 1000) / 1000,
    metalSilver:   Math.round(metalSilver   * 1000) / 1000,
  };
};


// ─── GET /api/customers ───────────────────────────────────────────────────────
// Returns all customers with their current calculated balances
router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });

    // For each customer, fetch their transactions and calculate balances
    const customersWithBalances = await Promise.all(
      customers.map(async (customer) => {
        const transactions = await Transaction.find({ customer: customer._id });
        const balances = calculateBalances(customer.opening, transactions);

        return {
          _id:       customer._id,
          name:      customer.name,
          phone:     customer.phone,
          notes:     customer.notes,
          opening:   customer.opening,
          balances,  // current calculated balances
          createdAt: customer.createdAt,
        };
      })
    );

    res.json(customersWithBalances);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// ─── GET /api/customers/:id ───────────────────────────────────────────────────
// Returns one customer with their full transaction history and current balances
router.get("/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found." });
    }

    const transactions = await Transaction.find({ customer: customer._id })
      .sort({ date: -1 }); // newest first

    const balances = calculateBalances(customer.opening, transactions);

    res.json({
      _id:          customer._id,
      name:         customer.name,
      phone:        customer.phone,
      notes:        customer.notes,
      opening:      customer.opening,
      balances,
      transactions,
      createdAt:    customer.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// ─── POST /api/customers ──────────────────────────────────────────────────────
// Create a new customer
// Body: { name, phone, notes, opening: { goldPending, silverPending, cashAdvance, metalGold, metalSilver } }
router.post("/", async (req, res) => {
  try {
    const { name, phone, notes, opening } = req.body;

    // Check if phone number already exists
    const existing = await Customer.findOne({ phone });
    if (existing) {
      return res.status(400).json({ message: "A customer with this phone number already exists." });
    }

    const customer = await Customer.create({
      name,
      phone,
      notes: notes || "",
      opening: {
        goldPending:   opening?.goldPending   || 0,
        silverPending: opening?.silverPending || 0,
        cashAdvance:   opening?.cashAdvance   || 0,
        metalGold:     opening?.metalGold     || 0,
        metalSilver:   opening?.metalSilver   || 0,
      },
    });

    res.status(201).json(customer);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// ─── PUT /api/customers/:id ───────────────────────────────────────────────────
// Update customer name, phone, or notes (not balances — those come from transactions)
router.put("/:id", async (req, res) => {
  try {
    const { name, phone, notes } = req.body;

    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { name, phone, notes },
      { new: true, runValidators: true }
    );

    if (!customer) {
      return res.status(404).json({ message: "Customer not found." });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// ─── DELETE /api/customers/:id ────────────────────────────────────────────────
// Delete a customer and ALL their transactions
router.delete("/:id", async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found." });
    }

    // Also delete all their transactions
    await Transaction.deleteMany({ customer: req.params.id });

    res.json({ message: "Customer and all their transactions deleted." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


module.exports = router;
