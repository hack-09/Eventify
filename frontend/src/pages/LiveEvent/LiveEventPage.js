import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserIdFromToken } from '../../utils/tokenHelper';
import { fetchEventDetails } from '../../utils/api';
import io from 'socket.io-client';
import './LiveEventPage.css';

const socket = io('http://localhost:5000'); // Replace with your backend URL

const LiveEventPage = () => {
    const { id: eventId } = useParams(); 
    const userId = getUserIdFromToken();
    const navigate = useNavigate(); // For navigation

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
            const { data } = await fetchEventDetails(eventId); // Fetch single event details
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
                <div>
                    <h1>{event?event.name:"Name"}</h1>
                    <p>{event? new Date(event.date).toLocaleString():"Date"} | Category: {event?event.category:"Category"}</p>
                </div>
                <button className="leave-button" onClick={leaveEvent}>Leave Event</button>
            </header>

            {/* Main Content */}
            <div className="main-content">
                {/* Left Column */}
                <div className="left-column">
                    <section>
                        <h2>About the Event</h2>
                        <p>{event?event.description:"Description"}</p>
                        {eventAgenda.length > 0 && (
                            <div>
                                <h3>Agenda</h3>
                                <ul>
                                    {eventAgenda.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </section>

                    <section>
                        <h2>Attendees</h2>
                        <p>Attendee Count: {attendeeCount}</p>
                        <ul>
                            {attendees.map((attendee, index) => (
                                <li key={index}>{attendee.username}</li>
                            ))}
                        </ul>
                    </section>
                </div>

                {/* Center Content: Live Stream */}
                <div className="center-content">
                    <h2>Livestream</h2>
                    <div className="livestream-placeholder">
                        <p>Livestream Video Placeholder</p>
                    </div>
                </div>

                {/* Right Column */}
                <div className="right-column">
                    <section>
                        <h2>Live Chat</h2>
                        <div className="chat-box">
                            {chatMessages.map((msg, index) => (
                                <p key={index}><strong>{msg.username}:</strong> {msg.text}</p>
                            ))}
                        </div>
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your message..."
                        />
                        <button onClick={sendMessage}>Send</button>
                    </section>

                    <section>
                        <h2>Q&A</h2>
                        <ul>
                            {questions.map((question, index) => (
                                <li key={index}>{question.text}</li>
                            ))}
                        </ul>
                        <input
                            type="text"
                            placeholder="Ask a question..."
                            onKeyDown={(e) => e.key === 'Enter' && submitQuestion(e.target.value)}
                        />
                    </section>

                    {poll.question && (
                        <section>
                            <h2>Poll</h2>
                            <p>{poll.question}</p>
                            <ul>
                                {poll.options.map((option, index) => (
                                    <li key={index}>
                                        <button onClick={() => submitPollResponse(option)}>{option}</button>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>
            </div>

            {/* Footer */}
            <footer>
                <p>Powered by Event Management Platform</p>
                <p>
                    <a href="/resources">Resources</a> | 
                    <a href="/support">Support</a>
                </p>
            </footer>
        </div>
    );
};

export default LiveEventPage;
