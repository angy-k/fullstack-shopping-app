import { createApp } from 'vue'
import App from './App.vue'

// Vuetify
import vuetify from './plugins/vuetify'

// Pinia
import { createPinia } from 'pinia'

// Router
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')
