import { useState, useEffect, useCallback } from "react";
import { AccountAPI } from "../services/api";
function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    const fetchTransactionHistory = async () => {
      const response = await AccountAPI.getTransactionHistory("269997912");
      setTransactions(response.data.transactions);
    };
    fetchTransactionHistory();
  }, []);
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
  return (
    <div className="transaction-history">
      <h1>Transaction History</h1>
      <ul className="transaction-list">
        {transactions.map((transaction) => (
          <li key={transaction._id} className="transaction-item">
            <span>Sender: {transaction.sender}</span>
            <span>Receiver: {transaction.receiver}</span>
            <span>Type: {transaction.type}</span>
            <span>Amount: {transaction.amount}</span>
            <span>Status: {transaction.status}</span>
            <span>Content: {transaction.content}</span>
            <span>Balance before: {transaction.balanceBefore}</span>
            <span>Balance after: {transaction.balanceAfter}</span>
            <span>Date: {formatTimestamp(transaction.createdAt)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default TransactionHistory;
