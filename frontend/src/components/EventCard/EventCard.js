import React from "react";
import axios from 'axios';
import { deleteEvent, joiningEvent } from "../../utils/api";
import { Link, useNavigate } from "react-router-dom";
import { getUserIdFromToken } from '../../utils/tokenHelper';
import './EventCard.css';

const EventCard = ({ event, showManagementOptions, onEventUpdated }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(event._id);
        if (onEventUpdated) {
          onEventUpdated(event._id); // Pass the deleted event ID
        }
      } catch (err) {
        console.error("Failed to delete event:", err);
      }
    }
  };

  const joinEvent = async (eventId) => {
    const userId = getUserIdFromToken(); // Extract userId from token
    if (!userId) {
      alert('Please log in to join events.');
      return;
    }

    try {
      const response = await joiningEvent(eventId, userId);
      alert(response.data.message);
      console.log("Successfully joined event:", response.data);
      navigate(`/event/${event._id}/join`);
    } catch (error) {
      console.error('Error joining event:', error);
      alert(error.response?.data?.message || 'Failed to join event.');
    }
  };


  return (
    <div className="event-card">
      <h3>{event.name}</h3>
      <p>{event.description}</p>
      <p>{new Date(event.date).toLocaleString()}</p>
      <p>Category: {event.category}</p>


      {showManagementOptions && <Link to={`/event/edit/${event._id}`}>Edit Event</Link>}
      {showManagementOptions && <button type="button" onClick={handleDelete}>Delete</button>}
      <Link to={`/event/${event._id}`}>Event Details</Link>
      <button onClick={() => joinEvent(event._id)}>Join Events</button>
    </div>
  );
};

export default EventCard;
