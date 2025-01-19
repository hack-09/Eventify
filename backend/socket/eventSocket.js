const eventsAttendees = {}; // Store attendees for each event

const eventSocket = (io) => {
    io.on('connection', (socket) => {
        console.log(`New client connected: ${socket.id}`);

        socket.on('joinEvent', ({ eventId, userId }) => {
            if (!eventsAttendees[eventId]) eventsAttendees[eventId] = [];
            if (!eventsAttendees[eventId].includes(userId)) eventsAttendees[eventId].push(userId);

            io.to(eventId).emit('updateAttendeeListAndCount', {
                eventId,
                attendees: eventsAttendees[eventId],
                count: eventsAttendees[eventId].length,
            });

            socket.join(eventId);
            console.log(`User joined event: ${userId}, Event: ${eventId}`);
        });

        socket.on('leaveEvent', ({ eventId, userId }) => {
            if (eventsAttendees[eventId]) {
                eventsAttendees[eventId] = eventsAttendees[eventId].filter((id) => id !== userId);
            }

            io.to(eventId).emit('updateAttendeeListAndCount', {
                eventId,
                attendees: eventsAttendees[eventId] || [],
                count: eventsAttendees[eventId]?.length || 0,
            });

            console.log(`User left event: ${userId}, Event: ${eventId}`);
        });

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
};

module.exports = eventSocket;
