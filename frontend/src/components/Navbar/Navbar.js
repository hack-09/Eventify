import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css"; // Custom CSS for styling

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check login state from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token"); // Assuming auth token is stored here
    setIsLoggedIn(!!token); // Set isLoggedIn to true if token exists
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    setIsLoggedIn(false);
    navigate("/"); // Redirect to login page
  };

  const toggleMenu = () => {
    const navbarLinks = document.querySelector(".navbar-links");
    navbarLinks.classList.toggle("show-menu");
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
        <NavLink to="/dashboard" activeClassName="active" className="nav-item">
          Dashboard
        </NavLink>
        <NavLink to="/create-event" activeClassName="active" className="nav-item">
          Create Event
        </NavLink>
        <NavLink to="/manage-events" activeClassName="active" className="nav-item">
          Manage Events
        </NavLink>

        {isLoggedIn ? (
          <button className="nav-item logout-btn" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <NavLink to="/" activeClassName="active" className="nav-item">
            Login
          </NavLink>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
