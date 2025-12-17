<template>
  <!-- Floating Security Button -->
  <button
    class="floating-pin-btn"
    @click="openSecurityModal"
    aria-label="Security Settings"
  >
    <i class="pi pi-shield"></i>
    <span>Security</span>
  </button>

  <!-- Security Disclaimer Watermark -->
  <div class="security-watermark">
    <p>
      <span class="warning-header">SECURITY MANDATE:</span><br>
      IMMEDIATE PIN UPDATE IS REQUIRED IF THIS DEVICE WAS LEFT UNATTENDED OR PREVIOUSLY LOST.
      NUIMBASE ASSISTANCE IS STRICTLY CONTINGENT UPON YOUR ADHERENCE TO THESE SECURITY PROTOCOLS.
    </p>
  </div>

  <!-- MAIN SECURITY DIALOG (COMPACT) -->
  <Dialog
    v-model:visible="keys.modalPin"
    :header="dialogHeader"
    modal
    class="compact-dialog"
    :style="{ width: '310px' }"
    :pt="{
      header: { class: '!py-2 !px-4' },
      content: { class: '!p-4' }
    }"
  >

    <!-- STATE 1: MENU SELECTION -->
    <div v-if="uiState === 'menu'" class="flex flex-col gap-2 py-1">
      <button class="selection-card" @click="uiState = 'change-pin'">
        <div class="icon-box bg-orange-100 text-orange-600">
          <i class="pi pi-lock text-sm"></i>
        </div>
        <div class="text-left" style="padding-top: 15px;">
          <h4 class="text-gray-700" style="font-size: 14px; font-family: Poppins;">Change PIN</h4>
          <p class="text-[10px] text-gray-500">Update access code.</p>
        </div>
        <i class="pi pi-chevron-right text-gray-300 text-xs ml-auto"></i>
      </button>

      <button class="selection-card" @click="uiState = 'view-auth'">
        <div class="icon-box bg-purple-100 text-purple-600">
          <i class="pi pi-eye text-sm"></i>
        </div>
        <div class="text-left"style="padding-top: 15px;" >
          <h4 class="text-gray-700" style="font-size: 14px; font-family: Poppins;">View Seed Phrase</h4>
          <p class="text-[10px] text-gray-500">Reveal your seed phrase.</p>
        </div>
        <i class="pi pi-chevron-right text-gray-300 text-xs ml-auto"></i>
      </button>
    </div>

    <!-- STATE 2: CHANGE PIN FORM -->
    <form v-else-if="uiState === 'change-pin'" @submit.prevent="onChangePin" class="flex flex-col gap-3">
      <div class="flex flex-col gap-1 items-center">
        <label class="text-[10px] font-bold text-gray-500 uppercase">Current PIN</label>
        <InputOtp v-model="pinForm.oldPin" :length="6" mask integer class="compact-otp" />
      </div>

      <div class="flex flex-col gap-1 items-center">
        <label class="text-[10px] font-bold text-gray-500 uppercase">New PIN</label>
        <InputOtp v-model="pinForm.newPin" :length="6" mask integer class="compact-otp" />
      </div>

      <div class="flex gap-2 mt-2">
        <Button type="button" label="Back" severity="secondary" size="small" outlined class="flex-1 !py-1 !text-xs" @click="uiState = 'menu'" />
        <Button type="submit" label="Update" severity="warning" size="small" class="flex-1 !py-1 !text-xs" :loading="isLoading" />
      </div>
    </form>

    <!-- STATE 3: VIEW MNEMONIC AUTH -->
    <form v-else-if="uiState === 'view-auth'" @submit.prevent="onRevealMnemonic" class="flex flex-col gap-3">
      <div class="bg-yellow-50 p-2 rounded border border-yellow-200">
        <p class="text-[10px] text-yellow-800 flex items-start gap-2 leading-tight">
          <i class="pi pi-exclamation-triangle mt-0.5 text-xs"></i>
          Select wallet and enter PIN to decrypt keys.
        </p>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-[10px] font-bold text-gray-500 uppercase">Wallet</label>
        <Select
          v-model="viewForm.blockchain"
          :options="tokens"
          option-label="label"
          option-value="key"
          class="w-full compact-select"
        />
      </div>

      <div class="flex flex-col gap-1 items-center">
        <label class="text-[10px] font-bold text-gray-500 uppercase">Enter PIN</label>
        <InputOtp v-model="viewForm.pin" :length="6" mask integer class="compact-otp" />
      </div>

      <div class="flex gap-2 mt-2">
        <Button type="button" label="Back" severity="secondary" size="small" outlined class="flex-1 !py-1 !text-xs" @click="uiState = 'menu'" />
        <Button type="submit" label="Reveal" severity="danger" size="small" class="flex-1 !py-1 !text-xs" :loading="isLoading" />
      </div>
    </form>

    <!-- STATE 4: MNEMONIC DISPLAY -->
    <div v-else-if="uiState === 'view-display'" class="text-center">
      <div class="mb-2">
        <h5 class="text-gray-700 uppercase tracking-wide mb-1" style="size: 12px;">{{ viewForm.blockchain }} Keys</h5>
        <span class="text-[9px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded border border-red-100">CONFIDENTIAL</span>
      </div>

      <!-- Printable Area -->
      <div id="printable-mnemonic">
        <div class="mnemonic-grid">
          <div v-for="(word, index) in mnemonicArray" :key="index" class="word-chip">
            <span class="word-index">{{ index + 1 }}</span>
            <span class="word-text">{{ word }}</span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col gap-2 mt-3">
        <div class="flex gap-2">
          <Button label="Copy" icon="pi pi-copy" severity="secondary" size="small" outlined class="flex-1 !py-1 !text-xs" @click="copyMnemonic" />
          <Button label="Print" icon="pi pi-print" severity="secondary" size="small" outlined class="flex-1 !py-1 !text-xs" @click="printMnemonic" />
        </div>

        <Button
          label="Delete Wallet"
          icon="pi pi-trash"
          severity="danger"
          text
          size="small"
          class="w-full !py-1 !text-xs"
          @click="confirmDelete"
        />

        <Button label="Close" severity="contrast" size="small" class="w-full !py-1 !text-xs" @click="resetAndClose" />
      </div>
    </div>

  </Dialog>

  <!-- CONFIRM DELETE DIALOG -->
  <Dialog v-model:visible="keys.confirmDelete" header="Delete Wallet?" modal class="compact-dialog" :style="{ width: '280px' }">
    <p class="text-xs text-gray-600 mb-4 leading-relaxed">
      This will remove the wallet from Nuimbase.
      <br>
      <strong class="text-red-500">Funds are lost if you haven't backed up the keys.</strong>
    </p>
    <div class="flex justify-end gap-2">
      <Button label="Cancel" severity="secondary" text size="small" class="!text-xs" @click="keys.confirmDelete = false" />
      <Button label="Delete" severity="danger" size="small" class="!text-xs" :loading="isDeleting" @click="onDeleteWallet" />
    </div>
  </Dialog>

  <!-- TOAST NOTIFICATION -->
  <div v-if="toast.show" :class="['toast', toast.type]">
    <i :class="toast.type === 'success' ? 'pi pi-check' : 'pi pi-info-circle'" style="font-size: 0.8rem;"></i>
    <span>{{ toast.message }}</span>
  </div>

