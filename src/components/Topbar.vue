<template>
  <header class="topbar">
    <DarkModeToggle />

    <div class="right">
        <button @click="handleLogout" class="menu-link logout-btn" style="font-family: Poppins; font-size: 14px;">
            <i class="pi pi-sign-out" style="font-size: 14px;"></i> Logout
          </button>
    </div>
  </header>
</template>

<script setup>
import DarkModeToggle from "./DarkModeToggle.vue";
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { supabase } from "@/scripts/supabase";
import "primeicons/primeicons.css";

const router = useRouter();
const isOpen = ref(false);

const handleLogout = async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Logout error:', error.message);
      alert('Failed to logout. Please try again.');
      return;
    }

    router.push('/login');
  } catch (err) {
    console.error('Unexpected logout error:', err);
    alert('An unexpected error occurred during logout.');
  }
};
</script>

<style scoped>
.topbar {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: var(--topbar-bg, #ffffff);
  border-bottom: 1px solid #ddd;
}

.user {
  font-weight: bold;
}
</style>
