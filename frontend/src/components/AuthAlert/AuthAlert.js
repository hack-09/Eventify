import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AlertMessage.css'; // Importing styles for the alert

// Functional component to display an alert for restricted access
const AuthAlert = ({ message }) => {
    // eslint-disable-next-line
    const [visible, setVisible] = useState(true); // State to control the visibility of the alert
    const navigate = useNavigate(); // Hook to programmatically navigate between routes

    // Function to handle redirection to the login page
    const handleLoginRedirect = () => {
        navigate('/login'); // Navigate to the login route
    };

    // Function to handle closing the alert and redirecting to the dashboard
    const handleClose = () => {
        navigate('/dashboard'); // Navigate to the dashboard route
    };

    // If the alert is not visible, don't render anything
    if (!visible) return null;

    return (
        <div className="auth-alert"> {/* Main wrapper div for the alert */}
            <div className="auth-alert-content"> {/* Inner content container */}
                <button className="auth-alert-close" onClick={handleClose}> 
                    &times; {/* Button to close the alert (X icon) */}
                </button>
                <h3>Access Restricted</h3> {/* Title of the alert */}
                <p>{message || "Please log in to access this feature."}</p> {/* The message passed from props or default message */}
                <button className="btn-primary" onClick={handleLoginRedirect}> 
                    Go to Login Page 
                </button> {/* Button to navigate to the login page */}
            </div>
        </div>
    );
};

export default AuthAlert; // Exporting the component for use in other parts of the app
