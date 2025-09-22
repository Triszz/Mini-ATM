import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const AccountAPI = {
  // login
  login: (email, password) => api.post("/login", { email, password }),

  // signup
  signup: (data) => api.post("/signup", data),

  // get account
  getAccount: (accountNumber) => api.get(`${accountNumber}`),

  // withdraw
  withdraw: (accountNumber, amount, pin) =>
    api.post(`/${accountNumber}/withdraw`, { amount, pin }),

  // transfer
  transfer: (accountNumber, receiverAccountNumber, amount, pin) =>
    api.post(`/${accountNumber}/transfer`, {
      receiverAccountNumber,
      amount,
      pin,
    }),

  // deposit
  deposit: (accountNumber, amount, pin) =>
    api.post(`/${accountNumber}/deposit`, { amount, pin }),

  // get transaction history
  getTransactionHistory: (accountNumber, limit, page, type) =>
    api.get(`${accountNumber}/history`, { params: { limit, page, type } }),

  // change balance state
  changeBalanceState: (accountNumber, isBalanceHide) =>
    api.put(`${accountNumber}/balance-state`, { isBalanceHide }),
};

export default api;
