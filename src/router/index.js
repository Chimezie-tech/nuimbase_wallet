import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import DashboardLayout from '@/layout/DashboardLayout.vue'
import CreateWallet from '@/views/CreateWallet.vue'
import Send from '@/views/Send.vue'
import ChangePin from '@/views/ChangePin.vue'
// import ChatScreen from '@/components/ChatScreen.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      // SEO DATA FOR HOME
      meta: {
        title: 'Nuimbase | Free Multi-Chain Wallet & Instant Crypto Transfers',
        description: 'Create a free non-custodial crypto wallet. Send Bitcoin & Ethereum instantly with low gas fees. Powered by Tatum.io technology.'
      }
    },

    {
      path: '/dashboard',
      component: DashboardLayout,
      children: [
        {
          path: '',
          name: 'DashboardHome',
          component: CreateWallet,
          // SEO DATA FOR DASHBOARD
          meta: {
            title: 'Manage Crypto Portfolio | Nuimbase',
            description: 'Secure dashboard to track real-time Bitcoin and Ethereum prices and manage your digital assets.'
          }
        },
        {
          path: '/send',
          name: 'Send',
          component: Send,
          // SEO DATA FOR SENDING
          meta: {
            title: 'Send Crypto Instantly | Low Fee Transfers',
            description: 'Send crypto to any address instantly. Optimized for low gas fees and fast blockchain confirmations.'
          }
        },
        // {
        //   path: '/chat',
        //   name: 'chat',
        //   component: ChatScreen,
        //   // SEO DATA FOR SENDING
        //   meta: {
        //     title: 'Send Crypto Instantly | Low Fee Transfers',
        //     description: 'Send crypto to any address instantly. Optimized for low gas fees and fast blockchain confirmations.'
        //   }
        // },
        {
          path: '/change-pin',
          name: 'Change pin',
          component: ChangePin,
          meta: {
            title: 'Security Settings | Nuimbase',
            description: 'Update your wallet security PIN.'
          }
        }
      ]
    },

    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: {
        title: 'Login to Nuimbase',
        description: 'Access your secure crypto wallet.'
      }
    },

    {
      path: '/home',
      name: 'Overview',
      component: () => import('@/views/Overview.vue'),
      meta: {
        title: 'Wallet Overview | Nuimbase',
        description: 'View your total crypto balance and asset distribution.'
      }
    },
  ],
})

// --- THE MAGIC PART ---
// This code runs automatically every time the user changes pages
router.beforeEach((to, from, next) => {

  // 1. Update the Tab Title
  const defaultTitle = 'Nuimbase | Secure Crypto Wallet';
  document.title = to.meta.title || defaultTitle;

  // 2. Update the Meta Description
  const defaultDesc = 'Create a free, secure crypto wallet with Nuimbase. Powered by Tatum.io.';
  const descriptionContent = to.meta.description || defaultDesc;

  // Find the meta tag
  let metaDesc = document.querySelector('meta[name="description"]');

  if (metaDesc) {
    // If tag exists, update it
    metaDesc.setAttribute('content', descriptionContent);
  } else {
    // If tag doesn't exist, create it (failsafe)
    const meta = document.createElement('meta');
    meta.name = "description";
    meta.content = descriptionContent;
    document.head.appendChild(meta);
  }

  next();
});

export default router
