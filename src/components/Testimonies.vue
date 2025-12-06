<template>
  <div class="container py-5">
    <h2 class="text-center mb-4" style="font-family: Poppins; font-weight: 600;">
      What Our Clients Say
    </h2>

    <swiper
      :modules="[Autoplay, Pagination]"
      :slides-per-view="4"
      :space-between="20"
      :loop="true"
      :autoplay="{ delay: 2500, disableOnInteraction: false }"
      :breakpoints="{
        0: { slidesPerView: 1 },
        576: { slidesPerView: 2 },
        992: { slidesPerView: 4 }
      }"
      pagination
      class="testimonial-swiper"
    >
      <swiper-slide v-for="(t, index) in testimonials" :key="index">
        <div class="testimonial-card p-3">
          <div class="d-flex align-items-center mb-3">
            <img :src="t.image" class="profile-pic" />
            <div class="ms-3">
              <h6 class="m-0" style="font-family: Poppins; font-weight: 600; font-size: 12px;">
                {{ t.name }}
              </h6>
              <p class="m-0" style="font-family: Nunito; font-size: 10px;">
                {{ t.title }}
              </p>
            </div>
          </div>

          <p class="testimonial-text" style="font-family: Nunito; font-size: 14px;">{{ t.text }}</p>

          <div class="stars">★★★★★</div>
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
import girl from '../components/assets/girl.png'

const testimonials = [
  {
    name: "Sarah Johnson",
    title: "Legal Advisor • GlobeCorp",
    text: "They handled my documents faster than expected. Very reliable service.",
    image: girl
  },
  {
    name: "Michael Ade",
    title: "Entrepreneur • LagosTech",
    text: "Their professionalism is unmatched. I felt supported all through.",
    image: girl
  },
  {
    name: "Emily Carter",
    title: "Project Manager • SkyWorks",
    text: "Smooth process from start to finish. Highly recommended.",
    image: girl
  },
  {
    name: "Daniel Lee",
    title: "Consultant • BrightBridge",
    text: "Exceptional attention to detail. They truly know their work.",
    image: girl
  },
  {
    name: "Amina Yusuf",
    title: "Founder • Amina Foods",
    text: "Great experience. My legalization was completed without stress.",
    image: girl
  },
  {
    name: "John Smith",
    title: "CEO • NorthWave",
    text: "Trustworthy and efficient. I will continue using their services.",
    image: girl
  },
];
</script>

<style scoped>
.testimonial-card {
  background: white;
  border-radius: 5px;
  min-height: 200px;
  height: auto;
  width: 100%;
  box-shadow: 0px 4px 12px rgba(0,0,0,0.08);
  padding: 18px;
  box-sizing: border-box;
}

.profile-pic {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  object-fit: cover;
}

.testimonial-text {
  font-family: Nunito;
  font-size: 14px;
  color: #333;
  min-height: 60px;
}

.stars {
  color: gold;
  font-size: 18px;
  margin-top: 8px;
}

/* Ensure the swiper container has space at bottom for pagination */
.testimonial-swiper {
  padding-bottom: 40px; /* give room for dots below cards */
  position: relative;
}

/* Put pagination OUTSIDE the slide viewport (static flow), centered */
.testimonial-swiper .swiper-pagination {
  position: static !important;
  margin-top: 18px !important;    /* distance from cards */
  display: flex;
  justify-content: center;
  gap: 8px;
  pointer-events: auto;
}

/* Style the bullets (dots) */
.testimonial-swiper .swiper-pagination-bullet {
  background: #29974D !important;
  width: 10px;
  height: 10px;
  opacity: 0.45;
  border-radius: 50%;
  transition: opacity 200ms ease, transform 200ms ease;
  transform: scale(1);
}

/* Active bullet */
.testimonial-swiper .swiper-pagination-bullet-active {
  opacity: 1;
  transform: scale(1.15);
}

/* As a fallback: if pagination is absolutely positioned by configuration,
   push it down beyond the cards so it never overlaps. */
.testimonial-swiper .swiper-pagination.swiper-pagination-horizontal {
  position: absolute !important;
  left: 0;
  right: 0;
  bottom: -28px !important; /* pushes it well below the cards */
  margin: 0 auto;
}

/* Small screens: tighten spacing and ensure visible */
@media (max-width: 576px) {
  .testimonial-swiper {
    padding-bottom: 48px;
  }
  .testimonial-swiper .swiper-pagination {
    margin-top: 12px !important;
  }
  .testimonial-swiper .swiper-pagination-bullet {
    width: 9px;
    height: 9px;
  }
}
</style>

