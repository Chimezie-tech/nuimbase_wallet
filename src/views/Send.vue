<template>
  <div class="send-wrapper">

    <!-- 1. MARKET TABS SECTION -->
    <div class="content-section">
        <MarketTabs @repeat-transaction="handleRepeatTransaction" />
    </div>

    <!-- 2. TWITTER-STYLE FLOATING ACTION BUTTON (FAB) -->
    <div class="fab-container">

      <!-- Expanded Options (Slide Up Animation) -->
      <div v-show="isFabOpen" class="fab-options">
        <button class="fab-option receive" @click="openReceiveModal">
          <span class="fab-label">Receive</span>
          <div class="fab-icon bg-blue-500"><i class="pi pi-qrcode text-white"></i></div>
        </button>

        <button class="fab-option send" @click="openSendModal">
          <span class="fab-label">Send</span>
          <div class="fab-icon bg-green-500"><i class="pi pi-send text-white"></i></div>
        </button>
      </div>

      <!-- Main Trigger Button -->
      <button
        class="main-fab"
        :class="{ 'is-open': isFabOpen }"
        @click="isFabOpen = !isFabOpen"
      >
        <i class="pi pi-plus transition-transform duration-300" :class="{ 'rotate-45': isFabOpen }"></i>
      </button>

      <!-- Backdrop for FAB -->
      <div v-if="isFabOpen" class="fab-backdrop" @click="isFabOpen = false"></div>
    </div>

    <!-- ============================================ -->
    <!-- SEND TOKEN DIALOG (COMPACT)                  -->
    <!-- ============================================ -->
    <Dialog
      v-model:visible="keys.modalSend"
      :header="step === 1 ? 'Send Assets' : 'Confirm'"
      modal
      class="compact-dialog"
      :style="{ width: '310px' }"
      :pt="{
        header: { class: '!py-2 !px-4' },
        content: { class: '!p-4' }
      }"
    >

      <!-- STEP 1: ENTER DETAILS -->
      <form @submit.prevent="onReview" v-if="step === 1" class="flex flex-col gap-3">

        <!-- Compact Header Grid -->
        <div class="grid grid-cols-2 gap-2">
          <div class="flex flex-col gap-1">
            <label class="text-[10px] font-bold text-gray-500 uppercase">Fiat</label>
            <Select
              v-model="fiatForm.currency"
              :options="fiatCurrencies"
              option-label="key"
              option-value="key"
              class="w-full compact-select"
              @change="updateExchangeRate"
            />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[10px] font-bold text-gray-500 uppercase">Asset</label>
            <Select
              v-model="stForm.selectedAssetKey"
              :options="tokens"
              option-label="key"
              option-value="key"
              class="w-full compact-select"
              @change="onAssetChange"
            />
          </div>
        </div>

        <!-- Tiny Balance Display -->
        <div class="flex justify-between items-center bg-gray-50 px-2 py-1.5 rounded border border-gray-100">
          <span class="text-[10px] text-gray-400">Available</span>
          <div class="text-[11px] font-semibold text-gray-700">
            {{ parseFloat(currentBalance).toFixed(4) }} {{ getCurrencyLabel() }}
            <span class="text-gray-400 font-normal">({{ formatFiat(currentBalance * fiatForm.rate) }})</span>
          </div>
        </div>

        <!-- Address Input -->
        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-bold text-gray-500 uppercase">To</label>
          <div class="input-icon-wrapper">
            <InputText
              v-model.trim="stForm.to"
              placeholder="Address"
              class="w-full compact-input pr-8"
              @input="validationError = ''"
            />
            <i class="pi pi-qrcode inner-icon text-xs" @click="openScanner"></i>
          </div>
          <small class="text-red-500 text-[9px] leading-tight" v-if="validationError">{{ validationError }}</small>
        </div>

        <!-- Compact Amount Logic -->
        <div class="flex flex-col gap-2 p-2 border border-gray-200 rounded bg-white">

          <!-- Fiat Row -->
          <div class="flex items-center gap-2">
            <span class="text-[10px] font-bold text-gray-400 w-8">{{ fiatForm.currency }}</span>
            <InputText
              v-model="fiatForm.amount"
              placeholder="0.00"
              type="number"
              class="w-full compact-input text-right"
              @input="convertFiatToCrypto"
            />
          </div>

          <!-- Crypto Row -->
          <div class="flex items-center gap-2">
            <span class="text-[10px] font-bold text-gray-400 w-8">{{ getCurrencyLabel() }}</span>
            <InputText
              v-model="stForm.amount"
              placeholder="0.00"
              type="number"
              class="w-full compact-input text-right"
              @input="convertCryptoToFiat"
            />
          </div>
        </div>

        <Button
          type="submit"
          label="Review"
          class="w-full !py-2 !text-xs"
          severity="success"
          :loading="isCalculating"
        />
      </form>

      <!-- STEP 2: CONFIRMATION -->
      <form @submit.prevent="onSend" v-if="step === 2" class="flex flex-col gap-3">

        <div class="bg-gray-50 p-3 rounded border border-gray-200">
          <div class="flex justify-between items-end mb-2">
            <span class="text-[10px] text-gray-500 uppercase">Sending</span>
            <div class="text-right">
              <strong class="block text-sm text-gray-800">{{ stForm.amount }} {{ getCurrencyLabel() }}</strong>
              <small class="text-[10px] text-gray-400">≈ {{ formatFiat(fiatForm.amount) }}</small>
            </div>
          </div>

          <div class="h-px bg-gray-200 my-2"></div>

          <div class="flex justify-between text-[10px] text-gray-500 mb-1">
            <span>Blockchain Fee</span>
            <span>{{ feeData.networkFee }}</span>
          </div>
          <div class="flex justify-between text-[10px] text-gray-500">
            <span>Nuimbase Fee</span>
            <span>{{ feeData.platformFee }}</span>
          </div>

          <div class="h-px bg-gray-200 my-2"></div>

          <div class="flex justify-between items-center">
            <span class="text-[10px] font-bold text-gray-600">TOTAL</span>
            <span class="text-xs font-bold text-green-600">{{ feeData.totalAmount }}</span>
          </div>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-bold text-gray-500 uppercase text-center">Confirm PIN</label>
          <div class="flex justify-center">
             <InputOtp v-model="stForm.pin" :length="6" mask integer />
          </div>
        </div>

        <div class="flex gap-2 mt-1">
          <Button type="button" label="Back" severity="secondary" size="small" outlined class="flex-1 !py-1 !text-xs" @click="step = 1" />
          <Button type="submit" label="Send" severity="danger" size="small" class="flex-1 !py-1 !text-xs" :loading="isSending" :disabled="stForm.pin.length !== 6" />
        </div>
      </form>
    </Dialog>

    <!-- ============================================ -->
    <!-- RECEIVE MODAL (COMPACT)                      -->
    <!-- ============================================ -->
    <Dialog
      v-model:visible="keys.modalReceive"
      header="Receive"
      modal
      class="compact-dialog"
      :style="{ width: '310px' }"
      :pt="{
        header: { class: '!py-2 !px-4' },
        content: { class: '!p-4' }
      }"
    >
      <div id="printable-receive" class="flex flex-col items-center gap-3 text-center">

        <Select
          v-model="receiveForm.selectedAssetKey"
          :options="tokens"
          option-label="label"
          option-value="key"
          class="w-full compact-select"
          @change="generateReceiveQR"
        />

        <div class="bg-white p-2 border border-gray-100 rounded-lg shadow-sm">
          <img v-if="receiveForm.qrCode" :src="receiveForm.qrCode" alt="QR" class="w-32 h-32" />
          <div v-else class="w-32 h-32 flex items-center justify-center bg-gray-50 text-gray-300">
            <i class="pi pi-spin pi-spinner" style="font-size: 1.5rem"></i>
          </div>
        </div>

        <div class="w-full bg-gray-50 p-2 rounded border border-gray-200">
          <p class="text-[10px] text-gray-400 uppercase font-bold mb-1">Address</p>
          <p class="text-[10px] font-mono text-gray-700 break-all leading-tight">{{ receiveForm.address }}</p>
        </div>

      </div>

      <div class="grid grid-cols-2 gap-2 mt-3">
        <Button label="Copy" icon="pi pi-copy" severity="secondary" outlined size="small" class="!text-xs" @click="copyReceiveAddress" />
        <Button label="Share" icon="pi pi-share-alt" severity="help" outlined size="small" class="!text-xs" @click="downloadReceivePDF" />
      </div>
    </Dialog>

    <!-- SCANNER (COMPACT) -->
    <Dialog v-model:visible="keys.scannerOpen" header="Scan QR" modal class="compact-dialog" :style="{ width: '310px' }">
      <div class="flex flex-col gap-2">
        <div class="overflow-hidden rounded-lg bg-black h-56 relative">
          <QrcodeStream @detect="onDecode" @error="onError" :track="paintBoundingBox">
             <div class="absolute inset-0 border-2 border-green-500 opacity-50 m-8 rounded-lg"></div>
          </QrcodeStream>
        </div>
        <Button label="Cancel" severity="secondary" size="small" class="w-full !py-1 !text-xs" @click="closeScanner" />
      </div>
    </Dialog>

    <!-- TOAST -->
    <div v-if="toast.show" :class="['toast', toast.type]">
      <i :class="toast.type === 'success' ? 'pi pi-check' : 'pi pi-info-circle'" style="font-size: 0.8rem;"></i>
      <span>{{ toast.message }}</span>
    </div>

  </div>
