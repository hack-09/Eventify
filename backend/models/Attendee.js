const mongoose = require('mongoose');

const attendeeSchema = new mongoose.Schema({
    eventId: mongoose.Schema.Types.ObjectId, // Reference to the event
    userId: mongoose.Schema.Types.ObjectId,  // Reference to the user
    joinedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Attendee', attendeeSchema);
