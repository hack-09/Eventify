import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaClock, FaTag, FaArrowLeft, FaShare, FaMapMarkerAlt } from "react-icons/fa";
import './EventDetails.css';
import { fetchEventDetails } from "../../utils/api";

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
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

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading event details...</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <div className="error-alert">
        ⚠️ {error}
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    </div>
  );

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="event-details-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back to Events
      </button>

      <div className="event-content">
        <div className="event-header">
          <h1 className="event-title">{event.name}</h1>
          <div className="event-meta">
            <span className="event-category">
              <FaTag /> {event.category}
            </span>
            {event.location && (
              <span className="event-location">
                <FaMapMarkerAlt /> {event.location}
              </span>
            )}
          </div>
        </div>

        <div className="event-grid">
          <div className="event-poster-wrapper">
            <img
              src={event.image}
              alt={`${event.name} poster`}
              className="event-poster"
            />
            <div className="event-actions">
              <button className="btn primary-btn">
                <FaShare /> Share Event
              </button>
              <button className="btn cta-btn">
                Join Now
              </button>
            </div>
          </div>

          <div className="event-info">
            <div className="info-card">
              <div className="info-item">
                <FaCalendarAlt className="info-icon" />
                <div>
                  <h3>Date</h3>
                  <p>{formattedDate}</p>
                </div>
              </div>
              <div className="info-item">
                <FaClock className="info-icon" />
                <div>
                  <h3>Time</h3>
                  <p>{formattedTime}</p>
                </div>
              </div>
            </div>

            <div className="description-card">
              <h2>Event Description</h2>
              <p className="event-description">{event.description}</p>
            </div>

            {event.agenda && (
              <div className="agenda-card">
                <h2>Event Agenda</h2>
                <ul className="agenda-list">
                  {event.agenda.map((item, index) => (
                    <li key={index}>
                      <span className="agenda-time">{item.time}</span>
                      <span className="agenda-title">{item.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;