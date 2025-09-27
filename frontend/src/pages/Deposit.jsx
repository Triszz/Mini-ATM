import { useState } from "react";
import { AccountAPI } from "../services/api";
import { useAuthContext } from "../hooks/useAuthContext";
function Deposit() {
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const { user } = useAuthContext();
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

      const response = await AccountAPI.deposit(Number(amount), pin);
      const newBalance = await AccountAPI.getAccount();
      console.log(response.data);
      setSuccess(
        `Successfully deposit $${amount}. New balance: $${newBalance.data.balance}`
      );
      setAmount("");
      setPin("");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message;
      setError(errorMessage);
      console.error("Error deposit: ", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="deposit-container">
      <h1>Deposit</h1>
      <form className="deposit-form" onSubmit={handleSubmit}>
        <label>Amount ($): </label>
        <input
          type="number"
          min="0"
          className="amount-input"
          value={amount}
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
          className="button login deposit-button"
          disabled={isLoading || !amount || !pin}
        >
          {isLoading ? "Processing..." : "Deposit"}
        </button>
      </form>
      {isLoading && <div className="loading">Processing depositing...</div>}
      {error && <div className="error">Error: {error}</div>}
      {success && <div className="success">{success}</div>}
    </div>
  );
}
export default Deposit;
