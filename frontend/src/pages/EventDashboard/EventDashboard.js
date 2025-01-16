import React, { useState, useEffect } from "react";
import { fetchEvents } from "../../utils/api";
import EventCard from "../../components/EventCard/EventCard";
import "./EventDashboard.css";


const EventDashboard = () => {
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({ category: "", date: "" });

  useEffect(() => {
    loadEvents();
  }, [filters]);

  const loadEvents = async () => {
    try {
      const response = await fetchEvents(filters);
      setEvents(response.data);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Event Dashboard</h1>

      <div className="filters">
        <label>
          Category:
          <input
            type="text"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
          />
        </label>
        <label>
          Date:
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
          />
        </label>
      </div>

      <div className="event-list">
        {events.map((event) => (
          <EventCard key={event._id} event={event} onEventUpdated={fetchEvents} />
        ))}
      </div>
    </div>
  );
};

export default EventDashboard;
