import { RouteRecordRaw } from 'vue-router';
import OrganogramPage from 'pages/OrganogramPage.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    children: [
      {
        path: '',
        component: OrganogramPage,
      },
    ],
  },
];

export default routes;
