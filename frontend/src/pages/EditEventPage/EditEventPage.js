import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchEventDetails, updateEvent } from "../../utils/api";
import "./EditEventPage.css";

const EditEventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    category: "",
  });

  useEffect(() => {
    const loadEvent = async () => {
      try {
        console.log("Event ID : ",eventId);
        const response = await fetchEventDetails(eventId); // Fetch single event details
        const eventData = response.data;
        // Convert the date to the ISO format required for datetime-local
        const formattedDate = new Date(eventData.date).toISOString().slice(0, 16); // Keep only "YYYY-MM-DDTHH:mm"
        setFormData({ ...eventData, date: formattedDate });
      } catch (err) {
        console.error("Failed to load event:", err);
      }
    };

    loadEvent();
  }, [eventId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateEvent(eventId, formData);
      alert("Event updated successfully!");
      navigate("/dashboard"); // Navigate back to the dashboard
    } catch (err) {
      console.error("Failed to update event:", err);
    }
  };

  return (
    <div className="edit-event-page">
      <h1>Edit Event</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Event Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </label>

        <label htmlFor="date">
          Event Date & Time : 
          <input
              type="datetime-local"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
          />
        </label>
        <label>
          Category:
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Save Changes</button>
        <button type="button" onClick={() => navigate("/dashboard")}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditEventPage;
