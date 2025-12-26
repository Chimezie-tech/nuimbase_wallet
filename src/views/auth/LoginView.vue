<template>
  <div class="auth-container">
    <div v-if="isLoading" class="spinner-overlay">
      <div class="spinner"></div>
    </div>

    <Transition name="toast">
      <div v-if="toast.show" :class="['toast', toast.type]">
        <i :class="toast.type === 'success' ? 'ri-check-line' : 'ri-error-warning-line'"></i>
        <span>{{ toast.message }}</span>
      </div>
    </Transition>

    <form @submit.prevent="handleSubmit" class="auth-box">
      <div class="auth-header">
        <div class="auth-title-wrapper">
          <div class="icon-wrapper">
            <i class="ri-account-circle-2-line"></i>
          </div>
          <div class="auth-title">
            {{ activeForm === 'login' ? 'Log in' : activeForm === 'signup' ? 'Sign Up' : 'Recover Password' }}
          </div>
        </div>
        <RouterLink to="/" class="home-link" title="Go back home">
          <i class="pi pi-home"></i>
        </RouterLink>
      </div>

      <p class="auth-text" v-if="activeForm !== 'forgot'">
        <span style="color: #1bac4b;">Nuimbase.</span> Fast, Secured and Reliable
      </p>

      <p class="auth-text" v-if="activeForm === 'forgot'">
        Enter your email and we will send you a password reset link.
      </p>

      <div class="divider"></div>

      <template v-if="activeForm === 'login'">
        <div class="input-group">
          <label>Email</label>
          <input v-model="form.email" type="email" class="input-field" placeholder="Your email" required />
        </div>

        <div class="input-group">
          <label>Password</label>
          <div class="password-wrapper">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              class="input-field"
              placeholder="Your password"
              required
            />
            <i
              :class="showPassword ? 'ri-eye-off-line' : 'ri-eye-line'"
              class="toggle-password"
              @click="showPassword = !showPassword"
            ></i>
          </div>
        </div>

        <button type="submit" class="submit-btn">Login</button>

        <div class="auth-links">
          <span @click="activeForm = 'signup'">Create account</span>
          <span @click="activeForm = 'forgot'">Forgot password?</span>
        </div>
      </template>

      <template v-if="activeForm === 'signup'">
        <div class="input-group">
          <label>Email</label>
          <input v-model="form.email" type="email" class="input-field" placeholder="Your email" required />
        </div>

        <div class="input-group">
          <label>Password</label>
          <div class="password-wrapper">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              class="input-field"
              placeholder="Choose a password"
              required
            />
            <i
              :class="showPassword ? 'ri-eye-off-line' : 'ri-eye-line'"
              class="toggle-password"
              @click="showPassword = !showPassword"
            ></i>
          </div>
        </div>

        <button type="submit" class="submit-btn">Create Account</button>

        <div class="auth-links">
          <span @click="activeForm = 'login'">Already have an account?</span>
        </div>
      </template>

      <template v-if="activeForm === 'forgot'">
        <div class="input-group">
          <label>Email</label>
          <input v-model="form.email" type="email" class="input-field" placeholder="Your email" required />
        </div>

        <button type="submit" class="submit-btn">Send reset link</button>

        <div class="auth-links">
          <span @click="activeForm = 'login'">Back to login</span>
        </div>
      </template>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { supabase } from "@/scripts/supabase";
import { useRouter } from "vue-router";

const router = useRouter();

const activeForm = ref("login");
const form = ref({ email: "", password: "" });
const isLoading = ref(false);
const showPassword = ref(false); // Eye icon toggle state

const toast = ref({
  show: false,
  message: "",
  type: "success"
});

const showToast = (message, type = "success") => {
  toast.value = { show: true, message, type };
  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
};

const clearInputs = () => {
  form.value.email = "";
  form.value.password = "";
};

