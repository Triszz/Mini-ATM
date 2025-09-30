const Account = require("../models/account.model");
const Transaction = require("../models/transaction.model");
const jwt = require("jsonwebtoken");

// create token
const createToken = (accountNumber) => {
  return jwt.sign({ accountNumber }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
};

// get current account
const getAccount = async (req, res) => {
  try {
    const accountNumber = req.user.accountNumber;
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

// get account by account number
const getAccountByNumber = async (req, res) => {
  try {
    const { receiverAccountNumber } = req.body;
    const account = await Account.findOne({
      accountNumber: receiverAccountNumber,
    });
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

    res.status(200).json({ accountNumber: account.accountNumber, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// withdraw
const withdraw = async (req, res) => {
  try {
    const accountNumber = req.user.accountNumber;
    const { amount, pin } = req.body;
    if ((!amount || !pin) && amount !== 0) {
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
      senderName: account.username,
      receiverName: account.username,
      type: "withdrawal",
      amount: amount,
      content: `ATM withdrawal of $${amount}`,
      senderBalanceBefore: balanceBefore,
      senderBalanceAfter: balanceAfter,
      receiverBalanceBefore: balanceBefore,
      receiverBalanceAfter: balanceAfter,
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
    const senderAccountNumber = req.user.accountNumber;
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

    const senderAccount = await Account.findOne({
      accountNumber: senderAccountNumber,
    });

    const receiverAccount = await Account.findOne({
      accountNumber: receiverAccountNumber,
    });

    if (!senderAccount) {
      return res.status(404).json({
        message: "Sender account not found!",
      });
    }

    if (!receiverAccount) {
      return res.status(404).json({
        message: "Receiver account not found!",
      });
    }
    const { content } = req.body;
    const senderBalanceBefore = senderAccount.getBalance();
    const receiverBalanceBefore = receiverAccount.getBalance();
    const { senderBalance, receiverBalance } = await senderAccount.transfer(
      receiverAccountNumber,
      amount,
      pin
    );

    const senderBalanceAfter = senderBalance;
    const receiverBalanceAfter = receiverBalance;

    const transaction = await Transaction.create({
      sender: senderAccountNumber,
      receiver: receiverAccountNumber,
      senderName: senderAccount.username,
      receiverName: receiverAccount.username,
      type: "transfer",
      amount: amount,
      content: content,
      senderBalanceBefore: senderBalanceBefore,
      senderBalanceAfter: senderBalanceAfter,
      receiverBalanceBefore: receiverBalanceBefore,
      receiverBalanceAfter: receiverBalanceAfter,
    });
    res.status(200).json({
      success: true,
      message: "Transfer successful",
      data: {
        transactionId: transaction._id,
        transactionType: "transfer",
        content: content,
        amount: parseFloat(amount),
        newBalance: senderBalanceAfter,
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
    const accountNumber = req.user.accountNumber;
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
      senderName: account.username,
      receiverName: account.username,
      type: "deposit",
      amount: amount,
      content: `ATM deposit of $${amount}`,
      senderBalanceBefore: balanceBefore,
      senderBalanceAfter: balanceAfter,
      receiverBalanceBefore: balanceBefore,
      receiverBalanceAfter: balanceAfter,
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
    const accountNumber = req.user.accountNumber;
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
    const accountNumber = req.user.accountNumber;
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
  getAccountByNumber,
  signupAccount,
  loginAccount,
  withdraw,
  deposit,
  getTransactionHistory,
  transfer,
  changeBalanceState,
};
