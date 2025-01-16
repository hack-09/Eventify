import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import './EventDetails.css';
import io from "socket.io-client";

const socket = io("http://localhost:5000"); // Replace with your server's URL

const EventDetails = () => {
  const { eventId } = useParams(); // Get eventId from URL
  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);

  useEffect(() => {
    // Fetch event details
    fetch(`http://localhost:5000/api/events/${eventId}`)
      .then((response) => response.json())
      .then((data) => setEvent(data));

    // Join event room
    socket.emit("joinEvent", { eventId, userName: "User123" }); // Replace 'User123' with the logged-in user's name

    // Listen for attendee updates
    socket.on("attendeesUpdated", (updatedAttendees) => {
      setAttendees(updatedAttendees);
    });

    // Leave room on unmount
    return () => {
      socket.emit("leaveEvent", { eventId, userName: "User123" });
      socket.disconnect();
    };
  }, [eventId]);

  if (!event) return <p>Loading event details...</p>;

  return (
    <div>
      <h1>{event.name}</h1>
      <p>{event.description}</p>

      <h3>Live Attendees:</h3>
      <ul>
        {attendees.map((attendee) => (
          <li key={attendee.id}>{attendee.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default EventDetails;
