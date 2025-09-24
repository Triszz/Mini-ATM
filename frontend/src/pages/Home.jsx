import { AccountAPI } from "../services/api";
import { useState, useEffect } from "react";
import { Link } from "react-router";
function Home() {
  const [username, setUsername] = useState("");
  const [balance, setBalance] = useState(0);
  const [accountNumber, setAccountNumber] = useState(0);
  const [isBalanceHide, setIsBalanceHide] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await AccountAPI.getAccount("269997912");
        setUsername(response.data.username);
        setBalance(response.data.balance);
        setAccountNumber(response.data.accountNumber);
        setIsBalanceHide(response.data.isBalanceHide);
        console.log(response.data.isBalanceHide);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleClick = async () => {
    try {
      const newState = !isBalanceHide;
      setIsBalanceHide(newState);
      await AccountAPI.changeBalanceState(accountNumber, !isBalanceHide);
    } catch (error) {
      setIsBalanceHide(isBalanceHide);
      setError("Failed to update balance visibility");
      console.error("Error updating balance state:", error);
    }
  };
  if (error) {
    return <div className="error">Error: {error}</div>;
  }
  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }
  return (
    <div className="home">
      <div className="main-container">
        <div className="user-info">
          <h2 className="welcome">
            Welcome, <strong>{username}</strong>
          </h2>
          <h3 className="account-number">{accountNumber}</h3>
          <div className="balance-container">
            <h2 className="balance">{isBalanceHide ? "*****" : balance} VND</h2>
            <button className="display-balance-button" onClick={handleClick}>
              <i
                className={`fa-solid fa-eye${isBalanceHide ? "" : "-slash"}`}
              ></i>
            </button>
          </div>
        </div>
        <div className="action-container">
          <Link to="/withdraw" className="action withdraw">
            Withdraw
          </Link>
          <Link to="/deposit" className="action deposit">
            Deposit
          </Link>
          <Link to="/transfer" className="action transfer">
            Transfer
          </Link>
          <Link to="/history" className="action history">
            Transaction History
          </Link>
        </div>
      </div>
    </div>
  );
}
export default Home;
