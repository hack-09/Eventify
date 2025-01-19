import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import './EventDetails.css';
import io from "socket.io-client";
import { fetchEventDetails } from "../../utils/api";

const socket = io("http://localhost:5000"); // Replace with your server's URL

const EventDetails = () => {
  const { eventId } = useParams(); // Get eventId from URL
  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEventDetails = async () => {
      try {
        const { data } = await fetchEventDetails(eventId); // Fetch single event details
        setEvent(data);
        console.log(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch event details:", err);
        setError("Failed to load event details. Please try again later.");
        setLoading(false);
      }
    };

    loadEventDetails();

    // Join event room via socket.io
    socket.emit("joinEvent", { eventId, userName: "User123" }); // Replace 'User123' with the logged-in user's name

    // Listen for real-time attendee updates
    socket.on("attendeesUpdated", (updatedAttendees) => {
      setAttendees(updatedAttendees);
    });

    // Cleanup: Leave room and disconnect on unmount
    return () => {
      socket.emit("leaveEvent", { eventId, userName: "User123" });
      socket.disconnect();
    };
  }, [eventId]);

  if (loading) return <p>Loading event details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="event-details-container">
      <h1 className="event-title">{event.name}</h1>
      <p className="event-description">{event.description}</p>
      <p className="event-date-time">Date & Time: {new Date(event.date).toLocaleString()}</p>
      <p>
        <strong>Attendees:</strong> {event.attendees.length}
      </p>

      <h3 className="attendees-title">Live Attendees:</h3>
      <ul className="attendees-list">
        {attendees.length > 0 ? (
          attendees.map((attendee) => (
            <li key={attendee.id} className="attendee-item">
              {attendee.name}
            </li>
          ))
        ) : (
          <p>No attendees yet.</p>
        )}
      </ul>
    </div>
  );
};

export default EventDetails;
