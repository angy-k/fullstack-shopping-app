import { createApp } from 'vue'
import App from './App.vue'

// Material Design Icons (using the iconfont package)
import '@mdi/font/css/materialdesignicons.css'
// Vuetify
import vuetify from './plugins/vuetify'

// Pinia
import { createPinia } from 'pinia'

// Router
import router from './router'

// Stores
import { useAuthStore } from './stores/auth'
import { useCartStore } from './stores/cart'

// Global components registration utility
import { registerGlobalComponents } from './utils/globalComponents'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(vuetify)

// Register global components automatically
registerGlobalComponents(app)

// Initialize stores before mounting the app
const authStore = useAuthStore(pinia)
const cartStore = useCartStore(pinia)

// Initialize auth store
authStore.init()

// Initialize cart store (loads from localStorage)
cartStore.loadFromLocalStorage()

app.mount('#app')
