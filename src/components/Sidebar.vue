<template>
  <div class="layout">
    <!-- SIDEBAR (Desktop fixed, iPad drawer only) -->
    <aside :class="['sidebar', { open: isOpen }]">

      <!-- Brand Logo -->
      <div class="logo-area">
        <h2 class="logo-text">Nuimbase</h2>
      </div>

      <ul class="menu">
        <li>
          <!-- Wallet Link -->
          <RouterLink
            to="/dashboard"
            class="menu-link"
            active-class="active-link"
            @click="closeSidebar"
          >
            <i class="pi pi-wallet"></i>
            <span>Wallet</span>
          </RouterLink>
        </li>
        <li>
          <!-- Transaction Link -->
          <RouterLink
            to="/send"
            class="menu-link"
            active-class="active-link"
            @click="closeSidebar"
          >
            <i class="pi pi-send"></i>
            <span>Transaction</span>
          </RouterLink>
        </li>
        
        <li>
          <!-- Settings Link -->
          <RouterLink
            to="/change-pin"
            class="menu-link"
            active-class="active-link"
            @click="closeSidebar"
          >
            <i class="pi pi-shield"></i>
            <span>Settings</span>
          </RouterLink>
        </li>
      </ul>
    </aside>

    <!-- BURGER (iPad/Mobile Logic Handled via Overlay) -->
    <div v-if="isOpen" class="overlay" @click="closeSidebar"></div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";
import "primeicons/primeicons.css";

const isOpen = ref(false);
const closeSidebar = () => { isOpen.value = false; };
</script>

<style scoped>
/* SIDEBAR BASE */
.sidebar {
  width: 160px;
  height: 100vh;
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
  z-index: 1001;

  /* Fixed position ensures it stays on left while scrolling */
  position: fixed;
  top: 0;
  left: 0;
}

/* LOGO AREA */
.logo-area {
  height: 60px;
  display: flex;
  align-items: center;
  padding-left: 20px;
  border-bottom: 1px solid #f3f4f6;
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  color: #1bac4b;
  margin: 0;
  font-family: 'Poppins', sans-serif;
}

/* MENU */
.menu {
  list-style: none;
  padding: 20px 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.menu-link {
  display: flex;
  align-items: center;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  color: #64748b;
  padding: 12px 20px;
  transition: all 0.2s ease;
  border-right: 3px solid transparent; /* Placeholder for active border */
}

.menu-link i {
  font-size: 16px;
  margin-right: 10px;
}

.menu-link:hover {
  color: #1bac4b;
  background: #f8fafc;
}

/* --- ACTIVE STATE --- */
/* Vue Router applies this class automatically to the active route */
.active-link {
  color: #1bac4b !important;
  background: #f0fdf4; /* Very light green bg */
  border-right-color: #1bac4b; /* Brand border on right */
  font-weight: 600;
}

/* -------------------------
   RESPONSIVE LOGIC
-------------------------- */

@media (max-width: 767px) {
  .sidebar { display: none !important; }
}

@media (min-width: 768px) and (max-width: 1024px) {
  .sidebar {
    transform: translateX(-100%);
    box-shadow: 2px 0 10px rgba(0,0,0,0.1);
  }
  .sidebar.open { transform: translateX(0); }

  .overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000;
  }
}

@media (min-width: 1025px) {
  .sidebar {
    transform: translateX(0);
    box-shadow: none;
  }
  .overlay { display: none; }
}
</style>
