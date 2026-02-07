import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/bureau',
      name: 'bureau',
      component: () => import('../views/Bureau.vue')
    },
    {
      path: '/actions',
      name: 'actions',
      component: () => import('../views/Actions.vue')
    },
    {
      path: '/galerie',
      name: 'galerie',
      component: () => import('../views/Galerie.vue')
    },
    {
      path: '/partners',
      name: 'partners',
      component: () => import('../views/Partners.vue')
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/Contact.vue')
    },
    {
      path: '/donate',
      name: 'donate',
      component: () => import('../views/Donate.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Register.vue')
    },
  ]
})

export default router
