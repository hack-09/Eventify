import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AlertMessage.css'; // For styles

const AuthAlert = ({ message }) => {
    const [visible, setVisible] = useState(true);
    const navigate = useNavigate();

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    const handleClose = () => {
        navigate('/dashboard');
    };

    if (!visible) return null;

    return (
        <div className="auth-alert">
            <div className="auth-alert-content">
                <button className="auth-alert-close" onClick={handleClose}>
                    &times;
                </button>
                <h3>Access Restricted</h3>
                <p>{message || "Please log in to access this feature."}</p>
                <button className="btn-primary" onClick={handleLoginRedirect}>
                    Go to Login Page
                </button>
            </div>
        </div>
    );
};

export default AuthAlert;
