import { useState } from "react";
import { AccountAPI } from "../services/api";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await AccountAPI.login(email, password);
      console.log(response.data);
    } catch (error) {
      setError("Fail to login");
      console.error("Error logging", error);
    } finally {
      setIsLoading(false);
      setEmail("");
      setPassword("");
    }
  };
  if (error) {
    return <div className="error">Error: {error}</div>;
  }
  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }
  return (
    <div className="login-container">
      <h1>Login</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <label>Email: </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="email-input"
        />

        <label>Password: </label>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="password-input"
        />
        <button type="submit" className="button login">
          Login
        </button>
      </form>
    </div>
  );
}
export default Login;
