import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
]

// 暂时先不用ssr
const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
