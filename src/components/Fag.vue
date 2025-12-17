<script setup>
import { ref } from 'vue';

// 1. STATE MANAGEMENT
// We track which FAQ is currently open. null = all closed.
const openIndex = ref(null);

// 2. TOGGLE FUNCTION
// If clicking the same one, close it. Otherwise, open the new one.
const toggleFaq = (index) => {
  if (openIndex.value === index) {
    openIndex.value = null;
  } else {
    openIndex.value = index;
  }
};

// 3. SEO DATA (Kept your high-ranking keywords)
const faqs = [
  {
    question: "Is Nuimbase a secure, non-custodial wallet?",
    answer: "Yes. Nuimbase is 100% non-custodial. This means we do not have access to your funds. When you create a wallet, you generate a 12/24-word mnemonic phrase. Only you hold the private keys to your assets."
  },
  {
    question: "Are there any hidden fees for sending crypto?",
    answer: "Nuimbase is free to use. We do not charge subscription fees. When you send crypto, you only pay the Network Gas Fee required by the blockchain miners. Our smart algorithm ensures you get the lowest gas price."
  },
  {
    question: "What happens if I lose my phone or forget my PIN?",
    answer: "As long as you have your Secret Recovery Phrase (the 12/24 words you got when signing up), you can restore your wallet on any device using the 'Import Wallet' feature."
  },
  {
    question: "Which cryptocurrencies can I store and send?",
    answer: "We support a multi-chain environment including Bitcoin (BTC), Ethereum (ETH), and other major networks. Powered by Tatum.io infrastructure, we are constantly adding support for Web3 assets."
  },
  {
    question: "How long do transactions take to complete?",
    answer: "Most transactions are near-instant. However, speed depends on blockchain network congestion. We optimize gas fees to ensure your transactions are prioritized for fast confirmation."
  }
];
</script>

<template>
  <div class="d-flex justify-content-center align-items-center mb-5">
    <div class="container m-4" style="max-width: 800px; padding-top: 10px;">

      <!-- HEADER -->
      <div class="text-center mb-4">
        <h2 style="font-family: Poppins; font-weight: 700; color: #2c3e50;">
          Frequently Asked Questions
        </h2>
        <p class="text-muted" style="font-family: Nunito;">
          Everything you need to know about security, fees, and managing your assets.
        </p>
      </div>

      <!-- VUE ACCORDION (No Bootstrap JS) -->
      <div class="accordion-list">

        <div
          v-for="(item, index) in faqs"
          :key="index"
          class="custom-accordion-item mb-3 shadow-sm"
        >
          <!-- BUTTON -->
          <button
            @click="toggleFaq(index)"
            class="accordion-btn d-flex justify-content-between align-items-center w-100"
            :class="{ 'active': openIndex === index }"
          >
            <span style="text-align: left;">{{ item.question }}</span>

            <!-- Simple CSS Arrow that rotates -->
            <i class="bi bi-chevron-down transition-icon" :class="{ 'rotate': openIndex === index }"></i>
          </button>

          <!-- CONTENT (Animated via CSS) -->
          <div class="accordion-content" :class="{ 'is-open': openIndex === index }">
            <div class="p-3">
              <p class="m-0" style="font-family: Nunito; font-size: 14px; color: #555; line-height: 1.6;">
                {{ item.answer }}
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* 1. CONTAINER STYLING */
.custom-accordion-item {
  border: 1px solid #e9ecef;
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden; /* Important for the sliding animation */
}

/* 2. BUTTON STYLING */
.accordion-btn {
  background: #fff;
  border: none;
  padding: 18px 24px;
  font-family: 'Poppins', sans-serif;
  font-size: 15px;
  font-weight: 500;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
}

/* Active State (When Open) */
.accordion-btn.active {
  background-color: #E8F7ED;
  color: #29974D;
  font-weight: 600;
  box-shadow: inset 4px 0 0 #29974D; /* Green line on left */
}

/* 3. CONTENT ANIMATION (The "No Glitch" Magic) */
.accordion-content {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition: max-height 0.4s ease-out, opacity 0.4s ease-out;
  background-color: #fff;
}

/* When the class 'is-open' is added by Vue, these styles apply */
.accordion-content.is-open {
  max-height: 200px; /* Enough height to fit text, but limits animation range */
  opacity: 1;
}

/* 4. ICON ROTATION */
.transition-icon {
  transition: transform 0.3s ease;
  font-size: 12px;
}
.rotate {
  transform: rotate(180deg);
}

/* Responsive fix for very small screens */
@media (max-width: 576px) {
  .accordion-btn {
    font-size: 14px;
    padding: 15px 15px;
  }
}
</style>
