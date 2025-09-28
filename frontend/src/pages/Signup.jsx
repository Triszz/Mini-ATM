import { useState, useRef } from "react";
import { AccountAPI } from "../services/api";
import { useNavigate } from "react-router";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPinVisible, setIsPinVisible] = useState(false);

  const passwordInputRef = useRef(null);
  const pinInputRef = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      setIsLoading(true);

      await AccountAPI.signup({
        username,
        email,
        password,
        pin,
      });
      setSuccess("Account created successfully! Redirecting to login page...");
      setUsername("");
      setEmail("");
      setPassword("");
      setPin("");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
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

  const togglePinVisibility = (e) => {
    e.preventDefault();

    const input = pinInputRef.current;
    const cursorPosition = input ? input.selectionStart : 0;
    setIsPinVisible(!isPinVisible);
    setTimeout(() => {
      if (input) {
        input.focus();
        input.setSelectionRange(cursorPosition, cursorPosition);
      }
    }, 0);
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h1 className="form-header">Signup</h1>
        <label>Username: </label>
        <input
          type="text"
          className="username-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoFocus
          disabled={isLoading || success}
        />
        <label>Email: </label>
        <input
          type="email"
          className="email-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading || success}
        />
        <label>Password: </label>
        <div className="input-container">
          <input
            ref={passwordInputRef}
            type={isPasswordVisible ? "text" : "password"}
            className="password-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading || success}
          />
          <button
            type="button"
            className="toggle-password-button"
            onClick={togglePasswordVisibility}
            disabled={isLoading || success}
            tabIndex={-1}
          >
            <i
              className={`fa-solid fa-eye${isPasswordVisible ? "-slash" : ""}`}
            ></i>
          </button>
        </div>
        <label>PIN: </label>
        <div className="input-container">
          <input
            ref={pinInputRef}
            type={isPinVisible ? "text" : "password"}
            maxLength="6"
            className="pin-input"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            disabled={isLoading || success}
          />
          <button
            type="button"
            className="toggle-password-button"
            onClick={togglePinVisibility}
            disabled={isLoading || success}
            tabIndex={-1}
          >
            <i className={`fa-solid fa-eye${isPinVisible ? "-slash" : ""}`}></i>
          </button>
        </div>
        <button
          type="submit"
          className="button login"
          disabled={isLoading || success}
        >
          {isLoading ? "Creating Account..." : success ? "Success!" : "Signup"}
        </button>
      </form>
      {isLoading && <div className="loading">Creating your account...</div>}
      {success && (
        <div className="success">
          <i className="fa-solid fa-check-circle"></i> {success}
        </div>
      )}
      {error && <div className="error">Error: {error}</div>}
    </div>
  );
}
export default Signup;
