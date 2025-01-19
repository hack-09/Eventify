const User = require('../models/User');
const Event = require('../models/Event');

const eventsAttendees = {}; // Store attendees for each event

const eventSocket = (io) => {
    const getUserDetails = async (userId) => {
        try {
            const user = await User.findById(userId);
            return user ? user.name : 'Unknown User';
        } catch (error) {
            console.error(`Error fetching user details: ${error.message}`);
            return 'Unknown User';
        }
    };

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
        // console.log(`New client connected: ${socket.id}`);
        socket.on('joinEvent', async ({ eventId, userId }) => {
            // console.log('joinEvent called with:', { eventId, userId });

            if (!eventId || !userId) {
                console.error('Invalid eventId or userId received.');
                socket.emit('error', { message: 'Invalid eventId or userId' });
                return;
            }

            const username = await getUserDetails(userId);
            const eventName = await getEventName(eventId);

            socket.userData = { eventId, userId };

            if (!eventsAttendees[eventId]) eventsAttendees[eventId] = [];
            if (!eventsAttendees[eventId].find((attendee) => attendee.userId === userId)) {
                eventsAttendees[eventId].push({ userId, username });
            }

            io.to(eventId).emit('updateAttendeeListAndCount', {
                eventId,
                eventName,
                attendees: eventsAttendees[eventId],
                count: eventsAttendees[eventId].length,
            });

            socket.join(eventId);
            console.log(`User joined event: ${username}, Event: ${eventName}`);
        });

        socket.on('leaveEvent', ({ eventId, userId }) => {
            console.log('leaveEvent called with:', { eventId, userId });

            if (!eventId || !userId) {
                console.error('Invalid eventId or userId in leaveEvent.');
                return;
            }

            if (eventsAttendees[eventId]) {
                eventsAttendees[eventId] = eventsAttendees[eventId].filter((attendee) => attendee.userId !== userId);
            }

            io.to(eventId).emit('updateAttendeeListAndCount', {
                eventId,
                attendees: eventsAttendees[eventId] || [],
                count: eventsAttendees[eventId]?.length || 0,
            });

            console.log(`User left event: ${userId}, Event: ${eventId}`);
        });

        socket.on('disconnect', () => {
            const { eventId, userId } = socket.userData || {};

            if (eventId && userId && eventsAttendees[eventId]) {
                eventsAttendees[eventId] = eventsAttendees[eventId].filter((attendee) => attendee.userId !== userId);

                io.to(eventId).emit('updateAttendeeListAndCount', {
                    eventId,
                    attendees: eventsAttendees[eventId] || [],
                    count: eventsAttendees[eventId]?.length || 0,
                });

                console.log(`Client disconnected: ${userId} from event: ${eventId}`);
            } else {
                console.log(`Client disconnected: ${socket.id}`);
            }
        });
    });
};

module.exports = eventSocket;
