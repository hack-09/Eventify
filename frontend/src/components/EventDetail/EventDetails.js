import React, { useEffect, useState } from "react";  // Importing React, useEffect, and useState hooks for component logic
import { useParams } from "react-router-dom";  // Importing useParams to access route parameters
import './EventDetails.css';  // Importing CSS for styling
import { fetchEventDetails } from "../../utils/api";  // Importing API function to fetch event details

// Functional component to display the details of a specific event
const EventDetails = () => {
  const { eventId } = useParams();  // Getting the eventId from the route parameters
  const [event, setEvent] = useState(null);  // State to hold the event details
  const [loading, setLoading] = useState(true);  // State to manage loading state
  const [error, setError] = useState(null);  // State to manage any errors

  // useEffect to fetch event details when component mounts
  useEffect(() => {
    const loadEventDetails = async () => {
      try {
        const { data } = await fetchEventDetails(eventId);  // Fetch event details using API function
        setEvent(data);  // Set the fetched event data to state
        setLoading(false);  // Set loading state to false after data is fetched
      } catch (err) {
        console.error("Failed to fetch event details:", err);  // Log any errors
        setError("Failed to load event details. Please try again later.");  // Set an error message
        setLoading(false);  // Set loading state to false if there's an error
      }
    };

    loadEventDetails();  // Call the function to fetch event details
  }, [eventId]);  // Dependency: Fetch event details whenever the eventId changes

  if (loading) return <p>Loading event details...</p>;  // Display loading message while fetching data
  if (error) return <p>{error}</p>;  // Display error message if fetching fails

  return (
    <div className="event-details-container">  {/* Main container for event details */}
      <div className="event-content">
        {/* Left side: Event details */}
        <div className="event-details">
          <h1 className="event-title">{event.name}</h1>  {/* Display event name */}
          <p className="event-date-time">
            <strong>Date & Time:</strong> {new Date(event.date).toLocaleString()}  {/* Format and display event date and time */}
          </p>
          <h2 className="event-description-title">Description</h2>  {/* Section heading for event description */}
          <p className="event-description">{event.description}</p>  {/* Display event description */}
          <h2 className="event-description-title">Category</h2>  {/* Section heading for event category */}
          <p className="event-description">{event.category}</p>  {/* Display event category */}
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

export default EventDetails;  // Exporting the EventDetails component for use in other parts of the app