const handleSubmit = async () => {
  const { email, password } = form.value;
  isLoading.value = true;

  try {
    // LOGIN
    if (activeForm.value === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      // Clear inputs immediately after result
      clearInputs();

      if (error) {
        showToast(error.message, "error");
        return;
      }

      showToast("Login successful!", "success");
      setTimeout(() => router.push("/dashboard"), 1000);
    }

    // SIGNUP
    if (activeForm.value === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password });

      // Clear inputs immediately after result
      clearInputs();

      if (error) {
        showToast(error.message, "error");
        return;
      }

      if (data.user) {
        const { error: customerError } = await supabase
          .from('customers')
          .insert([{ uuid: data.user.id, email: email }]);

        if (customerError) console.error("Error:", customerError.message);
      }

      showToast("Signup successful! you can now login.", "success");
      // Switch back to login card
      activeForm.value = "login";
    }

    // FORGOT PASSWORD
    if (activeForm.value === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "https://nuimbase.com/reset-password",
      });

      clearInputs();

      if (error) {
        showToast(error.message, "error");
        return;
      }

      showToast("Reset link sent! Check your email.", "success");
    }
  } finally {
    isLoading.value = false;
  }
};

function gtag_report_conversion(url) {
  var callback = function () {
    if (typeof(url) != 'undefined') {
      window.location = url;
    }
  };
  gtag('event', 'conversion', {
      'send_to': 'AW-659070632/c_VICIex2_sCEKi9oroC',
      'event_callback': callback
  });
  return false;
}

</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
  background-color: #f9fafb;
}

.auth-box {
  width: 100%;
  max-width: 350px;
  padding: 1.5rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.auth-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.auth-title-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.home-link {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 50%;
  color: #6b7280;
  transition: all 0.2s;
  text-decoration: none;
}

.home-link:hover {
  background: #1bac4b;
  border-color: #1bac4b;
  color: white;
  transform: translateY(-1px);
}

.icon-wrapper {
  width: 40px;
  height: 40px;
  border: 1px solid #1bac4b;
  background: #e7f8ee;
  color: #1bac4b;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}

.auth-title {
  font-size: 20px;
  font-weight: 700;
}

.auth-text {
  font-size: 0.9rem;
  color: #6b7280;
}

.divider {
  height: 1px;
  background: #ddd;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

/* Password wrapper and icon styling */
.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-wrapper .input-field {
  width: 100%;
  padding-right: 40px;
}

.toggle-password {
  position: absolute;
  right: 12px;
  cursor: pointer;
  color: #6b7280;
  font-size: 18px;
  transition: color 0.2s;
}

.toggle-password:hover {
  color: #1bac4b;
}

.input-field {
  border: 1px solid #1bac4b;
  border-radius: 6px;
  height: 40px;
  padding: 0 10px;
  transition: 0.2s ease;
}

.input-field:focus {
  border-color: #1bac4b;
  outline: none;
  box-shadow: 0 0 0 2px rgba(27,172,75,0.3);
}

.submit-btn {
  background: #1bac4b;
  color: white;
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.2s;
}

.submit-btn:hover {
  background: #159a43;
}

.auth-links {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
}

.auth-links span {
  color: #1bac4b;
  cursor: pointer;
  font-size: 0.85rem;
  text-decoration: underline;
}

/* ===== SPINNER OVERLAY ===== */
.spinner-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e7f8ee;
  border-top: 4px solid #1bac4b;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* ===== TOAST NOTIFICATION ===== */
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 16px 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 500;
  z-index: 10000;
  min-width: 250px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.toast.success {
  background: #1bac4b;
  color: white;
}

.toast.error {
  background: #ef4444;
  color: white;
}

.toast i {
  font-size: 20px;
}

.toast-enter-active {
  animation: slideInRight 0.3s ease-out;
}

.toast-leave-active {
  animation: slideOutRight 0.3s ease-in;
}

@keyframes slideInRight {
  from { transform: translateX(400px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes slideOutRight {
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(400px); opacity: 0; }
}
</style>
