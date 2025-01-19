import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserIdFromToken } from '../../utils/tokenHelper';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Replace with your backend URL

const LiveEventPage = () => {
    const { id: eventId } = useParams(); // Retrieve the eventId from the URL
    const [attendeeCount, setAttendeeCount] = useState(0);
    const [attendees, setAttendees] = useState([]);
    const userId = getUserIdFromToken();

    useEffect(() => {
        if (!eventId) {
            console.error('No event ID found!');
            return;
        }
        
        // Join event room on component mount
        socket.emit('joinEvent', { eventId, userId });

        // Listen for attendee count updates
        socket.on('updateAttendeeListAndCount', (data) => {
            if (data.eventId === eventId) {
                setAttendeeCount(data.count); // Update the count
                setAttendees(data.attendees);
            }
        });

        // Cleanup on component unmount
        return () => {
            socket.emit('leaveEvent', { eventId, userId });
            socket.off('updateAttendeeCount');
        };
    }, [eventId, userId]);

    return (
        <div>
            <h1>Live Event</h1>
            <p>Event ID: {eventId}</p>
            <p>Attendees: {attendeeCount}</p>
            <p>Attendees:</p>
            <ul>
                {attendees.map((attendee, index) => (
                    <li key={index}>{attendee}</li>
                ))}
            </ul>
        </div>
    );
};

export default LiveEventPage;
