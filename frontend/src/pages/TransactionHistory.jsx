import { useState, useEffect, useCallback } from "react";
import { AccountAPI } from "../services/api";
import { useAuthContext } from "../hooks/useAuthContext";
function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { user, isInitialized } = useAuthContext();
  console.log("🔍 Full user object:", user);
  console.log("🔍 User keys:", Object.keys(user || {}));
  useEffect(() => {
    const fetchTransactionHistory = async () => {
      try {
        setIsLoading(true);
        const response = await AccountAPI.getTransactionHistory();
        setTransactions(response.data.transactions);
      } catch (error) {
        const errorMessage =
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message;
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    if (!isInitialized) {
      return;
    }
    if (user) {
      fetchTransactionHistory();
    } else {
      setError("Please login to continue");
      setIsLoading(false);
    }
  }, [user, isInitialized]);

  const formatTimestamp = useCallback((mongoTimestamp) => {
    const date = new Date(mongoTimestamp);
    const dateString = date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const timeString = date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    return `${dateString} ${timeString}`;
  }, []);
  if (error) {
    return <div className="error">Error: {error}</div>;
  }
  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }
  if (transactions.length === 0) {
    return (
      <div className="empty">
        You don't have any transactions yet. Make your first transaction!
      </div>
    );
  }

  return (
    <div className="transaction-history">
      <h1>Transaction History</h1>
      <ul className="transaction-list">
        {transactions.map((transaction) => (
          <li
            key={transaction._id}
            className={`transaction-item ${
              (transaction.type === "transfer" &&
                transaction.sender === user.accountNumber) ||
              transaction.type === "withdrawal"
                ? "send"
                : "receive"
            }`}
          >
            <span>Sender: {transaction.senderName}</span>
            <span>Receiver: {transaction.receiverName}</span>
            <span>Content: {transaction.content}</span>
            <span>Type: {transaction.type}</span>
            <span>
              Amount:{" "}
              {(transaction.type === "transfer" &&
                transaction.sender === user.accountNumber) ||
              transaction.type === "withdrawal"
                ? "-"
                : "+"}
              {transaction.amount}
            </span>
            <span>Status: {transaction.status}</span>
            <span>
              Balance before: $
              {transaction.sender === user.accountNumber
                ? transaction.senderBalanceBefore
                : transaction.receiverBalanceBefore}
            </span>
            <span>
              Balance after: $
              {transaction.sender === user.accountNumber
                ? transaction.senderBalanceAfter
                : transaction.receiverBalanceAfter}
            </span>
            <span>Date: {formatTimestamp(transaction.createdAt)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default TransactionHistory;
