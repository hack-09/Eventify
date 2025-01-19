import React, { useState } from "react";
import axios from 'axios';
import EditEventPage from "../../pages/EditEventPage/EditEventPage";
import { updateEvent, deleteEvent } from "../../utils/api";
import { Link, useNavigate } from "react-router-dom";
import { getUserIdFromToken } from '../../utils/tokenHelper';
import socket from '../../utils/socket';
import './EventCard.css';

const EventCard = ({ event, onEventUpdated }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(event._id);
        onEventUpdated(); // Refresh the event list
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
    }else{
      alert('You are now logging in');
    }
  
    try {
      const response = await axios.post(`http://localhost:5000/api/events/${eventId}/join`, { userId }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token in headers
        },
      });
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
      <image src="../../assets\time-management.png" alt="Eventify Logo" className="logo" />
      <p>{event.description}</p>
      <p>{new Date(event.date).toLocaleString()}</p>
      <p>Category: {event.category}</p>
      <Link to={`/event/edit/${event._id}`}>Edit Event</Link>
      <button type="button" onClick={handleDelete}>Delete</button>

      <Link to={`/event/${event._id}`}>Event Details</Link>

      <button onClick={() => joinEvent(event._id)}>Join Events</button>
    </div>
  );
};

export default EventCard;
