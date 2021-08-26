import { createRouter, createWebHistory } from 'vue-router'
import Main from '@/views/Main'

const routes = [
  {
    path: '/',
    name: 'Main',
    component: Main
  },
  {
    path: '/Authorization',
    name: 'Authorization',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Authorization.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
