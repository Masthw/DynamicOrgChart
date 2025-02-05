import { RouteRecordRaw } from 'vue-router';
import OrgChartPage from 'src/views/OrgChartPage.vue';
import DefaultLayout from 'layouts/DefaultLayout.vue';
import HomePage from '../views/HomePage.vue';
import CreateOrgChartPage from 'src/views/CreateOrgChartPage.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        component: HomePage,
      },
      {
        path: '/orgchart/:id',
        component: OrgChartPage,
        props: true,
      },
    ],
  },
  {
    path: '/orgchart/create',
    component: CreateOrgChartPage,
  },
];

export default routes;
