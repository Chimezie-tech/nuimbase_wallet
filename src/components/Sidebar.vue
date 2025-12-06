<template>
  <div class="layout">
    <!-- SIDEBAR (Desktop fixed, iPad drawer only) -->
    <aside :class="['sidebar', { open: isOpen }]">
      <h2 class="logo">Nuimbase</h2>
      <ul class="menu">
        <li>
          <RouterLink to="/dashboard" class="menu-link" @click="closeSidebar">
            <i class="pi pi-wallet"></i> Wallet
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/send" class="menu-link" @click="closeSidebar">
            <i class="pi pi-send"></i> Transaction
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/change-pin" class="menu-link" @click="closeSidebar">
            <i class="pi pi-cog"></i> Settings
          </RouterLink>
        </li>
      </ul>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="content">
      <!-- BURGER (iPad only) -->
      <button class="burger" @click="toggleSidebar">
        <i class="pi pi-bars"></i>
      </button>
      <slot />
    </main>

    <!-- Overlay for iPad drawer -->
    <div v-if="isOpen" class="overlay" @click="closeSidebar"></div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import "primeicons/primeicons.css";

const router = useRouter();
const isOpen = ref(false);

const toggleSidebar = () => {
  isOpen.value = !isOpen.value;
};

const closeSidebar = () => {
  isOpen.value = false;
};

</script>

<style scoped>
.layout {
  display: flex;
}

/* -------------------------
   SIDEBAR BASE
-------------------------- */
.sidebar {
  width: 160px;
  height: 100vh;
  padding: 16px;
  background: #ffffff;
  color: #555;
  transition: all 0.3s ease;
}

.logo {
  margin-bottom: 24px;
  font-size: 14px;
  font-weight: 600;
}

.menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu li {
  margin: 14px 0;
}

.menu-link {
  display: flex;
  align-items: center;
  font-size: 12px;
  text-decoration: none;
  color: grey;
  gap: 8px;
  transition: 0.2s;
  background: none;
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
  padding: 8px 0;
}

.menu-link:hover {
  color: #1bac4b;
}

.logout-btn {
  font-family: inherit;
}

.overlay {
  display: none;
}

/* -------------------------
   MOBILE (NO SIDEBAR, NO BURGER)
-------------------------- */
@media (max-width: 767px) {
  .sidebar {
    display: none !important;
  }

  .burger {
    display: none !important;
  }

  .content {
    width: 100%;
    padding: 16px;
    flex: 1;
    margin-left: 0;
  }

  .overlay {
    display: none !important;
  }
}

/* -------------------------
   IPAD (DRAWER WITH BURGER)
-------------------------- */
@media (min-width: 768px) and (max-width: 1024px) {
  .sidebar {
    position: fixed;
    top: 0;
    right: 0;
    transform: translateX(100%);
    z-index: 1001;
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .content {
    width: 100%;
    padding: 20px;
    flex: 1;
    margin-left: 0;
  }

  .burger {
    position: fixed;
    top: 16px;
    right: 16px;
    font-size: 20px;
    background: transparent;
    border: none;
    cursor: pointer;
    z-index: 1100;
    display: block;
    color: #555;
  }

  .burger:hover {
    color: #1bac4b;
  }

  .overlay {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
  }
}

/* -------------------------
   DESKTOP (FIXED SIDEBAR, NO BURGER)
-------------------------- */
@media (min-width: 1025px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    transform: translateX(0);
  }

  .burger {
    display: none;
  }

  .content {
    margin-left: 160px;
    padding: 20px;
    flex: 1;
  }

  .overlay {
    display: none;
  }
}
</style>
