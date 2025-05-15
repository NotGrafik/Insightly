import { createRouter, createWebHistory } from 'vue-router'
import RegisterPage from '@/pages/RegisterPage.vue'
import LoginPage from '@/pages/LoginPage.vue'

const routes = [
  {
    path: '/auth/register',
    component: RegisterPage
  },
  {
    path: '/auth/login',
    component: LoginPage
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
