import React, { useState, useEffect } from "react";
import { fetchCreatorEvents } from "../../utils/api"; // API to fetch user's events and delete event
import { getUserIdFromToken } from "../../utils/tokenHelper"; // Helper function to extract userId from token string
import EventCard from "../../components/EventCard/EventCard";
import "./ManageEventsPage.css";

const ManageEventsPage = () => {
  const userId = getUserIdFromToken(); // Extract userId from token
  const [userEvents, setUserEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserEvents();
    // eslint-disable-next-line
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

  const handleEventDeletion = (deletedEventId) => {
    setUserEvents((prevEvents) => prevEvents.filter((event) => event._id !== deletedEventId));
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
              onEventUpdated={handleEventDeletion} // Pass the deletion handler
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageEventsPage;
