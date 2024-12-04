import { RouteRecordRaw } from 'vue-router';
/* import OrganogramPage from 'pages/OrganogramPage.vue'; */
import NewOrganogramPage from 'src/pages/NewOrganogramPage.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    children: [
      {
        path: '',
        component: NewOrganogramPage,
      },
    ],
  },
];

export default routes;
