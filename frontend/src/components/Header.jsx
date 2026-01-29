import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/header.css";

const Header = () => {
  const { isLoggedIn, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <span className="logo-text">TestGen</span>
        </Link>

        <nav className="header-nav">
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link nav-btn">
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to={role === "mentor" ? "/mentor/dashboard" : "/student/dashboard"}
                className="nav-link"
              >
                Dashboard
              </Link>
              <button onClick={handleLogout} className="nav-link nav-btn logout-btn">
                Logout
              </button>
            </>
          )}
        </nav>

        <button className="mobile-menu-btn" aria-label="Toggle menu">
          <span className="hamburger"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