</template>

<script setup lang="js">
import { onMounted, reactive, ref, computed } from 'vue';
import { Button, Dialog, InputText, InputOtp, Select } from 'primevue';
import { QrcodeStream } from 'vue-qrcode-reader';
import QRCode from 'qrcode';
import { $POST, $GET } from '@/scripts/utils';
import MarketTabs from '@/components/MarketTabs.vue';
import { getCryptoPriceUSD, getFiatRateUSD } from '../scripts/tatumServices';

// --- STATE ---
const keys = reactive({
  modalSend: false,
  modalReceive: false,
  scannerOpen: false,
});

const isFabOpen = ref(false); // Controls the Floating Button Menu

// Full Asset List
const tokens = [
  { label: 'BTC', key: 'BTC', blockchain: 'BTC', isToken: false },
  { label: 'ETH', key: 'ETH', blockchain: 'ETH', isToken: false },
  { label: 'BSC', key: 'BSC', blockchain: 'BSC', isToken: false },
  { label: 'SOL', key: 'SOL', blockchain: 'SOLANA', isToken: false },
  { label: 'USDT (ETH)', key: 'USDT_ETH', blockchain: 'ETH', isToken: true, symbol: 'USDT' },
  { label: 'USDT (BSC)', key: 'USDT_BSC', blockchain: 'BSC', isToken: true, symbol: 'USDT' },
  { label: 'USDC (ETH)', key: 'USDC_ETH', blockchain: 'ETH', isToken: true, symbol: 'USDC' },
];

