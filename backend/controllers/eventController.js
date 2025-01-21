const Event = require('../models/Event');
const cloudinary = require('../config/cloudinary');

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
            attendees: [] // Initialize attendees array
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

// get event details with specific event id
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
      // Fetch the existing event to get the current image details
      const event = await Event.findOne({ _id: req.params.id, createdBy: req.user.id });
      if (!event) {
        return res.status(404).json({ error: "Event not found or unauthorized" });
      }
  
      // If an image file is uploaded, handle the update
      if (req.file) {
        // Remove the previous image from Cloudinary if it exists
        console.log("Image file is present to upload to cloudinary");
        if (event.image) {
          try {
            const publicId = event.image.split('/events/')[1].split('.')[0]; // Extract the public_id from the URL
            await cloudinary.uploader.destroy(`events/${publicId}`); // Delete the image
          } catch (error) {
            console.error('Failed to delete old image from Cloudinary:', error);
          }
        }
  
        // Upload the new image to Cloudinary
        const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
          folder: "events", // Specify folder in Cloudinary
        });
  
        req.body.image = uploadedImage.secure_url; // Use the secure_url as a string
      }
      else{
        console.log("No file is present to upload to cloudinary");
      }
  
      // Update the event with the new details
      const updatedEvent = await Event.findOneAndUpdate(
        { _id: req.params.id, createdBy: req.user.id },
        req.body,
        { new: true }
      );
  
      res.status(200).json(updatedEvent);
    } catch (err) {
      console.error("Failed to update event:", err);
      res.status(500).json({ error: "Failed to update event" });
    }
  };
  

// Delete an event
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

        console.log("public id will be printed ");
        // Delete the image from Cloudinary
        if (event.image) {
            const imageUrl = event.image;
            const publicId = imageUrl.split('/events/')[1].split('.')[0];
            public = 'events/' + publicId;     // Remove the file extension

            console.log(public);
            try {
                const result = await cloudinary.uploader.destroy(public);
                console.log("public id : ",public);
                console.log('Image deleted from Cloudinary:', result);
            } catch (error) {
                console.error('Failed to delete image from Cloudinary:', error);
            }
        }

        // Delete the event from the database
        await Event.findOneAndDelete(
            { _id: req.params.id, createdBy: req.user.id },
            { new: true }
        );

        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete event' });
    }
};

exports.joinEvent = async (req, res) => {
    try {
        const { eventId } = req.params; // Extract event ID from the URL

        // Validate that `req.user` exists (ensured by `protect` middleware)
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        // Find the event
        const event = await Event.findById(eventId).populate("attendees", "name email"); // Populate attendees for verification
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Check if the user is already an attendee
        const isAlreadyAttendee = event.attendees.some(
            (attendee) => attendee._id.toString() === req.user._id.toString()
        );

        if (!isAlreadyAttendee) {
            // Add the user to the attendees array
            event.attendees.push(req.user._id);
            await event.save();
        }

        res.status(200).json({
            message: "Joined event successfully",
            attendees: event.attendees,
        });
    } catch (err) {
        console.error("Error in joinEvent:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.getCreatorEvents = async (req, res) => {
    try {
        const creatorId = req.params.creatorId;
        const events = await Event.find({ createdBy: creatorId }).populate('createdBy', 'name');

        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// In your Event Controller
exports.getEventAttendees = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const event = await Event.findById(eventId).populate('attendees', 'userId'); // Assuming 'attendees' is an array of user IDs or full user objects

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json(event.attendees);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
