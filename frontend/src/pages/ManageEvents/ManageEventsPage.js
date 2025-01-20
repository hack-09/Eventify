import React, { useState, useEffect } from "react";
import { fetchCreatorEvents, deleteEvent } from "../../utils/api"; // API to fetch user's events and delete event
import { getUserIdFromToken } from "../../utils/tokenHelper"; // Helper function to extract userId from token string
import EventCard from "../../components/EventCard/EventCard";
import "./ManageEventsPage.css";

const ManageEventsPage = () => {
  const userId = getUserIdFromToken(); // Extract userId from token
  const [userEvents, setUserEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserEvents();
  }, []);

  const loadUserEvents = async () => {
    setLoading(true);
    try {
      const response = await fetchCreatorEvents(userId); // Fetch only events created by the user
      setUserEvents(response.data);
    } catch (err) {
      console.error("Failed to fetch user events:", err);
    } finally {
      setLoading(false);
    }
  };

  const handledeleteEvent = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(eventId); // Call delete API
        setUserEvents((prev) => prev.filter((event) => event._id !== eventId)); // Remove event from state
      } catch (err) {
        console.error("Failed to delete event:", err);
      }
    }
  };

  return (
    <div className="manage-events-container">
      <h1 className="manage-events-title">Manage My Events</h1>
      {loading ? (
        <div className="loading-box">Loading your events...</div>
      ) : userEvents.length === 0 ? (
        <p>No events created by you yet.</p>
      ) : (
        <div className="event-list">
          {userEvents.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              showManagementOptions
              onDelete={() => handledeleteEvent(event._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageEventsPage;
