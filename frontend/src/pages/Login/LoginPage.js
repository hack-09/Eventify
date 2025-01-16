import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { login } from '../../services/authService';
import './LoginPage.css'; 

const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGuestLogin = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/guest-login`);
            localStorage.setItem('token', response.data.token);
            alert('Logged in as guest!');
            navigate('/dashboard');
        } catch (error) {
            alert('Failed to login as guest.');
        }
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
