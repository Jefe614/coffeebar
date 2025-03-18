// src/services/api.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create an axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Orders API
export const ordersApi = {
  // Create a new order
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders/', orderData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  // Track an order by order number
  trackOrder: async (orderNumber) => {
    try {
      const response = await api.get(`/orders/track/?order_number=${orderNumber}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }
  
};

export default api;