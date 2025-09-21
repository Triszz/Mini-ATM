const mongoose = require("mongoose");

const TransactionSchema = mongoose.Schema(
  {
    sender: {
      type: String,
      required: true,
      ref: "Account",
    },
    receiver: {
      type: String,
      required: true,
      ref: "Account",
    },
    type: {
      type: String,
      required: true,
      enum: ["withdrawal", "deposit", "transfer"],
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "completed",
    },
    content: {
      type: String,
      default: "",
    },
    balanceBefore: {
      type: Number,
      required: true,
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// statics methods
TransactionSchema.statics.getTransactionHistory = async function (
  accountNumber,
  limit,
  page,
  type
) {
  const skip = (page - 1) * limit;

  const query = {
    $or: [{ sender: accountNumber }, { receiver: accountNumber }],
  };

  if (type) query.type = type;

  const transactions = await this.find(query)
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip(skip);

  const total = await this.countDocuments(query);

  return { transactions, total, pages: Math.ceil(total / limit) };
};

const Transaction = mongoose.model("Transaction", TransactionSchema);
module.exports = Transaction;
