<template>
  <!-- TOP NAV WRAPPER WITH BACKGROUND -->
  <div style="background-color: #1bac4b;">
    <nav class="navbar navbar-expand-lg navbar-light py-1">
      <div class="container">

        <!-- Logo -->
        <RouterLink
          class="navbar-brand"
          to="/"
          style="color: white; font-family: Poppins; font-weight: 600; font-size: 20px;"
        >
          Nuimbase
        </RouterLink>

        <!-- MOBILE MENU BUTTON -->
        <button
          class="navbar-toggler border-0"
          type="button"
          @click="toggleDrawer"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- DESKTOP MENU -->
        <div class="navbar-collapse d-none d-lg-block">
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
            <li class="nav-item"><a class="nav-link custom-link" href="#contact">Contact</a></li>
            <li class="nav-item"><a class="nav-link custom-link" href="#testimonial">Testimonials</a></li>
            <li class="nav-item"><a class="nav-link custom-link" href="#faq">Faq</a></li>
            <li class="nav-item"><a class="nav-link custom-link" href="#about">About</a></li>
          </ul>
        </div>

      </div>
    </nav>
  </div>

  <!-- MOBILE DRAWER OVERLAY -->
  <div
    v-if="drawer"
    class="drawer-overlay"
    @click="toggleDrawer"
  ></div>

  <!-- SLIDING MOBILE DRAWER -->
  <div
    class="drawer"
    :class="{ 'drawer-open': drawer }"
  >
    <div class="drawer-header">
      <h5>Menu</h5>
      <button class="btn-close" @click="toggleDrawer"></button>
    </div>

    <ul class="list-unstyled px-3">
      <li class="py-2"><a class="drawer-link" href="#contact" @click="toggleDrawer">Contact</a></li>
      <li class="py-2"><a class="drawer-link" href="#testimonial" @click="toggleDrawer">Testimonials</a></li>
      <li class="py-2"><a class="drawer-link" href="#fag" @click="toggleDrawer">Fag</a></li>
      <li class="py-2"><a class="drawer-link" href="#about" @click="toggleDrawer">About</a></li>
    </ul>
  </div>

</template>

<script setup>
import { ref } from "vue";

const drawer = ref(false);

function toggleDrawer() {
  drawer.value = !drawer.value;
}
</script>

<style scoped>
.custom-link {
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  font-family: Poppins;
  color: white !important;
}

.custom-link:hover {
  color: #094D72 !important;
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* --- DRAWER STYLES --- */
.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.45);
  backdrop-filter: blur(3px);
  z-index: 998;
}

.drawer {
  position: fixed;
  top: 0;
  right: -260px; /* hidden default */
  width: 200px;
  height: 100%;
  background: white;
  z-index: 999;
  transition: right 0.3s ease-in-out;
  padding-top: 20px;
  box-shadow: -2px 0 6px rgba(0,0,0,0.15);
}

.drawer-open {
  right: 0;
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
}

.drawer-link {
  font-size: 18px;
  font-family: Poppins;
  color: #1bac4b;
  text-decoration: none;
}

.drawer-link:hover {
  text-decoration: underline;
}

/* Make burger (navbar-toggler-icon) white with border */
.navbar-toggler {
  border: 2px solid white !important;
  border-radius: 6px;
  padding: 10px;
}

/* Custom white burger lines */
.navbar-toggler-icon {
  background-image: none !important;
  width: 24px;
  height: 6px;
  background-color: white !important;
  position: relative;
  display: block;
}

.navbar-toggler-icon::before,
.navbar-toggler-icon::after {
  content: "";
  position: absolute;
  left: 0;
  width: 24px;
  /* height: 4px; */
  background-color: white !important;
}

.navbar-toggler-icon::before {
  top: -7px;
}

.navbar-toggler-icon::after {
  top: 7px;
}

</style>

<style>
html { scroll-behavior: smooth; }
</style>
