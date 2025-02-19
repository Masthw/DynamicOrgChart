import { RouteRecordRaw } from 'vue-router';
import OrgChartPage from 'src/views/OrgChartPage.vue';
import DefaultLayout from 'layouts/DefaultLayout.vue';
import HomePage from '../views/HomePage.vue';
import CreateOrgChartPage from 'src/views/CreateOrgChartPage.vue';
import PdfViewer from 'src/components/PdfViewer.vue';

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
      {
        path: 'orgchart/:id/view-changes',
        name: 'VisualizarAlteracoes',
        component: PdfViewer,
        props: (route) => ({
          pdfUrl: '/pdfs/alteracoes.pdf',
          id: route.params.id,
        }),
      },
      {
        path: 'orgchart/:id/view-ordinance',
        name: 'VisualizarPortaria',
        component: PdfViewer,
        props: (route) => ({
          pdfUrl: '/pdfs/portaria.pdf',
          id: route.params.id,
        }),
      },
    ],
  },
  {
    path: '/orgchart/create',
    component: CreateOrgChartPage,
  },
];

export default routes;
