const express = require("express");
const router = express.Router();
const {
  getAccount,
  getAccountByNumber,
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

router.get("/", getAccount);
router.post("/prev-transfer", getAccountByNumber);
router.post("/withdraw", withdraw);
router.post("/transfer", transfer);
router.post("/deposit", deposit);
router.get("/history", getTransactionHistory);
router.put("/balance-state", changeBalanceState);

module.exports = router;