const fiatCurrencies = [
  { key: 'USD', symbol: '$' },
  { key: 'EUR', symbol: '€' },
  { key: 'GBP', symbol: '£' },
  { key: 'NGN', symbol: '₦' },
];

// Forms
const stForm = ref({ pin: '', selectedAssetKey: 'BTC', to: '', amount: '' });
const receiveForm = ref({ selectedAssetKey: 'BTC', address: '', qrCode: '' });
const fiatForm = ref({ currency: 'USD', amount: '', rate: 0 });

const feeData = ref({ networkFee: '0', platformFee: '0', totalAmount: '0' });
const userWallets = ref([]);

// UI State
const step = ref(1);
const isCalculating = ref(false);
const isSending = ref(false);
const validationError = ref('');
const toast = ref({ show: false, message: '', type: 'success' });

// --- HELPERS ---
const getCurrentAsset = () => tokens.find(t => t.key === stForm.value.selectedAssetKey) || tokens[0];
const getReceiveAsset = () => tokens.find(t => t.key === receiveForm.value.selectedAssetKey) || tokens[0];

const getCurrencyLabel = () => {
  const asset = getCurrentAsset();
  return asset.isToken ? asset.symbol : asset.blockchain;
};

const getReceiveCurrencyLabel = () => {
  const asset = getReceiveAsset();
  return asset.isToken ? asset.symbol : asset.blockchain;
};

