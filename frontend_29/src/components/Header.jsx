import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/header.css";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <span className="logo-text">TestGen</span>
        </Link>

        <nav className="header-nav">
          {!user ? (
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
              <span className="nav-role">{user.role}</span>
              <Link
                to={user.role === "mentor" ? "/mentor/dashboard" : "/student/dashboard"}
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
