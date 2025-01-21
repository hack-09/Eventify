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
    image: null, // Add image to form data
  });
  const [imagePreview, setImagePreview] = useState(null); // For image preview

  useEffect(() => {
    const loadEvent = async () => {
      try {
        console.log("Event ID : ", eventId);
        const response = await fetchEventDetails(eventId); // Fetch single event details
        const eventData = response.data;

        // Convert the date to the ISO format required for datetime-local
        const formattedDate = new Date(eventData.date).toISOString().slice(0, 16); // Keep only "YYYY-MM-DDTHH:mm"

        setFormData({ ...eventData, date: formattedDate });
        setImagePreview(eventData.image); // Set the existing image as preview
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });

    // Generate preview URL
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "attendees") return; 
        formDataToSend.append(key, value);
      });

      await updateEvent(eventId, formDataToSend);
      alert("Event updated successfully!");
      navigate("/dashboard"); // Navigate back to the dashboard
    } catch (err) {
      console.error("Failed to update event:", err);
    }
  };

  return (
    <div className="edit-event-page">
      <h1>Edit Event</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
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
          Event Date & Time:
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
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select Category
            </option>
            <option value="Tech Talks">Tech Talks</option>
            <option value="Workshop">Workshop</option>
            <option value="Webinars">Webinars</option>
            <option value="Conference">Conference</option>
            <option value="Meetup">Meetup</option>
            <option value="Health Awareness">Health Awareness</option>
            <option value="Virtual Concerts">Virtual Concerts</option>
          </select>
        </label>

        <label>
          Event Image:
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>

        {/* Display image preview */}
        {imagePreview && (
          <div className="image-preview-container">
            <img
              src={imagePreview}
              alt="Event Preview"
              className="image-preview"
            />
          </div>
        )}

        <button type="submit">Save Changes</button>
        <button type="button" onClick={() => navigate("/manage-events")}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditEventPage;
