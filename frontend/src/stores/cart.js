import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { cartService } from '@/services/cart'
import { useAuthStore } from './auth'

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref([])
  const loading = ref(false)
  const error = ref(null)
  const isInitialized = ref(false)
  
  // Get auth store for checking authentication status
  const authStore = useAuthStore()

  // Getters
  const count = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })
  
  const productCount = computed(() => {
    return items.value.length
  })

  const totalPrice = computed(() => {
    return items.value.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    )
  })

  // Actions
  async function addToCart(product, quantity = 1) {
    if (authStore.isAuthenticated) {
      return await addToUserCart(product, quantity)
    } else {
      addToGuestCart(product, quantity)
    }
  }
  
  // Add item to authenticated user's cart via API
  async function addToUserCart(product, quantity = 1) {
    loading.value = true
    error.value = null
    
    try {
      await cartService.addItem(product.id, quantity)
      
      // Refresh cart from API
      await fetchUserCart()
      return true
    } catch (err) {
      console.error('Failed to add item to cart:', err)
      error.value = 'Failed to add item to cart'
      return false
    } finally {
      loading.value = false
    }
  }
  
  // Add item to guest cart in localStorage
  function addToGuestCart(product, quantity = 1) {
    const existingItem = items.value.find(item => item.id === product.id)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      items.value.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image_url: product.image_url,
        quantity: quantity,
      })
    }

    // Save to localStorage
    saveToLocalStorage()
    return true
  }

  async function updateQuantity(productId, quantity) {
    if (authStore.isAuthenticated) {
      return await updateUserCartItemQuantity(productId, quantity)
    } else {
      return updateGuestCartItemQuantity(productId, quantity)
    }
  }
  
  // Update authenticated user's cart item quantity via API
  async function updateUserCartItemQuantity(productId, quantity) {
    loading.value = true
    error.value = null
    
    try {
      // Find the cart item to get its cart_item_id
      const item = items.value.find(item => item.id === productId)
      if (!item || !item.cart_item_id) {
        throw new Error('Cart item not found')
      }
      
      // If quantity is 0 or less, remove the item
      if (quantity <= 0) {
        return await removeFromCart(productId)
      }
      
      // Update via API
      await cartService.updateItemQuantity(item.cart_item_id, quantity)
      
      // Refresh cart from API
      await fetchUserCart()
      return true
    } catch (err) {
      console.error('Failed to update cart item quantity:', err)
      error.value = 'Failed to update item quantity'
      return false
    } finally {
      loading.value = false
    }
  }
  
  // Update guest cart item quantity in localStorage
  function updateGuestCartItemQuantity(productId, quantity) {
    const item = items.value.find(item => item.id === productId)
    if (item) {
      // Remove item if quantity is 0 or less
      if (quantity <= 0) {
        return removeFromCart(productId)
      }
      
      item.quantity = quantity
      saveToLocalStorage()
      return true
    }
    return false
  }

  async function removeFromCart(productId) {
    if (authStore.isAuthenticated) {
      return await removeFromUserCart(productId)
    } else {
      return removeFromGuestCart(productId)
    }
  }
  
  // Remove item from authenticated user's cart via API
  async function removeFromUserCart(productId) {
    loading.value = true
    error.value = null
    
    try {
      // Find the cart item to get its cart_item_id
      const item = items.value.find(item => item.id === productId)
      if (!item || !item.cart_item_id) {
        throw new Error('Cart item not found')
      }
      
      // Remove via API
      await cartService.removeItem(item.cart_item_id)
      
      // Refresh cart from API
      await fetchUserCart()
      return true
    } catch (err) {
      console.error('Failed to remove cart item:', err)
      error.value = 'Failed to remove item from cart'
      return false
    } finally {
      loading.value = false
    }
  }
  
  // Remove item from guest cart in localStorage
  function removeFromGuestCart(productId) {
    items.value = items.value.filter(item => item.id !== productId)
    saveToLocalStorage()
    return true
  }

  async function clearCart() {
    if (authStore.isAuthenticated) {
      return await clearUserCart()
    } else {
      return clearGuestCart()
    }
  }
  
  // Clear authenticated user's cart via API
  async function clearUserCart() {
    loading.value = true
    error.value = null
    
    try {
      await cartService.clearCart()
      
      // Refresh cart from API
      await fetchUserCart()
      return true
    } catch (err) {
      console.error('Failed to clear cart:', err)
      error.value = 'Failed to clear your cart'
      return false
    } finally {
      loading.value = false
    }
  }
  
  // Clear guest cart in localStorage
  function clearGuestCart() {
    items.value = []
    saveToLocalStorage()
    return true
  }

  function loadFromLocalStorage() {
    try {
      const savedCart = localStorage.getItem('shopping-cart')
      if (savedCart) {
        items.value = JSON.parse(savedCart)
      }
    } catch (err) {
      console.error('Failed to load cart from localStorage:', err)
      error.value = 'Failed to load cart data'
    }
  }

  function saveToLocalStorage() {
    try {
      localStorage.setItem('shopping-cart', JSON.stringify(items.value))
    } catch (err) {
      console.error('Failed to save cart to localStorage:', err)
      error.value = 'Failed to save cart data'
    }
  }

  // Watch for authentication state changes
  watch(
    () => authStore.isAuthenticated,
    async (isAuthenticated) => {
      if (isAuthenticated) {
        // User just logged in, merge guest cart with authenticated cart
        await mergeGuestCartWithUserCart()
      } else {
        // User logged out, load from localStorage
        loadFromLocalStorage()
      }
    }
  )
  
  // Initialize cart
  async function initializeCart() {
    if (isInitialized.value) return
    
    if (authStore.isAuthenticated) {
      await fetchUserCart()
    } else {
      loadFromLocalStorage()
    }
    
    isInitialized.value = true
  }
  
  // Fetch authenticated user's cart from the API
  async function fetchUserCart() {
    if (!authStore.isAuthenticated) return
    
    loading.value = true
    error.value = null
    
    try {
      const response = await cartService.getCart()
      if (response && response.cart && response.cart.items) {
        // Transform API response to match our cart item structure
        items.value = response.cart.items.map(item => ({
          id: item.product_id,
          title: item.product.title,
          price: parseFloat(item.price_at_add),
          image_url: item.product.image_url,
          quantity: item.quantity,
          cart_item_id: item.id // Store the cart item ID for API operations
        }))
      } else {
        items.value = []
      }
    } catch (err) {
      console.error('Failed to fetch user cart:', err)
      error.value = 'Failed to load your cart data'
    } finally {
      loading.value = false
    }
  }
  
  // Merge guest cart with authenticated user's cart
  async function mergeGuestCartWithUserCart() {
    if (!authStore.isAuthenticated || items.value.length === 0) return
    
    loading.value = true
    error.value = null
    
    try {
      // Format cart items for API
      const guestItems = items.value.map(item => ({
        product_id: item.id,
        quantity: item.quantity
      }))
      
      // Send merge request to API
      await cartService.mergeCart(guestItems)
      
      // Clear localStorage cart after successful merge
      localStorage.removeItem('shopping-cart')
      
      // Fetch the updated cart from the API
      await fetchUserCart()
    } catch (err) {
      console.error('Failed to merge guest cart:', err)
      error.value = 'Failed to merge your cart data'
    } finally {
      loading.value = false
    }
  }
  
  // Initialize cart from localStorage or API
  initializeCart()

  return {
    items,
    loading,
    error,
    count,
    productCount,
    totalPrice,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    loadFromLocalStorage,
    fetchUserCart,
    mergeGuestCartWithUserCart,
    initializeCart,
    isInitialized
  }
})
