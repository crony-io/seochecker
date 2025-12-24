import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from '@/App.vue';
import { initializeTheme } from '@/composables/useAppearance';
import '@/style.css';
import i18n from '@/i18n';

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(i18n);

// Initialize theme before mounting to prevent flash
initializeTheme();
app.mount('#app');
