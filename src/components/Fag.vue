<script setup>
import { ref } from 'vue';

const openIndex = ref(null);

const toggleFaq = (index) => {
  openIndex.value = openIndex.value === index ? null : index;
};

// Expanded detailed FAQs to build high user trust
const faqs = [
  {
    question: "Is Nuimbase a secure, non-custodial wallet?",
    answer: "Absolutely. Nuimbase is architected as a strictly non-custodial environment. We do not store your private keys on any server. Upon registration, you generate a military-grade 12/24-word mnemonic phrase. This ensures that you, and only you, have sovereign control over your digital wealth."
  },
  {
    question: "How does the Tatum.io infrastructure benefit me?",
    answer: "By utilizing Tatum.io’s enterprise-grade infrastructure, Nuimbase offers 99.9% network uptime and real-time blockchain synchronization. Using their services allows us to provide institutional-grade reliability, ensuring your balances are always accurate and your transactions are broadcasted to the blockchain without delay."
  },
  {
    question: "Are there any hidden service fees?",
    answer: "No. Nuimbase is committed to financial transparency. We do not charge subscription or platform usage fees. The only cost incurred is the Network Gas Fee, which goes directly to blockchain miners. Our smart algorithm calculates the most efficient gas price in real-time to prevent you from overpaying."
  },
  {
    question: "What happens if I lose my device or forget my PIN?",
    answer: "Because Nuimbase is non-custodial, your assets are tied to your Secret Recovery Phrase, not your device. As long as you have your 12/24-word phrase safely stored offline, you can instantly restore your entire portfolio on any new device using our 'Import Wallet' protocol."
  },
  {
    question: "How does Nuimbase ensure fast transaction speeds?",
    answer: "Speed is a priority. We use a Dynamic Fee Engine that monitors mempool congestion across Bitcoin, Ethereum, and other networks. By suggesting the optimal gas price for 'Instant' priority, we ensure your transactions are picked up by the next available block for near-instant settlement."
  },
  {
    question: "Which assets can I manage within Nuimbase?",
    answer: "We support a robust multi-chain ecosystem including Bitcoin (BTC), Ethereum (ETH), and various Web3 tokens. Our infrastructure is designed for the future of DeFi, allowing you to monitor, send, and receive diverse assets from one unified, secure dashboard."
  }
];
</script>

<template>
  <div class="container my-5 py-5">
    <div class="row justify-content-center">
      <div class="col-lg-12">

        <div class="text-center mb-5">
          <h2 class="brand-title">Frequently Asked Questions</h2>
          <p class="brand-subtitle mx-auto">
            Everything you need to know about our non-custodial security, optimized fees, and enterprise-grade infrastructure.
          </p>
        </div>

        <div class="accordion-container">
          <div
            v-for="(item, index) in faqs"
            :key="index"
            class="custom-accordion-item mb-2"
          >
            <button
              @click="toggleFaq(index)"
              class="accordion-btn d-flex justify-content-between align-items-center w-100"
              :class="{ 'active': openIndex === index }"
            >
              <span class="faq-question">{{ item.question }}</span>
              <i class="bi bi-chevron-right transition-icon" :class="{ 'rotate': openIndex === index }"></i>
            </button>

            <div class="accordion-content" :class="{ 'is-open': openIndex === index }">
              <div class="p-4 pt-0">
                <p class="faq-answer">
                  {{ item.answer }}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* BRAND COLOR: #1bac4b | RADIUS: 4px | NO SHADOWS */

.brand-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  color: #2c3e50;
  font-size: 2.2rem;
}

.brand-subtitle {
  font-family: 'Nunito', sans-serif;
  color: #6c757d;
  max-width: 700px;
}

.accordion-container {
  width: 100%;
}

.custom-accordion-item {
  border: 1px solid #eee; /* Flat design */
  background-color: #fff;
  border-radius: 4px; /* STRICT 4PX */
  overflow: hidden;
  transition: border-color 0.3s ease;
}

.custom-accordion-item:hover {
  border-color: #1bac4b;
}

/* BUTTON STYLING */
.accordion-btn {
  background: #fff;
  border: none;
  padding: 22px 28px;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  cursor: pointer;
  transition: all 0.2s ease;
}

/* Active State Colors locked to #1bac4b */
.accordion-btn.active {
  color: #1bac4b;
}

.faq-question {
  text-align: left;
  padding-right: 15px;
}

/* CONTENT ANIMATION */
.accordion-content {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
}

.accordion-content.is-open {
  max-height: 300px; /* Sufficient for detailed text */
  opacity: 1;
}

.faq-answer {
  font-family: 'Nunito', sans-serif;
  font-size: 15px;
  color: #555;
  line-height: 1.8;
  margin: 0;
}

/* ICON STYLING */
.transition-icon {
  transition: transform 0.3s ease;
  font-size: 14px;
  color: #1bac4b; /* Brand color icons */
}

.rotate {
  transform: rotate(90deg);
}

/* Desktop Width Enforcement */
@media (min-width: 992px) {
  .accordion-container {
    max-width: 100%; /* Spans full column width */
  }
}

@media (max-width: 576px) {
  .accordion-btn {
    font-size: 14px;
    padding: 18px 20px;
  }
  .brand-title {
    font-size: 1.75rem;
  }
}
</style>
