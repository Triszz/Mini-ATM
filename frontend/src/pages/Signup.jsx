import { useState } from "react";
import { AccountAPI } from "../services/api";
function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setIsLoading(true);

      const response = await AccountAPI.signup({
        username,
        email,
        password,
        pin,
      });
      console.log(response.data);
      setUsername("");
      setEmail("");
      setPassword("");
      setPin("");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message;
      setError(errorMessage);
      console.error("Error signup: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h1>Signup</h1>
      <form className="signup-form" onSubmit={handleSubmit}>
        <label>Username: </label>
        <input
          type="text"
          className="username-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoFocus
        />
        <label>Email: </label>
        <input
          type="email"
          className="email-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Password: </label>
        <input
          type="password"
          className="password-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label>PIN: </label>
        <input
          type="password"
          className="pin-input"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />
        <button type="submit" className="button login">
          Signup
        </button>
      </form>
      {isLoading && <div className="loading">Loading...</div>}
      {error && <div className="error">Error: {error}</div>}
    </div>
  );
}
export default Signup;
