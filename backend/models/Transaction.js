const mongoose = require("mongoose");

// Every transaction is one day's entry for one customer.
// "Out" = given TO the customer (increases pending)
// "In"  = received FROM the customer (decreases pending)

const transactionSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true, // speeds up queries like "get all transactions for customer X"
    },

    date: {
      type: Date,
      required: [true, "Transaction date is required"],
    },

    // Gold
    goldOut: { type: Number, default: 0, min: 0 }, // given to customer (grams)
    goldIn:  { type: Number, default: 0, min: 0 }, // received from customer (grams)

    // Silver
    silverOut: { type: Number, default: 0, min: 0 },
    silverIn:  { type: Number, default: 0, min: 0 },

    // Cash advance
    cashOut: { type: Number, default: 0, min: 0 }, // advance given (₹)
    cashIn:  { type: Number, default: 0, min: 0 }, // advance received back (₹)

    // Metal deposited (customer leaves metal at the shop)
    metalDepositGold:   { type: Number, default: 0, min: 0 },
    metalDepositSilver: { type: Number, default: 0, min: 0 },

    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);
