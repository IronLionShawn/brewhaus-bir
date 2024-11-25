import BreweryDetail from '@/views/BreweryDetailPage.vue';
// import BreweryPage from '@/views/BreweryPage.vue';
// import BreweryPageO from '@/views/BreweryPageO.vue';
import { createRouter, createWebHistory } from '@ionic/vue-router';
// import { defineAsyncComponent } from 'vue';
import { RouteRecordRaw } from 'vue-router';

export const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    redirect: '/breweries'
  },
  {
    path: '/breweries/',
    component: () => import ('../views/BreweryPage.vue')
    // component: BreweryPageO
  },
  {
    path: '/brewery/:id',
    // component: defineAsyncComponent(() => import('../views/BreweryDetail.vue'))
    component: BreweryDetail
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});


export default router;
