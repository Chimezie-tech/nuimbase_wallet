<template>
  <button @click="toggleDark" class="toggle-btn">
    {{ isDark ? " Dark" : " Light" }}
  </button>
</template>

<script setup>
import { ref } from "vue";

const isDark = ref(false);

function toggleDark() {
  isDark.value = !isDark.value;

  document.documentElement.classList.toggle("dark-mode");
}
</script>

<style scoped>
.toggle-btn {
  padding: 6px 14px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 14px;
}
</style>
