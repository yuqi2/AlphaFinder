const express = require('express');
const cors = require('cors');
require('dotenv').config();

const stockRoutes = require('./routes/stocks');
const conditionRoutes = require('./routes/conditions');
const eventRoutes = require('./routes/events');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/stocks', stockRoutes);
app.use('/api/conditions', conditionRoutes);
app.use('/api/events', eventRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'AlphaFinder API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
