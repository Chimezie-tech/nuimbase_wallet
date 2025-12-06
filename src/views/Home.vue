<template>
  <div class="">
    <Nav/>
  </div>

  <!-- Header -->
  <div class="m-4">
    <Header />
  </div>

  <!-- About section -->
  <section id="about">
    <div style="
    background-color: #E8F7ED;
    height: 35rem;
    margin-top: 40px;
    display: flex;
    justify-content: center;   /* center horizontally */
    align-items: center;       /* center vertically */
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

  <!-- Fag -->
  <section id="fag">
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
import Fag from '@/components/Fag.vue';
import Nav from '@/components/Nav.vue';
import Footer from '@/components/Footer.vue';
</script>
