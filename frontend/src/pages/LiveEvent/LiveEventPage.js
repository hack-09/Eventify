import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserIdFromToken } from '../../utils/tokenHelper';
import { fetchEventDetails } from '../../utils/api';
import socket from '../../utils/socket';
import { FaInfoCircle } from "react-icons/fa";
import { FaUsers, FaComments, FaQuestionCircle, FaPollH, FaPaperPlane, FaSignOutAlt } from 'react-icons/fa';
import './LiveEventPage.css';

const LiveEventPage = () => {
    const { id: eventId } = useParams();
    const userId = getUserIdFromToken();
    const navigate = useNavigate();
    const chatEndRef = useRef(null);

    const [attendees, setAttendees] = useState([]);
    const [attendeeCount, setAttendeeCount] = useState(0);
    const [event, setEvent] = useState(null);
    const [eventAgenda, setEventAgenda] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [questions, setQuestions] = useState([]);
    const [poll, setPoll] = useState({ question: '', options: [], responses: {} });

    useEffect(() => {
        const loadEventDetails = async () => {
            try {
                const { data } = await fetchEventDetails(eventId);
                setEvent(data);
            } catch (err) {
                console.error("Failed to fetch event details:", err);
            }
        };
        loadEventDetails();
    }, [eventId]);

    useEffect(() => {
        socket.emit('joinEvent', { eventId, userId });

        socket.on('updateEventDetails', async(data) => {
            if (data.eventId === eventId) {
                setEventAgenda(data.eventAgenda || []);
            }
        });

        socket.on('updateAttendeeListAndCount', (data) => {
            if (data.eventId === eventId) {
                setAttendees(data.attendees);
                setAttendeeCount(data.count);
            }
        });

        socket.on('chatMessage', (newMessage) => {
            setChatMessages((prevMessages) => [...prevMessages, newMessage]);
            scrollToBottom();
        });

        socket.on('newQuestion', (newQuestion) => {
            setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
        });

        socket.on('updatePoll', (updatedPoll) => {
            setPoll(updatedPoll);
        });

        return () => {
            socket.emit('leaveEvent', { eventId, userId });
            socket.off('updateEventDetails');
            socket.off('updateAttendeeListAndCount');
            socket.off('chatMessage');
            socket.off('newQuestion');
            socket.off('updatePoll');
        };
    }, [eventId, userId]);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const sendMessage = () => {
        if (message.trim()) {
            socket.emit('chatMessage', { eventId, userId, message });
            setMessage('');
        }
    };

    const submitQuestion = (questionText) => {
        if (questionText.trim()) {
            socket.emit('submitQuestion', { eventId, userId, questionText });
        }
    };

    const submitPollResponse = (option) => {
        socket.emit('pollResponse', { eventId, userId, option });
    };

    const leaveEvent = () => {
        socket.emit('leaveEvent', { eventId, userId });
        navigate('/dashboard');
    };

    return (
        <div className="live-event-page">
            {/* Header Section */}
            <header className="event-header">
                <div className="header-content">
                    <h1>{event?.name || "Event Name"}</h1>
                    <div className="event-meta">
                        <span className="event-date">{event ? new Date(event.date).toLocaleString() : "Date"}</span>
                        <span className="event-category">{event?.category || "Category"}</span>
                    </div>
                </div>
                <button className="leave-button" onClick={leaveEvent}>
                    <FaSignOutAlt /> Leave Event
                </button>
            </header>

            {/* Main Content */}
            <div className="main-content">
                {/* Left Column */}
                <div className="left-column">
                    <section className="about-section">
                        <h2><FaInfoCircle /> About the Event</h2>
                        <p>{event?.description || "Event description"}</p>
                        {eventAgenda.length > 0 && (
                            <div className="agenda-section">
                                <h3>Agenda</h3>
                                <ul>
                                    {eventAgenda.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </section>

                    <section className="attendees-section">
                        <h2><FaUsers /> Attendees ({attendeeCount})</h2>
                        <div className="attendees-list">
                            {attendees.map((attendee, index) => (
                                <div key={index} className="attendee">
                                    <div className="attendee-avatar">
                                        {attendee.username[0].toUpperCase()}
                                    </div>
                                    <span>{attendee.username}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Center Content: Live Stream */}
                <div className="center-content">
                    <div className="livestream-container">
                        <div className="livestream-placeholder">
                            <div className="livestream-overlay">
                                <h2>Live Stream</h2>
                                <p>Stream will begin shortly</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="right-column">
                    <section className="chat-section">
                        <h2><FaComments /> Live Chat</h2>
                        <div className="chat-box">
                            {chatMessages.map((msg, index) => (
                                <div key={index} className="chat-message">
                                    <div className="message-avatar">
                                        {msg.username[0].toUpperCase()}
                                    </div>
                                    <div className="message-content">
                                        <span className="message-username">{msg.username}</span>
                                        <p>{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>
                        <div className="chat-input">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                placeholder="Type your message..."
                            />
                            <button onClick={sendMessage}>
                                <FaPaperPlane />
                            </button>
                        </div>
                    </section>

                    <section className="qa-section">
                        <h2><FaQuestionCircle /> Q&A</h2>
                        <div className="questions-list">
                            {questions.map((question, index) => (
                                <div key={index} className="question">
                                    <div className="question-avatar">
                                        {question.userId[0].toUpperCase()}
                                    </div>
                                    <p>{question.text}</p>
                                </div>
                            ))}
                        </div>
                        <div className="question-input">
                            <input
                                type="text"
                                placeholder="Ask a question..."
                                onKeyDown={(e) => e.key === 'Enter' && submitQuestion(e.target.value)}
                            />
                        </div>
                    </section>

                    {poll.question && (
                        <section className="poll-section">
                            <h2><FaPollH /> Poll</h2>
                            <div className="poll-content">
                                <h3>{poll.question}</h3>
                                <div className="poll-options">
                                    {poll.options.map((option, index) => (
                                        <button 
                                            key={index} 
                                            className="poll-option"
                                            onClick={() => submitPollResponse(option)}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LiveEventPage;