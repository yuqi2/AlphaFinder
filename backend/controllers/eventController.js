const pool = require('../config/database');

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT e.*, c.name as condition_name, s.name as stock_name 
      FROM events e
      LEFT JOIN conditions c ON e.condition_id = c.id
      LEFT JOIN stocks s ON e.stock_symbol = s.symbol
      ORDER BY e.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

// Get event by ID
exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT e.*, c.name as condition_name, s.name as stock_name 
      FROM events e
      LEFT JOIN conditions c ON e.condition_id = c.id
      LEFT JOIN stocks s ON e.stock_symbol = s.symbol
      WHERE e.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
};

// Create new event
exports.createEvent = async (req, res) => {
  try {
    const { stock_symbol, condition_id, event_type, notification_config, trade_config } = req.body;
    
    if (!stock_symbol || !event_type) {
      return res.status(400).json({ error: 'Stock symbol and event type are required' });
    }
    
    const result = await pool.query(
      `INSERT INTO events (stock_symbol, condition_id, event_type, notification_config, trade_config) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        stock_symbol,
        condition_id || null,
        event_type,
        notification_config ? JSON.stringify(notification_config) : null,
        trade_config ? JSON.stringify(trade_config) : null
      ]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
};

// Update event status
exports.updateEventStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['active', 'triggered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const triggered_at = status === 'triggered' ? 'CURRENT_TIMESTAMP' : 'triggered_at';
    
    const result = await pool.query(
      `UPDATE events SET status = $1, triggered_at = ${triggered_at} WHERE id = $2 RETURNING *`,
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM events WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
};
