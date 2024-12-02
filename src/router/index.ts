import BreweryDetail from '@/views/BreweryDetailPage.vue';
import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

export const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    redirect: '/breweries'
  },
  {
    path: '/breweries/',
    component: () => import ('../views/BreweryPage.vue')
  },
  {
    path: '/brewery/:id',
    component: BreweryDetail
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});


export default router;
