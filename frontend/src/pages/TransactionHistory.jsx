import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { AccountAPI } from "../services/api";
import { useAuthContext } from "../hooks/useAuthContext";

function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);

  const [itemsPerPage] = useState(10);

  const { user, isInitialized } = useAuthContext();
  const navigate = useNavigate();

  const fetchTransactionHistory = useCallback(
    async (page = 1) => {
      try {
        setIsLoading(true);
        const response = await AccountAPI.getTransactionHistory(
          page,
          itemsPerPage
        );

        setTransactions(response.data.transactions);
        setCurrentPage(response.data.currentPage);
        setTotalPages(response.data.totalPages);
        setTotalTransactions(response.data.totalTransactions);
      } catch (error) {
        const errorMessage =
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message;
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [itemsPerPage]
  );

  useEffect(() => {
    if (!isInitialized) {
      return;
    }
    if (user) {
      fetchTransactionHistory(1);
    } else {
      setError("Please login to continue");
      setIsLoading(false);
    }
  }, [user, isInitialized, fetchTransactionHistory]);

  const handlePageChange = async (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
      await fetchTransactionHistory(newPage);
    }
  };

  const getPageNumbers = () => {
    const delta = 2;
    const pages = [];
    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

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

  if (totalTransactions === 0) {
    return (
      <div className="empty">
        You don't have any transactions yet. Make your first transaction!
      </div>
    );
  }

  return (
    <div className="transaction-history">
      <button
        className="back-button"
        onClick={() => navigate("/")}
        disabled={isLoading}
      >
        ← Back to Home
      </button>

      <div className="history-header">
        <h1>Transaction History</h1>
        <div className="transaction-summary">
          <span>Total: {totalTransactions} transactions</span>
          <span>
            Page {currentPage} of {totalPages}
          </span>
        </div>
      </div>

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
              ${transaction.amount}
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

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
          >
            Previous
          </button>

          <div className="page-numbers">
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                className={`page-number ${
                  page === currentPage ? "active" : ""
                } ${page === "..." ? "ellipsis" : ""}`}
                onClick={() =>
                  typeof page === "number" && handlePageChange(page)
                }
                disabled={page === "..." || page === currentPage || isLoading}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            className="pagination-button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default TransactionHistory;