</template>

<script setup lang="js">
import { onMounted, reactive, ref, computed } from 'vue';
import { Button, Dialog, InputOtp, Select } from 'primevue';
import { $POST } from '@/scripts/utils';

// --- STATE ---
const uiState = ref('menu'); // 'menu' | 'change-pin' | 'view-auth' | 'view-display'
const isLoading = ref(false);
const isDeleting = ref(false);
const revealedMnemonic = ref('');

const keys = reactive({
  modalPin: false,
  confirmDelete: false
});

const pinForm = ref({ oldPin: '', newPin: '' });
const viewForm = ref({ pin: '', blockchain: 'ETH' });
const toast = ref({ show: false, message: '', type: 'success' });

// Supported Chains
const tokens = [
  { key: 'BTC', label: 'Bitcoin (BTC)' },
  { key: 'ETH', label: 'Ethereum (ETH)' },
  { key: 'BSC', label: 'Binance (BSC)'},
  { key: 'SOL', label: 'Solana (SOL)'},
  { key: 'TRON', label: 'Tron (TRX)'},
  { key: 'LTC', label: 'Litecoin (LTC)'},
  { key: 'CELO', label: 'Celo (CELO)'},
  { key: 'ONE', label: 'Harmony (ONE)'},
  { key: 'XDC', label: 'XDC (XDC)'},
  { key: 'KLAYTN', label: 'Klaytn (KLAY)'},
  { key: 'ALGO', label: 'Algorand (ALGO)'},
  { key: 'KCS', label: 'KuCoin (KCS)'},
];

