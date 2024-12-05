import { RouteRecordRaw } from 'vue-router';
/* import OrganogramPage from 'pages/OrganogramPage.vue'; */
import NewOrganogramPage from 'src/pages/NewOrganogramPage.vue';
import IndexPage from 'src/pages/IndexPage.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    children: [
      {
        path: '',
        component: NewOrganogramPage,
      },
      {
        path: 'novo',
        component: IndexPage,
      },
    ],
  },
];

export default routes;
