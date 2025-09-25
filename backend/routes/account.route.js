const express = require("express");
const router = express.Router();
const {
  getAccount,
  signupAccount,
  loginAccount,
  withdraw,
  deposit,
  getTransactionHistory,
  transfer,
  changeBalanceState,
} = require("../controllers/account.controller");
const requireAuth = require("../middleware/requireAuth");

router.post("/signup", signupAccount);
router.post("/login", loginAccount);

router.use(requireAuth);

router.get("/:accountNumber", getAccount);
router.post("/:accountNumber/withdraw", withdraw);
router.post("/:senderAccountNumber/transfer", transfer);
router.post("/:accountNumber/deposit", deposit);
router.get("/:accountNumber/history", getTransactionHistory);
router.put("/:accountNumber/balance-state", changeBalanceState);

module.exports = router;