const currentBalance = computed(() => {
  const asset = getCurrentAsset();
  const wallet = userWallets.value.find(w => w.blockchain === asset.blockchain);
  return wallet ? parseFloat(wallet.balance || 0) : 0;
});

// --- INITIALIZATION ---
const onStart = async () => {
  try {
    const res = await $GET('wallets');
    if (res && res.wallets) {
      userWallets.value = res.wallets;
      userWallets.value.forEach(async (w) => {
        const balRes = await $POST({ blockchain: w.blockchain }, 'wallet/balance');
        if(balRes.success) {
           const idx = userWallets.value.findIndex(uw => uw.blockchain === w.blockchain);
           if(idx !== -1) userWallets.value[idx].balance = balRes.balance.availBalance || balRes.balance.incoming;
        }
      });
    }
    updateExchangeRate();
  } catch(e) { console.error(e); }
};

// ... existing imports ...

// ... existing state variables ...

// ---------------------------------------------------------
// NEW FUNCTION: Handle Send Again from MarketTabs
// ---------------------------------------------------------
const handleRepeatTransaction = (tx) => {
  console.log("Repeating Transaction:", tx);

  // 1. Reset Flow
  step.value = 1;
  validationError.value = '';
  fiatForm.value.amount = ''; // Clear fiat input to avoid confusion

  // 2. Auto-Fill Data
  stForm.value.to = tx.toAddress;
  stForm.value.amount = Math.abs(parseFloat(tx.amount)).toString();

  // 3. Set Asset
  // This assumes your DB stores 'BTC', 'ETH' etc in tx.blockchain column
  stForm.value.selectedAssetKey = tx.blockchain;

  // 4. Open Modal
  keys.modalSend = true;

  // 5. Update Rates based on the selected asset
  // We use setTimeout to ensure the watcher/state updates first
  setTimeout(() => {
    updateExchangeRate();
    convertCryptoToFiat(); // Optional: calculate the fiat equivalent immediately
  }, 100);
};

// --- FIAT LOGIC (Now fully dynamic) ---
const updateExchangeRate = async () => {
  const asset = getCurrentAsset();
  const fiat = fiatForm.value.currency.toUpperCase(); // Ensure FIAT symbol is uppercase
 
  // 1. Identify the asset symbol
  const assetSymbol = asset.isToken ? asset.symbol : asset.blockchain;

  // 2. Get the real-time crypto price in USD
  const cryptoPriceUSD = await getCryptoPriceUSD(assetSymbol);
 
  if (cryptoPriceUSD <= 0) {
    console.warn(`Could not get dynamic USD price for ${assetSymbol}. Using 0 rate.`);
    fiatForm.value.rate = 0;
    if (stForm.value.amount) convertCryptoToFiat();
    return;
  }
 
  // 3. Get the real-time fiat exchange rate (USD to Target Fiat)
  const fiatMultiplier = await getFiatRateUSD(fiat);

  console.log(`Dynamic Rate Check: 1 USD = ${fiatMultiplier.toFixed(4)} ${fiat}`);
 
  // 4. Calculate the final exchange rate: (Crypto Price in USD) * (USD to Target Fiat Multiplier)
  const finalRate = cryptoPriceUSD * fiatMultiplier;

  // 5. Update the form data
  fiatForm.value.rate = finalRate;

  // 6. Convert the existing amount if present
  if (stForm.value.amount) {
    convertCryptoToFiat();
  }
};

const convertFiatToCrypto = () => {
  if (!fiatForm.value.amount || fiatForm.value.rate === 0) {
    stForm.value.amount = '';
    return;
  }
  const cryptoVal = parseFloat(fiatForm.value.amount) / fiatForm.value.rate;
  stForm.value.amount = cryptoVal.toFixed(6);
};

