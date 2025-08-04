import { createRouter, createWebHistory } from 'vue-router'
import RegisterPage from '@/pages/RegisterPage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import LandingPage from '@/pages/LandingPage.vue'
import HomePage from '@/pages/HomePage.vue'
import MySurveyPage from '@/pages/MySurveyPage.vue'
import CreateSurvey from '@/pages/CreateSurvey.vue'
import Survey from '@/pages/Survey.vue'
import AccountPage from '@/pages/AccountPage.vue'
import Cookies from 'js-cookie'

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
    component: HomePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/me/survey',
    component: MySurveyPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/me/survey/create',
    component: CreateSurvey,
    meta: { requiresAuth: true }
  },
  {
    path: '/survey/:id',
    component: Survey,
    meta: { requiresAuth: true }
  },
  {
    path: '/me',
    component: AccountPage,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


import { API_BASE_URL } from '@/constants/url'

router.beforeEach(async (to, from, next) => {
  const publicPages = ['/auth/login', '/auth/register'];
  const isPublic = publicPages.includes(to.path);

  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      credentials: 'include',
    });

    if (response.ok) {
      if (isPublic) return next('/home'); 
      return next(); // OK
    } else {
      if (!isPublic) return next('/auth/login');
      return next();
    }
  } catch (error) {
    if (!isPublic) return next('/auth/login');
    return next();
  }
});

export default router
