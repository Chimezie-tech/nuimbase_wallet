<template>
  <div class="dashboard-container">
    <Sidebar class="sidebar-wrapper" />

    <div class="main-content">
      <Topbar />
      <router-view />

      <!-- Mobile Bottom Nav -->
      <MobileNavbar />
    </div>
  </div>
</template>

<script setup>
import Sidebar from '../components/Sidebar.vue'
import Topbar from '../components/Topbar.vue'
import MobileNavbar from '../components/MobileNavbar.vue'

</script>

<style scoped>
.dashboard-container {
  display: flex;
  height: 100vh;
  margin: 0;
  padding: 0;
}

.sidebar-wrapper {
  flex-shrink: 0;
}

.main-content {
  flex: 1;
  background: var(--body-bg, white);
  padding: 20px;
  overflow-y: auto;
}

/* -------------------------
   MOBILE (HIDE SIDEBAR)
-------------------------- */
@media (max-width: 767px) {
  .sidebar-wrapper {
    display: none !important; /* Hide sidebar completely on mobile */
  }

  .dashboard-container {
    margin: 0;
    padding: 0;
  }

  .main-content {
    width: 100%;
    margin-left: 0;
    padding: 16px;
  }
}

/* -------------------------
   IPAD (HIDE SIDEBAR - IT'S A DRAWER IN SIDEBAR COMPONENT)
-------------------------- */
@media (min-width: 768px) and (max-width: 1024px) {
  .sidebar-wrapper {
    display: none; /* Hide the static sidebar, drawer is handled inside Sidebar component */
  }

  .main-content {
    width: 100%;
    margin-left: 0;
    padding: 20px;
  }
}

/* -------------------------
   DESKTOP (SHOW SIDEBAR)
-------------------------- */
@media (min-width: 1025px) {
  .sidebar-wrapper {
    display: block;
  }

  .main-content {
    margin-left: 0;
    padding: 20px;
  }
}
</style>
