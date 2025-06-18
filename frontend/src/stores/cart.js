import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref([])
  const loading = ref(false)
  const error = ref(null)

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
  function addToCart(product, quantity = 1) {
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
  }

  function updateQuantity(productId, quantity) {
    const item = items.value.find(item => item.id === productId)
    if (item) {
      item.quantity = quantity
      
      // Remove item if quantity is 0
      if (quantity <= 0) {
        removeFromCart(productId)
        return
      }
      
      // Save to localStorage
      saveToLocalStorage()
    }
  }

  function removeFromCart(productId) {
    items.value = items.value.filter(item => item.id !== productId)
    
    // Save to localStorage
    saveToLocalStorage()
  }

  function clearCart() {
    items.value = []
    
    // Save to localStorage
    saveToLocalStorage()
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

  // Initialize cart from localStorage
  loadFromLocalStorage()

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
  }
})
