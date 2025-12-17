<template>
  <div class="container py-5">
    <!-- SEO Title: Builds 'Trust' and 'Community' authority -->
    <h2 class="text-center mb-4" style="font-family: Poppins; font-weight: 600; color: #2c3e50;">
      Trusted by Crypto Users Worldwide
    </h2>

    <swiper
      :modules="[Autoplay, Pagination]"
      :slides-per-view="4"
      :space-between="20"
      :loop="true"
      :autoplay="{ delay: 3000, disableOnInteraction: false }"
      :breakpoints="{
        0: { slidesPerView: 1 },
        576: { slidesPerView: 2 },
        992: { slidesPerView: 3 },
        1200: { slidesPerView: 4 }
      }"
      pagination
      class="testimonial-swiper"
    >
      <swiper-slide v-for="(t, index) in testimonials" :key="index">
        <div class="testimonial-card d-flex flex-column justify-content-between">

          <!-- Review Text -->
          <div>
            <div class="stars mb-2">★★★★★</div>
            <p class="testimonial-text mb-3">"{{ t.text }}"</p>
          </div>

          <!-- User Info (No Image) -->
          <div class="user-info pt-3 border-top">
            <h6 class="m-0 text-dark" style="font-family: Poppins; font-weight: 600; font-size: 14px;">
              {{ t.name }}
            </h6>
            <p class="m-0 text-muted" style="font-family: Nunito; font-size: 12px; font-weight: 500;">
              {{ t.title }}
            </p>
          </div>

        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

// SEO OPTIMIZED TESTIMONIALS
// These reviews target specific pain points: Speed, Security, Fees, and Ease of Use.
const testimonials = [
  {
    name: "Alex R.",
    title: "DeFi Trader",
    text: "Finally, a wallet that calculates gas fees accurately. I've saved so much on failed transactions compared to MetaMask."
  },
  {
    name: "Sarah Jenkins",
    title: "Crypto Beginner",
    text: "I was scared to generate my first mnemonic phrase, but Nuimbase made it so easy and secure. Highly recommended!"
  },
  {
    name: "Michael O.",
    title: "NFT Collector",
    text: "The instant send feature is actually instant. Sending ETH between wallets has never been this smooth."
  },
  {
    name: "David Chen",
    title: "Blockchain Dev",
    text: "Love the non-custodial approach. Knowing I have full control of my private keys gives me total peace of mind."
  },
  {
    name: "Elena G.",
    title: "Investor",
    text: "Managing my Bitcoin and Ethereum in one dashboard is a game changer. The interface is clean and professional."
  },
  {
    name: "James Smith",
    title: "Day Trader",
    text: "Zero downtime. The Tatum.io integration really shows because the network connection is always stable."
  },
];
</script>

<style scoped>
.testimonial-card {
  background: white;
  border: 1px solid #f0f0f0; /* Subtle border replaces shadow for cleaner look */
  border-radius: 12px;
  min-height: 220px; /* Increased slightly to accommodate text */
  height: 100%;
  padding: 24px;
  box-sizing: border-box;
  transition: transform 0.3s ease;
}

.testimonial-card:hover {
  transform: translateY(-5px);
  border-color: #29974D; /* Highlight border on hover */
}

.testimonial-text {
  font-family: 'Nunito', sans-serif;
  font-size: 14px;
  color: #555;
  line-height: 1.6;
  font-style: italic;
}

.stars {
  color: #ffc107; /* Standard Gold */
  font-size: 16px;
  letter-spacing: 2px;
}

.user-info {
  border-top: 1px solid #eee;
}

/* --- SWIPER DOTS CUSTOMIZATION --- */

.testimonial-swiper {
  padding-bottom: 50px;
}

/*
   IMPORTANT: The :deep() selector allows us to style the
   Swiper dots even though they are inside a child component.
*/
:deep(.swiper-pagination-bullet) {
  background-color: #29974D !important; /* Brand Green */
  width: 10px;
  height: 10px;
  opacity: 0.3; /* Dimmed by default */
  margin: 0 6px !important;
}

:deep(.swiper-pagination-bullet-active) {
  background-color: #29974D !important; /* Brand Green */
  opacity: 1; /* Full brightness when active */
  width: 12px;
  height: 12px;
  transform: scale(1.1);
}

</style>
