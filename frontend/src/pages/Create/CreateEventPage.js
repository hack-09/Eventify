import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { createEvent } from '../../utils/api';
import { getUserIdFromToken } from '../../utils/tokenHelper';
import './CreateEventPage.css';

const CreateEventPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        date: '',
        category: '',
        image: null,
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            // Compression options
            const options = {
                maxSizeMB: 0.2, // Maximum file size (0.2 MB or 200 KB)
                maxWidthOrHeight: 800, // Resize to max width/height
                useWebWorker: true,
            };

            const compressedFile = await imageCompression(file, options);
            setFormData({ ...formData, image: compressedFile });

            // Generate preview URL
            const reader = new FileReader();
            reader.onload = () => setImagePreview(reader.result);
            reader.readAsDataURL(compressedFile);
        } catch (error) {
            console.error('Image compression error:', error);
            alert('Failed to process image.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = getUserIdFromToken();
        if (!userId) {
            alert('Please log in to use this feature.');
            return;
        }

        if (!formData.name || !formData.description || !formData.date || !formData.category) {
            alert('Please fill in all required fields.');
            return;
        }

        setIsLoading(true);

        try {
            const formDataToSend = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                formDataToSend.append(key, value);
            });

            await createEvent(formDataToSend);
            alert('Event created successfully!');
            setFormData({
                name: '',
                description: '',
                date: '',
                category: '',
                image: null,
            });
            setImagePreview(null);
            document.getElementById('image').value = '';  // Clear the file input field in the DOM
        } catch (error) {
            console.error('Failed to create event:', error);
            alert('Failed to create event. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="create-event-container">
            <h1 className="create-event-title">Create New Event</h1>
            <form className="create-event-form" onSubmit={handleSubmit} encType="multipart/form-data">
                <label htmlFor="name">Event Name</label>
                <input type="text" id="name" name="name" placeholder="Enter event name" value={formData.name} onChange={handleChange} required />

                <label htmlFor="description">Event Description</label>
                <textarea id="description" name="description" placeholder="Enter event description" value={formData.description} onChange={handleChange} required></textarea>

                <label htmlFor="date">Event Date & Time</label>
                <input type="datetime-local" id="date" name="date" value={formData.date} onChange={handleChange} required />

                <label htmlFor="category">Category</label>
                <select id="category" name="category" value={formData.category} onChange={handleChange} required>
                    <option value="" disabled>Select Category</option>
                    <option value="Tech Talks">Tech Talks</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Webinars">Webinars</option>
                    <option value="Conference">Conference</option>
                    <option value="Meetup">Meetup</option>
                    <option value="Health Awareness">Health Awareness</option>
                    <option value="Virtual Concerts">Virtual Concerts</option>
                </select>

                <label htmlFor="image">Event Image</label>
                <div className="image-input-container">
                    <input type="file" id="image" name="image" accept="image/*" onChange={handleFileChange} required />
                    {imagePreview && (
                        <div className="image-preview-container">
                            <img src={imagePreview} alt="Event Preview" className="image-preview" />
                        </div>
                    )}
                </div>

                <button type="submit" className="create-event-button" disabled={isLoading}>
                    {isLoading ? 'Submitting...' : 'Create Event'}
                </button>
            </form>
            {isLoading && <div className="loading-indicator">Loading...</div>}
        </div>
    );
};

export default CreateEventPage;
