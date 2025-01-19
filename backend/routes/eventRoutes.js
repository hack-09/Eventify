const express = require('express');
const { createEvent, getEvents, updateEvent, deleteEvent, getEventsDetails, joinEvent, getEventAttendees } = require('../controllers/eventController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');


// Configure Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'events',
        allowed_formats: ['jpg', 'png', 'jpeg'], // Define allowed formats
    },
});
const upload = multer({ storage });

// Event routes
router.post('/', authMiddleware.protect, upload.single('image'), createEvent); // Create event with image upload
router.get('/', authMiddleware.protect, getEvents); // Fetch events
router.put('/:id', authMiddleware.protect, upload.single('image'), updateEvent); // Update event with image upload
router.delete('/:id', authMiddleware.protect, deleteEvent); // Delete event
router.get('/:id', authMiddleware.protect, getEventsDetails); // Fetch event details

// Join Event
router.post('/:eventId/join', authMiddleware.protect, joinEvent);
router.get('/:eventId/attendees', authMiddleware.protect, getEventAttendees);

module.exports = router;

