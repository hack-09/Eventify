const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');
const dotenv = require('dotenv');

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

const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const connectDB = require('./config/db');

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

// Real-time Socket.IO
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
  
    socket.on("joinEvent", ({ eventId, userName }) => {
      socket.join(eventId);
      console.log(`${userName} joined event room: ${eventId}`);
  
      if (!eventAttendees[eventId]) {
        eventAttendees[eventId] = [];
      }
      eventAttendees[eventId].push({ id: socket.id, name: userName });
  
      // Notify others in the room
      io.to(eventId).emit("attendeesUpdated", eventAttendees[eventId]);
    });
  
    socket.on("leaveEvent", ({ eventId, userName }) => {
      socket.leave(eventId);
      console.log(`${userName} left event room: ${eventId}`);
  
      if (eventAttendees[eventId]) {
        eventAttendees[eventId] = eventAttendees[eventId].filter(
          (attendee) => attendee.id !== socket.id
        );
        io.to(eventId).emit("attendeesUpdated", eventAttendees[eventId]);
      }
    });
  
    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
  
      for (const eventId in eventAttendees) {
        eventAttendees[eventId] = eventAttendees[eventId].filter(
          (attendee) => attendee.id !== socket.id
        );
        io.to(eventId).emit("attendeesUpdated", eventAttendees[eventId]);
      }
    });
});

// Connect to MongoDB and Start Server
connectDB();
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

