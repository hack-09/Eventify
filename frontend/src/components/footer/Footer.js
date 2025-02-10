import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaArrowUp } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand Section */}
        <div className="footer-section">
          <h3 className="footer-brand">Eventify</h3>
          <p className="footer-text">
            Connecting people through unforgettable experiences. Discover and manage events with ease.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/events" className="footer-link">All Events</Link></li>
            <li><Link to="/create-event" className="footer-link">Create Event</Link></li>
            <li><Link to="/about" className="footer-link">About Us</Link></li>
            <li><Link to="/contact" className="footer-link">Contact</Link></li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="footer-section">
          <h4 className="footer-heading">Follow Us</h4>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <FaFacebook className="social-icon facebook" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <FaTwitter className="social-icon twitter" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <FaInstagram className="social-icon instagram" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <FaLinkedin className="social-icon linkedin" />
            </a>
          </div>
        </div>

        {/* Back to Top */}
        <button className="scroll-top" onClick={scrollToTop}>
          <FaArrowUp className="arrow-icon" />
        </button>
      </div>

      {/* Copyright Section */}
      <div className="footer-bottom">
        <div className="footer-divider"></div>
        <p className="copyright">
          © {new Date().getFullYear()} Eventify. All rights reserved.
          <span className="legal-links">
            <Link to="/privacy" className="legal-link">Privacy Policy</Link>
            <Link to="/terms" className="legal-link">Terms of Service</Link>
          </span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;