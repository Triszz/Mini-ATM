import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { AccountAPI } from "../services/api";
import { useAuthContext } from "../hooks/useAuthContext";
function Transfer() {
  const [amount, setAmount] = useState("");
  const [content, setContent] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [receiverAccountNumber, setReceiverAccountNumber] = useState("");
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        if (user) {
          const response = await AccountAPI.getAccount();
          setContent(`${response.data.username} transfer`);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    loadUserData();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      if (!user) {
        setError("Please login to continue");
        return;
      }

      setIsLoading(true);

      const response = await AccountAPI.transfer(
        receiverAccountNumber,
        Number(amount),
        content,
        pin
      );
      const newBalance = await AccountAPI.getAccount();
      console.log(response.data);
      setSuccess(
        `Successfully transfer $${amount}. \nNew balance: $${newBalance.data.balance}`
      );
      setAmount("");
      setPin("");
      setReceiverAccountNumber("");
      const userResponse = await AccountAPI.getAccount();
      setContent(`${userResponse.data.username} transfer`);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message;
      setError(errorMessage);
      console.error("Error withdraw: ", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="transaction-container">
      <div className="transaction-card">
        <button
          className="back-button"
          onClick={() => navigate("/")}
          disabled={isLoading}
        >
          ← Back to Home
        </button>
        <h1>Transfer</h1>
        <form className="transfer-form" onSubmit={handleSubmit}>
          <label>Account number: </label>
          <input
            type="text"
            className="receiver-account-number-input"
            value={receiverAccountNumber}
            onChange={(e) => setReceiverAccountNumber(e.target.value)}
            disabled={isLoading}
            autoFocus
          />
          <label>Amount ($): </label>
          <input
            type="number"
            min="0"
            className="amount-input"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isLoading}
          />
          <label>Content: </label>
          <input
            type="text"
            className="content-input"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isLoading}
          />
          <label>PIN:</label>
          <input
            type="password"
            maxLength="6"
            className="pin-input"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="button login transfer-button"
            disabled={isLoading || !amount || !pin || !receiverAccountNumber}
          >
            {isLoading ? "Processing..." : "Transfer"}
          </button>
        </form>
        {isLoading && <div className="loading">Processing transferring...</div>}
        {error && <div className="error">Error: {error}</div>}
        {success && <div className="success">{success}</div>}
      </div>
    </div>
  );
}
export default Transfer;
