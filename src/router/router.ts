import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '@/views/Home.vue';
import { disallowAuthGuard, requireAuthGuard } from './navigationGuards';

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      layout: 'empty',
    },
  },
  {
    path: '/record',
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
