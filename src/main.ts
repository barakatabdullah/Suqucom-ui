import 'virtual:uno.css'
import './styles/index.css'

import { createApp } from 'vue'
import PrimeVue from 'primevue/config';
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import App from '@/App.vue'
import { router } from './router'
import { ThemePreset } from './config/theme';
import Tooltip from 'primevue/tooltip';
import ToastService from 'primevue/toastservice';
import { createI18n } from 'vue-i18n'
import ConfirmationService from 'primevue/confirmationservice';

import 'uno.css'


import { en } from './locales/en'
import { ar } from './locales/ar'


export const i18n = createI18n({
    legacy: false,
    locale: '',
    fallbackLocale: 'en',

    messages: {
        en:en,
        ar:ar
    },
  })


const pinia = createPinia()
const app = createApp(App)

app.use(i18n)

app.use(pinia)
app.use(router)

app.use(VueQueryPlugin)
app.use(PrimeVue, {
    theme: {
        preset: ThemePreset,
        options: {
            darkModeSelector: '.dark',
        }
    }
})
app.directive('tooltip', Tooltip);
app.use(ToastService);
app.use(ConfirmationService);


app.mount('#app')

