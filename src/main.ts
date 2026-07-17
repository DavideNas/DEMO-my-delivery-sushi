import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import PermissionGate from '@/components/PermissionGate.vue'
import { useAuthStore } from '@/stores/auth'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(vuetify)

// Registrazione globale del componente RBAC
app.component('PermissionGate', PermissionGate)

// Init auth store (token is validated on the fly if present in localStorage)
const authStore = useAuthStore()
authStore.initAuth().finally(() => {
    app.mount('#app')
})
