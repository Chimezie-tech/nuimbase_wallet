<script setup lang="ts">
// No script logic needed for this static component
</script>

<template>
  <div class="container my-5">

    <!-- Added 'g-4' to handle spacing cleanly between the Left and Right columns -->
    <div class="row align-items-center g-4">

      <!-- LEFT SIDE: The Core Value Proposition -->
      <!-- SEO Focus: General Brand Trust & Technology -->
      <div class="col-lg-5 col-md-12">
        <div class="p-3">
          <h2 style="font-family: Poppins; font-weight: 700; color: #2c3e50; line-height: 1.3;">
            Why Choose Nuimbase?
          </h2>
          <p class="mt-3 text-secondary" style="font-family: Nunito; font-size: 16px; line-height: 1.7;">
            We simplify the complexity of Blockchain. Whether you are a beginner or a Web3 expert,
            Nuimbase provides a secure, <strong>non-custodial environment</strong> to manage your digital assets.
          </p>
          <p class="text-secondary" style="font-family: Nunito; font-size: 16px; line-height: 1.7;">
            Powered by <strong>Tatum.io infrastructure</strong>, we ensure 99.9% uptime, accurate gas fee estimation,
            and military-grade encryption for your private keys.
          </p>
        </div>
      </div>

      <!-- RIGHT SIDE: The 4 Service Cards -->
      <div class="col-lg-7 col-md-12">
        <!-- Changed g-1 to g-3 to remove awkward tight gaps while keeping cards close -->
        <div class="row g-3">

          <!-- CARD 1: Create Wallet / Security -->
          <!-- Keywords: Non-custodial, Private Keys, Mnemonic -->
          <div class="col-md-6 col-12">
            <div class="card h-100 shadow-sm border-0 p-4 rounded-3 service-card">
              <div class="icon-box mb-3">
                <i class="bi bi-shield-lock-fill"></i>
              </div>
              <h5 class="card-title">Secure Wallet Creation</h5>
              <p class="card-text">
                Generate a <strong>non-custodial crypto wallet</strong> in seconds.
                We provide a 12-word mnemonic phrase that gives you 100% ownership
                of your private keys. No middleman, total control.
              </p>
            </div>
          </div>

          <!-- CARD 2: Send -->
          <!-- Keywords: Low Gas Fees, Instant Transfer -->
          <div class="col-md-6 col-12">
            <div class="card h-100 shadow-sm border-0 p-4 rounded-3 service-card">
              <div class="icon-box mb-3">
                <i class="bi bi-send-fill"></i>
              </div>
              <h5 class="card-title">Instant Transfers</h5>
              <p class="card-text">
                Send Bitcoin, Ethereum, and other assets instantly.
                Our smart algorithm calculates the <strong>lowest gas fees</strong>
                automatically, ensuring your transaction confirms quickly on the blockchain without overpaying.
              </p>
            </div>
          </div>

          <!-- CARD 3: Receive -->
          <!-- Keywords: Multi-chain, QR Code, Public Address -->
          <div class="col-md-6 col-12">
            <div class="card h-100 shadow-sm border-0 p-4 rounded-3 service-card">
              <div class="icon-box mb-3">
                <i class="bi bi-qr-code"></i>
              </div>
              <h5 class="card-title">Receive Globally</h5>
              <p class="card-text">
                Accept crypto payments from anywhere in the world.
                Generate secure <strong>multi-chain QR codes</strong> or public addresses
                to receive funds directly into your wallet with real-time balance updates.
              </p>
            </div>
          </div>

          <!-- CARD 4: Swap / Manage -->
          <!-- Keywords: Portfolio, Real-time rates -->
          <div class="col-md-6 col-12">
            <div class="card h-100 shadow-sm border-0 p-4 rounded-3 service-card">
              <div class="icon-box mb-3">
                <i class="bi bi-arrow-left-right"></i>
              </div>
              <h5 class="card-title">Swap & Manage</h5>
              <p class="card-text">
                Track your portfolio performance in real-time.
                Seamlessly swap tokens and monitor live market exchange rates.
                Your comprehensive dashboard for <strong>DeFi asset management</strong>.
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Icon Styling */
.icon-box {
  width: 45px;
  height: 45px;
  background-color: #E8F7ED;
  color: #29974D;
  border-radius: 12px; /* Soft square looks more modern than circle */
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
}

/* Typography Styling */
.card-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 16px;
  color: #2c3e50;
  margin-bottom: 10px;
}

.card-text {
  font-family: 'Nunito', sans-serif;
  font-size: 14px;
  color: #6c757d;
  line-height: 1.6; /* Improves readability of the denser text */
}

/* Card Hover Effect for better UX */
.service-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: #fff;
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .icon-box {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }
}
</style>
