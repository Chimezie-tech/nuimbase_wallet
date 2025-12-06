import '../assets/main.css'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import Theme from '@primeuix/themes/aura'
import { definePreset } from '@primeuix/themes'

const app = createApp(App)

const customTheme = definePreset(Theme, {
  semantic: {
    primary: {
      50: '{green.50}',
      100: '{green.100}',
      200: '{green.200}',
      300: '{green.300}',
      400: '{green.400}',
      500: '{green.500}',
      600: '{green.600}',
      700: '{green.700}',
      800: '{green.800}',
      900: '{green.900}',
      950: '{green.950}',
    },
  },
})

app.use(PrimeVue, {
  theme: {
    preset: customTheme,
    options: {
      darkModeSelector: '.dark',
    },
  },
})
app.use(ToastService)

app.use(router)
app.mount('#app')
