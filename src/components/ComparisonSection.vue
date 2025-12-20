<script setup lang="ts">
// Component focuses on high-conviction comparison data
</script>

<template>
  <section class="py-4 bg-white">
    <div class="container py-1">
      <div class="text-center mb-5">
        <h2 class="display-6 fw-bold mt-2" style="color: #2c3e50;">How Nuimbase Outperforms</h2>
        <p class="text-muted mx-auto" style="max-width: 600px;">
          We compared Nuimbase against traditional exchanges and standard wallets.
          The results show a clear advantage in speed, cost, and security.
        </p>
      </div>

      <div class="table-responsive" style="border-radius: 4px; border: 1px solid #eee;">
        <table class="table table-borderless align-middle mb-0">
          <thead class="bg-light">
            <tr style="border-bottom: 2px solid #eee;">
              <th class="p-4 text-dark fw-bold" style="width: 30%;">Feature</th>
              <th class="p-4 text-muted fw-normal" style="width: 23%;">Centralized Exchanges</th>
              <th class="p-4 text-muted fw-normal" style="width: 23%;">Generic Wallets</th>
              <th class="p-4 text-brand fw-bold" style="width: 24%; background-color: rgba(27, 172, 75, 0.03);">
                Nuimbase Advantage
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="p-4 fw-bold">Private Key Ownership</td>
              <td class="p-4 text-muted"><i class="bi bi-x-circle me-2"></i> Custodial (They own it)</td>
              <td class="p-4 text-muted"><i class="bi bi-check2 me-2"></i> Non-Custodial</td>
              <td class="p-4 text-brand fw-bold brand-cell">
                <i class="bi bi-shield-check me-2"></i> 100% Self-Custody
              </td>
            </tr>
            <tr>
              <td class="p-4 fw-bold">Network Fees</td>
              <td class="p-4 text-muted">Fixed & High Markups</td>
              <td class="p-4 text-muted">Standard Estimates</td>
              <td class="p-4 text-brand fw-bold brand-cell">
                <i class="bi bi-graph-down me-2"></i> Real-time Low-Gas Optimization
              </td>
            </tr>
            <tr>
              <td class="p-4 fw-bold">Settlement Speed</td>
              <td class="p-4 text-muted">Delayed (Manual Review)</td>
              <td class="p-4 text-muted">Network Dependent</td>
              <td class="p-4 text-brand fw-bold brand-cell">
                <i class="bi bi-lightning-charge me-2"></i> Instant Chain Execution
              </td>
            </tr>
            <tr>
              <td class="p-4 fw-bold">Regional Fiat Rails</td>
              <td class="p-4 text-muted">Complex / Restricted</td>
              <td class="p-4 text-muted">Not Supported</td>
              <td class="p-4 text-brand fw-bold brand-cell">
                <i class="bi bi-globe-central-south-asia me-2"></i> Optimized for Local Markets
              </td>
            </tr>
            <tr>
              <td class="p-4 fw-bold">Uptime & Reliability</td>
              <td class="p-4 text-muted">Prone to Maintenance</td>
              <td class="p-4 text-muted">Variable</td>
              <td class="p-4 text-brand fw-bold brand-cell">
                <i class="bi bi-cpu me-2"></i> 99.9% Tatum® Backed
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-5 text-center p-5 brand-cta-box">
        <h3 class="fw-bold mb-3">Stop overpaying and start owning.</h3>
        <p class="mb-4 opacity-75">Join the next generation of financial sovereignty with Nuimbase.</p>
        <RouterLink to="/login" class="btn btn-brand-light btn-lg px-5 py-3 fw-bold">
          <span>Enjoy Low Fee Transactions</span>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* BRAND COLOR: #1bac4b */

.text-brand {
  color: #1bac4b !important;
}

.brand-tag {
  background-color: rgba(27, 172, 75, 0.1);
  color: #1bac4b;
  padding: 6px 14px;
  font-size: 0.8rem;
  font-weight: 800;
  border-radius: 4px; /* STRICT 4PX */
  letter-spacing: 1px;
}

/* Table Enhancements */
.brand-cell {
  background-color: rgba(27, 172, 75, 0.03);
}

tr {
  border-bottom: 1px solid #f5f5f5;
}

/* CTA Box using brand colors */
.brand-cta-box {
  background-color: #1bac4b;
  color: white;
  border-radius: 4px; /* STRICT 4PX */
}

.btn-brand-light {
  background-color: white;
  color: #1bac4b;
  border: none;
  border-radius: 4px; /* STRICT 4PX */
  transition: all 0.3s ease;
}

.btn-brand-light:hover {
  background-color: #f8f9fa;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

/* Icon Colors within the table */
.bi-check2, .bi-shield-check, .bi-lightning-charge, .bi-graph-down, .bi-globe-central-south-asia, .bi-cpu {
  color: #1bac4b;
  font-size: 1.1rem;
}

.bi-x-circle {
  color: #999;
}

@media (max-width: 768px) {
  .display-6 { font-size: 1.75rem; }
}
</style>
