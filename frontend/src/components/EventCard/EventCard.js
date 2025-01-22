import React from "react";
import axios from 'axios';  // Importing Axios for making HTTP requests
import { deleteEvent, joiningEvent } from "../../utils/api";  // Importing API utility functions for delete and join event
import { Link, useNavigate } from "react-router-dom";  // Importing Link and useNavigate for routing navigation
import { getUserIdFromToken } from '../../utils/tokenHelper';  // Importing function to extract userId from token
import './EventCard.css';  // Importing CSS for styling

// Functional component to display an event card
const EventCard = ({ event, showManagementOptions, onEventUpdated }) => {
  const navigate = useNavigate();  // Hook to programmatically navigate between routes

  // Function to handle event deletion
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this event?")) {  // Confirmation dialog before deleting
      try {
        await deleteEvent(event._id);  // Call delete event API with the event ID
        if (onEventUpdated) {
          onEventUpdated(event._id);  // Pass the deleted event ID to callback function
        }
      } catch (err) {
        console.error("Failed to delete event:", err);  // Log error if deletion fails
      }
    }
  };

  // Function to handle joining an event
  const joinEvent = async (eventId) => {
    const userId = getUserIdFromToken();  // Extract userId from token
    if (!userId) {
      alert('Please log in to join events.');  // Alert if user is not logged in
      return;
    }

    try {
      const response = await joiningEvent(eventId, userId);  // Call API to join event with eventId and userId
      alert(response.data.message);  // Show success message
      console.log("Successfully joined event:", response.data);  // Log success response
      navigate(`/event/${event._id}/join`);  // Navigate to the event join page
    } catch (error) {
      console.error('Error joining event:', error);  // Log error if joining fails
      alert(error.response?.data?.message || 'Failed to join event.');  // Show error message from response
    }
  };

  return (
    <div className="event-card">  {/* Main container for the event card */}
      <h3>{event.name}</h3>  {/* Event name */}
      <p>{event.description}</p>  {/* Event description */}
      <p>{new Date(event.date).toLocaleString()}</p>  {/* Event date formatted as a readable string */}
      <p>Category: {event.category}</p>  {/* Event category */}

      {/* Conditional rendering of management options */}
      {showManagementOptions && <Link to={`/event/edit/${event._id}`}>Edit Event</Link>}  
      {showManagementOptions && <button type="button" onClick={handleDelete}>Delete</button>}
      
      <Link to={`/event/${event._id}`}>Event Details</Link>  {/* Link to view event details */}
      <button onClick={() => joinEvent(event._id)}>Join Event</button>  {/* Button to join the event */}
    </div>
  );
};

export default EventCard;  // Exporting the EventCard component for use in other parts of the app
