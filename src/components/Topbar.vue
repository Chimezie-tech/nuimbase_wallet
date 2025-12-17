<template>
  <header class="topbar">

    <!-- Left: Brand (Mobile) -->
    <div class="brand-area">
      <span class="brand-text d-lg-none" style="color: white;">Nuimbase</span>
    </div>

    <!-- Right: Profile -->
    <div class="profile-container" ref="menuRef">
      <button class="profile-btn" @click="isOpen = !isOpen">
        <div class="avatar-circle">
          <i class="pi pi-user"></i>
        </div>
      </button>

      <!-- Dropdown -->
      <transition name="fade">
        <div v-if="isOpen" class="dropdown-menu">
          <div class="menu-item" @click="handleThemeToggle">
            <div class="icon-box">
              <i :class="isDark ? 'pi pi-sun' : 'pi pi-moon'"></i>
            </div>
            <span>{{ isDark ? 'Light Mode' : 'Dark Mode' }}</span>
          </div>
          <div class="divider"></div>
          <div class="menu-item text-red" @click="handleLogout">
            <div class="icon-box bg-red-50 text-red-500">
              <i class="pi pi-sign-out"></i>
            </div>
            <span class="text-red-500">Logout</span>
          </div>
        </div>
      </transition>

      <div v-if="isOpen" class="backdrop" @click="isOpen = false"></div>
    </div>
  </header>

  <!-- Spacer -->
  <div class="topbar-spacer d-lg-none"></div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "@/scripts/supabase";
import { useTheme } from "@/composables/useTheme";

const router = useRouter();
const isOpen = ref(false);
const { isDark, toggleTheme } = useTheme();

const handleThemeToggle = () => toggleTheme();

const handleLogout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    router.push('/login');
  } catch (err) {
    alert('Error logging out');
  }
};
</script>

<style scoped>
/* Ensure Padding doesn't expand width */
* { box-sizing: border-box; }

.topbar {
  height: 60px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;

  /* Hardcoded Brand Color */
  background-color: #1bac4b !important;
  color: white;

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;

  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

/* DESKTOP ADJUSTMENT */
@media (min-width: 1025px) {
  .topbar {
    left: 160px; /* Push past sidebar */
    width: calc(100% - 160px); /* Exact remaining width */
  }
  .brand-text { display: none; }
}

.brand-text {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 18px;
  color: white;
}

.profile-container { position: relative; }
.profile-btn { background: transparent; border: none; cursor: pointer; padding: 0; }

.avatar-circle {
  width: 36px; height: 36px; border-radius: 50%;
  background: white;
  color: #1bac4b;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}
.avatar-circle:hover { transform: scale(1.05); background: #f0fff4; }

.dropdown-menu {
  position: absolute; top: 50px; right: 0; width: 180px;
  background: #ffffff; border: 1px solid #e5e7eb; color: #333333;
  border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  padding: 8px; z-index: 1002; display: flex; flex-direction: column; gap: 4px;
}

.menu-item {
  display: flex; align-items: center; gap: 10px; padding: 10px;
  border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 500;
  color: #374151; transition: background 0.2s;
}
.menu-item:hover { background: #f3f4f6; }

.icon-box { width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 6px; }
.divider { height: 1px; background: #e5e7eb; margin: 4px 0; }
.text-red-500 { color: #ef4444 !important; }
.bg-red-50 { background: #fef2f2; }
.backdrop { position: fixed; inset: 0; z-index: 1001; cursor: default; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s, transform 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-10px); }
</style>
