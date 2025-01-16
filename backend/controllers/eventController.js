const Event = require('../models/Event');

// Create an event
exports.createEvent = async (req, res) => {
    try {
        const { name, description, date, category } = req.body;

        if (!name || !description || !date || !category) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const event = new Event({
            name,
            description,
            date,
            category,
            image: req.file ? req.file.path : null, // Cloudinary URL for the image
            createdBy: req.user.id,
        });

        await event.save();
        res.status(201).json(event);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create event' });
    }
};

// Get all events
exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find().populate('createdBy', 'name').exec();
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch events' });
    }
}

exports.getEventsDetails = async (req, res) => {
    try{
        const { id } = req.params; // Fetch eventId from route params
        const event = await Event.findById(id); // Fetch a single event
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.status(200).json(event);
    }catch(err){
        res.status(500).json({ error: 'Failed to fetch event details' });
    }
};

// Update an event
exports.updateEvent = async (req, res) => {
    try {
        const event = await Event.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.user.id },
            req.body,
            { new: true }
        );
        if (!event) return res.status(404).json({ error: 'Event not found or unauthorized' });
        res.status(200).json(event);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update event' });
    }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
        if (!event) return res.status(404).json({ error: 'Event not found or unauthorized' });
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete event' });
    }
};


exports.addAttendee = async (req, res) => {
    try {
        const { eventId } = req.body;
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ error: 'Event not found' });

        if (!event.attendees.includes(req.user.id)) {
            event.attendees.push(req.user.id);
            await event.save();

            // Emit real-time update
            req.io.to(eventId).emit('attendeeUpdated');
        }

        res.status(200).json(event);
    } catch (err) {
        res.status(500).json({ error: 'Failed to add attendee' });
    }
};