<template>
  <div class="error-page">
    <i class="ri-error-warning-line"></i>
    <h1>Oops! Page Not Found</h1>
    <p>The page you're looking for doesn't exist or you've been logged out.</p>
    <router-link to="/login" class="back-btn">Return to Login</router-link>
  </div>
</template>

<style scoped>
.error-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  color: #1f2937;
}
.error-page i { font-size: 80px; color: #1bac4b; }
.back-btn {
  margin-top: 20px;
  background: #1bac4b;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
}
</style>
