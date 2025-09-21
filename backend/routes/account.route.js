const express = require("express");
const router = express.Router();
const {
  getAccount,
  signupAccount,
  loginAccount,
  getBalance,
  withdraw,
  deposit,
  getTransactionHistory,
  transfer,
} = require("../controllers/account.controller");

router.post("/signup", signupAccount);
router.post("/login", loginAccount);

router.get("/:accountNumber", getAccount);
router.get("/:accountNumber/balance", getBalance);

router.post("/:accountNumber/withdraw", withdraw);
router.post("/:senderAccountNumber/transfer", transfer);
router.post("/:accountNumber/deposit", deposit);

router.get("/:accountNumber/history", getTransactionHistory);

module.exports = router;