const convertCryptoToFiat = () => {
  if (!stForm.value.amount || fiatForm.value.rate === 0) {
    fiatForm.value.amount = '';
    return;
  }
  const fiatVal = parseFloat(stForm.value.amount) * fiatForm.value.rate;
  fiatForm.value.amount = fiatVal.toFixed(2);
};

const formatFiat = (val) => {
  if(!val) return '0.00';
  const currencySym = fiatCurrencies.find(f => f.key === fiatForm.value.currency)?.symbol || '';
  return `${currencySym}${parseFloat(val).toFixed(2)}`;
}

const onAssetChange = () => {
  updateExchangeRate();
  stForm.value.amount = '';
  fiatForm.value.amount = '';
};

// --- MODAL TRIGGERS ---
const openSendModal = () => {
  isFabOpen.value = false;
  step.value = 1;
  stForm.value.amount = '';
  fiatForm.value.amount = '';
  keys.modalSend = true;
  updateExchangeRate();
};

const openReceiveModal = () => {
  isFabOpen.value = false;
  keys.modalReceive = true;
  generateReceiveQR();
};

// --- LOGIC: SEND ---
const onReview = async () => {
  validationError.value = '';
  const asset = getCurrentAsset();

  if (!stForm.value.to || stForm.value.to.length < 15) {
    validationError.value = 'Address too short';
    return;
  }
  if (!stForm.value.amount || parseFloat(stForm.value.amount) <= 0) {
    validationError.value = 'Invalid amount';
    return;
  }

  isCalculating.value = true;
  try {
    const payload = {
      pin: '000000',
      blockchain: asset.blockchain,
      symbol: asset.isToken ? asset.symbol : null,
      to: stForm.value.to,
      amount: stForm.value.amount
    };
    const res = await $POST(payload, 'transfer/fee');
    if (res.error) {
      showToast(res.error, 'error');
    } else {
      feeData.value = {
        networkFee: res.networkFee,
        platformFee: res.platformFee,
        totalAmount: res.totalAmount
      };
      step.value = 2;
    }
  } catch (e) {
    showToast('Calculation error', 'error');
  } finally {
    isCalculating.value = false;
  }
};

const onSend = async () => {
  if (stForm.value.pin.length !== 6) return;
  isSending.value = true;
  const asset = getCurrentAsset();
  try {
    const payload = {
      pin: stForm.value.pin,
      blockchain: asset.blockchain,
      symbol: asset.isToken ? asset.symbol : null,
      to: stForm.value.to,
      amount: stForm.value.amount
    };
    const res = await $POST(payload, 'transfer/send');
    if (res.success) {
      showToast('Sent!', 'success');
      keys.modalSend = false;
    } else {
      showToast(res.error, 'error');
    }
  } catch (e) {
    showToast('Network error', 'error');
  } finally {
    isSending.value = false;
  }
};

// --- LOGIC: RECEIVE ---
const generateReceiveQR = async () => {
  const asset = getReceiveAsset();
  const wallet = userWallets.value.find(w => w.blockchain === asset.blockchain);

  if (wallet && wallet.address) {
    receiveForm.value.address = wallet.address;
    try {
      receiveForm.value.qrCode = await QRCode.toDataURL(wallet.address, {
        width: 200, margin: 1, color: { dark: '#000000', light: '#ffffff' }
      });
    } catch (err) { console.error(err); }
  } else {
    receiveForm.value.address = 'No wallet found';
    receiveForm.value.qrCode = '';
  }
};

const copyReceiveAddress = () => {
  navigator.clipboard.writeText(receiveForm.value.address);
  showToast('Copied', 'success');
};

const downloadReceivePDF = () => {
  // Simple print logic
  const printContent = document.getElementById('printable-receive').innerHTML;
  const printWindow = window.open('', '', 'height=600,width=800');
  printWindow.document.write('<html><head><title>Receive</title><style>body{text-align:center; font-family:sans-serif;}</style></head><body>');
  printWindow.document.write(printContent);
  printWindow.document.write('</body></html>');
  printWindow.document.close();
  printWindow.print();
};

