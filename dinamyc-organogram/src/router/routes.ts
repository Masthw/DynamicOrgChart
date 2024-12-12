import { RouteRecordRaw } from 'vue-router';
import OrganogramPage from 'src/pages/OrganogramPage.vue';
import LoginPage from 'src/pages/LoginPage.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: LoginPage,
  },
  {
    path: '/',
    component: OrganogramPage,
  },
];

export default routes;
