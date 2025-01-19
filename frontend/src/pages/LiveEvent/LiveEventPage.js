import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Replace with your backend URL

const LiveEventPage = () => {
    const { id: eventId } = useParams(); // Retrieve the eventId from the URL
    const [attendeeCount, setAttendeeCount] = useState(0);

    useEffect(() => {
        if (!eventId) {
            console.error('No event ID found!');
            return;
        }

        // Join event room on component mount
        socket.emit('joinEvent', eventId);

        // Listen for attendee count updates
        socket.on('updateAttendeeCount', (data) => {
            if (data.eventId === eventId) {
                setAttendeeCount(data.count); // Update the count
            }
        });

        // Cleanup on component unmount
        return () => {
            socket.emit('leaveEvent', eventId);
            socket.off('updateAttendeeCount');
        };
    }, [eventId]);

    return (
        <div>
            <h1>Live Event</h1>
            <p>Event ID: {eventId}</p>
            <p>Attendees: {attendeeCount}</p>
        </div>
    );
};

export default LiveEventPage;
