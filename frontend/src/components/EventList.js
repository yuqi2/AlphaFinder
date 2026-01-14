import React, { useState, useEffect } from 'react';
import { eventAPI, conditionAPI } from '../services/api';
import './EventList.css';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventAPI.getAllEvents();
      setEvents(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (eventId, newStatus) => {
    try {
      await eventAPI.updateEventStatus(eventId, newStatus);
      fetchEvents();
    } catch (err) {
      alert('Failed to update event status');
      console.error(err);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventAPI.deleteEvent(eventId);
        fetchEvents();
      } catch (err) {
        alert('Failed to delete event');
        console.error(err);
      }
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active': return 'status-badge status-active';
      case 'triggered': return 'status-badge status-triggered';
      case 'cancelled': return 'status-badge status-cancelled';
      default: return 'status-badge';
    }
  };

  if (loading) {
    return <div className="loading">Loading events...</div>;
  }

  return (
    <div className="event-list-container">
      <h2>Event Management</h2>
      
      {error && <div className="error-message">{error}</div>}

      {events.length === 0 ? (
        <div className="no-events">
          <p>No events created yet. Select a stock from the Stock Finder to create an event.</p>
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-header">
                <h3>{event.stock_symbol} - {event.stock_name}</h3>
                <span className={getStatusBadgeClass(event.status)}>
                  {event.status}
                </span>
              </div>
              
              <div className="event-body">
                <div className="event-info">
                  <strong>Event Type:</strong> {event.event_type}
                </div>
                {event.condition_name && (
                  <div className="event-info">
                    <strong>Condition:</strong> {event.condition_name}
                  </div>
                )}
                <div className="event-info">
                  <strong>Created:</strong> {new Date(event.created_at).toLocaleString()}
                </div>
                {event.triggered_at && (
                  <div className="event-info">
                    <strong>Triggered:</strong> {new Date(event.triggered_at).toLocaleString()}
                  </div>
                )}
              </div>

              <div className="event-actions">
                {event.status === 'active' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(event.id, 'triggered')}
                      className="btn btn-trigger"
                    >
                      Trigger
                    </button>
                    <button
                      onClick={() => handleStatusChange(event.id, 'cancelled')}
                      className="btn btn-cancel"
                    >
                      Cancel
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDeleteEvent(event.id)}
                  className="btn btn-delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;
