import { createRouter, createWebHistory } from 'vue-router'
import RegisterPage from '@/pages/RegisterPage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import LandingPage from '@/pages/LandingPage.vue'
import HomePage from '@/pages/HomePage.vue'
import MySurveyPage from '@/pages/MySurveyPage.vue'
import CreateSurvey from '@/pages/CreateSurvey.vue'
import Survey from '@/pages/Survey.vue'
import AccountPage from '@/pages/AccountPage.vue'

const routes = [
  {
    path: '/',
    component: LoginPage
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
  },
  {
    path: '/me/survey',
    component: MySurveyPage
  },
  {
    path: '/me/survey/create',
    component: CreateSurvey
  },
  {
    path: '/survey/:id',
    component: Survey,
  },
  {
    path: '/me',
    component: AccountPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
