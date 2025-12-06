<template>
  <!-- Floating Change Pin Button -->
  <button
    class="floating-pin-btn"
    @click="keys.modalPin = true"
    aria-label="Change Pin"
  >
    <i class="pi pi-lock"></i>
    <span>Change Pin</span>
  </button>

  <!-- Change PIN Dialog -->
  <Dialog v-model:visible="keys.modalPin" header="Your security PIN" modal class="!w-[325px]">
    <form @submit.prevent="onCreatePin" class="space-y-4">
      <div class="flex flex-col gap-1">
        <label for="">Old PIN</label>
        <InputOtp v-model="pinForm.oldPin" :length="6" mask="true" />
      </div>

      <div class="flex flex-col gap-1">
        <label for="">New PIN</label>
        <InputOtp v-model="pinForm.newPin" :length="6" />
      </div>

      <Button type="submit" label="Create PIN" fluid />
    </form>
  </Dialog>
</template>


<script setup lang="js">
import { onMounted, reactive, ref } from 'vue';
import { Button, Dialog, InputText, InputOtp, Select } from 'primevue'
import { $POST } from '@/scripts/utils';

const tokens = [
  { key: 'BTC', label: 'Bitcoin' },
  { key: 'ETH', label: 'Ethereum' },
]

const keys = reactive({ modal: false, modalSend: false, modalPin: false, pinNeeded: false })

const pinForm = ref({ oldPin: '', newPin: '' })

const onCreatePin = async () => {
  const body = await $POST(pinForm.value, 'pin/change')
  console.log(body)
}


const onStart = () => {


}


onMounted(() => {
  onStart()

})

</script>

<style scoped>
.floating-pin-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 12px 24px;
  background: #1bac4b;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(27, 172, 75, 0.4);
  transition: all 0.3s ease;
  z-index: 999;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
}

.floating-pin-btn i {
  font-size: 18px;
}

.floating-pin-btn:hover {
  background: #159a43;
  box-shadow: 0 6px 16px rgba(27, 172, 75, 0.5);
  transform: translateY(-2px);
}

.floating-pin-btn:active {
  transform: translateY(0);
}

/* Responsive adjustments */
@media (max-width: 767px) {
  .floating-pin-btn {
    bottom: 80px;
    right: 16px;
    padding: 10px 20px;
    font-size: 13px;
  }

  .floating-pin-btn i {
    font-size: 16px;
  }
}
</style>
