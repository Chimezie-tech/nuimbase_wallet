<template>
  <div class="dashboard-container">

    <!-- SECURITY MANDATE WATERMARK -->
    <div class="security-watermark">
      <p>
        <span class="warning-header">SECURITY MANDATE:</span><br>
        IMMEDIATE PIN UPDATE IS REQUIRED IF THIS DEVICE WAS LEFT UNATTENDED OR PREVIOUSLY LOST.
        NUIMBASE ASSISTANCE IS STRICTLY CONTINGENT UPON YOUR ADHERENCE TO THESE SECURITY PROTOCOLS.
      </p>
    </div>

    <!-- 1. WALLET CAROUSEL SECTION -->
    <div class="carousel-section">
      <div class="wallet-carousel">
        <!-- LOADING SKELETON -->
        <div v-if="isLoading" class="skeleton-card">
          <div class="spinner-border text-success" role="status"></div>
        </div>

        <!-- REAL WALLET CARDS -->
        <div v-else v-for="(wallet, index) in wallets" :key="index" class="atm-card nuimbase-card">
          <div class="card-top">
            <div class="balance-section">
              <span class="label">Balance</span>
              <div class="balance-row">
                <h2 class="balance-amount">
                  {{ hideBalance ? '******' : formatBalance(wallet.balance) }}
                </h2>
                <button class="icon-btn" @click.stop="togglePrivacy">
                  <i :class="hideBalance ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
                </button>
              </div>
              <span class="currency-badge">{{ wallet.blockchain }}</span>
            </div>
            <div class="brand-section">
              <span class="brand-name">Nuimbase</span>
              <div class="sim-chip"></div>
            </div>
          </div>
          <div class="card-bottom">
            <div class="address-container" @click="copyAddress(wallet.address)">
              <span class="address-text">{{ truncateAddress(wallet.address) }}</span>
              <i class="pi pi-copy copy-icon"></i>
            </div>
          </div>
        </div>

        <!-- ADD NEW CARD (Click to Open Flow) -->
        <div class="atm-card empty-card" @click="!isCheckingPin && openWalletFlow()">
          <div class="dashed-border">
            <div class="content" v-if="!isCheckingPin">
              <i class="pi pi-plus" style="font-size: 1.5rem; margin-bottom: 8px;"></i>
              <span>New / Import</span>
            </div>
            <div class="content" v-else>
              <i class="pi pi-spin pi-spinner" style="font-size: 1.5rem; margin-bottom: 8px; color: #1bac4b;"></i>
              <span style="color: #1bac4b;">Security Check...</span>
            </div>
          </div>
        </div>

        <div style="min-width: 20px;"></div>
      </div>
    </div>

    <!-- 2. MARKET TABS SECTION -->
    <div class="content-section">
      <MarketTabs @repeat-transaction="handleRepeatTransaction" />
    </div>

    <!-- 3. FLOATING ACTION BUTTON -->
    <button class="floating-create-btn" @click="!isCheckingPin && openWalletFlow()" aria-label="Create Wallet"
      :disabled="isCheckingPin">
      <i class="pi" :class="isCheckingPin ? 'pi-spin pi-spinner' : 'pi-wallet'"></i>
      <span>{{ isCheckingPin ? 'Please wait...' : 'Wallet Actions' }}</span>
    </button>

    <!-- ============================================ -->
    <!-- UNIFIED FLOW DIALOG                          -->
    <!-- ============================================ -->
    <Dialog v-model:visible="keys.modal" :header="dialogHeader" modal class="custom-dialog" :style="{ width: '350px' }"
      :closable="uiState !== 'success-transition'">

      <!-- STATE 1: CREATE PIN FORM -->
      <form v-if="uiState === 'create-pin'" @submit.prevent="handleCreatePin" class="space-y-4">
        <div class="text-center mb-4">
          <p class="text-xs text-gray-500">You must set a security PIN before proceeding.</p>
        </div>
        <div class="flex flex-col gap-2 mb-4">
          <label class="font-bold text-sm">Set New PIN</label>
          <InputOtp v-model="pinForm.pin" :length="6" mask integer />
        </div>
        <Button type="submit" label="Secure Account" class="w-full" severity="help" :loading="isSubmitting" />
      </form>

      <!-- STATE 2: SUCCESS TRANSITION -->
      <div v-else-if="uiState === 'success-transition'" class="flex flex-col items-center justify-center py-6">
        <i class="pi pi-check-circle text-green-500 fade-in-scale" style="font-size: 4rem; margin-bottom: 1rem;"></i>
        <h3 class="font-bold text-lg">PIN Set Successfully</h3>
        <p class="text-xs text-gray-400 mt-2">Proceeding...</p>
      </div>

      <!-- STATE 3: METHOD SELECTION (New or Import) -->
      <div v-else-if="uiState === 'method-select'" class="flex flex-col gap-3 py-2">
        <button class="selection-card" @click="uiState = 'create-wallet'">
          <div class="icon-box bg-green-100 text-green-600">
            <i class="pi pi-plus"></i>
          </div>
          <div class="text-left" style="padding-top: 13px;">
            <h5 class="text-sm" style="font-size: 14px; font-family: Poppins;">Generate New Wallet</h5>
            <p class="text-xs text-gray-500">Generate new seed phrase.</p>
          </div>
        </button>

        <button class="selection-card" @click="uiState = 'import-wallet'">
          <div class="icon-box bg-blue-100 text-blue-600">
            <i class="pi pi-download"></i>
          </div>
          <div class="text-left" style="padding-top: 13px;">
            <h4 class="text-sm" style="font-size: 14px; font-family: Poppins;">Import Existing Wallet</h4>
            <p class="text-xs text-gray-500">Restore using Mnemonic or Private Key.</p>
          </div>
        </button>
      </div>

      <!-- STATE 4: CREATE WALLET FORM -->
      <form v-else-if="uiState === 'create-wallet'" @submit.prevent="handleCreateWallet" class="space-y-4">
        <div class="flex flex-col gap-2 mb-3">
          <label class="text-sm" style="font-size: 14px; font-family: Poppins;">Verify PIN</label>
          <InputOtp v-model="walletForm.pin" :length="6" mask integer />
        </div>
        <div class="flex flex-col gap-2 mb-4">
          <label class="text-sm" style="font-size: 14px; font-family: Poppins;">Select Blockchain</label>
          <Select v-model="walletForm.blockchain" :options="tokens" option-label="label" option-value="key"
            class="w-full" />
        </div>
        <div class="flex gap-2">
          <Button type="button" label="Back" severity="secondary" @click="uiState = 'method-select'" class="flex-1" />
          <Button type="submit" label="Generate" class="flex-1" severity="success" :loading="isSubmitting" />
        </div>
      </form>

      <!-- STATE 5: IMPORT WALLET FORM -->
      <form v-else-if="uiState === 'import-wallet'" @submit.prevent="handleImportWallet" class="space-y-4">
        <div class="flex flex-col gap-2">
          <label class="font-bold text-sm">Select Blockchain</label>
          <Select v-model="importForm.blockchain" :options="tokens" option-label="label" option-value="key"
            class="w-full" />
        </div>

        <div class="flex flex-col gap-2">
          <label class="font-bold text-sm">Mnemonic or Private Key</label>
          <Textarea v-model="importForm.data" rows="3" class="w-full text-sm"
            placeholder="Enter 12/16/24-word phrase or 0x... key" />
          <small class="text-xs text-gray-400">Your keys are encrypted locally before storage.</small>
        </div>

        <div class="flex flex-col gap-2 mb-2">
          <label class="font-bold text-sm">Verify PIN</label>
          <InputOtp v-model="importForm.pin" :length="6" mask integer />
        </div>

        <div class="flex gap-2">
          <Button type="button" label="Back" severity="secondary" @click="uiState = 'method-select'" class="flex-1" />
          <Button type="submit" label="Import" class="flex-1" severity="info" :loading="isImporting" />
        </div>
      </form>

    </Dialog>

    <!-- MNEMONIC DISPLAY (Grid Layout) -->
    <Dialog v-model:visible="keys.showMnemonic" header="Wallet Created Successfully" modal :style="{ width: '400px' }"
      :closable="false">
      <div class="text-center">
        <i class="pi pi-check-circle text-green-500" style="font-size: 3rem; margin-bottom: 0.5rem;"></i>
        <p class="text-sm text-gray-600 mb-2">Please save your recovery phrase securely.</p>
        <p class="text-red-500 font-bold text-xs mb-4 uppercase bg-red-50 p-1 rounded"> Do not share this with anyone
        </p>

        <!-- Mnemonic Grid -->
        <div class="mnemonic-grid">
          <div v-for="(word, index) in mnemonicArray" :key="index" class="word-chip">
            <span class="word-index">{{ index + 1 }}</span>
            <span class="word-text">{{ word }}</span>
          </div>
        </div>

        <!-- Copy & Confirm Actions -->
        <div class="flex flex-col gap-3 mt-4">
          <Button label="Copy to Clipboard" icon="pi pi-copy" severity="secondary" outlined size="small"
            @click="copyMnemonic" />
          <Button label="I have saved it safely" severity="success" @click="keys.showMnemonic = false" />
        </div>
      </div>
    </Dialog>

    <!-- GENERIC MESSAGE DIALOG -->
    <Dialog v-model:visible="keys.showMessage" :header="messageData.title" modal :style="{ width: '300px' }">
      <div class="flex align-items-center gap-3">
        <i :class="messageData.icon" :style="{ color: messageData.color, fontSize: '2rem' }"></i>
        <span class="text-sm">{{ messageData.text }}</span>
      </div>
      <template #footer>
        <Button label="OK" @click="keys.showMessage = false" text />
      </template>
    </Dialog>

  </div>
