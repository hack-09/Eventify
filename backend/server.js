// events.js (Main file to bootstrap the application)

// Importing required modules
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

// Importing custom modules
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const eventSocket = require('./socket/eventSocket');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: '*', // React frontend
        methods: ['GET', 'POST'],
    },
});

// Connect to MongoDB database
connectDB();

// Middleware setup
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST','PUT','DELETE']
})); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests

// API Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/events', eventRoutes); // Event routes

// Socket connection setup
eventSocket(io); // Setup real-time socket communication for events

// Starting the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

