import { RouteRecordRaw } from 'vue-router';
import OrganogramPage from 'src/pages/OrganogramPage.vue';
import LoginPage from 'src/pages/LoginPage.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: LoginPage,
  },
  {
    path: '/organogram',
    component: OrganogramPage,
  },
];

export default routes;
