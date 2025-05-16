import { createRouter, createWebHistory } from 'vue-router'
import RegisterPage from '@/pages/RegisterPage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import LandingPage from '@/pages/LandingPage.vue'
import HomePage from '@/pages/HomePage.vue'

const routes = [
  {
    path: '/',
    component: LandingPage
  },
  {
    path: '/auth/register',
    component: RegisterPage
  },
  {
    path: '/auth/login',
    component: LoginPage
  },
  {
    path: '/home',
    component: HomePage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
