import { useState } from "react";
import { useNavigate } from "react-router";
import { AccountAPI } from "../services/api";
import { useAuthContext } from "../hooks/useAuthContext";
function Withdraw() {
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const { user } = useAuthContext();
  const navigate = useNavigate();

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

      const response = await AccountAPI.withdraw(Number(amount), pin);
      const newBalance = await AccountAPI.getAccount();
      console.log(response.data);
      setSuccess(
        `Successfully withdraw $${amount}. \nNew balance: $${newBalance.data.balance}`
      );
      setAmount("");
      setPin("");
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
        <h1>Withdrawal</h1>
        <form className="withdraw-form" onSubmit={handleSubmit}>
          <label>Amount ($): </label>
          <input
            type="text"
            min="0"
            className="amount-input"
            value={amount}
            placeholder="Enter amount (e.g., 50, 100)"
            onChange={(e) => setAmount(e.target.value)}
            disabled={isLoading}
            autoFocus
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
            className="button login withdraw-button"
            disabled={isLoading || !amount || !pin}
          >
            {isLoading ? "Processing..." : "Withdraw"}
          </button>
        </form>
        {isLoading && <div className="loading">Processing withdrawal...</div>}
        {error && <div className="error">Error: {error}</div>}
        {success && <div className="success">{success}</div>}
      </div>
    </div>
  );
}
export default Withdraw;
