import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import './EventDetails.css';
import { fetchEventDetails } from "../../utils/api";

const EventDetails = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEventDetails = async () => {
      try {
        const { data } = await fetchEventDetails(eventId);
        setEvent(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch event details:", err);
        setError("Failed to load event details. Please try again later.");
        setLoading(false);
      }
    };

    loadEventDetails();
  }, [eventId]);

  if (loading) return <p>Loading event details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="event-details-container">
      <div className="event-content">
        {/* Left side: Event details */}
        <div className="event-details">
          <h1 className="event-title">{event.name}</h1>
          <p className="event-date-time">
            <strong>Date & Time:</strong> {new Date(event.date).toLocaleString()}
          </p>
          <h2 className="event-description-title">Description</h2>
          <p className="event-description">{event.description}</p>
          <h2 className="event-description-title">Category</h2>
          <p className="event-description">{event.category}</p>
        </div>
        {/* Right side: Event poster */}
        <div className="event-poster-wrapper">
          <img
            src={event.image}
            alt={`${event.name} poster`}
            className="event-poster"
          />
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
