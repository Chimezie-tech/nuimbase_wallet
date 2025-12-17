<template>
  <footer class="footer-bg pt-5 pb-4">
    <div class="container">

      <div class="row gy-4">

        <!-- BRAND COLUMN -->
        <div class="col-lg-4 col-md-12 mb-4">
          <a href="#" class="text-decoration-none">
            <h3 class="footer-brand mb-3">Nuimbase</h3>
          </a>
          <p class="footer-desc pe-lg-5">
            The secure, non-custodial crypto wallet for everyone.
            Manage Bitcoin, Ethereum, and Web3 assets with total control of your private keys.
          </p>
          <div class="d-flex gap-3 social-icons mt-4">
            <!-- Social Icons (Bootstrap Icons) -->
            <!-- <a href="#" class="social-link"><i class="bi bi-twitter-x"></i></a>
            <a href="#" class="social-link"><i class="bi bi-telegram"></i></a>
            <a href="#" class="social-link"><i class="bi bi-discord"></i></a>
            <a href="#" class="social-link"><i class="bi bi-linkedin"></i></a> -->
          </div>
        </div>

        <!-- NAVIGATION LINKS -->
        <div class="col-6 col-md-2 mb-3">
          <h5 class="footer-title">Platform</h5>
          <ul class="nav flex-column">
            <li class="nav-item mb-2"><a href="#about" class="footer-link">About Us</a></li>
            <li class="nav-item mb-2"><a href="#features" class="footer-link">Features</a></li>
            <li class="nav-item mb-2"><a href="#" class="footer-link">Security</a></li>
          </ul>
        </div>

        <!-- SUPPORT LINKS -->
        <div class="col-6 col-md-2 mb-3">
          <h5 class="footer-title">Support</h5>
          <ul class="nav flex-column">
            <li class="nav-item mb-2"><a href="#faq" class="footer-link">Help Center</a></li>
            <li class="nav-item mb-2"><a href="#contact" class="footer-link">Contact Support</a></li>
          </ul>
        </div>

        <!-- LEGAL LINKS -->
        <div class="col-6 col-md-2 mb-3">
          <h5 class="footer-title">Legal</h5>
          <ul class="nav flex-column">
            <li class="nav-item mb-2"><a href="#" class="footer-link">Privacy Policy</a></li>
            <li class="nav-item mb-2"><a href="#" class="footer-link">Terms of Service</a></li>
            <li class="nav-item mb-2"><a href="#" class="footer-link">Cookie Policy</a></li>
          </ul>
        </div>

      </div>

      <!-- DIVIDER -->
      <hr class="my-4 border-light opacity-25">

      <!-- BOTTOM COPYRIGHT & DISCLAIMER -->
      <div class="row align-items-center">
        <div class="col-md-12 text-center">
          <p class="footer-copy mb-2">
            &copy; 2025 Nuimbase. All rights reserved.
          </p>
          <p class="disclaimer-text">
            <strong>Disclaimer:</strong> Nuimbase is a non-custodial wallet provider. We do not have access to your funds or private keys.
            Cryptocurrency investments are subject to high market risk. Please do your own research before investing.
          </p>
        </div>
      </div>

    </div>
  </footer>
</template>

<script setup>
// No script logic needed for footer
</script>

<style scoped>
/* BACKGROUND */
.footer-bg {
  background-color: #1bac4b;
  color: white;
}

/* BRAND TYPOGRAPHY */
.footer-brand {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  color: white;
  letter-spacing: 1px;
}

.footer-desc {
  font-family: 'Nunito', sans-serif;
  font-size: 15px;
  line-height: 1.6;
  opacity: 0.9;
}

/* HEADINGS */
.footer-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 1.2rem;
  color: #fff;
}

/* LINKS */
.footer-link {
  font-family: 'Nunito', sans-serif;
  font-size: 15px; /* Increased from 12px for readability */
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  transition: all 0.2s ease;
  padding: 2px 0;
  display: block;
}

.footer-link:hover {
  color: white;
  transform: translateX(5px); /* Small movement effect */
  opacity: 1;
}

/* SOCIAL ICONS */
.social-link {
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-decoration: none;
  font-size: 18px;
  transition: background-color 0.3s ease;
}

.social-link:hover {
  background-color: white;
  color: #1bac4b; /* Brand color on hover */
}

/* DISCLAIMER TEXT */
.footer-copy {
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
}

.disclaimer-text {
  font-family: 'Nunito', sans-serif;
  font-size: 11px;
  opacity: 0.6;
  max-width: 800px;
  margin: 0 auto;
}
</style>
