const pool = require('../config/database');

// Get all conditions
exports.getAllConditions = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM conditions ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching conditions:', error);
    res.status(500).json({ error: 'Failed to fetch conditions' });
  }
};

// Get condition by ID
exports.getConditionById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM conditions WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Condition not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching condition:', error);
    res.status(500).json({ error: 'Failed to fetch condition' });
  }
};

// Create new condition
exports.createCondition = async (req, res) => {
  try {
    const { name, description, criteria } = req.body;
    
    if (!name || !criteria) {
      return res.status(400).json({ error: 'Name and criteria are required' });
    }
    
    const result = await pool.query(
      'INSERT INTO conditions (name, description, criteria) VALUES ($1, $2, $3) RETURNING *',
      [name, description || '', JSON.stringify(criteria)]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating condition:', error);
    res.status(500).json({ error: 'Failed to create condition' });
  }
};

// Update condition
exports.updateCondition = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, criteria } = req.body;
    
    const result = await pool.query(
      'UPDATE conditions SET name = $1, description = $2, criteria = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [name, description, JSON.stringify(criteria), id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Condition not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating condition:', error);
    res.status(500).json({ error: 'Failed to update condition' });
  }
};

// Delete condition
exports.deleteCondition = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM conditions WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Condition not found' });
    }
    
    res.json({ message: 'Condition deleted successfully' });
  } catch (error) {
    console.error('Error deleting condition:', error);
    res.status(500).json({ error: 'Failed to delete condition' });
  }
};