// --- QR SCANNER ---
const openScanner = () => { keys.scannerOpen = true; };
const closeScanner = () => { keys.scannerOpen = false; };
const onDecode = (detected) => {
  let result = detected[0]?.rawValue;
  if(result) {
    result = result.replace(/^(bitcoin:|ethereum:)/i, '').trim();
    stForm.value.to = result;
    closeScanner();
  }
};
const onError = (e) => { console.error(e); };
const paintBoundingBox = (detected, ctx) => {
  for (const det of detected) {
    const { x, y, width, height } = det.boundingBox;
    ctx.lineWidth = 2; ctx.strokeStyle = '#1bac4b'; ctx.strokeRect(x, y, width, height);
  }
};

const showToast = (msg, type) => {
  toast.value = { show: true, message: msg, type };
  setTimeout(() => toast.value.show = false, 3000);
};

onMounted(() => { onStart(); });
</script>

<style scoped>
.send-wrapper { width: 100%; }
.content-section { width: 100%; max-width: 800px; margin: 0 auto; padding-bottom: 100px; }

/* --------------------------------- */
/* TWITTER-STYLE FAB SYSTEM          */
/* --------------------------------- */
.fab-container {
  position: fixed; bottom: 24px; right: 24px; z-index: 1000;
  display: flex; flex-direction: column; align-items: end; gap: 12px;
}

/* Main Button */
.main-fab {
  width: 50px; height: 50px; border-radius: 50%;
  background: #1bac4b; color: white; border: none;
  box-shadow: 0 4px 12px rgba(27, 172, 75, 0.4);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.5rem; cursor: pointer; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 1002;
}
.main-fab:active { transform: scale(0.9); }
.main-fab.is-open { background: #333; transform: rotate(135deg); box-shadow: 0 4px 12px rgba(0,0,0,0.3); }

/* Option Buttons (Send/Receive) */
.fab-options {
  display: flex; flex-direction: column; align-items: flex-end; gap: 12px;
  animation: slideUp 0.2s ease-out; z-index: 1002; margin-bottom: 5px;
}

.fab-option {
  display: flex; align-items: center; gap: 10px; border: none; background: transparent; cursor: pointer;
}
.fab-label {
  background: white; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 600;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1); color: #555;
  opacity: 0; animation: fadeIn 0.2s 0.1s forwards;
}
.fab-icon {
  width: 40px; height: 40px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 3px 10px rgba(0,0,0,0.2); transition: transform 0.2s;
}
.fab-icon:hover { transform: scale(1.1); }

/* Backdrop */
.fab-backdrop {
  position: fixed; inset: 0; background: rgba(255,255,255,0.8); backdrop-filter: blur(4px); z-index: 1001;
  animation: fadeIn 0.2s;
}

/* --------------------------------- */
/* COMPACT UI OVERRIDES              */
/* --------------------------------- */
.compact-dialog :deep(.p-dialog-header) { padding: 10px 15px !important; }
.compact-dialog :deep(.p-dialog-content) { padding: 0 15px 15px 15px !important; }

/* Customizing PrimeVue Components for Compactness */
.compact-input :deep(.p-inputtext) {
  padding-top: 0.4rem; padding-bottom: 0.4rem; font-size: 0.75rem; height: 2.2rem;
}
.compact-select :deep(.p-select-label) {
  padding: 0.4rem; font-size: 0.75rem;
}
.compact-select :deep(.p-select-dropdown) {
  width: 2rem;
}

/* Inputs wrapper */
.input-icon-wrapper { position: relative; display: flex; align-items: center; }
.inner-icon { position: absolute; right: 10px; cursor: pointer; color: #666; }

/* Toast */
.toast {
  position: fixed; top: 16px; right: 16px; padding: 8px 16px;
  border-radius: 6px; display: flex; align-items: center; gap: 8px;
  font-size: 0.8rem; font-weight: 600; z-index: 11000;
  box-shadow: 0 4px 15px rgba(0,0,0,0.15); animation: slideIn 0.3s;
}
.toast.success { background: #1bac4b; color: white; }
.toast.error { background: #ef4444; color: white; }

@keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

@media (max-width: 767px) {
  .fab-container { bottom: 80px; right: 16px; }
}
</style>
