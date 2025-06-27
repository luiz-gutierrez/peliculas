import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'peliculas',
    component: () => import('../views/pelisView.vue') // Cambiado a "views"
  },
  {
    path: '/likes',
    name: 'likes',
    component: () => import('../views/likesView.vue') // Cambiado a "views"
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router