import { RouteRecordRaw } from 'vue-router';
import OrganogramPage from 'src/pages/OrganogramPage.vue';
import LoginPage from 'src/pages/LoginPage.vue';
import ResetPasswordPage from 'src/pages/ResetPasswordPage.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: LoginPage,
  },
  {
    path: '/organogram',
    component: OrganogramPage,
  },
  {
    path: '/reset-password',
    component: ResetPasswordPage,
  },
];

export default routes;
