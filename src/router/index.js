import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import DashboardLayout from '@/layout/DashboardLayout.vue'
import CreateWallet from '@/views/CreateWallet.vue'
import Send from '@/views/Send.vue'
import ChangePin from '@/views/ChangePin.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },

    {
      path: '/dashboard',
      component: DashboardLayout,
      children: [
        { path: '', name: 'DashboardHome', component: CreateWallet },     // default dashboard page
        { path: '/send', name: 'Send', component: Send },
        {path: '/change-pin', name: 'Change pin', component: ChangePin}
      ]
    },

    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/auth/LoginView.vue'),
    },

    {
      path: '/home',
      name: 'Overview',
      component: () => import('@/views/Overview.vue'),
    },
  ],
})

export default router
