import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { AccountAPI } from "../services/api";
import { useAuthContext } from "../hooks/useAuthContext";
function Transfer() {
  const [amount, setAmount] = useState("");
  const [content, setContent] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const receiverData = location.state;
  const receiverAccountNumber = receiverData?.receiverAccountNumber;
  const receiverName = receiverData?.receiverName;

  useEffect(() => {
    if (!receiverData || !receiverAccountNumber) {
      navigate("/prev-transfer");
      return;
    }
    const loadUserData = async () => {
      try {
        if (user) {
          const response = await AccountAPI.getAccount();
          setContent(`${response.data.username} transfers`);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    loadUserData();
  }, [user, receiverData, receiverAccountNumber, navigate]);

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
      const userResponse = await AccountAPI.getAccount();
      setContent(`${userResponse.data.username} transfers`);
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

  if (!receiverData || !receiverAccountNumber) {
    return (
      <div className="transaction-container">
        <div className="transaction-card">
          <div className="loading">Redirecting...</div>
        </div>
      </div>
    );
  }
  const handleBack = () => {
    navigate("/prev-transfer", {
      state: {
        fromTransfer: true,
        receiverAccountNumber: receiverAccountNumber,
      },
    });
  };
  return (
    <div className="transaction-container">
      <div className="transaction-card">
        <button
          className="back-button"
          onClick={handleBack}
          disabled={isLoading}
        >
          ← Back
        </button>
        <h1>Transfer</h1>
        <div className="receiver-info">
          <p>
            <strong>Transfer to::</strong> {receiverName}
          </p>
          <p>
            <strong>Account number:</strong> {receiverAccountNumber}
          </p>
        </div>
        <form className="transfer-form" onSubmit={handleSubmit}>
          <label>Amount ($): </label>
          <input
            type="text"
            min="0"
            className="amount-input"
            value={amount}
            placeholder="Enter amount (e.g., 50, 100)"
            onChange={(e) => setAmount(e.target.value)}
            disabled={isLoading}
          />
          <label>Transfer Message: </label>
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
            disabled={isLoading || !amount || !pin}
          >
            {isLoading ? "Processing..." : `Transfer`}
          </button>
        </form>
        {isLoading && <div className="loading">Processing transferring...</div>}
        {error && <div className="error">Error: {error}</div>}
        {success && (
          <div className="success">
            {success}
            <button
              className="button signup"
              onClick={() => navigate("/")}
              style={{ marginTop: "10px", display: "block", width: "100%" }}
            >
              Back to home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
export default Transfer;
