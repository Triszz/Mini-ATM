const jwt = require("jsonwebtoken");
const Account = require("../models/account.model");
const requireAuth = async (req, res, next) => {
  // verify authentication
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }
  const token = authorization.split(" ")[1];
  try {
    const { accountNumber } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Account.findOne({ accountNumber }).select("accountNumber");
    if (!req.user) {
      return res.status(401).json({ error: "Account not found" });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Request is not authorized" });
  }
};

module.exports = requireAuth;
