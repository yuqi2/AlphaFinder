import React, { useState, useEffect } from 'react';
import { stockAPI } from '../services/api';
import './StockList.css';

const StockList = ({ onStockSelect }) => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    minVolume: '',
    maxPeRatio: '',
    minDividendYield: '',
    minMarketCap: '',
  });

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      setLoading(true);
      const response = await stockAPI.getAllStocks();
      setStocks(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch stocks. Please check if the backend server is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const applyFilters = async () => {
    try {
      setLoading(true);
      const criteria = {};
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== '') {
          criteria[key] = parseFloat(filters[key]);
        }
      });

      const response = await stockAPI.filterStocks(criteria);
      setStocks(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to filter stocks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      minVolume: '',
      maxPeRatio: '',
      minDividendYield: '',
      minMarketCap: '',
    });
    fetchStocks();
  };

  const formatNumber = (num) => {
    if (num >= 1000000000000) {
      return `$${(num / 1000000000000).toFixed(2)}T`;
    } else if (num >= 1000000000) {
      return `$${(num / 1000000000).toFixed(2)}B`;
    } else if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`;
    }
    return num;
  };

  if (loading && stocks.length === 0) {
    return <div className="loading">Loading stocks...</div>;
  }

  return (
    <div className="stock-list-container">
      <h2>Stock Finder</h2>
      
      <div className="filters-section">
        <h3>Filter Conditions</h3>
        <div className="filters-grid">
          <div className="filter-item">
            <label>Min Price ($)</label>
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              placeholder="e.g., 100"
            />
          </div>
          <div className="filter-item">
            <label>Max Price ($)</label>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              placeholder="e.g., 500"
            />
          </div>
          <div className="filter-item">
            <label>Min Volume</label>
            <input
              type="number"
              name="minVolume"
              value={filters.minVolume}
              onChange={handleFilterChange}
              placeholder="e.g., 10000000"
            />
          </div>
          <div className="filter-item">
            <label>Max P/E Ratio</label>
            <input
              type="number"
              name="maxPeRatio"
              value={filters.maxPeRatio}
              onChange={handleFilterChange}
              placeholder="e.g., 30"
            />
          </div>
          <div className="filter-item">
            <label>Min Dividend Yield (%)</label>
            <input
              type="number"
              name="minDividendYield"
              value={filters.minDividendYield}
              onChange={handleFilterChange}
              placeholder="e.g., 1.5"
            />
          </div>
          <div className="filter-item">
            <label>Min Market Cap</label>
            <input
              type="number"
              name="minMarketCap"
              value={filters.minMarketCap}
              onChange={handleFilterChange}
              placeholder="e.g., 1000000000"
            />
          </div>
        </div>
        <div className="filter-buttons">
          <button onClick={applyFilters} className="btn btn-primary">Apply Filters</button>
          <button onClick={clearFilters} className="btn btn-secondary">Clear Filters</button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="stocks-table-container">
        <h3>Found Stocks ({stocks.length})</h3>
        {stocks.length === 0 ? (
          <p>No stocks found matching your criteria.</p>
        ) : (
          <table className="stocks-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Name</th>
                <th>Price</th>
                <th>Volume</th>
                <th>Market Cap</th>
                <th>P/E Ratio</th>
                <th>Dividend Yield</th>
                <th>52W High</th>
                <th>52W Low</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock) => (
                <tr key={stock.symbol}>
                  <td className="symbol">{stock.symbol}</td>
                  <td>{stock.name}</td>
                  <td>${stock.price}</td>
                  <td>{formatNumber(stock.volume)}</td>
                  <td>{formatNumber(stock.market_cap)}</td>
                  <td>{stock.pe_ratio}</td>
                  <td>{stock.dividend_yield}%</td>
                  <td>${stock.fifty_two_week_high}</td>
                  <td>${stock.fifty_two_week_low}</td>
                  <td>
                    <button
                      onClick={() => onStockSelect && onStockSelect(stock)}
                      className="btn btn-small"
                    >
                      Create Event
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default StockList;
