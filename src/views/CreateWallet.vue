<template>
  <!-- Floating Create Wallet Button -->
  <button
    class="floating-create-btn"
    @click="keys.modal = true"
    aria-label="Create Wallet"
  >
    <i class="pi pi-wallet"></i>
    <span>Create Wallet</span>
  </button>

  <!-- Create Wallet Dialog -->
  <Dialog v-model:visible="keys.modal" :header="`${keys.pinNeeded ? 'Opps! pin needed' : 'Create your wallet'}`" modal
    class="!w-[325px]">
    <CreatePin @on-hide="keys.pinNeeded = true" @on-show="keys.pinNeeded = false" />

    <form @submit.prevent="onCreateWallet" class="space-y-4" v-if="!keys.pinNeeded">
      <div class="flex flex-col gap-1">
        <label for="">PIN</label>
        <InputOtp v-model="nwForm.pin" :length="6" :size="small" mask="true" />
      </div>
      <div class="flex flex-col gap-1">
        <label for="">Blockchain</label>
        <Select v-model="nwForm.blockchain" :options="tokens" option-label="label" option-value="key" />
      </div>

      <Button type="submit" label="Create wallet" fluid />
    </form>
  </Dialog>
</template>

<script setup lang="js">
  import { onMounted, reactive, ref } from 'vue';
  import { Button, Dialog, InputText, InputOtp, Select } from 'primevue'
  import { $POST } from '@/scripts/utils';

  import CreatePin from '@/components/CreatePin.vue';
import ChangePin from './ChangePin.vue';

  const tokens = [
    { key: 'BTC', label: 'Bitcoin' },
    { key: 'ETH', label: 'Ethereum' },
  ]

  const keys = reactive({ modal: false, modalSend: false, modalPin: false, pinNeeded: false })

  const nwForm = ref({ pin: '', blockchain: 'BTC' })
  const pinForm = ref({ oldPin: '', newPin: '' })


  const onCreateWallet = async () => {
    const body = await $POST(nwForm.value, 'wallet/create')
    console.log(body)
  }

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
.floating-create-btn {
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

.floating-create-btn i {
  font-size: 18px;
}

.floating-create-btn:hover {
  background: #159a43;
  box-shadow: 0 6px 16px rgba(27, 172, 75, 0.5);
  transform: translateY(-2px);
}

.floating-create-btn:active {
  transform: translateY(0);
}

/* Responsive adjustments */
@media (max-width: 767px) {
  .floating-create-btn {
    bottom: 80px;
    right: 16px;
    padding: 10px 20px;
    font-size: 13px;
  }

  .floating-create-btn i {
    font-size: 16px;
  }
}
</style>