</template>

<script setup lang="js">
import { onMounted, reactive, ref, computed } from 'vue';
import { Button, Dialog, InputOtp, Select, Textarea } from 'primevue';
import { $POST, $GET } from '@/scripts/utils';
import MarketTabs from '@/components/MarketTabs.vue';

// --- STATE MANAGEMENT ---
const wallets = ref([]);
const isLoading = ref(true);
const isCheckingPin = ref(false);
const isSubmitting = ref(false);    // Generate Wallet Spinner
const isImporting = ref(false);     // Import Wallet Spinner
const hideBalance = ref(false);
const newMnemonic = ref('');

// UI Flow State
// 'create-pin' | 'success-transition' | 'method-select' | 'create-wallet' | 'import-wallet'
const uiState = ref('method-select');

const keys = reactive({
  modal: false,
  showMnemonic: false,
  showMessage: false
});

// Forms
const pinForm = ref({ pin: '' });
const walletForm = ref({ pin: '', blockchain: 'BTC' });
const importForm = ref({ pin: '', blockchain: 'ETH', data: '' });
const messageData = reactive({ title: '', text: '', icon: '', color: '' });

const tokens = [
  { key: 'BTC', label: 'Bitcoin (BTC)' },
  { key: 'ETH', label: 'Ethereum (ETH)' },
  { key: 'BSC', label: 'Binance Smart Chain (BSC)' },
  { key: 'LTC', label: 'Litecoin (LTC)' },
  // { key: 'SOL', label: 'Solana (SOL)' },
  // { key: 'TRON', label: 'Tron (TRX)' },
  { key: 'CELO', label: 'Celo (CELO)' },
  { key: 'ONE', label: 'Harmony (ONE)' },
  { key: 'XDC', label: 'XDC Network (XDC)' },
  { key: 'KLAYTN', label: 'Klaytn (KLAY)' },
  { key: 'ALGO', label: 'Algorand (ALGO)' },
  { key: 'KCS', label: 'KuCoin (KCS)' },
];

