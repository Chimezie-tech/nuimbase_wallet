<template>
  <div class="py-8 overflow-hidden container">
    <div class="container mx-auto px-4 mb-6">
      <p class="text-gray-500 text-center text-sm">Seamlessly manage assets across multiple networks.</p>
    </div>

    <div class="carousel-mask relative w-full overflow-hidden text-center">
      <div class="flex w-fit animate-marquee hover:pause-animation">

        <div v-for="i in 2" :key="i" class="flex">
          <div
            v-for="(chain, index) in chains"
            :key="index"
            class="flex-shrink-0 mx-3 md:mx-6"
          >
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-3 flex flex-col items-center justify-center w-24 h-24 md:w-28 md:h-28 transition-transform hover:scale-105 hover:shadow-md cursor-default">
              <img :src="chain.logo" :alt="chain.name" class="h-10 w-10 mb-2 mx-auto" />
              <span class="text-xs font-semibold text-gray-700">{{ chain.name }}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const chains = ref([
  { name: 'Bitcoin', logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=029' },
  { name: 'Ethereum', logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=029' },
  { name: 'Binance SC', logo: 'https://cryptologos.cc/logos/bnb-bnb-logo.png?v=029' },
  { name: 'Polygon', logo: 'https://cryptologos.cc/logos/polygon-matic-logo.png?v=029' },
  { name: 'Solana', logo: 'https://cryptologos.cc/logos/solana-sol-logo.png?v=029' },
  { name: 'Avalanche', logo: 'https://cryptologos.cc/logos/avalanche-avax-logo.png?v=029' },
  { name: 'Tron', logo: 'https://cryptologos.cc/logos/tron-trx-logo.png?v=029' },
  { name: 'Litecoin', logo: 'https://cryptologos.cc/logos/litecoin-ltc-logo.png?v=029' },
  { name: 'Celo', logo: 'https://cryptologos.cc/logos/celo-celo-logo.png?v=029' }
]);
</script>

<style scoped>
.carousel-mask {
   -webkit-mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
   mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
}

@keyframes marquee {
  0% { transform: translateX(0%); }
  100% { transform: translateX(-50%); }
}

.animate-marquee {
  animation: marquee 30s linear infinite;
  will-change: transform;
}

.hover\:pause-animation:hover {
  animation-play-state: paused;
}
</style>
