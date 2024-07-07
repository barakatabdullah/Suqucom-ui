import 'virtual:uno.css'

import { createApp } from 'vue'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import App from './App.vue'
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
            darkModeSelector: '.my-app-dark',
        }
    }
})

app.mount('#app')