import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  auth: {
    token: localStorage.getItem('token')  // Ensure token is available
  }
});

socket.on('connect', () => {
  console.log('Socket connected');
});

export default socket;