// --- COMPUTED ---
const dialogHeader = computed(() => {
  if (uiState.value === 'create-pin') return 'Set Security PIN';
  if (uiState.value === 'success-transition') return 'Success';
  if (uiState.value === 'method-select') return 'Wallet Actions';
  if (uiState.value === 'import-wallet') return 'Import Wallet';
  return 'Generate Wallet';
});

const mnemonicArray = computed(() => {
  return newMnemonic.value ? newMnemonic.value.split(' ') : [];
});

// --- LOGIC ---

// 1. ENTRY POINT
const openWalletFlow = async () => {
  isCheckingPin.value = true;
  try {
    const res = await $POST({}, 'pin/check');
    // If user has a pin, let them choose method. If not, force pin creation.
    uiState.value = res.hasPin ? 'method-select' : 'create-pin';

    // Reset forms
    pinForm.value.pin = '';
    walletForm.value.pin = '';
    importForm.value.pin = '';
    importForm.value.data = '';

    keys.modal = true;
  } catch (e) {
    console.error(e);
    uiState.value = 'create-pin';
    keys.modal = true;
  } finally {
    isCheckingPin.value = false;
  }
};

  const handleRepeatTransaction = (tx) => {
  // 1. Open the Send Modal
  // 2. Pre-fill data
  // Example if using a ref to the Send Component:
  sendComponent.value.openSendModal();
  sendComponent.value.stForm.to = tx.toAddress;
  sendComponent.value.stForm.amount = tx.amount;
  sendComponent.value.stForm.selectedAssetKey = tx.blockchain;
}

