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
        title: 'Nuimbase | Best Non-Custodial Multi-Chain Crypto Wallet | Best crypto wallets',
        description: 'Create a secure, non-custodial crypto wallet instantly. Nuimbase is the safest MetaMask alternative for managing Bitcoin, Ethereum, and DeFi assets with zero-fee internal transfers.'
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: {
        title: 'Secure Web3 Login | Enjoy unlimited access to free crypto wallets | Create unlimited crypto wallets | Web3, Blockchain, Swap, instant crypto transfers',
        description: 'Log in to your Nuimbase decentralised account. Securely manage your private keys and blockchain assets with military-grade encryption.'
      }
    },
    {
      path: '/dashboard',
      component: DashboardLayout,
      meta: { requiresAuth: true }, // THE FRONT DOOR SECURITY
      children: [
        {
          path: '',
          name: 'DashboardHome',
          component: CreateWallet,
          meta: {
            title: 'Crypto Portfolio Tracker | Real-Time BTC & ETH Price Dashboard | Manage your crypto wallets securely | Hybrid HD crypto wallets for free',
            description: 'Monitor your crypto portfolio in real-time. The Nuimbase dashboard provides live market analytics for Bitcoin, Ethereum, and multi-chain assets.'
          }
        },
        {
          path: 'send',
          alias: '/send',
          name: 'Send',
          component: Send,
          meta: {
            title: 'Send Crypto Instantly | Zero-Fee Bitcoin & Ethereum Transfers | Send unlimited crypto | Send and receive crypto instantly',
            description: 'Experience lightning-fast blockchain transactions. Send Bitcoin and Ethereum globally with optimized gas fees and instant confirmation on the Nuimbase network.'
          }
        },
        {
          path: 'change-pin',
          alias: '/change-pin',
          name: 'ChangePin',
          component: ChangePin,
          meta: {
            title: 'Advanced Wallet Security | Secure Your Private Keys & Assets | How to secure your wallets | Best secured crypto wallets 2026',
            description: 'Enhance your self-custody security. Update your encrypted PIN and manage multi-sig settings to protect your crypto from unauthorized access.'
          }
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound,
      meta: {
        title: '404 - Page Not Found | Nuimbase Crypto Help Center',
        description: 'The page you are looking for has moved or does not exist. Return to Nuimbase, the world\'s most secure non-custodial wallet.'
      }
    }
  ]
})

// --- THE MASTER SECURITY & SEO INJECTION GUARD ---
router.beforeEach(async (to, from, next) => {
  // 1. DATABASE SECURITY CHECK (Blocks deleted users immediately)
  const { data: { user }, error } = await supabase.auth.getUser();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && (!user || error)) {
    console.warn("Auth failure: Redirecting to secure login.");
    await supabase.auth.signOut();
    return next('/login');
  }

  // 2. DYNAMIC SEO TITLE INJECTION
  const defaultTitle = 'Nuimbase | Secure Multi-Chain Web3 Wallet';
  document.title = to.meta.title || defaultTitle;

  // 3. DYNAMIC SEO META DESCRIPTION INJECTION
  const defaultDesc = 'Nuimbase is a non-custodial crypto wallet designed for total security and ease of use. Manage BTC, ETH, and more.';
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

export default router;
