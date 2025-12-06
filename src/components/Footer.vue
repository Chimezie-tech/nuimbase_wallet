<template>
  <footer class="footer-bg py-5 mt-5">
    <div class="container">
      <div class="row">

        <div class="col-6 col-md-3 mb-3">
          <h5 class="footer-title">Navigation</h5>
          <ul class="nav flex-column">
            <li class="nav-item mb-2"><a class="footer-link" href="#contact">Contact</a></li>
            <li class="nav-item mb-2"><a class="footer-link" href="#testimonial">Testimonials</a></li>
            <li class="nav-item mb-2"><a class="footer-link" href="#about">About</a></li>
          </ul>
        </div>

        <div class="col-6 col-md-3 mb-3">
          <h5 class="footer-title">Legal</h5>
          <ul class="nav flex-column">
            <li class="nav-item mb-2"><a class="footer-link" href="#privacy">Privacy Policy</a></li>
            <li class="nav-item mb-2"><a class="footer-link" href="#terms">Terms of Service</a></li>
          </ul>
        </div>

        <div class="col-6 col-md-3 mb-3">
          <h5 class="footer-title">Social</h5>
          <ul class="nav flex-column">
            <li class="nav-item mb-2"><a class="footer-link" href="#facebook">Facebook</a></li>
            <li class="nav-item mb-2"><a class="footer-link" href="#instagram">Instagram</a></li>
            <li class="nav-item mb-2"><a class="footer-link" href="#linkedin">LinkedIn</a></li>
          </ul>
        </div>

        <div class="col-6 col-md-3 mb-3">
          <a href="#home" class="footer-brand">
            Nuimbase
          </a>
          <p class="footer-copy">© 2025</p>
        </div>

      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.footer-bg {
  background-color: #1bac4b;
  /* SAME AS HEADER */
}

.footer-title {
  color: white;
  font-family: Poppins;
  font-size: 14px;
}

.footer-link {
  color: white;
  font-family: Nunito;
  font-size: 12px;
  text-decoration: none;
}

.footer-link:hover {
  text-decoration: underline;
}

.footer-brand {
  color: white;
  font-family: Poppins;
  font-size: 12px;
  text-decoration: none;
}

.footer-brand:hover {
  text-decoration: underline;
}

.footer-copy {
  margin-top: 8px;
  color: white;
  font-family: Poppins;
  font-size: 12px;
}
</style>
