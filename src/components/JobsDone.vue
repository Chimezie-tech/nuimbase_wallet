<script setup lang="ts">
// No logic needed, static data
</script>

<template>
  <div class="container py-5">

    <div class="text-center mb-5">
      <h2 style="font-family: Poppins; font-size: 30px; font-weight: 700;">Nuimbase by the Numbers</h2>
      <p class="opacity-75" style="font-family: Nunito; font-size: 16px;">
        Empowering the global Web3 ecosystem with secure, high-speed blockchain infrastructure.
      </p>
    </div>

    <div class="row text-center justify-content-center">

      <!-- KEYWORD: High Volume / Reliability -->
      <div class="col-6 col-md-3 mb-4">
        <div class="stat-box p-3">
          <h2 class="fw-bold" style="font-family: Poppins; font-size: 2.5rem;">2M+</h2>
          <p class="m-0 text-uppercase fw-semibold" style="font-family: Nunito; font-size: 14px; letter-spacing: 1px;">
            Transactions Processed
          </p>
        </div>
      </div>

      <!-- KEYWORD: Multi-Chain (Critical for your SEO) -->
      <div class="col-6 col-md-3 mb-4">
        <div class="stat-box p-3">
          <h2 class="fw-bold" style="font-family: Poppins; font-size: 2.5rem;">40+</h2>
          <p class="m-0 text-uppercase fw-semibold" style="font-family: Nunito; font-size: 14px; letter-spacing: 1px;">
            Blockchains Supported
          </p>
        </div>
      </div>

      <!-- KEYWORD: Community / Trust -->
      <div class="col-6 col-md-3 mb-4">
        <div class="stat-box p-3">
          <h2 class="fw-bold" style="font-family: Poppins; font-size: 2.5rem;">50k+</h2>
          <p class="m-0 text-uppercase fw-semibold" style="font-family: Nunito; font-size: 14px; letter-spacing: 1px;">
            Active Wallets
          </p>
        </div>
      </div>

      <!-- KEYWORD: Speed / Tatum Technology -->
      <div class="col-6 col-md-3 mb-4">
        <div class="stat-box p-3">
          <h2 class="fw-bold" style="font-family: Poppins; font-size: 2.5rem;">99.9%</h2>
          <p class="m-0 text-uppercase fw-semibold" style="font-family: Nunito; font-size: 14px; letter-spacing: 1px;">
            Network Uptime
          </p>
        </div>
      </div>

    </div>

  </div>
</template>

<style scoped>
/*
   Since this component is inside a Dark Green div in Home.vue,
   we use White Transparent borders to make it look premium.
*/
.stat-box {
  border: 1px solid rgba(255, 255, 255, 0.2); /* Subtle border */
  border-radius: 12px;
  transition: transform 0.3s ease, background-color 0.3s ease;
}

/* Hover Effect: Makes the numbers pop out when user moves mouse over */
.stat-box:hover {
  transform: translateY(-5px);
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
}

/* Ensure text is white (inheriting from Home.vue parent) but readable */
h2 {
  color: #fff;
}
p {
  color: rgba(255, 255, 255, 0.9);
}
</style>
