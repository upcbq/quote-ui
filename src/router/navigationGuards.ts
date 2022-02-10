import { NavigationGuard } from 'vue-router';

export const requireAuthGuard: NavigationGuard = (to, from, next) => {
  // if (to.meta && to.meta.requiresAuth) {
  //   if (!store.getters['auth/loggedIn']) {
  //     next({
  //       path: '/login',
  //       query: { redirect: to.fullPath },
  //     });
  //     return;
  //   }
  // }
  next();
};

export const disallowAuthGuard: NavigationGuard = (to, from, next) => {
  // if (to.meta && to.meta.disallowAuth) {
  //   if (store.getters['auth/loggedIn']) {
  //     next({
  //       path: '/',
  //     });
  //     return;
  //   }
  // }
  next();
};
