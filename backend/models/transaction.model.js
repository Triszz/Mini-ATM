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
    senderName: {
      type: String,
      required: true,
    },
    receiverName: {
      type: String,
      required: true,
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
    senderBalanceBefore: {
      type: Number,
      required: true,
    },
    senderBalanceAfter: {
      type: Number,
      required: true,
    },
    receiverBalanceBefore: {
      type: Number,
      required: function () {
        return this.type === "transfer";
      },
    },
    receiverBalanceAfter: {
      type: Number,
      required: function () {
        return this.type === "transfer";
      },
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
