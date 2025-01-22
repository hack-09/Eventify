const Event = require('../models/Event');
const cloudinary = require('../config/cloudinary');

/**
 * Create a new event.
 * @route POST /api/events
 * @access Private
 */
exports.createEvent = async (req, res) => {
    try {
        const { name, description, date, category } = req.body;

        // Ensure all required fields are provided
        if (!name || !description || !date || !category) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Create and save the event
        const event = new Event({
            name,
            description,
            date,
            category,
            image: req.file ? req.file.path : null, // Image uploaded via Cloudinary
            createdBy: req.user.id,
            attendees: [], // Initialize attendees array
        });

        await event.save();
        res.status(201).json(event);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create event' });
    }
};

/**
 * Fetch all events.
 * @route GET /api/events
 * @access Public
 */
exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find().populate('createdBy', 'name').exec(); // Populate creator details
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch events' });
    }
};

/**
 * Fetch details of a specific event.
 * @route GET /api/events/:id
 * @access Public
 */
exports.getEventsDetails = async (req, res) => {
    try {
        const { id } = req.params; // Event ID from route params
        const event = await Event.findById(id); // Find event by ID

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.status(200).json(event);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch event details' });
    }
};

/**
 * Update an event.
 * @route PUT /api/events/:id
 * @access Private (Creator only)
 */
exports.updateEvent = async (req, res) => {
    try {
        // Verify the event exists and is owned by the current user
        const event = await Event.findOne({ _id: req.params.id, createdBy: req.user.id });
        if (!event) {
            return res.status(404).json({ error: 'Event not found or unauthorized' });
        }

        // Handle image update, if applicable
        if (req.file) {
            if (event.image) {
                // Delete old image from Cloudinary
                const publicId = event.image.split('/events/')[1].split('.')[0];
                await cloudinary.uploader.destroy(`events/${publicId}`);
            }

            // Upload new image to Cloudinary
            const uploadedImage = await cloudinary.uploader.upload(req.file.path, { folder: 'events' });
            req.body.image = uploadedImage.secure_url;
        }

        // Update event details
        const updatedEvent = await Event.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.user.id },
            req.body,
            { new: true }
        );

        res.status(200).json(updatedEvent);
    } catch (err) {
        console.error('Failed to update event:', err);
        res.status(500).json({ error: 'Failed to update event' });
    }
};

/**
 * Delete an event.
 * @route DELETE /api/events/:id
 * @access Private (Creator only)
 */
exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Ensure only the creator can delete the event
        if (event.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized to delete this event' });
        }

        // Delete the image from Cloudinary, if it exists
        if (event.image) {
            const publicId = event.image.split('/events/')[1].split('.')[0];
            await cloudinary.uploader.destroy(`events/${publicId}`);
        }

        // Delete the event from the database
        await Event.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });

        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete event' });
    }
};

/**
 * Join an event as an attendee.
 * @route POST /api/events/:eventId/join
 * @access Private
 */
exports.joinEvent = async (req, res) => {
    try {
        const { eventId } = req.params;

        // Verify user authentication
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        // Find the event
        const event = await Event.findById(eventId).populate('attendees', 'name email');

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if the user is already an attendee
        const isAlreadyAttendee = event.attendees.some(
            (attendee) => attendee._id.toString() === req.user._id.toString()
        );

        if (!isAlreadyAttendee) {
            event.attendees.push(req.user._id); // Add user to attendees
            await event.save();
        }

        res.status(200).json({
            message: 'Joined event successfully',
            attendees: event.attendees,
        });
    } catch (err) {
        console.error('Error in joinEvent:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

/**
 * Get all events created by a specific user.
 * @route GET /api/events/creator/:creatorId
 * @access Public
 */
exports.getCreatorEvents = async (req, res) => {
    try {
        const creatorId = req.params.creatorId; // Creator ID from route params
        const events = await Event.find({ createdBy: creatorId }).populate('createdBy', 'name');

        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

/**
 * Get attendees of a specific event.
 * @route GET /api/events/:eventId/attendees
 * @access Public
 */
exports.getEventAttendees = async (req, res) => {
    try {
        const eventId = req.params.eventId; // Event ID from route params
        const event = await Event.findById(eventId).populate('attendees', 'userId');

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json(event.attendees);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
