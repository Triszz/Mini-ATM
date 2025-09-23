const Account = require("../models/account.model");
const Transaction = require("../models/transaction.model");
const jwt = require("jsonwebtoken");

// create token
const createToken = (accountNumber) => {
  return jwt.sign({ accountNumber }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
};

// get account
const getAccount = async (req, res) => {
  try {
    const { accountNumber } = req.params;
    const account = await Account.findOne({ accountNumber });
    if (!account) {
      return res.status(404).json({ message: "Account is not found!" });
    }
    const { password, pin, ...safeAccount } = account.toObject();
    res.status(200).json(safeAccount);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// signup
const signupAccount = async (req, res) => {
  try {
    const account = await Account.signup(req.body);
    const { password, pin, ...safeAccount } = account.toObject();
    res.status(201).json({ safeAccount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// login
const loginAccount = async (req, res) => {
  try {
    const { email, password } = req.body;
    const account = await Account.login(email, password);
    // create token
    const token = createToken(account.accountNumber);
    res.status(200).json({ email, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// withdraw
const withdraw = async (req, res) => {
  try {
    const { accountNumber } = req.params;
    const { amount, pin } = req.body;
    if (!amount || !pin) {
      return res.status(400).json({ message: "Amount and PIN are required" });
    }
    if (amount <= 0) {
      return res.status(400).json({
        message: "Amount must be greater than 0",
      });
    }
    const account = await Account.findOne({ accountNumber });
    if (!account) {
      return res.status(404).json({ message: "Account is not found!" });
    }
    const balanceBefore = account.getBalance();
    const balanceAfter = await account.withdraw(amount, pin);
    await account.save();
    const transaction = await Transaction.create({
      sender: accountNumber,
      receiver: accountNumber,
      type: "withdrawal",
      amount: amount,
      content: `ATM withdrawal of $${amount}`,
      balanceBefore: balanceBefore,
      balanceAfter: balanceAfter,
    });
    res.status(200).json({
      success: true,
      message: "Withdrawal successful",
      data: {
        transactionId: transaction._id,
        transactionType: "withdrawal",
        amount: parseFloat(amount),
        newBalance: balanceAfter,
        transactionTime: transaction.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// transfer
const transfer = async (req, res) => {
  try {
    const { senderAccountNumber } = req.params;
    const { receiverAccountNumber, amount, pin } = req.body;
    if (!receiverAccountNumber) {
      return res.status(400).json({
        message: "Receiver account number is required",
      });
    }
    if (senderAccountNumber === receiverAccountNumber) {
      return res.status(400).json({
        message: "Cannot transfer to your own account",
      });
    }

    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }
    if (!pin) {
      return res.status(400).json({ message: "PIN is required" });
    }
    if (amount <= 0) {
      return res.status(400).json({
        message: "Amount must be greater than 0",
      });
    }

    const account = await Account.findOne({
      accountNumber: senderAccountNumber,
    });

    if (!account) {
      return res.status(404).json({
        message: "Account is not found!",
      });
    }
    const { content = `${account.username} transfers` } = req.body;
    const balanceBefore = account.getBalance();
    const balanceAfter = await account.transfer(
      receiverAccountNumber,
      amount,
      pin
    );
    await account.save();
    const transaction = await Transaction.create({
      sender: senderAccountNumber,
      receiver: receiverAccountNumber,
      type: "transfer",
      amount: amount,
      content: content,
      balanceBefore: balanceBefore,
      balanceAfter: balanceAfter,
    });
    res.status(200).json({
      success: true,
      message: "Transfer successful",
      data: {
        transactionId: transaction._id,
        transactionType: "transfer",
        content: content,
        amount: parseFloat(amount),
        newBalance: balanceAfter,
        transactionTime: transaction.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// deposit
const deposit = async (req, res) => {
  try {
    const { accountNumber } = req.params;
    const { amount, pin } = req.body;
    if (!amount || !pin) {
      return res.status(400).json({ message: "Amount and PIN are required" });
    }
    if (amount <= 0) {
      return res.status(400).json({
        message: "Amount must be greater than 0",
      });
    }
    const account = await Account.findOne({ accountNumber });
    if (!account) {
      return res.status(404).json({ message: "Account is not found!" });
    }
    const balanceBefore = account.getBalance();
    const balanceAfter = await account.deposit(amount, pin);
    await account.save();
    const transaction = await Transaction.create({
      sender: accountNumber,
      receiver: accountNumber,
      type: "deposit",
      amount: amount,
      content: `ATM deposit of $${amount}`,
      balanceBefore: balanceBefore,
      balanceAfter: balanceAfter,
    });
    res.status(200).json({
      success: true,
      message: "Deposit successful",
      data: {
        transactionId: transaction._id,
        transactionType: "deposit",
        amount: parseFloat(amount),
        newBalance: balanceAfter,
        transactionTime: transaction.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get transaction history
const getTransactionHistory = async (req, res) => {
  try {
    const { accountNumber } = req.params;
    const { limit = 10, page = 1, type } = req.query;
    const history = await Transaction.getTransactionHistory(
      accountNumber,
      parseInt(limit),
      parseInt(page),
      type
    );
    res.status(200).json({
      success: true,
      transactions: history.transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: history.total,
        pages: history.pages,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const changeBalanceState = async (req, res) => {
  try {
    const { accountNumber } = req.params;
    const { isBalanceHide } = req.body;
    const account = await Account.findOneAndUpdate(
      { accountNumber },
      { isBalanceHide },
      { new: true }
    );
    if (!account) {
      return res.status(404).json({
        message: "Account is not found!",
      });
    }
    const { password, pin, ...safeAccount } = account.toObject();
    res.status(200).json({
      success: true,
      message: "Balance visibility updated",
      data: safeAccount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  getAccount,
  signupAccount,
  loginAccount,
  withdraw,
  deposit,
  getTransactionHistory,
  transfer,
  changeBalanceState,
};
