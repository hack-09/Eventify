import { io } from 'socket.io-client';

const socket = io(`${process.env.REACT_APP_API_CALL}`, {
  auth: {
    token: localStorage.getItem('token')  // Ensure token is available
  },
    transports: ["websocket"],
});

socket.on('connect', () => {
  console.log('Socket connected');
});

export default socket;
