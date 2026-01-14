import React, { useState, useEffect } from 'react';
import { conditionAPI } from '../services/api';
import './ConditionManager.css';

const ConditionManager = () => {
  const [conditions, setConditions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCondition, setEditingCondition] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    minPrice: '',
    maxPrice: '',
    minVolume: '',
    maxPeRatio: '',
    minDividendYield: '',
    minMarketCap: '',
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const criteria = {};
    ['minPrice', 'maxPrice', 'minVolume', 'maxPeRatio', 'minDividendYield', 'minMarketCap'].forEach(key => {
      if (formData[key] !== '') {
        criteria[key] = parseFloat(formData[key]);
      }
    });

    const conditionData = {
      name: formData.name,
      description: formData.description,
      criteria: criteria,
    };

    try {
      if (editingCondition) {
        await conditionAPI.updateCondition(editingCondition.id, conditionData);
        alert('Condition updated successfully!');
      } else {
        await conditionAPI.createCondition(conditionData);
        alert('Condition created successfully!');
      }
      resetForm();
      fetchConditions();
    } catch (err) {
      alert('Failed to save condition');
      console.error(err);
    }
  };

  const handleEdit = (condition) => {
    setEditingCondition(condition);
    setFormData({
      name: condition.name,
      description: condition.description || '',
      minPrice: condition.criteria.minPrice || '',
      maxPrice: condition.criteria.maxPrice || '',
      minVolume: condition.criteria.minVolume || '',
      maxPeRatio: condition.criteria.maxPeRatio || '',
      minDividendYield: condition.criteria.minDividendYield || '',
      minMarketCap: condition.criteria.minMarketCap || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this condition?')) {
      try {
        await conditionAPI.deleteCondition(id);
        fetchConditions();
      } catch (err) {
        alert('Failed to delete condition');
        console.error(err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      minPrice: '',
      maxPrice: '',
      minVolume: '',
      maxPeRatio: '',
      minDividendYield: '',
      minMarketCap: '',
    });
    setShowForm(false);
    setEditingCondition(null);
  };

  const renderCriteria = (criteria) => {
    const criteriaList = [];
    if (criteria.minPrice) criteriaList.push(`Min Price: $${criteria.minPrice}`);
    if (criteria.maxPrice) criteriaList.push(`Max Price: $${criteria.maxPrice}`);
    if (criteria.minVolume) criteriaList.push(`Min Volume: ${criteria.minVolume}`);
    if (criteria.maxPeRatio) criteriaList.push(`Max P/E: ${criteria.maxPeRatio}`);
    if (criteria.minDividendYield) criteriaList.push(`Min Dividend: ${criteria.minDividendYield}%`);
    if (criteria.minMarketCap) criteriaList.push(`Min Market Cap: $${criteria.minMarketCap}`);
    return criteriaList.join(', ');
  };

  return (
    <div className="condition-manager-container">
      <div className="condition-header">
        <h2>Condition Manager</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          {showForm ? 'Cancel' : 'Create New Condition'}
        </button>
      </div>

      {showForm && (
        <div className="condition-form">
          <h3>{editingCondition ? 'Edit Condition' : 'Create New Condition'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Condition Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., High Value Stocks"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe this condition..."
                rows="3"
              />
            </div>

            <div className="criteria-grid">
              <div className="form-group">
                <label>Min Price ($)</label>
                <input
                  type="number"
                  name="minPrice"
                  value={formData.minPrice}
                  onChange={handleInputChange}
                  placeholder="e.g., 100"
                />
              </div>
              <div className="form-group">
                <label>Max Price ($)</label>
                <input
                  type="number"
                  name="maxPrice"
                  value={formData.maxPrice}
                  onChange={handleInputChange}
                  placeholder="e.g., 500"
                />
              </div>
              <div className="form-group">
                <label>Min Volume</label>
                <input
                  type="number"
                  name="minVolume"
                  value={formData.minVolume}
                  onChange={handleInputChange}
                  placeholder="e.g., 10000000"
                />
              </div>
              <div className="form-group">
                <label>Max P/E Ratio</label>
                <input
                  type="number"
                  name="maxPeRatio"
                  value={formData.maxPeRatio}
                  onChange={handleInputChange}
                  placeholder="e.g., 30"
                />
              </div>
              <div className="form-group">
                <label>Min Dividend Yield (%)</label>
                <input
                  type="number"
                  name="minDividendYield"
                  value={formData.minDividendYield}
                  onChange={handleInputChange}
                  placeholder="e.g., 1.5"
                />
              </div>
              <div className="form-group">
                <label>Min Market Cap</label>
                <input
                  type="number"
                  name="minMarketCap"
                  value={formData.minMarketCap}
                  onChange={handleInputChange}
                  placeholder="e.g., 1000000000"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingCondition ? 'Update Condition' : 'Create Condition'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="conditions-list">
        <h3>Saved Conditions</h3>
        {conditions.length === 0 ? (
          <p className="no-conditions">No conditions created yet.</p>
        ) : (
          <div className="conditions-grid">
            {conditions.map((condition) => (
              <div key={condition.id} className="condition-card">
                <h4>{condition.name}</h4>
                {condition.description && <p className="description">{condition.description}</p>}
                <div className="criteria-text">{renderCriteria(condition.criteria)}</div>
                <div className="condition-actions">
                  <button onClick={() => handleEdit(condition)} className="btn btn-small btn-edit">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(condition.id)} className="btn btn-small btn-delete">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConditionManager;
