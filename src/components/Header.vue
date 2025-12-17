<template>
  <div class="hero-container">
    <div class="hero-content">

      <!-- Right Card - Exchange Form (Brought to Front) -->
      <div class="exchange-section">
        <ExchangeCard />
      </div>

      <!-- Left Card - Text Content -->
      <div class="text-section">
        <h1 class="hero-title">
          Empowering the Future with Web3.
        </h1>

        <p class="hero-description">
          We provide wallet services. Create wallets, send & receive tokens instantly. Enjoy our finance features powered by
          <span class="brand-highlight">Nuimbase</span>.
        </p>

        <RouterLink to="/login" class="cta-button">
          <span>Start Now</span>
          <i class="pi pi-arrow-right"></i>
        </RouterLink>

        <!-- Feature Pills -->
        <div class="feature-pills">
          <div class="pill">
            <i class="pi pi-shield"></i>
            <span>Secure</span>
          </div>
          <div class="pill">
            <i class="pi pi-bolt"></i>
            <span>Fast</span>
          </div>
          <div class="pill">
            <i class="pi pi-verified"></i>
            <span>Trusted</span>
          </div>
        </div>
      </div>

    </div>

    <!-- Decorative Background Elements -->
    <div class="bg-decoration decoration-1"></div>
    <div class="bg-decoration decoration-2"></div>
    <div class="bg-decoration decoration-3"></div>
  </div>
</template>

<script setup lang="js">
import ExchangeCard from './ExchangeCard.vue';
import 'primeicons/primeicons.css';
</script>

<style scoped>
.hero-container {
  min-height: calc(100vh - 80px);
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  position: relative;
  z-index: 2;
}

/* Exchange Card Section (Right - Now First in Order) */
.exchange-section {
  order: 2;
  animation: slideInRight 0.8s ease-out;
}

/* Text Content Section (Left) */
.text-section {
  order: 1;
  animation: slideInLeft 0.8s ease-out;
}

.hero-title {
  font-family: 'Poppins', sans-serif;
  font-size: 42px;
  font-weight: 700;
  color: #111827;
  line-height: 1.2;
  margin-bottom: 20px;
}

.hero-description {
  font-family: 'Nunito', sans-serif;
  font-size: 12px;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 30px;
  font-family: Poppins;
}

.brand-highlight {
  color: #1bac4b;
  font-weight: 600;
}

/* CTA Button */
.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #1bac4b;
  color: white;
  text-decoration: none;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 16px;
  border-radius: 4px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(27, 172, 75, 0.3);
}

.cta-button:hover {
  background: #159a43;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(27, 172, 75, 0.4);
  color: white;
}

.cta-button i {
  transition: transform 0.3s ease;
}

.cta-button:hover i {
  transform: translateX(4px);
}

/* Feature Pills */
.feature-pills {
  display: flex;
  gap: 12px;
  margin-top: 40px;
  flex-wrap: wrap;
}

.pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.pill i {
  color: #1bac4b;
  font-size: 16px;
}

/* Decorative Background Elements */
.bg-decoration {
  position: absolute;
  border-radius: 50%;
  opacity: 0.6;
  z-index: 1;
}

.decoration-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(27, 172, 75, 0.15) 0%, transparent 70%);
  top: -100px;
  right: -100px;
  animation: float 6s ease-in-out infinite;
}

.decoration-2 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(27, 172, 75, 0.1) 0%, transparent 70%);
  bottom: -80px;
  left: -80px;
  animation: float 8s ease-in-out infinite reverse;
}

.decoration-3 {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(27, 172, 75, 0.08) 0%, transparent 70%);
  top: 50%;
  left: 30%;
  animation: float 10s ease-in-out infinite;
}

/* Animations */
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* Responsive Design */
@media (max-width: 992px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .exchange-section {
    order: 1;
  }

  .text-section {
    order: 2;
    text-align: center;
  }

  .hero-title {
    font-size: 32px;
  }

  .feature-pills {
    justify-content: center;
  }

  .cta-button {
    display: flex;
    justify-content: center;
  }
}

@media (max-width: 576px) {
  .hero-container {
    padding: 20px 16px;
    margin-bottom: 80px;
  }

  .hero-title {
    font-size: 28px;
  }

  .hero-description {
    font-size: 15px;
  }

  .feature-pills {
    gap: 8px;
  }

  .pill {
    padding: 8px 14px;
    font-size: 13px;
  }
}
</style>
