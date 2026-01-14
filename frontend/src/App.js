import React, { useState } from 'react';
import './App.css';
import StockList from './components/StockList';
import EventList from './components/EventList';
import EventModal from './components/EventModal';
import ConditionManager from './components/ConditionManager';

function App() {
  const [activeTab, setActiveTab] = useState('stocks');
  const [selectedStock, setSelectedStock] = useState(null);
  const [eventListKey, setEventListKey] = useState(0);

  const handleStockSelect = (stock) => {
    setSelectedStock(stock);
  };

  const handleCloseModal = () => {
    setSelectedStock(null);
  };

  const handleEventCreated = () => {
    setEventListKey(prevKey => prevKey + 1);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>📈 AlphaFinder</h1>
        <p className="tagline">Find Your Alpha Stock</p>
      </header>

      <nav className="app-nav">
        <button
          className={`nav-btn ${activeTab === 'stocks' ? 'active' : ''}`}
          onClick={() => setActiveTab('stocks')}
        >
          Stock Finder
        </button>
        <button
          className={`nav-btn ${activeTab === 'conditions' ? 'active' : ''}`}
          onClick={() => setActiveTab('conditions')}
        >
          Conditions
        </button>
        <button
          className={`nav-btn ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          Events
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'stocks' && <StockList onStockSelect={handleStockSelect} />}
        {activeTab === 'conditions' && <ConditionManager />}
        {activeTab === 'events' && <EventList key={eventListKey} />}
      </main>

      {selectedStock && (
        <EventModal
          stock={selectedStock}
          onClose={handleCloseModal}
          onEventCreated={handleEventCreated}
        />
      )}
    </div>
  );
}

export default App;
