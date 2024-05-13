/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'
import { createPinia } from 'pinia';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

// Components
import App from './App.vue'
// Composables
import { createApp } from 'vue'
import router from './router'

const app = createApp(App)
app.use(router)
app.component('VueDatePicker', VueDatePicker);
app.use(createPinia());

registerPlugins(app)
app.mount('#app')
