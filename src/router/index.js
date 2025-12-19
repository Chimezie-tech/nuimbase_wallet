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
        description: 'Securely manage, store, and send Bitcoin, Ethereum, and Altcoins with Nuimbase. The premier non-custodial Web3 wallet for instant, low-fee decentralized finance.'
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: {
        title: 'Secure Web3 Login | Access Your Nuimbase Crypto Vault',
        description: 'Log in to your encrypted Nuimbase account. Access your private keys, manage digital assets, and execute secure blockchain transactions.'
      }
    },
    {
      path: '/dashboard',
      component: DashboardLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'DashboardHome',
          component: CreateWallet,
          meta: {
            title: 'Crypto Portfolio Dashboard | Real-Time Market Tracking Nuimbase',
            description: 'Track real-time Bitcoin (BTC) and Ethereum (ETH) prices. Manage your multi-chain portfolio with our advanced Web3 dashboard technology.'
          }
        },
        {
          path: 'send',
          name: 'Send',
          component: Send,
          meta: {
            title: 'Send Crypto Instantly | Zero-Fee Bitcoin & Ethereum Transfers',
            description: 'Experience lightning-fast crypto transfers. Send BTC and ETH globally with optimized gas fees and instant blockchain confirmation on Nuimbase.'
          }
        },
        {
          path: 'change-pin',
          name: 'Change pin',
          component: ChangePin,
          meta: {
            title: 'Advanced Wallet Security | Nuimbase Encrypted Pin Protection',
            description: 'Strengthen your wallet security. Update your encrypted PIN and manage multi-signature settings for maximum asset protection.'
          }
        }
      ]
    },
    {
      path: '/overview',
      name: 'Overview',
      component: () => import('@/views/Overview.vue'),
      meta: {
        requiresAuth: true,
        title: 'Asset Overview | Deep Analytics for Your Crypto Holdings',
        description: 'Get a comprehensive view of your crypto balance, asset distribution, and historical transaction data on the Nuimbase network.'
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound,
      meta: {
        title: '404 Page Not Found | Nuimbase Support',
        description: 'The requested page was not found. Return to Nuimbase to continue managing your secure crypto assets.'
      }
    },
  ],
})

// --- THE MASTER GUARD: AUTH + MAX SEO ---
router.beforeEach(async (to, from, next) => {
  // 1. STRICT AUTH CHECK (Verifies if user was deleted from DB)
  const { data: { user }, error } = await supabase.auth.getUser();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && (!user || error)) {
    await supabase.auth.signOut(); // Wipes local storage ghost sessions
    return next('/login');
  }

  // 2. SEO INJECTION (Titles)
  const defaultTitle = 'Nuimbase | Secure Non-Custodial Crypto Wallet';
  document.title = to.meta.title || defaultTitle;

  // 3. SEO INJECTION (Meta Descriptions)
  const defaultDesc = 'Manage your Bitcoin, Ethereum, and digital assets with Nuimbase—the most secure, decentralized multi-chain wallet.';
  const descriptionContent = to.meta.description || defaultDesc;

  let metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute('content', descriptionContent);
  } else {
    const meta = document.createElement('meta');
    meta.name = "description";
    meta.content = descriptionContent;
    document.head.appendChild(meta);
  }

  next();
});

export default router
