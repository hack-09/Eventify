import axios from 'axios';

// Use environment variable for the API base URL
const API = axios.create({ baseURL: `${process.env.REACT_APP_API_CALL}/api` });

// Add Authorization header
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
});

export const fetchEvents = () => API.get('/events');
export const createEvent = (eventData) => API.post('/events', eventData);
export const updateEvent = (id, eventData) => API.put(`/events/${id}`, eventData);
export const deleteEvent = (id) => API.delete(`/events/${id}`);
export const fetchEventDetails = (id) => API.get(`/events/${id}`);
export const fetchCreatorEvents = async (creatorId) => API.get(`/events/creator/${creatorId}`);
export const joiningEvent = (eventId, userId) => API.post(`/events/${eventId}/join`, userId);