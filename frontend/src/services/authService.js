import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_CALL}/api`;

export const register = async (userData) => {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
};

export const login = async (userData) => {
    const response = await axios.post(`${API_URL}/auth/login`, userData);
    return response.data;
};

export const guestLogin = async (userData) => {
    const response = await axios.post(`${API_URL}/auth/guest-login`, userData);
    return response.data;
}

export const getProfile = async (token) => {
    const response = await axios.get(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};
