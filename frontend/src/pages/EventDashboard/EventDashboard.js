import React, { useState, useEffect } from "react";
import EventCard from "../../components/EventCard/EventCard";
import { fetchEvents } from "../../utils/api";
import Footer from "../../components/footer/Footer";
import { FaSearch, FaFilter, FaCalendarAlt, FaTimes, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "./EventDashboard.css";

const EventDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    title: "",
    category: "",
    date: "",
    type: "all",
  });
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 6;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadEvents();
  }, [currentPage]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const response = await fetchEvents(filters, currentPage, eventsPerPage);
      setEvents(response.data.events);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  const handleSearch = async (e) => {
    if (e.key === "Enter") {
      setCurrentPage(1);
      loadEvents();
    }
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    loadEvents();
    setIsFilterPanelOpen(false);
  };

  const resetFilters = () => {
    setFilters({ title: "", category: "", date: "", type: "all" });
    setCurrentPage(1);
    loadEvents();
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Event Dashboard</h1>

      {/* Search and Filter Bar */}
      <div className="search-filter-bar">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            name="title"
            value={filters.title}
            onChange={(e) => handleFilterChange("title", e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search events..."
            className="search-input"
          />
        </div>
        <button
          className="filter-button"
          onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
        >
          <FaFilter /> Filters
        </button>
      </div>

      {/* Filter Panel */}
      {/* Filter Panel */}
{isFilterPanelOpen && (
  <div className={`filter-panel ${isFilterPanelOpen ? "open" : ""}`}>
    <div className="filter-panel-header">
      <h3>Filters</h3>
      <button className="close-button" onClick={() => setIsFilterPanelOpen(false)}>
        <FaTimes />
      </button>
    </div>

    <div className="filter-group">
      <label className="filter-label">Category</label>
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

    <div className="filter-group">
      <label className="filter-label">Date</label>
      <div className="date-input-container">
        <FaCalendarAlt className="date-icon" />
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={(e) => handleFilterChange("date", e.target.value)}
          className="filter-input date-input"
        />
      </div>
    </div>

    <div className="filter-group">
      <label className="filter-label">Event Type</label>
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

    <div className="filter-actions">
      <button onClick={resetFilters} className="reset-button">
        Reset Filters
      </button>
      <button onClick={handleApplyFilters} className="apply-button">
        Apply Filters
      </button>
    </div>
  </div>
)}


      {/* Event List */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading events...</p>
        </div>
      ) : (
        <>
          <div className="event-list">
            {events.length > 0 ? (
              events.map((event) => <EventCard key={event._id} event={event} />)
            ) : (
              <div className="no-events-found">
                <p>No events found matching the criteria.</p>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination-controls">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                <FaArrowLeft /> Previous
              </button>
              <span className="page-number">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="pagination-button"
              >
                Next <FaArrowRight />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EventDashboard;