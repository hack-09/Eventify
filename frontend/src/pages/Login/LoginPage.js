import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { login } from '../../services/authService';
import './LoginPage.css'; 

const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });

    useEffect(() => {
        // Check if the user is already logged in
        const token = localStorage.getItem("token");
        if (token) {
          navigate("/dashboard"); // Redirect to dashboard if logged in
        }
      }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGuestLogin = async () => {
        alert('Logged in as guest!');
        navigate('/dashboard');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await login(formData);
            localStorage.setItem('token', data.token);
            alert('Login successful!');
            navigate('/dashboard');
        } catch (error) {
            alert('Login failed. Please try again.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary">Login</button>
                </form>
                <button onClick={handleGuestLogin} className="btn-secondary">
                    Guest Login
                </button>
                <Link to="/register" className="link-register">Create Account</Link>
            </div>
        </div>
    );
};

export default LoginPage;
