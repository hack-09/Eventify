/**
 * EventSchema: Defines the structure for storing event-related data in the MongoDB database.
 * This schema includes details about the event, its creator, and attendees.
 */

const mongoose = require('mongoose');

// Define the schema for events
const EventSchema = new mongoose.Schema(
    {
        /**
         * @property {String} name - The name of the event.
         * Required field.
         */
        name: { type: String, required: true },

        /**
         * @property {String} description - Detailed description of the event.
         * Required field.
         */
        description: { type: String, required: true },

        /**
         * @property {Date} date - The date and time when the event is scheduled.
         * Required field.
         */
        date: { type: Date, required: true },

        /**
         * @property {String} category - The category or type of the event (e.g., conference, webinar).
         * Required field.
         */
        category: { type: String, required: true },

        /**
         * @property {String} image - URL or path to an image representing the event.
         * Optional field.
         */
        image: { type: String },

        /**
         * @property {ObjectId} createdBy - Reference to the User who created the event.
         * Required field. Ensures traceability of event creators.
         */
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

        /**
         * @property {Array<ObjectId>} attendees - List of User references who are attending the event.
         * Optional field.
         */
        attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    },
    {
        /**
         * Timestamps: Automatically adds `createdAt` and `updatedAt` fields to the schema.
         */
        timestamps: true,
    }
);

// Export the Event model for use in other parts of the application
module.exports = mongoose.model('Event', EventSchema);
