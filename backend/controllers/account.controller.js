const Account = require("../models/account.model");
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
    const { email } = req.body;
    const account = await Account.signup(req.body);
    // create token
    const token = createToken(account.accountNumber);

    res.status(201).json({ email, token });
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

// get balance
const getBalance = async (req, res) => {
  try {
    const { accountNumber } = req.params;
    const account = await Account.findOne({ accountNumber });
    if (!account) {
      return res.status(404).json({ message: "Account is not found!" });
    }
    const balance = await account.getBalance();
    res.status(200).json(balance);
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
    const balance = await account.withdraw(amount, pin);
    await account.save();
    res.status(200).json({
      success: true,
      message: "Withdrawal successful",
      data: {
        transactionType: "withdrawal",
        amount: parseFloat(amount),
        newBalance: balance,
        transactionTime: new Date(),
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
    const account = await Account.findOne({ accountNumber });
    if (!account) {
      return res.status(404).json({ message: "Account is not found!" });
    }
    const balance = await account.deposit(amount, pin);
    await account.save();
    res.status(200).json({
      success: true,
      message: "Deposit successful",
      data: {
        transactionType: "deposit",
        amount: parseFloat(amount),
        newBalance: balance,
        transactionTime: new Date(),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  getAccount,
  signupAccount,
  loginAccount,
  getBalance,
  withdraw,
  deposit,
};
