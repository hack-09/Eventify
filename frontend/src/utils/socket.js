import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); // Update with your backend URL if deployed

export default socket;
