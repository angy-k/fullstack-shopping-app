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

// Auth store
import { useAuthStore } from './stores/auth'

// Global components registration utility
import { registerGlobalComponents } from './utils/globalComponents'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(vuetify)

// Register global components automatically
registerGlobalComponents(app)

// Initialize auth store before mounting the app
const authStore = useAuthStore(pinia)
authStore.init()

app.mount('#app')
