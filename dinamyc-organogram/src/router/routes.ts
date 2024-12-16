import { RouteRecordRaw } from 'vue-router';
import OrganogramPage from 'src/pages/OrganogramPage.vue';
import LoginPage from 'src/pages/LoginPage.vue';
import ResetPasswordPage from 'src/pages/ResetPasswordPage.vue';
import OrganogramDashboardPage from 'src/pages/OrganogramDashboardPage.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: LoginPage,
  },
  {
    path: '/dashboard',
    component: OrganogramDashboardPage,
  },
  {
    path: '/organogram/:id',
    component: OrganogramPage,
    props: true,
  },
  {
    path: '/reset-password',
    component: ResetPasswordPage,
  },
];

export default routes;
