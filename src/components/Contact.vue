<template>
  <div class="page-wrap">
    <div class="layout">

      <!-- Top item -->
      <section class="panel mt-5">
        <h5 class="title" style="font-family: Poppins; font-size: 14px; font-weight: 600;">How do you reach us?</h5>

        <p class="text" style="font-family: Nunito; font-size: 14px;">
            With supporting text below as a natural lead-in to additional content.
        </p>

        <RouterLink class="btn main-btn call-btn" to="" style="font-family: Poppins; font-size: 14px; font-weight: 600;">
            Call Now
        </RouterLink>

        <!-- OPENING HOURS -->
        <div class="mt-5">
            <h6 style="font-family: Poppins; font-size: 14px; font-weight: 600;">Opening Hours</h6>
            <ul class="opening-hours">
              <li style="font-family: Nunito; font-size: 14px;">Monday – Friday: 9:00 AM – 6:00 PM</li>
              <li style="font-family: Nunito; font-size: 14px;">Saturday: 10:00 AM – 4:00 PM</li>
              <li style="font-family: Nunito; font-size: 14px;">Sunday: Closed</li>
            </ul>
        </div>
      </section>

      <!-- Bottom item (form) -->
      <section class="panel mt-4">
        <form class="form">
          <input type="text" placeholder="Full name" style="font-family: Nunito; font-size: 14px;" class="input" />
          <input type="text" placeholder="Country/State" style="font-family: Nunito; font-size: 14px;" class="input" />
          <input type="email" placeholder="Email" style="font-family: Nunito; font-size: 14px;" class="input" />
          <textarea placeholder="Drop a message" style="font-family: Nunito; font-size: 14px;" class="textarea"></textarea>
          <button type="submit" class="btn submit-btn w-100" style="font-family: Poppins; font-size: 14px;">Submit</button>
        </form>
      </section>

    </div>
  </div>
</template>

<script setup>
import { RouterLink } from "vue-router";
</script>

<style scoped>
/* Page centering */
.page-wrap {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: #fff;
}

/* Layout */
.layout {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 1080px;
}

/* Row on desktop */
@media (min-width: 992px) {
  .layout {
    flex-direction: row;
  }
  .panel {
    width: 50%;
  }
}

/* Panels */
.panel {
  background: transparent;
  padding: 0;
}

.title { margin: 0 0 8px; }
.text { margin: 0 0 12px; }

/* Buttons */
.main-btn {
  background-color: #1bac4b;
  color: #fff;
  font-family: Poppins, sans-serif;
  border-radius: 4px;
  padding: 8px 16px;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.call-btn {
  display: inline-flex;
  justify-content: center;
}

.w-100 { width: 100%; }

.submit-btn {
  display: flex;
  justify-content: center;  /* keeps text centered on mobile */
  align-items: center;
  background: #1bac4b;
  color: white;
}

/* Form sizing */
.form {
  max-width: 560px;
  margin: 0 auto;
}

/* Inputs and textarea */
.input,
.textarea {
  width: 100%;
  margin-bottom: 12px;
  padding: 10px 12px;
  background: #f3f5f7;
  border: none;
  border-radius: 4px;
  font-family: Poppins, sans-serif;
}

.input:focus,
.textarea:focus {
  outline: 2px solid #29974D;
  background: #eef6fb;
}

.textarea {
  height: 96px;
  resize: none;
}

/* Icon */
.icon {
  width: 18px;
  height: 18px;
}

/* Opening hours */
.opening-hours {
  list-style: none;
  padding: 0;
  margin: 0;
  font-family: Nunito;
  font-size: 14px;
}
</style>
