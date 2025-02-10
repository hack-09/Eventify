import React from "react";
import { deleteEvent, joiningEvent } from "../../utils/api";
import { Link, useNavigate } from "react-router-dom";
import { getUserIdFromToken } from '../../utils/tokenHelper';
import { FaEdit, FaTrash, FaCalendarAlt, FaUsers, FaInfoCircle, FaSignInAlt } from "react-icons/fa";
import './EventCard.css';

const EventCard = ({ event, showManagementOptions, onEventUpdated }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(event._id);
        if (onEventUpdated) {
          onEventUpdated(event._id);
        }
      } catch (err) {
        console.error("Failed to delete event:", err);
      }
    }
  };

  const joinEvent = async (eventId) => {
    const userId = getUserIdFromToken();
    if (!userId) {
      alert('Please log in to join events.');
      return;
    }

    try {
      await joiningEvent(eventId, userId);
      navigate(`/event/${event._id}/join`);
    } catch (error) {
      console.error('Error joining event:', error);
      alert(error.response?.data?.message || 'Failed to join event.');
    }
  };

  // Format date and time
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="event-card">
      <div className="card-header">
        <h3 className="event-title">{event.name}</h3>
        <span className="event-category">{event.category}</span>
      </div>
      
      <div className="card-content">
        <p className="event-description">{event.description}</p>
        
        <div className="event-details">
          <div className="detail-item">
            <FaCalendarAlt className="detail-icon" />
            <div>
              <div className="detail-date">{formattedDate}</div>
              <div className="detail-time">{formattedTime}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card-footer">
        <div className="button-group">
          <Link to={`/event/${event._id}`} className="btn details-btn">
            <FaInfoCircle /> Details
          </Link>
          <button onClick={() => joinEvent(event._id)} className="btn join-btn">
            <FaSignInAlt /> Join
          </button>
        </div>

        {showManagementOptions && (
          <div className="management-buttons">
            <Link to={`/event/edit/${event._id}`} className="btn edit-btn">
              <FaEdit /> Edit
            </Link>
            <button onClick={handleDelete} className="btn delete-btn">
              <FaTrash /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;