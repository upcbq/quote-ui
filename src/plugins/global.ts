import { App } from 'vue';
import Vue3TouchEvents from 'vue3-touch-events';

export default (app: App<Element>) => {
  app.use(Vue3TouchEvents);
};
