-- Create stocks table
CREATE TABLE IF NOT EXISTS stocks (
  id SERIAL PRIMARY KEY,
  symbol VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2),
  volume BIGINT,
  market_cap BIGINT,
  pe_ratio DECIMAL(10, 2),
  dividend_yield DECIMAL(5, 2),
  fifty_two_week_high DECIMAL(10, 2),
  fifty_two_week_low DECIMAL(10, 2),
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create conditions table
CREATE TABLE IF NOT EXISTS conditions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  criteria JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  stock_symbol VARCHAR(10) NOT NULL,
  condition_id INTEGER REFERENCES conditions(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL, -- 'notification' or 'trade'
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'triggered', 'cancelled'
  notification_config JSONB,
  trade_config JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  triggered_at TIMESTAMP,
  FOREIGN KEY (stock_symbol) REFERENCES stocks(symbol) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_stocks_symbol ON stocks(symbol);
CREATE INDEX IF NOT EXISTS idx_events_stock_symbol ON events(stock_symbol);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);

-- Insert sample stock data
INSERT INTO stocks (symbol, name, price, volume, market_cap, pe_ratio, dividend_yield, fifty_two_week_high, fifty_two_week_low) VALUES
  ('AAPL', 'Apple Inc.', 178.50, 52000000, 2800000000000, 29.5, 0.52, 199.62, 164.08),
  ('MSFT', 'Microsoft Corporation', 378.91, 24000000, 2820000000000, 36.2, 0.75, 384.30, 309.45),
  ('GOOGL', 'Alphabet Inc.', 140.15, 25000000, 1750000000000, 25.8, 0.00, 153.78, 121.46),
  ('AMZN', 'Amazon.com Inc.', 155.33, 48000000, 1600000000000, 68.5, 0.00, 161.72, 118.35),
  ('TSLA', 'Tesla Inc.', 238.45, 110000000, 757000000000, 75.2, 0.00, 299.29, 152.37),
  ('NVDA', 'NVIDIA Corporation', 495.22, 42000000, 1220000000000, 98.4, 0.03, 505.48, 360.68),
  ('META', 'Meta Platforms Inc.', 355.64, 18000000, 905000000000, 28.9, 0.00, 384.33, 274.38),
  ('JPM', 'JPMorgan Chase & Co.', 158.77, 11000000, 458000000000, 11.2, 2.45, 164.65, 135.19),
  ('V', 'Visa Inc.', 257.89, 7000000, 527000000000, 32.1, 0.78, 267.54, 225.81),
  ('WMT', 'Walmart Inc.', 162.33, 8000000, 437000000000, 28.7, 1.42, 166.70, 142.05)
ON CONFLICT (symbol) DO NOTHING;
