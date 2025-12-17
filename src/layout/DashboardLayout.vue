<template>
  <div class="dashboard-container">

    <!-- Sidebar -->
    <Sidebar class="sidebar-wrapper" />

    <!-- Main Content Area -->
    <div class="main-content">
      <Topbar />

      <!-- Content Wrapper -->
      <div class="page-content">
        <div class="content-container">
          <router-view />
        </div>
      </div>

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
/* GLOBAL RESET */
* { box-sizing: border-box; }

.dashboard-container {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background: var(--body-bg, #f8f9fa);
  overflow-x: hidden; /* Stops horizontal scrolling */
}

/* SIDEBAR WRAPPER */
.sidebar-wrapper {
  flex-shrink: 0;
  z-index: 1001;
}

/* MAIN CONTENT COLUMN */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  min-width: 0;
}

/* PAGE CONTENT WRAPPER */
.page-content {
  flex: 1;
  /* Default Padding (Mobile) */
  padding: 15px;
  padding-top: 80px; /* Clear Topbar */
  padding-bottom: 90px; /* Clear Bottom Nav */
}

/* INNER CONTAINER */
.content-container {
  width: 100%;
  margin: 0;
}

/* -------------------------
   MOBILE & TABLET (< 1025px)
-------------------------- */
@media (max-width: 1024px) {
  .sidebar-wrapper {
    display: none !important;
  }
  .main-content {
    width: 100%;
    margin-left: 0;
  }
}

/* -------------------------
   DESKTOP (>= 1025px)
-------------------------- */
@media (min-width: 1025px) {
 .sidebar-wrapper {
    display: block;
    width: 160px; /* This already reserves the space! */
  }

  .main-content {
    /* REMOVE or set this to 0 */
    margin-left: 0;

    /* 2. Let it fill remaining space naturally */
    width: auto;

    /* 3. Ensure it doesn't overflow */
    max-width: 100%;
  }

  .page-content {
    /* Reduce padding to bring content closer to sidebar as requested */
    padding: 20px;
    padding-top: 80px;
    padding-left: 20px; /* Tighter left spacing */
    padding-right: 20px;
  }
}
</style>
