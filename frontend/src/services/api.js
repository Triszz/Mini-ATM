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
  getAccount: () =>
    api.get(`/`, {
      headers: getAuthHeaders(),
    }),

  // withdraw
  withdraw: (amount, pin) =>
    api.post(
      `/withdraw`,
      { amount, pin },
      {
        headers: getAuthHeaders(),
      }
    ),

  // transfer
  transfer: (receiverAccountNumber, amount, content, pin) =>
    api.post(
      `/transfer`,
      {
        receiverAccountNumber,
        amount,
        content,
        pin,
      },
      {
        headers: getAuthHeaders(),
      }
    ),

  // deposit
  deposit: (amount, pin) =>
    api.post(
      `/deposit`,
      { amount, pin },
      {
        headers: getAuthHeaders(),
      }
    ),

  // get transaction history
  getTransactionHistory: (limit, page, type) =>
    api.get(`/history`, {
      params: { limit, page, type },
      headers: getAuthHeaders(),
    }),

  // change balance state
  changeBalanceState: (isBalanceHide) =>
    api.put(
      `/balance-state`,
      { isBalanceHide },
      {
        headers: getAuthHeaders(),
      }
    ),
};

export default api;
