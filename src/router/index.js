import { createRouter, createWebHistory } from 'vue-router'
import WorkTable from '@/views/WorkTable.vue';
import Authorization from '@/views/Authorization.vue';
import settings from '@/views/Settings.vue';
import UsersPage from '@/views/UsersPage.vue';


const routes = [
  {
    path: '/',
    name: 'WorkTable',
    component: WorkTable
  },
  {
    path: '/Authorization',
    name: 'Authorization',
    component: Authorization
  },
  {
    path: '/settings',
    name: 'settings',
    component: settings
  },
  {
    path: '/employee',
    name: 'UsersPage',
    component: UsersPage
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
