<template>
  <!-- Floating Send Button -->
  <button
    class="floating-send-btn"
    @click="keys.modalSend = true"
    aria-label="Send"
  >
    <i class="pi pi-send"></i>
    <span>Send</span>
  </button>

  <!-- Send Token Dialog -->
  <Dialog v-model:visible="keys.modalSend" header="Send token" modal class="!w-[325px]">
    <CreatePin @on-hide="keys.pinNeeded = true" @on-show="keys.pinNeeded = false" />

    <form @submit.prevent="onSend" class="space-y-4" v-if="!keys.pinNeeded">
      <div class="flex flex-col gap-1">
        <label for="">PIN</label>
        <InputOtp v-model="stForm.pin" :length="6" mask="true" />
      </div>
      <div class="flex flex-col gap-1">
        <label for="">Blockchain</label>
        <Select v-model="stForm.blockchain" :options="tokens" option-label="label" option-value="key" />
      </div>
      <div class="flex flex-col gap-1">
        <label for="">Destination address</label>
        <div class="address-input-wrapper">
          <InputText v-model="stForm.to" placeholder="Enter or scan address" />
          <button type="button" class="scan-btn" @click="openScanner" title="Scan QR Code">
            <i class="pi pi-qrcode"></i>
          </button>
        </div>
      </div>
      <div class="flex flex-col gap-1">
        <label for="">Amount</label>
        <InputText v-model="stForm.amount" />
      </div>

      <Button type="submit" label="Send funds" fluid />
    </form>
  </Dialog>

  <!-- QR Scanner Dialog -->
  <Dialog v-model:visible="keys.scannerOpen" header="Scan QR Code" modal class="!w-[350px]">
    <div class="scanner-container">
      <QrcodeStream
        v-if="keys.scannerOpen"
        @detect="onDecode"
        @error="onError"
        :track="paintBoundingBox"
      >
        <div class="scanner-overlay">
          <div class="scanner-frame"></div>
        </div>
      </QrcodeStream>

      <div class="scanner-actions">
        <button type="button" @click="closeScanner" class="cancel-scan-btn">
          <i class="pi pi-times"></i> Cancel
        </button>
      </div>

      <div v-if="scanError" class="scan-error">
        {{ scanError }}
      </div>
    </div>
  </Dialog>

  <!-- Success Toast -->
  <div v-if="toast.show" :class="['toast', toast.type]">
    <i :class="toast.type === 'success' ? 'pi pi-check' : 'pi pi-exclamation-triangle'"></i>
    <span>{{ toast.message }}</span>
  </div>
</template>

<script setup lang="js">
import { onMounted, reactive, ref } from 'vue';
import { Button, Dialog, InputText, InputOtp, Select } from 'primevue';
import { QrcodeStream } from 'vue-qrcode-reader';
import { $POST } from '@/scripts/utils';
import 'primeicons/primeicons.css';

import CreatePin from '@/components/CreatePin.vue';

const tokens = [
  { key: 'BTC', label: 'Bitcoin' },
  { key: 'ETH', label: 'Ethereum' },
];

const keys = reactive({
  modal: false,
  modalSend: false,
  modalPin: false,
  pinNeeded: false,
  scannerOpen: false
});

const stForm = ref({ pin: '', blockchain: 'BTC', to: '', amount: 0, tokenAddress: '' });
const scanError = ref('');
const toast = ref({ show: false, message: '', type: 'success' });

// Open QR Scanner
const openScanner = () => {
  scanError.value = '';
  keys.scannerOpen = true;
};

// Close QR Scanner
const closeScanner = () => {
  keys.scannerOpen = false;
  scanError.value = '';
};

// Handle QR Code Detection
const onDecode = (detectedCodes) => {
  if (detectedCodes && detectedCodes.length > 0) {
    const scannedData = detectedCodes[0].rawValue;

    // Basic validation - check if it looks like a blockchain address
    if (isValidAddress(scannedData)) {
      stForm.value.to = scannedData;
      closeScanner();
      showToast('Address scanned successfully!', 'success');
    } else {
      scanError.value = 'Invalid blockchain address format';
      showToast('Invalid address format', 'error');
    }
  }
};

// Handle Scanner Errors
const onError = (error) => {
  console.error('Scanner error:', error);
  if (error.name === 'NotAllowedError') {
    scanError.value = 'Camera access denied. Please allow camera permissions.';
  } else if (error.name === 'NotFoundError') {
    scanError.value = 'No camera found on this device.';
  } else {
    scanError.value = 'Error accessing camera. Please try again.';
  }
};

// Paint bounding box around detected QR code
const paintBoundingBox = (detectedCodes, ctx) => {
  for (const detectedCode of detectedCodes) {
    const { boundingBox } = detectedCode;
    const { x, y, width, height } = boundingBox;

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#1bac4b';
    ctx.strokeRect(x, y, width, height);
  }
};

// Basic address validation (enhance based on your blockchain requirements)
const isValidAddress = (address) => {
  if (!address || address.length < 26) return false;

  const blockchain = stForm.value.blockchain;

  // BTC: starts with 1, 3, or bc1
  if (blockchain === 'BTC') {
    return /^(1|3|bc1)[a-zA-HJ-NP-Z0-9]{25,62}$/.test(address);
  }

  // ETH: starts with 0x, 42 characters
  if (blockchain === 'ETH') {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  // Generic validation for other chains
  return address.length >= 26 && address.length <= 90;
};

// Show toast notification
const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type };
  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
};

const onSend = async () => {
  const body = await $POST(stForm.value, 'transfer/send');
  console.log(body);
};

const onStart = () => {};

onMounted(() => {
  onStart();
});
</script>

<style scoped>
.floating-send-btn {
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

.floating-send-btn i {
  font-size: 18px;
}

.floating-send-btn:hover {
  background: #159a43;
  box-shadow: 0 6px 16px rgba(27, 172, 75, 0.5);
  transform: translateY(-2px);
}

.floating-send-btn:active {
  transform: translateY(0);
}

/* Address Input with Scan Button */
.address-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
}

.address-input-wrapper input {
  flex: 1;
}

.scan-btn {
  padding: 8px 12px;
  background: #1bac4b;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s;
}

.scan-btn:hover {
  background: #159a43;
}

.scan-btn i {
  font-size: 18px;
}

/* QR Scanner Container */
.scanner-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.scanner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.scanner-frame {
  width: 200px;
  height: 200px;
  border: 3px solid #1bac4b;
  border-radius: 12px;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
}

.scanner-actions {
  display: flex;
  justify-content: center;
  margin-top: 12px;
}

.cancel-scan-btn {
  padding: 10px 20px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  transition: 0.2s;
}

.cancel-scan-btn:hover {
  background: #dc2626;
}

.scan-error {
  padding: 12px;
  background: #fef2f2;
  color: #dc2626;
  border-radius: 6px;
  font-size: 13px;
  text-align: center;
}

/* Toast Notification */
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
  animation: slideInRight 0.3s ease-out;
}

.toast.success {
  background: #1bac4b;
  color: white;
}

.toast.error {
  background: #ef4444;
  color: white;
}

@keyframes slideInRight {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 767px) {
  .floating-send-btn {
    bottom: 80px;
    right: 16px;
    padding: 10px 20px;
    font-size: 13px;
  }

  .floating-send-btn i {
    font-size: 16px;
  }

  .scanner-frame {
    width: 180px;
    height: 180px;
  }
}
</style>
