import { jwtDecode } from 'jwt-decode';

export const getUserIdFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded = jwtDecode(token); // Decodes the JWT payload
    return decoded.id; // Assuming the token payload includes `userId`
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};
