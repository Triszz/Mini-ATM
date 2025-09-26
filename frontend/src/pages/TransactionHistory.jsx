import { useState, useEffect, useCallback } from "react";
import { AccountAPI } from "../services/api";
import { useAuthContext } from "../hooks/useAuthContext";
function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { user, isInitialized } = useAuthContext();
  useEffect(() => {
    const fetchTransactionHistory = async () => {
      try {
        setIsLoading(true);
        const response = await AccountAPI.getTransactionHistory("755053976");
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
  return (
    <div className="transaction-history">
      <h1>Transaction History</h1>
      <ul className="transaction-list">
        {transactions.map((transaction) => (
          <li
            key={transaction._id}
            className={`transaction-item ${
              transaction.receiver === "755053976" &&
              (transaction.type === "deposit" ||
                transaction.type === "transfer")
                ? "receive"
                : "send"
            }`}
          >
            <span>Sender: {transaction.sender}</span>
            <span>Receiver: {transaction.receiver}</span>
            <span>Type: {transaction.type}</span>
            <span>Amount: {transaction.amount}</span>
            <span>Status: {transaction.status}</span>
            <span>Content: {transaction.content}</span>
            <span>Balance before: ${transaction.balanceBefore}</span>
            <span>Balance after: ${transaction.balanceAfter}</span>
            <span>Date: {formatTimestamp(transaction.createdAt)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default TransactionHistory;