// 2. CREATE PIN
const handleCreatePin = async () => {
  if (pinForm.value.pin.length !== 6) {
    showDialog('Error', 'PIN must be 6 digits', 'pi pi-times-circle', 'red');
    return;
  }

  isSubmitting.value = true;
  try {
    const res = await $POST(pinForm.value, 'pin/create');

    if (res.success) {
      uiState.value = 'success-transition';
      setTimeout(() => {
        uiState.value = 'method-select'; // Go to selection screen
      }, 1500);
    } else {
      showDialog('Failed', res.error || 'Could not create PIN', 'pi pi-times-circle', 'red');
    }
  } catch (e) {
    showDialog('Error', 'Network Error', 'pi pi-wifi', 'red');
  } finally {
    isSubmitting.value = false;
  }
};

// 3. CREATE WALLET
const handleCreateWallet = async () => {
  if (walletForm.value.pin.length !== 6) {
    showDialog('Error', 'Invalid PIN', 'pi pi-times-circle', 'red');
    return;
  }

  isSubmitting.value = true;
  try {
    const res = await $POST(walletForm.value, 'wallet/create');

    if (res.success) {
      keys.modal = false;
      newMnemonic.value = res.mnemonic;
      keys.showMnemonic = true;
      onStart();
    } else {
      showDialog('Failed', res.error || 'Creation failed', 'pi pi-times-circle', 'red');
    }
  } catch (e) {
    showDialog('Error', 'Connection failed', 'pi pi-wifi', 'red');
  } finally {
    isSubmitting.value = false;
  }
};

// 4. IMPORT WALLET
const handleImportWallet = async () => {
  if (importForm.value.pin.length !== 6) {
    showDialog('Error', 'Invalid PIN', 'pi pi-times-circle', 'red');
    return;
  }
  if (!importForm.value.data || importForm.value.data.length < 10) {
    showDialog('Error', 'Invalid Mnemonic or Private Key', 'pi pi-times-circle', 'red');
    return;
  }

  isImporting.value = true;
  try {
    const payload = {
      pin: importForm.value.pin,
      blockchain: importForm.value.blockchain,
      importData: importForm.value.data
    };

    const res = await $POST(payload, 'wallet/import');

    if (res.success) {
      keys.modal = false;
      showDialog('Success', 'Wallet Imported Successfully!', 'pi pi-check-circle', '#1bac4b');
      onStart(); // Refresh wallet list
    } else {
      showDialog('Import Failed', res.error, 'pi pi-times-circle', 'red');
    }
  } catch (e) {
    showDialog('Error', 'Connection failed during import', 'pi pi-wifi', 'red');
  } finally {
    isImporting.value = false;
  }
};

// --- HELPER FUNCTIONS ---
const copyMnemonic = () => {
  navigator.clipboard.writeText(newMnemonic.value);
  showDialog('Copied', 'Recovery phrase copied to clipboard', 'pi pi-check-circle', '#1bac4b');
};

const onStart = async () => {
  isLoading.value = true;
  try {
    const res = await $GET('wallets');
    if (res && res.wallets) {
      wallets.value = res.wallets.map(w => ({ ...w, balance: '...' }));
      isLoading.value = false;
      fetchBalances(wallets.value);
    } else {
      isLoading.value = false;
    }
  } catch (e) {
    isLoading.value = false;
  }
};

const fetchBalances = async (walletList) => {
  const promises = walletList.map(async (wallet, index) => {
    try {
      const res = await $POST({ blockchain: wallet.blockchain }, 'wallet/balance');
      if (res && res.success) {
        wallets.value[index].balance = res.balance.availBalance || res.balance.incoming || '0';
      }
    } catch (e) { console.log(e); }
  });
  await Promise.all(promises);
};

const showDialog = (title, text, icon, color) => {
  messageData.title = title;
  messageData.text = text;
  messageData.icon = icon;
  messageData.color = color;
  keys.showMessage = true;
};

const copyAddress = (addr) => {
  navigator.clipboard.writeText(addr);
  showDialog('Copied', 'Address copied!', 'pi pi-check-circle', '#1bac4b');
};

const togglePrivacy = () => { hideBalance.value = !hideBalance.value; };

const truncateAddress = (addr) => {
  if (!addr) return '';
  if (addr.length < 12) return addr;
  return `${addr.substring(0, 6)}...${addr.substring(addr.length - 6)}`;
};

const formatBalance = (bal) => {
  const num = parseFloat(bal);
  return isNaN(num) ? '0.00' : num.toFixed(5);
};

onMounted(() => { onStart(); });
</script>

