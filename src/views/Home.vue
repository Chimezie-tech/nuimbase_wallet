<template>
  <div class="">
    <Nav/>
  </div>

  <!-- Header -->
  <div class="m-4">
    <Header />
  </div>
   <main>
    <SupportedChainsCarousel />
    <SecurityFeatures />
  </main>

  <!-- About section (Body1) -->
  <section id="about">
    <!--
      FIXED:
      1. Changed 'height' to 'min-height' so it grows on mobile.
      2. Added 'padding: 50px 0' (py-5) to ensure content doesn't touch the edges.
    -->
    <div style="
      background-color: #E8F7ED;
      min-height: 40rem;
      height: auto;
      margin-top: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-top: 3rem;
      padding-bottom: 3rem;
    ">
      <Body1 />
    </div>
  </section>

  <!-- Testimonial section -->
  <section id="testimonial">
    <div style="background-color: rgba(27, 172, 75, 1); color: white;">
      <JobsDone />
    </div>
    <div style="background-color: #E8F7ED">
      <Testimonies />
    </div>
  </section>
  <section>
      <ComparisonSection />
  </section>

  <!-- FAQ Section (Renamed from 'Fag' for Professionalism) -->
  <section id="faq">
    <div>
      <Fag />
    </div>
  </section>
  <!-- Contact section -->
  <section id="contact">
    <div class="">
      <Contact />
    </div>
  </section>

  <div>
    <Footer/>
  </div>
</template>

<script setup>
import Header from '@/components/Header.vue';
import Body1 from '@/components/Body1.vue';
import JobsDone from '@/components/JobsDone.vue';
import Testimonies from '@/components/Testimonies.vue';
import Contact from '@/components/Contact.vue';
import SupportedChainsCarousel from '../components/SupportedChainsCarousel.vue';
import SecurityFeatures from '../components/SecurityFeatures.vue'
import ComparisonSection from '@/components/ComparisonSection.vue';
// Ideally, rename this component file to 'Faq.vue' in your folder later
import Fag from '@/components/Fag.vue';
import Nav from '@/components/Nav.vue';
import Footer from '@/components/Footer.vue';
</script>
