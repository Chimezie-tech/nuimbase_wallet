<script setup lang="ts">
// Logic remains empty as per request
</script>

<template>
  <div class="container my-5 py-5">
    <div class="row align-items-center g-5">

      <div class="col-lg-5 col-md-12">
        <div class="pe-lg-4">
          <h2 class="brand-title mb-4">Why Choose Nuimbase?</h2>

          <p class="brand-text mb-4">
            We simplify the complexity of Blockchain. Whether you are a beginner or a Web3 expert,
            Nuimbase provides a secure, <strong>non-custodial environment</strong> to manage your digital assets.
          </p>

          <p class="brand-text mb-5">
            Powered by <strong>Tatum.io infrastructure</strong>, we ensure 99.9% uptime, accurate gas fee estimation,
            and military-grade encryption for your private keys.
          </p>
          <RouterLink to="/login" class="btn btn-brand-primary btn-lg px-5 py-3 fw-bold">
          <span>Generate Wallet</span>
          <i class="pi pi-arrow-right px-3"></i>
        </RouterLink>
        </div>
      </div>

      <div class="col-lg-7 col-md-12">
        <div class="row g-3">

          <div class="col-md-6 col-12">
            <div class="card h-100 border-brand p-4 brand-card">
              <div class="icon-box mb-3">
                <i class="bi bi-shield-lock-fill"></i>
              </div>
              <h5 class="card-title">Secure Wallet Creation</h5>
              <p class="card-text">
                Generate a <strong>non-custodial crypto wallet</strong> in seconds.
                We provide a 24-word mnemonic phrase that gives you 100% ownership
                of your private keys. No middleman, total control.
              </p>
            </div>
          </div>

          <div class="col-md-6 col-12">
            <div class="card h-100 border-brand p-4 brand-card">
              <div class="icon-box mb-3">
                <i class="bi bi-send-fill"></i>
              </div>
              <h5 class="card-title">Instant Transfers</h5>
              <p class="card-text">
                Send Bitcoin, Ethereum, and other assets instantly.
                Our smart algorithm calculates the <strong>lowest gas fees</strong>
                automatically, ensuring your transaction confirms quickly.
              </p>
            </div>
          </div>

          <div class="col-md-6 col-12">
            <div class="card h-100 border-brand p-4 brand-card">
              <div class="icon-box mb-3">
                <i class="bi bi-qr-code"></i>
              </div>
              <h5 class="card-title">Receive Globally</h5>
              <p class="card-text">
                Accept crypto payments from anywhere in the world.
                Generate secure <strong>multi-chain QR codes</strong>
                to receive funds directly into your wallet with real-time updates.
              </p>
            </div>
          </div>

          <div class="col-md-6 col-12">
            <div class="card h-100 border-brand p-4 brand-card">
              <div class="icon-box mb-3">
                <i class="bi bi-arrow-left-right"></i>
              </div>
              <h5 class="card-title">Swap & Manage</h5>
              <p class="card-text">
                Track your portfolio performance in real-time.
                Seamlessly swap tokens and monitor live market exchange rates.
                Your comprehensive dashboard for <strong>DeFi management</strong>.
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* BRAND COLOR: #1bac4b | RADIUS: 4px */

.brand-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  color: #2c3e50;
  line-height: 1.3;
}

.brand-text {
  font-family: 'Nunito', sans-serif;
  font-size: 16px;
  color: #4a4a4a;
  line-height: 1.7;
}

/* BUTTON: Strictly 4px Radius and Brand Green */
.btn-brand-primary {
  background-color: #1bac4b;
  border: none;
  color: white;
  border-radius: 4px;
  transition: opacity 0.2s;
}

.btn-brand-primary:hover {
  background-color: #158b3d;
  color: white;
  opacity: 0.9;
}

/* CARDS: Strictly 4px Radius and Green Accents */
.brand-card {
  border-radius: 4px;
  border: 1px solid #eee;
  transition: all 0.3s ease;
  background: #ffffff;
}

.brand-card:hover {
  border-color: #1bac4b;
  box-shadow: 0 4px 15px rgba(27, 172, 75, 0.1); /* Shadow using brand color */
  transform: translateY(-5px);
}

/* ICON STYLING: Ensuring visibility and #1bac4b color */
.icon-box {
  width: 48px;
  height: 48px;
  background-color: rgba(27, 172, 75, 0.1);
  color: #1bac4b;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 22px;
}

.icon-box i {
  line-height: 1;
}

.card-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 1.1rem;
  color: #2c3e50;
}

.card-text {
  font-family: 'Nunito', sans-serif;
  font-size: 14px;
  color: #6c757d;
  line-height: 1.6;
}

@media (max-width: 991px) {
  .text-lg-start { text-align: center !important; }
}
</style>
