import React, { useState } from "react";
import EditEventPage from "../../pages/EditEventPage/EditEventPage";
import { updateEvent, deleteEvent } from "../../utils/api";
import { Link } from "react-router-dom";
import './EventCard.css';

const EventCard = ({ event, onEventUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedEvent, setUpdatedEvent] = useState({
    name: event.name,
    description: event.description,
    date: event.date,
    time: event.time,
    category: event.category,
  });

  const handleEdit = () => setIsEditing(true);
  const handleClose = () => setIsEditing(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedEvent({ ...updatedEvent, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateEvent(event._id, updatedEvent);
      onEventUpdated(); // Refresh the event list
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update event:", err);
    }
  };

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

  return (
    <div className="event-card">
      <h3>{event.name}</h3>
      <image src="../../assets\time-management.png" alt="Eventify Logo" className="logo" />
      <p>{event.description}</p>
      <p>{new Date(event.date).toLocaleString()}</p>
      <p>Category: {event.category}</p>
      <Link to={`/event/edit/${event._id}`}>Edit Event</Link>
      <button type="button" onClick={handleDelete}>Delete</button>
      <Link to={`/event/${event._id}`}>View Details</Link>

      {isEditing && (
          <>
              <div className="modal-backdrop"></div>
              <div className="modal">
                  <form onSubmit={handleSubmit}>
                      <label>
                          Event Name:
                          <input
                              type="text"
                              name="name"
                              value={updatedEvent.name}
                              onChange={handleChange}
                          />
                      </label>
                      <label>
                          Description:
                          <textarea
                              name="description"
                              value={updatedEvent.description}
                              onChange={handleChange}
                          />
                      </label>
                      <label>
                          Date:
                          <input
                              type="date"
                              name="date"
                              value={updatedEvent.date}
                              onChange={handleChange}
                          />
                      </label>
                      <label>
                          Time:
                          <input
                              type="time"
                              name="time"
                              value={updatedEvent.time}
                              onChange={handleChange}
                          />
                      </label>
                      <label>
                          Category:
                          <input
                              type="text"
                              name="category"
                              value={updatedEvent.category}
                              onChange={handleChange}
                          />
                      </label>
                      <button type="submit">Save Changes</button>
                      <button type="button" onClick={handleClose}>
                          Cancel
                      </button>
                  </form>
              </div>
          </>
      )}
    </div>
  );
};

export default EventCard;
