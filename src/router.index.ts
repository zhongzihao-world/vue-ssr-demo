/* eslint-disable import/prefer-default-export */
import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export function createRouter() {
  return new Router({
    mode: 'history',
    routes: [
      {
        path: '/',
        name: 'Home',
        component: () => import(/* webpackChunkName: "Home" */ './views/Home.vue'),
      },
      {
        path: '/about',
        name: 'About',
        component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
      },
    ],
  });
}
