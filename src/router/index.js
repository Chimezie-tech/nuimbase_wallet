import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from "@/scripts/supabase";
import Home from '@/views/Home.vue'
import DashboardLayout from '@/layout/DashboardLayout.vue'
import CreateWallet from '@/views/CreateWallet.vue'
import Send from '@/views/Send.vue'
import ChangePin from '@/views/ChangePin.vue'
import NotFound from '@/views/NotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        title: 'Nuimbase | Best Non-Custodial Multi-Chain Crypto Wallet 2025',
        description: 'Securely manage, store, and send Bitcoin, Ethereum, and Altcoins with Nuimbase.'
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { title: 'Secure Web3 Login | Nuimbase' }
    },
    {
      path: '/dashboard',
      component: DashboardLayout,
      meta: { requiresAuth: true }, // THE FRONT DOOR
      children: [
        {
          path: '', // Matches /dashboard
          name: 'DashboardHome',
          component: CreateWallet,
          meta: { title: 'Dashboard | Nuimbase Wallet' }
        },
        {
          path: 'send', // Matches /dashboard/send
          name: 'Send',
          component: Send,
          meta: { title: 'Send Crypto Instantly | Nuimbase' }
        },
        {
          path: 'change-pin', // Matches /dashboard/change-pin
          name: 'Change pin',
          component: ChangePin,
          meta: { title: 'Security Settings | Nuimbase' }
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound,
      meta: { title: '404 Page Not Found | Nuimbase' }
    }
  ],
})

// --- THE FRONT DOOR GATEKEEPER ---
router.beforeEach(async (to, from, next) => {
  // 1. We ask the DATABASE (not the browser) if this user exists
  const { data: { user }, error } = await supabase.auth.getUser();

  // 2. We check if the route being accessed is /dashboard or any of its children
  const isDashboardRoute = to.matched.some(record => record.meta.requiresAuth);

  // 3. THE KICK OUT: If they are on a dashboard route BUT user is null/deleted
  if (isDashboardRoute && (!user || error)) {
    console.log("Access Denied: User does not exist in database.");

    // Wipe the fake session so they can't try again
    await supabase.auth.signOut();

    // Throw them out to Login immediately
    return next('/login');
  }

  // 4. SEO & TITLE LOGIC (Restored for high ranking)
  const defaultTitle = 'Nuimbase | Secure Crypto Wallet';
  document.title = to.meta.title || defaultTitle;

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && to.meta.description) {
    metaDesc.setAttribute('content', to.meta.description);
  }

  next();
});

export default router;