// --- COMPUTED ---
const dialogHeader = computed(() => {
  if (uiState.value === 'change-pin') return 'Update PIN';
  if (uiState.value === 'view-auth') return 'Verify Identity';
  if (uiState.value === 'view-display') return 'Key';
  return 'Security';
});

const mnemonicArray = computed(() => {
  return revealedMnemonic.value ? revealedMnemonic.value.split(' ') : [];
});

// --- ACTIONS ---

const openSecurityModal = () => {
  uiState.value = 'menu';
  resetForms();
  keys.modalPin = true;
};

// 1. CHANGE PIN
const onChangePin = async () => {
  if (pinForm.value.oldPin.length !== 6 || pinForm.value.newPin.length !== 6) {
    showToast('Invalid PIN length', 'error');
    return;
  }
  isLoading.value = true;
  try {
    const res = await $POST(pinForm.value, 'pin/change');
    if (res.success) {
      showToast('PIN Updated', 'success');
      setTimeout(() => { keys.modalPin = false; }, 1500);
    } else {
      showToast(res.error || 'Failed', 'error');
    }
  } catch (e) {
    showToast('Network Error', 'error');
  } finally {
    isLoading.value = false;
  }
};

// 2. REVEAL KEYS
const onRevealMnemonic = async () => {
  if (viewForm.value.pin.length !== 6) {
    showToast('Invalid PIN', 'error');
    return;
  }
  isLoading.value = true;
  try {
    const res = await $POST(viewForm.value, 'wallet/view-mnemonic');
    if (res.mnemonic) {
      revealedMnemonic.value = res.mnemonic;
      uiState.value = 'view-display';
    } else {
      showToast(res.error || 'Error retrieving keys', 'error');
    }
  } catch (e) {
    showToast('Network Error', 'error');
  } finally {
    isLoading.value = false;
  }
};

// 3. UTILS
const copyMnemonic = () => {
  navigator.clipboard.writeText(revealedMnemonic.value);
  showToast('Copied', 'success');
};

const printMnemonic = () => {
  const printContent = document.getElementById('printable-mnemonic').innerHTML;
  const printWindow = window.open('', '', 'height=600,width=800');
  printWindow.document.write('<html><head><title>Wallet Backup</title><style>body{font-family:monospace;text-align:center;padding:20px;}.word-chip{border:1px solid #ccc;padding:5px;margin:5px;display:inline-block;}</style></head><body>');
  printWindow.document.write(printContent);
  printWindow.document.write('</body></html>');
  printWindow.document.close();
  printWindow.print();
};

const confirmDelete = () => { keys.confirmDelete = true; };

const onDeleteWallet = async () => {
  isDeleting.value = true;
  try {
    const payload = {
      pin: viewForm.value.pin,
      blockchain: viewForm.value.blockchain
    };
    // Ensure this route exists in backend, otherwise it will fail
    const res = await $POST(payload, 'wallet/delete');
    if (res.success || res.message) {
      showToast('Deleted', 'success');
      keys.confirmDelete = false;
      keys.modalPin = false;
    } else {
      showToast(res.error || 'Delete failed', 'error');
    }
  } catch (e) {
    showToast('Error', 'error');
  } finally {
    isDeleting.value = false;
  }
};

