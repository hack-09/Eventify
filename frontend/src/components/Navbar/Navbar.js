import React, { useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';
import "./Navbar.css"; // Custom CSS for styling

function Navbar() {
  const navigate = useNavigate();

  let location = useLocation();
  useEffect(() => {
  }, [location]);


  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    navigate("/"); // Redirect to login page
  };

  const toggleMenu = () => {
    const navbarLinks = document.querySelector(".navbar-links");
    navbarLinks.classList.toggle("show-menu");
  };

  const closeMenuOnClick = () => {
    const navbarLinks = document.querySelector(".navbar-links");
    if (navbarLinks.classList.contains("show-menu")) {
      navbarLinks.classList.remove("show-menu");
    }
  };
  

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div className="logo"></div>
        <h1>Eventify</h1>
      </div>

      <div className="navbar-toggle" onClick={toggleMenu}>
        <span className="hamburger"></span>
        <span className="hamburger"></span>
        <span className="hamburger"></span>
      </div>

      <div className="navbar-links">
        <NavLink to="/dashboard" activeClassName="active" className="nav-item" onClick={closeMenuOnClick}>
          <i className="fas fa-home"></i> <span>Dashboard</span>
        </NavLink>
        <NavLink to="/create-event" activeClassName="active" className="nav-item" onClick={closeMenuOnClick}>
        <i className="fas fa-plus-circle"></i> <span>Create Event</span>
        </NavLink>
        <NavLink to="/manage-events" activeClassName="active" className="nav-item" onClick={closeMenuOnClick}>
        <i className="fas fa-tasks"></i> <span>Manage Events</span>
        </NavLink>

        {localStorage.getItem('token') ? 
          <button className="nav-item logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> <span>Logout</span>
          </button>
         : 
          <NavLink to="/" activeClassName="active" className="nav-item">
            <i className="fas fa-sign-in-alt"></i> <span>Login</span>
          </NavLink>
        }
      </div>
    </nav>
  );
}

export default Navbar;
