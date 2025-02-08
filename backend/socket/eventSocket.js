/**
 * eventSocket.js: Socket.IO event handling for real-time event management.
 * This module sets up socket event listeners for joining, leaving events,
 * and updating attendee lists and counts in real-time.
 */

const User = require('../models/User'); // Importing User model
const Event = require('../models/Event'); // Importing Event model

// Object to store attendees for each event
const eventsAttendees = {};

const eventSocket = (io) => {

    /**
     * Fetches user details by userId.
     * @param {string} userId - ID of the user.
     * @returns {Promise<string>} - Returns the user's name or 'Unknown User' in case of an error.
     */
    const getUserDetails = async (userId) => {
        try {
            const user = await User.findById(userId);
            return user ? user.name : 'Unknown User';
        } catch (error) {
            console.error(`Error fetching user details: ${error.message}`);
            return 'Unknown User';
        }
    };

    /**
     * Fetches event name by eventId.
     * @param {string} eventId - ID of the event.
     * @returns {Promise<string>} - Returns the event name or 'Unknown Event' in case of an error.
     */
    const getEventName = async (eventId) => {
        try {
            const event = await Event.findById(eventId);
            return event ? event.name : 'Unknown Event';
        } catch (error) {
            console.error(`Error fetching event details: ${error.message}`);
            return 'Unknown Event';
        }
    };

    io.on('connection', (socket) => {

        // Handle user joining an event
        socket.on('joinEvent', async ({ eventId, userId }) => {
            if (!eventId || !userId) {
                console.error('Invalid eventId or userId received.');
                socket.emit('error', { message: 'Invalid eventId or userId' });
                return;
            }

            const username = await getUserDetails(userId);
            const eventName = await getEventName(eventId);

            socket.userData = { eventId, userId };

            socket.join(eventId);
            
            // Initialize attendee list if not already present for the event
            if (!eventsAttendees[eventId]) eventsAttendees[eventId] = [];

            // Avoid duplicate entries
            if (!eventsAttendees[eventId].find((attendee) => attendee.userId === userId)) {
                eventsAttendees[eventId].push({ userId, username });
            }

            // Emit updated attendee list and count to all sockets in the same event
            io.to(eventId).emit('updateAttendeeListAndCount', {
                eventId,
                eventName,
                attendees: eventsAttendees[eventId],
                count: eventsAttendees[eventId].length,
            });
        });

        // Handle user leaving an event
        socket.on('leaveEvent', ({ eventId, userId }) => {
            if (!eventId || !userId) {
                console.error('Invalid eventId or userId in leaveEvent.');
                return;
            }

            if (eventsAttendees[eventId]) {
                eventsAttendees[eventId] = eventsAttendees[eventId].filter((attendee) => attendee.userId !== userId);
            }

            // Emit updated attendee list and count to all sockets in the same event
            io.to(eventId).emit('updateAttendeeListAndCount', {
                eventId,
                attendees: eventsAttendees[eventId] || [],
                count: eventsAttendees[eventId]?.length || 0,
            });

        });

        // Handle socket disconnection
        socket.on('disconnect', () => {
            const { eventId, userId } = socket.userData || {};

            if (eventId && userId && eventsAttendees[eventId]) {
                eventsAttendees[eventId] = eventsAttendees[eventId].filter((attendee) => attendee.userId !== userId);

                // Emit updated attendee list and count to all sockets in the same event
                io.to(eventId).emit('updateAttendeeListAndCount', {
                    eventId,
                    attendees: eventsAttendees[eventId] || [],
                    count: eventsAttendees[eventId]?.length || 0,
                });

            } else {
                console.log(`Client disconnected`);
            }
        });
    });
};

module.exports = eventSocket;
