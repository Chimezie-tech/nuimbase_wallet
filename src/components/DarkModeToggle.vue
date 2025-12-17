<template>
  <button
    @click="toggleTheme"
    class="theme-btn"
    :aria-label="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
  >
    <!-- Sun Icon -->
    <i v-if="!isDark" class="pi pi-sun text-yellow-500"></i>
    <!-- Moon Icon -->
    <i v-else class="pi pi-moon text-blue-300"></i>
  </button>
</template>

<script setup>
import { useTheme } from '@/composables/useTheme';

const { isDark, toggleTheme } = useTheme();
</script>

<style scoped>
.theme-btn {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.theme-btn:hover {
  background: var(--border-color);
  transform: rotate(15deg);
}

.theme-btn i {
  font-size: 1.1rem;
}
</style>
