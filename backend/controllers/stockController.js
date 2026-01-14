const pool = require('../config/database');

// Get all stocks
exports.getAllStocks = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM stocks ORDER BY symbol');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching stocks:', error);
    res.status(500).json({ error: 'Failed to fetch stocks' });
  }
};

// Get stock by symbol
exports.getStockBySymbol = async (req, res) => {
  try {
    const { symbol } = req.params;
    const result = await pool.query('SELECT * FROM stocks WHERE symbol = $1', [symbol]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Stock not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching stock:', error);
    res.status(500).json({ error: 'Failed to fetch stock' });
  }
};

// Filter stocks based on conditions
exports.filterStocks = async (req, res) => {
  try {
    const { criteria } = req.body;
    
    let query = 'SELECT * FROM stocks WHERE 1=1';
    const params = [];
    let paramIndex = 1;
    
    if (criteria.minPrice !== undefined) {
      query += ` AND price >= $${paramIndex}`;
      params.push(criteria.minPrice);
      paramIndex++;
    }
    
    if (criteria.maxPrice !== undefined) {
      query += ` AND price <= $${paramIndex}`;
      params.push(criteria.maxPrice);
      paramIndex++;
    }
    
    if (criteria.minVolume !== undefined) {
      query += ` AND volume >= $${paramIndex}`;
      params.push(criteria.minVolume);
      paramIndex++;
    }
    
    if (criteria.maxPeRatio !== undefined) {
      query += ` AND pe_ratio <= $${paramIndex}`;
      params.push(criteria.maxPeRatio);
      paramIndex++;
    }
    
    if (criteria.minDividendYield !== undefined) {
      query += ` AND dividend_yield >= $${paramIndex}`;
      params.push(criteria.minDividendYield);
      paramIndex++;
    }
    
    if (criteria.minMarketCap !== undefined) {
      query += ` AND market_cap >= $${paramIndex}`;
      params.push(criteria.minMarketCap);
      paramIndex++;
    }
    
    query += ' ORDER BY symbol';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error filtering stocks:', error);
    res.status(500).json({ error: 'Failed to filter stocks' });
  }
};
