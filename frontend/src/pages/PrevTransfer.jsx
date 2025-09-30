import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { AccountAPI } from "../services/api";
import { useAuthContext } from "../hooks/useAuthContext";
function PrevTransfer() {
  const [receiverAccountNumber, setReceiverAccountNumber] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.fromTransfer) {
      setReceiverAccountNumber(location.state.receiverAccountNumber || "");
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      if (!user) {
        setError("Please login to continue");
        return;
      }

      const myAccount = await AccountAPI.getAccount();
      if (receiverAccountNumber === myAccount.data.accountNumber) {
        setError("Cannot transfer to your own account");
        return;
      }

      setIsLoading(true);
      const receiverInfo = await AccountAPI.getAccountByNumber(
        receiverAccountNumber
      );

      navigate("/transfer", {
        state: {
          receiverAccountNumber: receiverAccountNumber,
          receiverName: receiverInfo.data.username,
          fromPrevTransfer: true,
        },
      });
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
          <label>Receiver account number: </label>
          <input
            type="text"
            className="receiver-account-number-input"
            value={receiverAccountNumber}
            onChange={(e) => setReceiverAccountNumber(e.target.value)}
            disabled={isLoading}
            autoFocus
          />

          <button
            type="submit"
            className="button login transfer-button"
            disabled={isLoading || !receiverAccountNumber}
          >
            {isLoading ? "Processing..." : "Continue"}
          </button>
        </form>
        {isLoading && <div className="loading">Processing...</div>}
        {error && <div className="error">Error: {error}</div>}
        {success && <div className="success">{success}</div>}
      </div>
    </div>
  );
}
export default PrevTransfer;
