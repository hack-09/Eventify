import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUserIdFromToken } from '../../utils/tokenHelper';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Replace with your backend URL

const LiveEventPage = () => {
    const { id: eventId } = useParams(); 
    const userId = getUserIdFromToken();

    const [attendees, setAttendees] = useState([]);
    const [attendeeCount, setAttendeeCount] = useState(0);
    const [eventName, setEventName] = useState('');

    useEffect(() => {
        // Join event room on mount
        console.log('Emitting joinEvent:', { eventId, userId });
        socket.emit('joinEvent', { eventId, userId });

        // Listen for real-time attendee updates
        socket.on('updateAttendeeListAndCount', (data) => {
            if (data.eventId === eventId) {
                setEventName(data.eventName);
                setAttendees(data.attendees);
                setAttendeeCount(data.count);
            }
        });

        // Cleanup on unmount
        return () => {
            socket.emit('leaveEvent', { eventId, userId });
            socket.off('updateAttendeeListAndCount');
        };
    }, [eventId, userId]);

    return (
        <div>
            <h1>Live Event: {eventName}</h1>
            <p>Attendee Count: {attendeeCount}</p>
            <h2>Attendees:</h2>
            <ul>
                {attendees.map((attendee, index) => (
                    <li key={index}>{attendee.username}</li> // Display username instead of userId
                ))}
            </ul>
        </div>
    );
};

export default LiveEventPage;
