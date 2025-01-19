const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');
const dotenv = require('dotenv');

const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const connectDB = require('./config/db');

dotenv.config();
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

const eventAttendees = {};

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// When a client connects
io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // When a user joins an event
    socket.on('joinEvent', (eventId) => {
        if (!eventId) {
            console.error('Invalid eventId received');
            return;
        }
        if (!eventAttendees[eventId]) {
            eventAttendees[eventId] = new Set(); // Initialize the attendee list
        }
        eventAttendees[eventId].add(socket.id);

        // Broadcast the updated attendee count to all clients in the room
        io.emit('updateAttendeeCount', {
            eventId,
            count: eventAttendees[eventId].size,
        });

        console.log(`User joined event: ${eventId}, Attendees: ${eventAttendees[eventId].size}`);
    });

    // When a user leaves an event
    socket.on('leaveEvent', (eventId) => {
        if (eventAttendees[eventId]) {
            eventAttendees[eventId].delete(socket.id);

            // Broadcast the updated attendee count
            io.emit('updateAttendeeCount', {
                eventId,
                count: eventAttendees[eventId].size,
            });

            console.log(`User left event: ${eventId}, Attendees: ${eventAttendees[eventId].size}`);
        }
    });

    // Cleanup on disconnect
    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
        for (const eventId in eventAttendees) {
            if (eventAttendees[eventId].has(socket.id)) {
                eventAttendees[eventId].delete(socket.id);

                // Update attendees for the event
                io.emit('updateAttendeeCount', {
                    eventId,
                    count: eventAttendees[eventId].size,
                });
            }
        }
    });
});


// Connect to MongoDB and Start Server
connectDB();
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

