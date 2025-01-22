/**
 * eventRoutes.js: Express routes for handling events-related operations.
 * This file defines the API endpoints for creating, retrieving, updating, deleting events,
 * handling event details, joining events, and managing event attendees.
 */

const express = require('express');
const { createEvent, getEvents, updateEvent, deleteEvent, getEventsDetails, joinEvent, getEventAttendees, getCreatorEvents } = require('../controllers/eventController'); // Importing event controller functions
const authMiddleware = require('../middlewares/authMiddleware'); // Importing authentication middleware
const router = express.Router(); // Create a new instance of Express Router
const multer = require('multer'); // Multer for handling file uploads
const { CloudinaryStorage } = require('multer-storage-cloudinary'); // Cloudinary storage for file uploads
const cloudinary = require('../config/cloudinary'); // Cloudinary configuration

// **Cloudinary Storage Setup**
const storage = new CloudinaryStorage({
    cloudinary, // Configuration imported from 'cloudinary'
    params: {
        folder: 'events', // Folder name in Cloudinary where files will be stored
        allowed_formats: ['jpg', 'png', 'jpeg'], // Allowed image formats
    },
});
const upload = multer({ storage }); // Multer middleware for handling image uploads

// **Event Routes**

/**
 * @route POST /api/events
 * @description Route to create a new event with image upload
 * @access Private (requires authentication)
 */
router.post('/', authMiddleware.protect, upload.single('image'), createEvent);

/**
 * @route GET /api/events
 * @description Route to retrieve all events
 * @access Public
 */
router.get('/', getEvents);

/**
 * @route PUT /api/events/:id
 * @description Route to update an existing event with image upload
 * @access Private (requires authentication)
 */
router.put('/:id', authMiddleware.protect, upload.single('image'), updateEvent);

/**
 * @route DELETE /api/events/:id
 * @description Route to delete an event
 * @access Private (requires authentication)
 */
router.delete('/:id', authMiddleware.protect, deleteEvent);

/**
 * @route GET /api/events/:id
 * @description Route to retrieve details of a specific event
 * @access Public
 */
router.get('/:id', getEventsDetails);

/**
 * @route GET /api/events/creator/:creatorId
 * @description Route to retrieve events created by a specific user (creator)
 * @access Private (requires authentication)
 */
router.get('/creator/:creatorId', authMiddleware.protect, getCreatorEvents);

/**
 * @route POST /api/events/:eventId/join
 * @description Route for users to join an event
 * @access Private (requires authentication)
 */
router.post('/:eventId/join', authMiddleware.protect, joinEvent);

/**
 * @route GET /api/events/:eventId/attendees
 * @description Route to retrieve the list of attendees for an event
 * @access Private (requires authentication)
 */
router.get('/:eventId/attendees', authMiddleware.protect, getEventAttendees);

// Exporting the router for use in the main application
module.exports = router;
