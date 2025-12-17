<template>
  <nav class="mobile-nav">
    <!-- Left items -->
    <RouterLink
      v-for="item in leftItems"
      :key="item.to"
      :to="item.to"
      class="nav-item"
      :class="{ active: route.path.startsWith(item.to) }"
    >
      <i :class="[item.icon, isDark ? 'text-white' : 'text-gray-800']"></i>
      <span>{{ item.label }}</span>
    </RouterLink>

    <!-- Right items -->
    <RouterLink
      v-for="item in rightItems"
      :key="item.to"
      :to="item.to"
      class="nav-item"
      :class="{ active: route.path.startsWith(item.to) }"
    >
      <i :class="[item.icon, isDark ? 'text-white' : 'text-gray-800']"></i>
      <span>{{ item.label }}</span>
    </RouterLink>
  </nav>
</template>

<script setup>
import { useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();

// Dark mode detection from <html class="dark-mode">
const isDark = computed(() =>
  document.documentElement.classList.contains("dark-mode")
);

// Split items for symmetry around the FAB
const leftItems = [
  { label: "Wallet", to: "/dashboard", icon: "pi pi-wallet" },
  { label: "Transaction", to: "/send", icon: "pi pi-send" },
  // { label: "Chat", to: "/chat", icon: "pi pi-send" },
];

const rightItems = [
  { label: "Settings", to: "/change-pin", icon: "pi pi-cog" },
];
</script>

<style scoped>
.mobile-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: var(--nav-bg, #ffffff);
  border-top: 1px solid #e5e5e5;
  display: none;
  justify-content: space-around;
  align-items: center;
  z-index: 2000;
}

/* Show only on mobile */
@media (max-width: 768px) {
  .mobile-nav {
    display: flex;
  }
}

.nav-item {
  flex: 1;
  text-align: center;
  padding-top: 10px;
  font-size: 10px;
  text-decoration: none;
  color: var(--nav-text, grey);
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.nav-item.active {
  color: #1bac4b;
  font-weight: 600;
}

.nav-item i {
  font-size: 1.2rem;
}

/* Floating Action Button */
.fab-wrapper {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
}

.fab {
  width: 55px;
  height: 55px;
  background: #1bac4b;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.3);
  animation: float 3s infinite ease-in-out;
  cursor: pointer;
}

/* Floating animation */
@keyframes float {
  0% {
    transform: translate(-50%, -2px);
  }
  50% {
    transform: translate(-50%, -10px);
  }
  100% {
    transform: translate(-50%, -2px);
  }
}

.fab i {
  font-size: 1.4rem;
}
</style>
