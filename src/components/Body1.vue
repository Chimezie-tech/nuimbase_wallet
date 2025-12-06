<script setup lang="ts">

</script>

<template>
  <div class="container my-5">

    <div class="row justify-content-center align-items-center" style="min-height: 280px;">

      <!-- LEFT SIDE -->
      <div class="col-sm-6 d-flex justify-content-center align-items-center">
        <div class="p-4 rounded-4 w-100" style="">
          <h4 style="font-family: Poppins; font-size: 14px; font-weight: 600;">Why do we help with legalization?</h4>
          <p class="mt-2" style="font-family: Nunito; font-size: 14px;">
            We are here for everyone around the world to carry out the legalization process,
            which is sometimes complicated.
          </p>
        </div>
      </div>

      <!-- RIGHT SIDE — 4 SMALLER CARDS -->
      <div class="col-sm-6">
        <div class="row g-1">

          <!-- CARD 1 -->
          <div class="col-6">
            <div class="card h-100 shadow-sm p-3 rounded-2 small-card">
              <div class="icon-box mb-2">
                <i class="bi bi-chat-dots-fill"></i>
              </div>
              <h6 style="font-family: Poppins; font-size: 14px; font-weight: 600;">Consultation</h6>
              <p class="small text-muted" style="font-family: Nunito; font-size: 14px;">Legal advice tailored to your needs.</p>
            </div>
          </div>

          <!-- CARD 2 -->
          <div class="col-6">
            <div class="card h-100 shadow-sm p-3 rounded-2 small-card">
              <div class="icon-box mb-2">
                <i class="bi bi-file-earmark-text-fill"></i>
              </div>
              <h6 style="font-family: Poppins; font-size: 14px; font-weight: 600;">Document Review</h6>
              <p class="small text-muted" style="font-family: Nunito; font-size: 14px;">We review your legal papers thoroughly.</p>
            </div>
          </div>

          <!-- CARD 3 -->
          <div class="col-6">
            <div class="card h-100 shadow-sm p-3 rounded-2 small-card">
              <div class="icon-box mb-2">
                <i class="bi bi-people-fill"></i>
              </div>
              <h6 style="font-family: Poppins; font-size: 14px; font-weight: 600;">Representation</h6>
              <p class="small text-muted" style="font-family: Nunito; font-size: 14px;">Professional representation in legal matters.</p>
            </div>
          </div>

          <!-- CARD 4 -->
          <div class="col-6">
            <div class="card h-100 shadow-sm p-3 rounded-2 small-card">
              <div class="icon-box mb-2">
                <i class="bi bi-shield-lock-fill"></i>
              </div>
              <h6 style="font-family: Poppins; font-size: 14px; font-weight: 600;">Support</h6>
              <p class="small text-muted" style="font-family: Nunito; font-size: 14px;">We guide you throughout the process.</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Smaller icons */
.icon-box {
  width: 36px;
  height: 36px;
  background-color: #E8F7ED;
  color: #29974D;
  border-radius: 50%; /* makes icons circular */
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px; /* reduced icon size */
}

/* Make cards slightly smaller */
.small-card {
  transform: scale(0.90);
}
</style>
