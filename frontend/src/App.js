import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import Navbar from './components/Navbar/Navbar';
import EditEventPage from './pages/EditEventPage/EditEventPage';
import LiveEventPage from './pages/LiveEvent/LiveEventPage';
import EventDetails from './components/EventDetail/EventDetails';
import EventDashboard from './pages/EventDashboard/EventDashboard';
import CreateEventPage from './pages/Create/CreateEventPage';

const App = () => {
    return (
        <div className="App">
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/dashboard" element={<EventDashboard />} />
                    <Route path="/event/edit/:eventId" element={<EditEventPage />} />
                    <Route path="/event/:eventId" element={<EventDetails/>} />
                    <Route path="/event/:id/join" element={<LiveEventPage />} />
                    <Route path="/create-event" element={<CreateEventPage />} />
                </Routes>
            </Router>
        </div>
    );
};

export default App;