<style scoped>
/* MAIN LAYOUT */
.dashboard-container {
  width: 100%;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* SECURITY WATERMARK */
.security-watermark {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 600px;
  text-align: center;
  z-index: 0;
  pointer-events: none;
  user-select: none;
}

.security-watermark p {
  color: #9ca3af;
  opacity: 0.5;
  font-size: 14px;
  line-height: 1.6;
  font-weight: 600;
  text-transform: uppercase;
  margin: 0;
  font-family: 'Courier New', Courier, monospace;
  letter-spacing: 0.5px;
}

.security-watermark .warning-header {
  color: #ef4444;
  display: block;
  margin-bottom: 8px;
  font-size: 16px;
  font-weight: 800;
  opacity: 0.6;
}

/* CAROUSEL & CARDS */
.carousel-section {
  width: 100%;
  z-index: 1;
}

.wallet-carousel {
  display: flex;
  overflow-x: auto;
  gap: 16px;
  padding: 10px 24px;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.wallet-carousel::-webkit-scrollbar {
  display: none;
}

.content-section {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding-bottom: 100px;
  z-index: 1;
}

.atm-card {
  flex: 0 0 auto;
  width: 290px;
  height: 170px;
  border-radius: 14px;
  scroll-snap-align: center;
  position: relative;
  padding: 18px;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 8px 20px rgba(27, 172, 75, 0.2);
  transition: transform 0.2s;
}

.nuimbase-card {
  background: linear-gradient(110deg, #1bac4b 0%, #2ce66e 100%);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.balance-section {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 0.65rem;
  opacity: 0.8;
  text-transform: uppercase;
  margin-bottom: 2px;
}

.balance-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.balance-amount {
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
  letter-spacing: 0.5px;
}

.icon-btn {
  background: none;
  border: none;
  color: white;
  padding: 0;
  cursor: pointer;
  opacity: 0.7;
}

.currency-badge {
  font-size: 0.75rem;
  opacity: 0.9;
  margin-top: 2px;
}

.brand-section {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.brand-name {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 8px;
}

.sim-chip {
  width: 36px;
  height: 26px;
  background: linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%);
  border-radius: 5px;
  border: 1px solid #999;
  position: relative;
}

.sim-chip::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 1px;
  background: #888;
}

.sim-chip::after {
  content: '';
  position: absolute;
  left: 33%;
  top: 0;
  width: 1px;
  height: 100%;
  background: #888;
}

.card-bottom {
  margin-top: auto;
}

.address-container {
  background: rgba(0, 0, 0, 0.1);
  padding: 6px 10px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  transition: background 0.2s;
}

.address-container:hover {
  background: rgba(0, 0, 0, 0.2);
}

.address-text {
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  margin-right: 8px;
  letter-spacing: 0.5px;
}

.copy-icon {
  font-size: 0.8rem;
  opacity: 0.8;
}

.empty-card {
  background: #f8f9fa;
  border: 2px dashed #ced4da;
  color: #adb5bd;
  box-shadow: none;
  cursor: pointer;
}

.empty-card:hover {
  border-color: #1bac4b;
  color: #1bac4b;
  background: #f0fff4;
}

.dashed-border {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.6rem;
  font-weight: 500;
}

.skeleton-card {
  flex: 0 0 auto;
  width: 290px;
  height: 170px;
  border-radius: 14px;
  background: #f1f3f5;
  display: flex;
  justify-content: center;
  align-items: center;
  scroll-snap-align: center;
}

/* SELECTION CARDS */
.selection-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.selection-card:hover {
  border-color: #1bac4b;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.icon-box {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
}

/* MNEMONIC GRID */
.mnemonic-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  background: #f8f9fa;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  margin-bottom: 12px;
}

.word-chip {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 4px 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
}

.word-index {
  color: #94a3b8;
  font-size: 0.75rem;
  user-select: none;
}

.word-text {
  font-weight: 600;
  color: #334155;
  font-family: monospace;
}

/* FLOATING BUTTON */
.floating-create-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 20px 36px;
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

.floating-create-btn:hover:not(:disabled) {
  background: #159a43;
  transform: translateY(-2px);
}

.floating-create-btn:active:not(:disabled) {
  transform: translateY(0);
}

.floating-create-btn:disabled {
  background: #8cd6a5;
  cursor: not-allowed;
}

/* ANIMATION */
@keyframes fadeInScale {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.fade-in-scale {
  animation: fadeInScale 0.4s ease-out forwards;
}

@media (max-width: 767px) {
  .floating-create-btn {
    bottom: 80px;
    right: 16px;
    padding: 10px 20px;
    font-size: 13px;
  }

  .security-watermark p {
    font-size: 11px;
  }

  .security-watermark .warning-header {
    font-size: 13px;
  }

  .mnemonic-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
