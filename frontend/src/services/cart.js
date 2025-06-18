import { api } from './api'

/**
 * Service for handling cart-related API requests
 */
export const cartService = {
  /**
   * Get the user's cart
   * @returns {Promise<Object>} The API response
   */
  getCart() {
    return api.get('/cart')
  },

  /**
   * Add an item to the cart
   * @param {Number} productId - The product ID to add
   * @param {Number} quantity - The quantity to add
   * @returns {Promise<Object>} The API response
   */
  addItem(productId, quantity = 1) {
    return api.post('/cart/items', {
      product_id: productId,
      quantity
    })
  },

  /**
   * Update the quantity of a cart item
   * @param {Number} cartItemId - The cart item ID to update
   * @param {Number} quantity - The new quantity
   * @returns {Promise<Object>} The API response
   */
  updateItemQuantity(cartItemId, quantity) {
    return api.patch(`/cart/items/${cartItemId}`, { quantity })
  },

  /**
   * Remove an item from the cart
   * @param {Number} cartItemId - The cart item ID to remove
   * @returns {Promise<Object>} The API response
   */
  removeItem(cartItemId) {
    return api.delete(`/cart/items/${cartItemId}`)
  },

  /**
   * Clear all items from the cart
   * @returns {Promise<Object>} The API response
   */
  clearCart() {
    return api.delete('/cart')
  },

  /**
   * Merge a guest cart with the authenticated user's cart
   * @param {Array} guestCartItems - Array of guest cart items to merge
   * @returns {Promise<Object>} The API response
   */
  mergeCart(guestCartItems) {
    return api.post('/cart/merge', { items: guestCartItems })
  }
}

export default cartService
