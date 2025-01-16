import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';  // Custom CSS for styling

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div className="logo"></div>
        <h1>Eventify</h1>  {/* Logo or App name */}
        
      </div>
      
      <div className="navbar-links">
        <NavLink to="/" activeClassName="active" className="nav-item">
          Login
        </NavLink>
        <NavLink to="/register" activeClassName="active" className="nav-item">
          Register
        </NavLink>
        <NavLink to="/dashboard" activeClassName="active" className="nav-item">
          Dashboard
        </NavLink>
        <NavLink to="/create-event" activeClassName="active" className="nav-item">
          Create Event
        </NavLink>
        <NavLink to="/event-list" activeClassName="active" className="nav-item">
          Event List
        </NavLink>
        <NavLink to="/profile" activeClassName="active" className="nav-item">
          Profile
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
