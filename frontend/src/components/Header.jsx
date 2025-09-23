import { Link } from "react-router";
function Header() {
  return (
    <div className="header">
      <Link to="/" className="title">
        Mini ATM
      </Link>
      <div className="button-container">
        <Link to="/login" className="button login">
          Login
        </Link>
        <Link to="/signup" className="button signup">
          Signup
        </Link>
      </div>
    </div>
  );
}
export default Header;
