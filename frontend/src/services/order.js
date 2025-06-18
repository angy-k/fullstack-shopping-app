import { api } from './api'

/**
 * Service for handling order-related API requests
 */
export const orderService = {
  /**
   * Get all orders for the authenticated user
   * @returns {Promise<Object>} The API response
   */
  getOrders() {
    return api.get('/orders')
  },

  /**
   * Get a specific order by ID
   * @param {Number} orderId - The order ID to retrieve
   * @returns {Promise<Object>} The API response
   */
  getOrder(orderId) {
    return api.get(`/orders/${orderId}`)
  },

  /**
   * Create a new order from the cart
   * @param {Object} orderData - The order data including shipping information
   * @returns {Promise<Object>} The API response
   */
  createOrder(orderData) {
    return api.post('/orders', orderData)
  },

  /**
   * Cancel an order
   * @param {Number} orderId - The order ID to cancel
   * @returns {Promise<Object>} The API response
   */
  cancelOrder(orderId) {
    return api.patch(`/orders/${orderId}/cancel`)
  }
}

export default orderService
