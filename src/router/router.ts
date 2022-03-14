import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '@/views/Home.vue';
import { disallowAuthGuard, requireAuthGuard } from './navigationGuards';

export const PATH = {
  home: '/',
  quote: '/quote-session',
  record: '/record',
};

export const routes: Array<RouteRecordRaw> = [
  {
    path: PATH.home,
    name: 'Home',
    component: Home,
    meta: {
      layout: 'empty',
    },
  },
  {
    path: PATH.quote,
    name: 'Quote Session',
    component: () => import(/* webpackChunkName "quote" */ '@/views/QuoteSession.vue'),
    meta: {
      layout: 'empty',
    },
  },
  {
    path: PATH.record,
    name: 'Record',
    component: () => import(/* webpackChunkName: "record" */ '@/components/Record.vue'),
    meta: {
      layout: 'empty',
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(requireAuthGuard);
router.beforeEach(disallowAuthGuard);

export default router;
