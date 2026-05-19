const mongoose = require("mongoose");

// Opening balances are set when a customer is created.
// Current balances are always CALCULATED from transaction history,
// never stored directly — this keeps data accurate and auditable.

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
      match: [/^\d{10}$/, "Phone must be a 10-digit number"],
    },

    // Opening balances — entered once when creating the customer
    // These represent balances that existed before using this app
    opening: {
      goldPending:   { type: Number, default: 0 },
      silverPending: { type: Number, default: 0 },
      cashAdvance:   { type: Number, default: 0 },
      metalGold:     { type: Number, default: 0 },
      metalSilver:   { type: Number, default: 0 },
    },

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model("Customer", customerSchema);
