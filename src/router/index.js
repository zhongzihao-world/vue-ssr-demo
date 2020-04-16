import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export function createRouter() {
  return new Router({
    mode: 'history', //一定要是history模式
    routes: [
      {
        path: '/',
        name: 'Home',
        component: () =>
          import(/* webpackChunkName: "about" */ '../views/Home.vue'),
      },
      {
        path: '/about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "about" */ '../views/About.vue'),
      },
    ],
  });
}
