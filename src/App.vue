<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue';
import { useTheme } from '@/composables/useTheme';

const { initTheme } = useTheme();

onMounted(() => {
  initTheme();
});
</script>

<template>
  <div>
    <RouterView />
  </div>
</template>
