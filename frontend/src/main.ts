// src/main.ts
import { createApp } from 'vue'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import App from './App.vue'
import './assets/main.css'
import router from "@/router"
import { createPinia } from 'pinia'

const pinia = createPinia()
const app = createApp(App)

app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});
app.use(router)
app.use(pinia)
app.mount('#app')

