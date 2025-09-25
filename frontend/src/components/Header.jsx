import { Link } from "react-router";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
function Header() {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const handleClick = () => {
    logout();
  };
  return (
    <div className="header">
      <Link to="/" className="title">
        Mini ATM
      </Link>
      <nav>
        {user && (
          <div>
            <button className="button signup" onClick={handleClick}>
              Log out
            </button>
          </div>
        )}
        {!user && (
          <div className="button-container">
            <Link to="/login" className="button login">
              Login
            </Link>
            <Link to="/signup" className="button signup">
              Signup
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
}
export default Header;
