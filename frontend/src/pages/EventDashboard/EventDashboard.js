import React, { useState, useEffect } from "react";
import EventCard from "../../components/EventCard/EventCard";
import debounce from "lodash.debounce";
import { fetchEvents } from "../../utils/api";
import "./EventDashboard.css"; // Importing custom CSS for styles

const EventDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    title: "",
    category: "",
    date: "",
    type: "all",
  });

  useEffect(() => {
    loadEvents();
  }, [filters]);

  const loadEvents = async () => {
    try {
      const response = await fetchEvents(filters);
      setLoading(false);
      setEvents(response.data);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    }
  };

  const handleFilterChange = debounce((key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  }, 300);

  const filterEvents = () => {
    const currentDate = new Date();

    return events.filter((event) => {
      const eventDate = new Date(event.date);

      if (filters.type === "upcoming" && eventDate < currentDate) return false;
      if (filters.type === "past" && eventDate > currentDate) return false;

      if (filters.title && !event.title.toLowerCase().includes(filters.title.toLowerCase())) {
        return false;
      }

      if (filters.category && event.category !== filters.category) {
        return false;
      }

      if (filters.date && eventDate.toISOString().split("T")[0] !== filters.date) {
        return false;
      }

      return true;
    });
  };

  const filteredEvents = filterEvents();

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Event Dashboard</h1>

      <div className="filters">
        <div className="filter-group search-bar">
          <label className="filter-label">Search by Title:</label>
          <input
            type="text"
            name="title"
            value={filters.title}
            onChange={(e) => handleFilterChange("title", e.target.value)}
            placeholder="Search events..."
            className="filter-input search-bar"
          />
        </div>

        <div className="filter-group category">
          <label className="filter-label">Category:</label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            className="filter-input"
          >
            <option value="">All Categories</option>
            <option value="Tech Talks">Tech Talks</option>
            <option value="Workshop">Workshop</option>
            <option value="Webinars">Webinars</option>
            <option value="Conference">Conference</option>
            <option value="Meetup">Meetup</option>
            <option value="Health Awareness">Health Awareness</option>
            <option value="Virtual Concerts">Virtual Concerts</option>
          </select>
        </div>

        <div className="filter-group date">
          <label className="filter-label">Date:</label>
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={(e) => handleFilterChange("date", e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">Event Type:</label>
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange("type", e.target.value)}
            className="filter-input"
          >
            <option value="all">All</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
        </div>

        <div className="filter-group">
          <button
            onClick={() => setFilters({ title: "", category: "", date: "", type: "all" })}
            className="reset-button"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-box">Loading your events...</div>
      ) :
      (<div className="event-list">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => <EventCard key={event._id} event={event} />)
        ) : (
          <p>No events found matching the criteria.</p>
        )}
      </div>)}
    </div>
  );
};

export default EventDashboard;
