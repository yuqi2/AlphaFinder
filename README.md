# AlphaFinder

Help Trader Find Their Alpha Stock

## Overview

AlphaFinder is a full-stack web application that helps traders find alpha stocks based on configurable conditions. The application allows users to:

- Filter stocks based on multiple criteria (price, volume, P/E ratio, dividend yield, market cap)
- Create and manage custom conditions for stock filtering
- Set up events for stock notifications or third-party trading platform integration
- Track and manage stock-related events

## Tech Stack

- **Frontend**: React
- **Backend**: Node.js with Express
- **Database**: PostgreSQL

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL (v12 or higher)

## Setup Instructions

### 1. Database Setup

First, create a PostgreSQL database:

```bash
# Log into PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE alphafinder;

# Exit psql
\q
```

Run the schema script to set up tables and sample data:

```bash
cd backend
psql -U postgres -d alphafinder -f config/schema.sql
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env file with your database credentials
# Update DB_PASSWORD and other settings as needed

# Start the backend server
npm run dev
```

The backend server will start on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file from example (optional, defaults to localhost:5000)
cp .env.example .env

# Start the React development server
npm start
```

The frontend will open automatically in your browser at `http://localhost:3000`

## API Endpoints

### Stocks
- `GET /api/stocks` - Get all stocks
- `GET /api/stocks/:symbol` - Get stock by symbol
- `POST /api/stocks/filter` - Filter stocks by criteria

### Conditions
- `GET /api/conditions` - Get all conditions
- `GET /api/conditions/:id` - Get condition by ID
- `POST /api/conditions` - Create new condition
- `PUT /api/conditions/:id` - Update condition
- `DELETE /api/conditions/:id` - Delete condition

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create new event
- `PATCH /api/events/:id/status` - Update event status
- `DELETE /api/events/:id` - Delete event

## Features

### Stock Finder
- View all available stocks with detailed information
- Filter stocks using multiple criteria:
  - Price range (min/max)
  - Volume threshold
  - P/E ratio
  - Dividend yield
  - Market capitalization
- Create events directly from filtered stocks

### Condition Manager
- Create custom reusable conditions
- Edit and delete existing conditions
- Conditions can be applied to events for automated monitoring

### Event Management
- Create notification events for stocks
- Create trade events with third-party platform integration
- Track event status (active, triggered, cancelled)
- Manage and monitor all events in one place

## Project Structure

```
AlphaFinder/
├── backend/
│   ├── config/
│   │   ├── database.js       # Database configuration
│   │   └── schema.sql        # Database schema
│   ├── controllers/
│   │   ├── stockController.js
│   │   ├── conditionController.js
│   │   └── eventController.js
│   ├── routes/
│   │   ├── stocks.js
│   │   ├── conditions.js
│   │   └── events.js
│   ├── server.js             # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── StockList.js
│   │   │   ├── EventList.js
│   │   │   ├── EventModal.js
│   │   │   └── ConditionManager.js
│   │   ├── services/
│   │   │   └── api.js        # API client
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## Usage

1. **Filter Stocks**: Use the Stock Finder tab to search for stocks based on your criteria
2. **Create Conditions**: Save frequently used filter combinations as conditions
3. **Set Up Events**: Click "Create Event" on any stock to set up notifications or trades
4. **Monitor Events**: Use the Events tab to track all your active, triggered, and cancelled events

## Development

### Backend Development
```bash
cd backend
npm run dev  # Starts server with nodemon for auto-reload
```

### Frontend Development
```bash
cd frontend
npm start  # Starts React dev server with hot reload
```

## Future Enhancements

- Real-time stock price updates
- Integration with actual trading platforms (Robinhood, TD Ameritrade, etc.)
- Email/SMS notifications
- Advanced charting and analytics
- Portfolio management
- Backtesting capabilities

## License

ISC

