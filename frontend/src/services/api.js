import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Stock API calls
export const stockAPI = {
  getAllStocks: () => api.get('/stocks'),
  getStockBySymbol: (symbol) => api.get(`/stocks/${symbol}`),
  filterStocks: (criteria) => api.post('/stocks/filter', { criteria }),
};

// Condition API calls
export const conditionAPI = {
  getAllConditions: () => api.get('/conditions'),
  getConditionById: (id) => api.get(`/conditions/${id}`),
  createCondition: (data) => api.post('/conditions', data),
  updateCondition: (id, data) => api.put(`/conditions/${id}`, data),
  deleteCondition: (id) => api.delete(`/conditions/${id}`),
};

// Event API calls
export const eventAPI = {
  getAllEvents: () => api.get('/events'),
  getEventById: (id) => api.get(`/events/${id}`),
  createEvent: (data) => api.post('/events', data),
  updateEventStatus: (id, status) => api.patch(`/events/${id}/status`, { status }),
  deleteEvent: (id) => api.delete(`/events/${id}`),
};

export default api;
