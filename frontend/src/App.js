import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import EditEventPage from './pages/EditEventPage/EditEventPage';
import LiveEventPage from './pages/LiveEvent/LiveEventPage';
import EventDetails from './components/EventDetail/EventDetails';
import EventDashboard from './pages/EventDashboard/EventDashboard';
import ManageEventsPage from './pages/ManageEvents/ManageEventsPage';
import CreateEventPage from './pages/Create/CreateEventPage';
import PrivateRoute from './utils/PrivateRoute';
import MainLayout from './Layout/MainLayout';
import AuthLayout from './Layout/AuthLayout';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AuthLayout><LoginPage /></AuthLayout>} />
                <Route path="/register" element={<AuthLayout><RegisterPage /></AuthLayout>} />

                <Route path="/dashboard" element={<MainLayout><EventDashboard /></MainLayout>} />
                <Route path="/event/edit/:eventId" element={<MainLayout><EditEventPage /></MainLayout>} />
                <Route path="/event/:eventId" element={<MainLayout><EventDetails /></MainLayout>} />
                <Route path="/manage-events" element={<MainLayout><ManageEventsPage /></MainLayout>} />
                <Route path="/event/:id/join" element={<MainLayout><LiveEventPage /></MainLayout>} />
                <Route path="/create-event" element={<MainLayout><PrivateRoute> <CreateEventPage /> </PrivateRoute></MainLayout>} />
            </Routes>
        </Router>
    );
};

export default App;
