<script setup>
import { ref } from 'vue';
import { supabase } from "@/scripts/supabase";


const isOpen = ref(false);
const isSubmitting = ref(false);
const showSuccess = ref(false);

const form = ref({
  fullName: '',
  email: '',
  message: ''
});

const toggleChat = () => {
  isOpen.value = !isOpen.value;
  // Reset form state on reopen
  if (isOpen.value && showSuccess.value) {
    showSuccess.value = false;
    form.value = { fullName: '', email: '', message: '' };
  }
};

const submitForm = async () => {
  if (!form.value.email || !form.value.message) {
    alert("Please fill in email and message");
    return;
  }
  isSubmitting.value = true;
  try {
    const { error } = await supabase.from('customerCare').insert([{
      fullName: form.value.fullName,
      email: form.value.email,
      message: form.value.message
    }]);
    if (error) throw error;
    showSuccess.value = true;
  } catch (error) {
    console.error(error);
    alert("Error sending message");
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="customer-care-wrapper">

    <!-- 1. CHAT WINDOW (Professional Design restored) -->
    <transition name="slide-up">
      <div v-if="isOpen" class="chat-window shadow-lg">

        <!-- Professional Header -->
        <div class="chat-header">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <h6 class="m-0 fw-bold text-white" style="font-family: Poppins; letter-spacing: 0.5px; font-size: 12px;">Support Team</h6>
              <span class="status-dot"></span>
              <small class="text-white-50" style="font-family: Nunito; font-size: 11px;">We typically reply in a few minutes</small>
            </div>
            <!-- Close 'X' inside header -->
            <button @click="toggleChat" class="btn-close btn-close-white small-close"></button>
          </div>
        </div>

        <!-- Body -->
        <div class="chat-body">

          <!-- Success State -->
          <div v-if="showSuccess" class="text-center py-4 success-state">
            <div class="icon-circle mb-3">
              <i class="bi bi-check-lg"></i>
            </div>
            <h6 style="font-family: Poppins; font-weight: 600;">Message Sent!</h6>
            <p class="small text-muted mb-3" style="font-family: Nunito;">
              We have received your request and will email you shortly.
            </p>
            <button @click="toggleChat" class="btn btn-sm btn-outline-success px-4" style="border-radius: 10px;">Close</button>
          </div>

          <!-- Form State -->
          <form v-else @submit.prevent="submitForm">
            <p class="text-muted mb-3" style="font-family: Nunito; font-size: 12px; line-height: 1.4;">
              Hello! 👋 <br>How can <span style="color: #1bac4b;">Nuimbase</span> help you today?
            </p>

            <div class="mb-2">
              <input v-model="form.fullName" type="text" class="form-control compact-input" placeholder="Your Name">
            </div>

            <div class="mb-2">
              <input v-model="form.email" type="email" class="form-control compact-input" placeholder="Email Address *" required>
            </div>

            <div class="mb-3">
              <textarea v-model="form.message" class="form-control compact-input" rows="3" placeholder="Write your message..." required></textarea>
            </div>

            <button type="submit" class="btn w-100 submit-btn" :disabled="isSubmitting">
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
              {{ isSubmitting ? 'Sending...' : 'Send Message' }}
            </button>
          </form>

        </div>

        <!-- Professional Footer -->
        <div class="chat-footer text-center">
          <i class="bi bi-shield-lock-fill me-1"></i>
          <span>Powered by Nuimbase Support</span>
        </div>

      </div>
    </transition>


    <!-- 2. THE NEW SINGLE TRIGGER BUTTON -->
    <!-- Replaces the round button with a "Pill" shape containing text -->
    <button class="chat-trigger-btn shadow" @click="toggleChat">
      <div v-if="!isOpen" class="d-flex align-items-center gap-2">
        <i class="bi bi-chat-text-fill"></i>
        <span>Chat Support</span>
      </div>
      <div v-else>
        <i class="bi bi-x-lg" style="font-size: 18px;"></i>
      </div>
    </button>

  </div>
</template>

<style scoped>
/* WRAPPER */
.customer-care-wrapper {
  position: fixed;
  bottom: 25px;
  right: 25px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

/* --- NEW TRIGGER BUTTON (The Pill) --- */
.chat-trigger-btn {
  background-color: #1bac4b;
  color: white;
  border: none;
  border-radius: 30px; /* Pill shape */
  padding: 8px 15px;
  font-family: 'Poppins', sans-serif;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 50px; /* Ensures round shape when only 'X' is showing */
  min-height: 50px;
}

.chat-trigger-btn:hover {
  background-color: #148038;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(27, 172, 75, 0.4);
}

/* --- CHAT WINDOW --- */
.chat-window {
  width: 250px; /* Compact width */
  height: 370px;
  min-height: auto;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 15px; /* Space between window and button */
  border: 1px solid #f0f0f0;
}

/* Header */
.chat-header {
  background: linear-gradient(135deg, #1bac4b 0%, #148038 100%);
  padding: 10px 15px;
  position: relative;
}

.status-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  background-color: #7affb5;
  border-radius: 50%;
  margin-right: 5px;
}

.small-close {
  opacity: 0.7;
}

/* Body */
.chat-body {
  padding: 20px;
  background-color: #fff;
}

.compact-input {
  font-family: 'Nunito', sans-serif;
  font-size: 10px;
  background-color: #f9f9f9;
  border: 1px solid #eee;
  padding: 8px;
  border-radius: 4px;
}

.compact-input:focus {
  background-color: #fff;
  border-color: #1bac4b;
  box-shadow: none;
}

/* Submit Button */
.submit-btn {
  background-color: #1bac4b;
  color: white;
  font-family: 'Poppins', sans-serif;
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 1px;
  padding: 8px;
  border-radius: 6px;
  margin-top: 5px;
}

.submit-btn:hover {
  background-color: #1a252f;
}

/* Success State Icons */
.icon-circle {
  width: 50px;
  height: 50px;
  background-color: #e8f7ed;
  color: #1bac4b;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  margin: 0 auto;
}

/* Footer */
.chat-footer {
  background-color: #f8f9fa;
  padding: 8px;
  font-family: 'Nunito', sans-serif;
  font-size: 8px;
  color: #adb5bd;
  border-top: 1px solid #f1f1f1;
}

/* ANIMATION */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

/* Responsive */
@media (max-width: 576px) {
  .customer-care-wrapper {
    bottom: 20px;
    right: 20px;
  }
  .chat-window {
    width: 280px;
  }
}
</style>
