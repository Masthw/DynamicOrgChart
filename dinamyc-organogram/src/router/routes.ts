import { RouteRecordRaw } from 'vue-router';
import OrgChartPage from 'src/pages/OrgChartPage.vue';
import LoginPage from 'src/pages/LoginPage.vue';
import ResetPasswordPage from 'src/pages/ResetPasswordPage.vue';
import OrgChartDashboardPage from 'src/pages/OrgChartDashboardPage.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: LoginPage,
  },
  {
    path: '/dashboard',
    component: OrgChartDashboardPage,
  },
  {
    path: '/orgchart/:id',
    component: OrgChartPage,
    props: true,
  },
  {
    path: '/reset-password',
    component: ResetPasswordPage,
  },
];

export default routes;
