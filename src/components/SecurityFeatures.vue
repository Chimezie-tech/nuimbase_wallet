<template>
  <section class="py-16 bg-white">
    <div class="container mx-auto px-6">

      <div class="text-center max-w-2xl mx-auto mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style="font-family: 'Poppins', sans-serif;">
          Your Security is Our Priority
        </h2>
        <p class="text-gray-600 text-lg" style="font-family: 'Nunito', sans-serif;">
          Nuimbase is a non-custodial wallet. We provide the tools, but you hold the power.
          No middleman, no counterparty risk.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">

        <div class="group p-8 border border-gray-100 bg-gray-50 transition-all hover:border-brand hover:-translate-y-2 card-radius">
          <div class="w-14 h-14 bg-brand flex items-center justify-center mb-6 card-radius shadow-brand-soft">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-3" style="font-family: 'Poppins', sans-serif;">True Self-Custody</h3>
          <p class="text-gray-600 leading-relaxed text-sm" style="font-family: 'Nunito', sans-serif;">
            Your private keys are encrypted directly on your device. Nuimbase never sees, stores, or has access to your funds.
          </p>
        </div>

        <div class="group p-8 border border-gray-100 bg-gray-50 transition-all hover:border-brand hover:-translate-y-2 card-radius">
          <div class="w-14 h-14 bg-brand flex items-center justify-center mb-6 card-radius shadow-brand-soft">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-3" style="font-family: 'Poppins', sans-serif;">24-Word Security</h3>
          <p class="text-gray-600 leading-relaxed text-sm" style="font-family: 'Nunito', sans-serif;">
            We use the global BIP39 standard. Your 24-word recovery phrase ensures you can recover your wallet on any major platform.
          </p>
        </div>

        <div class="group p-8 border border-gray-100 bg-gray-50 transition-all hover:border-brand hover:-translate-y-2 card-radius">
          <div class="w-14 h-14 bg-brand flex items-center justify-center mb-6 card-radius shadow-brand-soft">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-3" style="font-family: 'Poppins', sans-serif;">Local Encryption</h3>
          <p class="text-gray-600 leading-relaxed text-sm" style="font-family: 'Nunito', sans-serif;">
            Every transaction requires your authorization. Your wallet is protected by AES-256 encryption and device-level security.
          </p>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
/* BRAND COLOR: #1bac4b | RADIUS: 4px */
.bg-brand {
  background-color: #1bac4b !important;
}

.hover\:border-brand:hover {
  border-color: #1bac4b !important;
}

.card-radius {
  border-radius: 4px !important;
}

/* Subtle brand shadow for the icon boxes */
.shadow-brand-soft {
  box-shadow: 0 4px 10px rgba(27, 172, 75, 0.2);
}

/* Ensure icons are centered and clear */
svg {
  display: block;
}

/* Remove default Tailwind rounded-3xl if necessary via priority */
.group {
  border-radius: 4px !important;
}
</style>
