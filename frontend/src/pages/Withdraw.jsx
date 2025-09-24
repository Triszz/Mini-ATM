import { useState } from "react";
import { AccountAPI } from "../services/api";
function Withdraw() {
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setIsLoading(true);
      const response = await AccountAPI.withdraw(
        "269997912",
        Number(amount),
        pin
      );
      console.log(response.data);
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
    <div className="withdraw-container">
      <h1>Withdrawal</h1>
      <form className="withdraw-form" onSubmit={handleSubmit}>
        <label>Amount: </label>
        <input
          type="text"
          className="amount-input"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          autoFocus
        />
        <label>PIN:</label>
        <input
          type="password"
          className="pin-input"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />
        <button type="submit" className="button login withdraw-button">
          Withdraw
        </button>
      </form>
      {isLoading && <div className="loading">Loading...</div>}
      {error && <div className="error">Error: {error}</div>}
    </div>
  );
}
export default Withdraw;