const resetAndClose = () => { keys.modalPin = false; resetForms(); };
const resetForms = () => {
  pinForm.value = { oldPin: '', newPin: '' };
  viewForm.value = { pin: '', blockchain: 'ETH' };
  revealedMnemonic.value = '';
};
const showToast = (msg, type) => {
  toast.value = { show: true, message: msg, type };
  setTimeout(() => { toast.value.show = false; }, 3000);
};
</script>

<style scoped>
/* Security Watermark (Compact Font) */
.security-watermark {
  position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: 90%; max-width: 600px; text-align: center;
  z-index: 0; pointer-events: none; user-select: none;
}
.security-watermark p {
  color: #9ca3af; opacity: 0.5; font-size: 11px; line-height: 1.5;
  font-weight: 600; text-transform: uppercase; margin: 0;
  font-family: 'Courier New', Courier, monospace; letter-spacing: 0.5px;
}
.security-watermark .warning-header {
  color: #ef4444; display: block; margin-bottom: 4px;
  font-size: 12px; font-weight: 800; opacity: 0.6;
}

/* Floating Button (Compact) */
.floating-pin-btn {
  position: fixed; bottom: 24px; right: 24px; padding: 20px 36px;
  background: #1bac4b; color: white; border: none; border-radius: 50px;
  cursor: pointer; box-shadow: 0 4px 12px rgba(27, 172, 75, 0.4);
  transition: all 0.3s ease; z-index: 999;
  display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600;
}
.floating-pin-btn i { font-size: 14px; }
.floating-pin-btn:hover { background: #159a43; transform: translateY(-2px); }
.floating-pin-btn:active { transform: translateY(0); }

/* Selection Cards (Compact) */
.selection-card {
  display: flex; align-items: center; gap: 10px;
  background: #fff; border: 1px solid #f3f4f6; border-radius: 8px;
  padding: 10px; cursor: pointer; transition: all 0.2s ease; width: 100%;
}
.selection-card:hover { border-color: #1bac4b; box-shadow: 0 2px 8px rgba(0,0,0,0.03); }
.icon-box { width: 32px; height: 32px; border-radius: 6px; display: flex; justify-content: center; align-items: center; }

/* Mnemonic Grid (Compact) */
.mnemonic-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px;
  background: #f9fafb; padding: 10px; border-radius: 8px; border: 1px solid #e5e7eb;
  margin-bottom: 10px;
}
.word-chip {
  background: #fff; border: 1px solid #e5e7eb; border-radius: 4px;
  padding: 3px 4px; display: flex; align-items: center; gap: 4px; font-size: 0.7rem; justify-content: center;
}
.word-index { color: #9ca3af; font-size: 0.65rem; user-select: none; }
.word-text { font-weight: 600; color: #374151; font-family: monospace; }

/* --------------------------------- */
/* COMPACT UI OVERRIDES              */
/* --------------------------------- */
.compact-dialog :deep(.p-dialog-header) { padding: 10px 15px !important; }
.compact-dialog :deep(.p-dialog-content) { padding: 0 15px 15px 15px !important; }

/* Compact Select */
.compact-select :deep(.p-select-label) { padding: 0.4rem; font-size: 0.75rem; }
.compact-select :deep(.p-select-dropdown) { width: 2rem; }

/* Compact OTP - Critical for reducing width */
.compact-otp :deep(.p-inputotp-input) {
  width: 2.5rem !important;
  height: 2.5rem !important;
  font-size: 1rem !important;
  padding: 0 !important;
}

/* Toast */
.toast {
  position: fixed; top: 16px; right: 16px; padding: 8px 16px;
  border-radius: 6px; display: flex; align-items: center; gap: 8px;
  font-size: 0.8rem; font-weight: 600; z-index: 11000;
  box-shadow: 0 4px 15px rgba(0,0,0,0.15); animation: slideIn 0.3s;
}
.toast.success { background: #1bac4b; color: white; }
.toast.error { background: #ef4444; color: white; }

@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

@media (max-width: 767px) {
  .floating-pin-btn { bottom: 80px; right: 16px; }
  .mnemonic-grid { grid-template-columns: repeat(3, 1fr); }
  .security-watermark p { font-size: 9px; }
  .security-watermark .warning-header { font-size: 8px; }
}
</style>
