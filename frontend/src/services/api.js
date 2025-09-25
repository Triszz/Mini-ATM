import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const getAuthHeaders = () => {
  try {
    const userString = localStorage.getItem("user");
    if (!userString) return {};

    const user = JSON.parse(userString);
    return user.token ? { Authorization: `Bearer ${user.token}` } : {};
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    return {};
  }
};

export const AccountAPI = {
  // login
  login: (email, password) => api.post("/login", { email, password }),

  // signup
  signup: (data) => api.post("/signup", data),

  // get account
  getAccount: (accountNumber) =>
    api.get(`${accountNumber}`, {
      headers: getAuthHeaders(),
    }),

  // withdraw
  withdraw: (accountNumber, amount, pin) =>
    api.post(
      `/${accountNumber}/withdraw`,
      { amount, pin },
      {
        headers: getAuthHeaders(),
      }
    ),

  // transfer
  transfer: (accountNumber, receiverAccountNumber, amount, pin) =>
    api.post(
      `/${accountNumber}/transfer`,
      {
        receiverAccountNumber,
        amount,
        pin,
      },
      {
        headers: getAuthHeaders(),
      }
    ),

  // deposit
  deposit: (accountNumber, amount, pin) =>
    api.post(
      `/${accountNumber}/deposit`,
      { amount, pin },
      {
        headers: getAuthHeaders(),
      }
    ),

  // get transaction history
  getTransactionHistory: (accountNumber, limit, page, type) =>
    api.get(`${accountNumber}/history`, {
      params: { limit, page, type },
      headers: getAuthHeaders(),
    }),

  // change balance state
  changeBalanceState: (accountNumber, isBalanceHide) =>
    api.put(
      `${accountNumber}/balance-state`,
      { isBalanceHide },
      {
        headers: getAuthHeaders(),
      }
    ),
};

export default api;
