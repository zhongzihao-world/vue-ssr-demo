/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import { createApp } from './main';
import './api/axios.config';

const { app, router } = createApp();
router.onReady(() => {
  app.$mount('#app');
});
