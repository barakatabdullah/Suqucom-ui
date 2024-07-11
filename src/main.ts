import 'virtual:uno.css'
import './styles/index.css'

import { createApp } from 'vue'
import PrimeVue from 'primevue/config';
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import App from '@/App.vue'
import { router } from './router'
import { ThemePreset } from './config/theme';


const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)

app.use(VueQueryPlugin)
app.use(PrimeVue, {
    theme: {
        preset: ThemePreset,
        options: {
            darkModeSelector: '.s-dark-mode',
        }
    }
})

app.mount('#app')