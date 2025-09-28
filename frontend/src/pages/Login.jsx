import { useState, useRef } from "react";
import { useLogin } from "../hooks/useLogin";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const passwordInputRef = useRef(null);
  const { login, error, isLoading } = useLogin();
  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  const togglePasswordVisibility = (e) => {
    e.preventDefault();

    const input = passwordInputRef.current;
    const cursorPosition = input ? input.selectionStart : 0;
    setIsPasswordVisible(!isPasswordVisible);
    setTimeout(() => {
      if (input) {
        input.focus();
        input.setSelectionRange(cursorPosition, cursorPosition);
      }
    }, 0);
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1 className="form-header">Login</h1>
        <label>Email: </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="email-input"
          autoFocus
        />
        <label>Password: </label>
        <div className="input-container">
          <input
            ref={passwordInputRef}
            type={isPasswordVisible ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="password-input"
            disabled={isLoading}
          />
          <button
            type="button"
            className="toggle-password-button"
            onClick={togglePasswordVisibility}
            disabled={isLoading}
            tabIndex={-1}
          >
            <i
              className={`fa-solid fa-eye${isPasswordVisible ? "-slash" : ""}`}
            ></i>
          </button>
        </div>

        <button type="submit" className="button login">
          Login
        </button>
      </form>
      {isLoading && <div className="loading">Loading...</div>}
      {error && <div className="error">Error: {error}</div>}
    </div>
  );
}
export default Login;
