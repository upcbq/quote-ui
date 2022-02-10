import { createApp } from 'vue';
import App from './App.vue';
import router from './router/router';
import { store } from './store/store';
import installGlobal from '@/plugins/global';
import { Services } from '@/services/services';
import mqViewports from '@/plugins/mqViewports';

Services.initialize();

const app = createApp(App).use(store).use(router);
installGlobal(app);
mqViewports.install(app);

app.mount('#app');
