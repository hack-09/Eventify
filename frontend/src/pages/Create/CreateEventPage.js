import React, { useState } from 'react';
import { createEvent } from '../../utils/api';
import './CreateEventPage.css';

const CreateEventPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        date: '',
        category: '', 
        image: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.description || !formData.date || !formData.category) {
            alert('Please fill in all required fields.');
            return;
        }

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
                image: null,  //  field for image upload
            });
        } catch (error) {
            console.error('Failed to create event:', error);
            alert('Failed to create event. Please try again.');
        }
    };

    return (
        <div className="create-event-container">
            <h1 className="create-event-title">Create New Event</h1>
            <form className="create-event-form" onSubmit={handleSubmit} encType="multipart/form-data">
                <label htmlFor="name">Event Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter event name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="description">Event Description</label>
                <textarea
                    id="description"
                    name="description"
                    placeholder="Enter event description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                ></textarea>

                <label htmlFor="date">Event Date & Time</label>
                <input
                    type="datetime-local"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="category">Category</label>
                <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                >
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
                <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleFileChange}
                />

                <button type="submit" className="create-event-button">
                    Create Event
                </button>
            </form>
        </div>
    );
};

export default CreateEventPage;
