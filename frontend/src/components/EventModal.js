import React, { useState, useEffect } from 'react';
import { eventAPI, conditionAPI } from '../services/api';
import './EventModal.css';

const EventModal = ({ stock, onClose, onEventCreated }) => {
  const [eventType, setEventType] = useState('notification');
  const [conditions, setConditions] = useState([]);
  const [selectedCondition, setSelectedCondition] = useState('');
  const [notificationEmail, setNotificationEmail] = useState('');
  const [tradeAction, setTradeAction] = useState('buy');
  const [tradeQuantity, setTradeQuantity] = useState('');
  const [tradePlatform, setTradePlatform] = useState('');

  useEffect(() => {
    fetchConditions();
  }, []);

  const fetchConditions = async () => {
    try {
      const response = await conditionAPI.getAllConditions();
      setConditions(response.data);
    } catch (err) {
      console.error('Failed to fetch conditions:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const eventData = {
      stock_symbol: stock.symbol,
      event_type: eventType,
      condition_id: selectedCondition || null,
    };

    if (eventType === 'notification') {
      eventData.notification_config = {
        email: notificationEmail,
      };
    } else if (eventType === 'trade') {
      eventData.trade_config = {
        action: tradeAction,
        quantity: parseInt(tradeQuantity),
        platform: tradePlatform,
      };
    }

    try {
      await eventAPI.createEvent(eventData);
      alert('Event created successfully!');
      onEventCreated();
      onClose();
    } catch (err) {
      alert('Failed to create event');
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create Event for {stock.symbol}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Stock:</label>
            <div className="stock-info">
              <strong>{stock.symbol}</strong> - {stock.name} (${stock.price})
            </div>
          </div>

          <div className="form-group">
            <label>Event Type:</label>
            <select value={eventType} onChange={(e) => setEventType(e.target.value)} required>
              <option value="notification">Notification</option>
              <option value="trade">Trade</option>
            </select>
          </div>

          <div className="form-group">
            <label>Condition (Optional):</label>
            <select value={selectedCondition} onChange={(e) => setSelectedCondition(e.target.value)}>
              <option value="">No condition</option>
              {conditions.map((cond) => (
                <option key={cond.id} value={cond.id}>
                  {cond.name}
                </option>
              ))}
            </select>
          </div>

          {eventType === 'notification' && (
            <div className="form-group">
              <label>Notification Email:</label>
              <input
                type="email"
                value={notificationEmail}
                onChange={(e) => setNotificationEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
          )}

          {eventType === 'trade' && (
            <>
              <div className="form-group">
                <label>Trade Action:</label>
                <select value={tradeAction} onChange={(e) => setTradeAction(e.target.value)} required>
                  <option value="buy">Buy</option>
                  <option value="sell">Sell</option>
                </select>
              </div>

              <div className="form-group">
                <label>Quantity:</label>
                <input
                  type="number"
                  value={tradeQuantity}
                  onChange={(e) => setTradeQuantity(e.target.value)}
                  placeholder="Number of shares"
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label>Trading Platform:</label>
                <input
                  type="text"
                  value={tradePlatform}
                  onChange={(e) => setTradePlatform(e.target.value)}
                  placeholder="e.g., Robinhood, TD Ameritrade"
                  required
                />
              </div>
            </>
          )}

          <div className="modal-actions">
            <button type="submit" className="btn btn-primary">Create Event</button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
