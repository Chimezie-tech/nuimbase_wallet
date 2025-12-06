<template>
  <div class=" container" style="margin-top: 10px; margin-bottom: 80px;">
    <div class="row align-items-center">

      <!-- Left Card -->
      <div class="col-sm-6 mb-3 mb-sm-0 d-flex align-items-center">
        <div class="card w-100 border border-0">
          <div class="card-body">
            <h5 class="card-title" style="font-family: Poppins; font-size: 25px; color: black; font-weight: 600;">
              Empowering the Future with Web3.
            </h5>

            <p class="card-text" style="color: grey; font-family: Nunito;">
                 Enjoy our wallet services and finance features powered by <span style="color: #1bac4b;">Nuimbase</span>. Trusted. Secure. Scalable.
            </p>

            <RouterLink
              to="/login"
              class="btn"
              style="background-color: #1bac4b; color: white; font-family: Poppins;"
            >
              Start Now
            </RouterLink>

          </div>
        </div>
      </div>

      <!-- Right Card with Image -->
      <div class="col-sm-6 d-flex align-items-center mt-5">
        <div class="card w-100 border border-0 text-center position-relative">

          <!-- Faint Background Shape -->
          <div
            class="legal-bg-circle"
            style="
              position: absolute;
              width: 280px;
              height: 280px;
              border-radius: 50%;
              background: #E8F7ED;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              z-index: 1;
            ">
          </div>

          <div class="card-body d-flex justify-content-center align-items-center">
            <img
              src="../components/assets/nuimImage.png"
              class="big-forward-img"
              alt=""
              style="position: relative; z-index: 2;"
            />
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.big-forward-img {
  width: 260px;
  height: auto;
  margin-top: -30px;
  transform: scale(1.1);
}

.logo-img {
  width: 50px;   /* increase or reduce as needed */
  height: auto;
  opacity: 0.9;  /* optional aesthetic */
}
</style>
