<template>
  <div class="exchange-card">

    <!-- COMPACT TAB NAVIGATION -->
    <div class="tab-nav">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        <i :class="tab.icon"></i>
        <span>{{ tab.label }}</span>
      </button>
    </div>

    <!-- TAB CONTENT AREA -->
    <div class="tab-content">

      <!-- ============================ -->
      <!-- 1. EXCHANGE TAB              -->
      <!-- ============================ -->
      <div v-if="activeTab === 'exchange'" class="fade-in">

        <!-- FROM INPUT -->
        <div class="input-container">
          <div class="input-header">
            <span>You Pay</span>
            <span class="balance">Bal: 0.00</span>
          </div>
          <div class="input-row">
            <input
              v-model="calc.amount"
              type="number"
              placeholder="0.00"
              @input="calculateRate"
            />
            <div class="select-wrapper">
              <!-- Combined List, No Groups -->
              <select v-model="calc.fromId" @change="calculateRate">
                <option v-for="asset in allAssets" :key="asset.id" :value="asset.id">
                  {{ asset.symbol }}
                </option>
              </select>
              <i class="pi pi-angle-down"></i>
            </div>
          </div>
        </div>

        <!-- SWITCHER (Tiny) -->
        <div class="switcher-row">
          <div class="line"></div>
          <button class="switcher-btn" @click="switchAssets">
            <i class="pi pi-arrow-down-up" style="font-size: 10px;"></i>
          </button>
          <div class="line"></div>
        </div>

        <!-- TO INPUT -->
        <div class="input-container">
          <div class="input-header">
            <span>You Receive</span>
            <span class="rate-badge" v-if="exchangeRate">
              1 {{ getSymbol(calc.fromId) }} ≈ {{ formatRate(exchangeRate) }} {{ getSymbol(calc.toId) }}
            </span>
          </div>
          <div class="input-row">
            <input
              :value="resultAmount"
              type="text"
              readonly
              placeholder="0.00"
              class="readonly"
            />
            <div class="select-wrapper">
              <select v-model="calc.toId" @change="calculateRate">
                <option v-for="asset in allAssets" :key="asset.id" :value="asset.id">
                  {{ asset.symbol }}
                </option>
              </select>
              <i class="pi pi-angle-down"></i>
            </div>
          </div>
        </div>

        <button class="main-btn mt-3" @click="goToAuth" :disabled="loading">
          <i class="pi pi-refresh" :class="{'pi-spin': loading}" v-if="loading"></i>
          {{ loading ? 'Calculating...' : 'Exchange Now' }}
        </button>
      </div>

      <!-- ============================ -->
      <!-- 2. SWAP TAB                  -->
      <!-- ============================ -->
      <div v-if="activeTab === 'swap'" class="fade-in">

        <!-- FROM -->
        <div class="input-container">
          <label class="tiny-label">From</label>
          <div class="input-row">
            <input v-model="calc.amount" type="number" placeholder="0.00" @input="calculateRate" />
            <div class="select-wrapper">
              <select v-model="calc.fromId" @change="calculateRate">
                <option v-for="c in cryptoList" :key="c.id" :value="c.id">{{ c.symbol }}</option>
              </select>
              <i class="pi pi-angle-down"></i>
            </div>
          </div>
        </div>

        <!-- ARROW -->
        <div class="flex justify-center -my-2 relative z-10">
          <div class="bg-gray-100 p-1 rounded-full border border-white shadow-sm">
            <i class="pi pi-arrow-down text-gray-400" style="font-size: 10px;"></i>
          </div>
        </div>

        <!-- TO -->
        <div class="input-container">
          <label class="tiny-label">To (Estimate)</label>
          <div class="input-row">
            <input :value="resultAmount" type="text" readonly class="readonly" placeholder="0.00" />
            <div class="select-wrapper">
              <select v-model="calc.toId" @change="calculateRate">
                <option v-for="c in cryptoList" :key="c.id" :value="c.id">{{ c.symbol }}</option>
              </select>
              <i class="pi pi-angle-down"></i>
            </div>
          </div>
        </div>

        <div class="info-grid mt-2" v-if="exchangeRate">
          <div class="info-item">
            <span>Rate</span>
            <strong>{{ formatRate(exchangeRate) }}</strong>
          </div>
          <div class="info-item">
            <span>Slippage</span>
            <strong>0.5%</strong>
          </div>
          <div class="info-item">
            <span>Fee</span>
            <strong>$1.50</strong>
          </div>
        </div>

        <button class="main-btn mt-3 bg-slate-800 hover:bg-slate-700" @click="goToAuth">
          Connect to Swap
        </button>
      </div>

      <!-- ============================ -->
      <!-- 3. WALLET TAB (SEO Optimized) -->
      <!-- ============================ -->
      <div v-if="activeTab === 'wallet'" class="tab-pane center-pane fade-in">
        <div class="icon-circle bg-green-100 text-green-600">
          <i class="pi pi-shield" style="font-size: 1.2rem"></i>
        </div>
        <h3 class="text-sm font-extrabold text-gray-800 mb-1">Fortress-Level Security</h3>
        <p class="text-[10px] text-gray-500 px-6 mb-4 leading-relaxed">
          Experience the fusion of decentralized freedom and <strong>banking-grade reliability</strong>.
          Your assets are protected by next-gen encryption. You hold the keys, we protect the vault.
        </p>
        <button class="main-btn small-btn" @click="goToAuth">
          Create Secure Wallet
        </button>
      </div>

      <!-- ============================ -->
      <!-- 4. SEND TAB (SEO Optimized)   -->
      <!-- ============================ -->
      <div v-if="activeTab === 'send'" class="tab-pane center-pane fade-in">
        <div class="icon-circle bg-blue-100 text-blue-600">
          <i class="pi pi-globe" style="font-size: 1.2rem"></i>
        </div>
        <h3 class="text-sm font-extrabold text-gray-800 mb-1">Instant Global Settlement</h3>
        <p class="text-[10px] text-gray-500 px-6 mb-4 leading-relaxed">
          Bypass banking delays. Send funds across the globe in seconds with <strong>absolute credibility</strong>
          and minimal fees. High-speed transactions built for the modern economy.
        </p>
        <button class="main-btn small-btn" @click="goToAuth">
          Start Sending
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue';
import { useRouter } from "vue-router";

const router = useRouter();
const activeTab = ref('exchange');
const loading = ref(false);
const exchangeRate = ref(0);
const resultAmount = ref('');

// --- COMPACT DATA ---
const tabs = [
  { id: 'exchange', label: 'Exchange', icon: 'pi pi-refresh' },
  { id: 'swap', label: 'Swap', icon: 'pi pi-arrow-right-arrow-left' },
  { id: 'wallet', label: 'Wallet', icon: 'pi pi-wallet' },
  { id: 'send', label: 'Send', icon: 'pi pi-send' }
];

const fiatList = [
  { id: 'usd', apiId: 'usd', symbol: 'USD', type: 'fiat' },
  { id: 'eur', apiId: 'eur', symbol: 'EUR', type: 'fiat' },
  { id: 'gbp', apiId: 'gbp', symbol: 'GBP', type: 'fiat' },
  { id: 'ngn', apiId: 'ngn', symbol: 'NGN', type: 'fiat' },
];

const cryptoList = [
  { id: 'btc', apiId: 'bitcoin', symbol: 'BTC', type: 'crypto' },
  { id: 'eth', apiId: 'ethereum', symbol: 'ETH', type: 'crypto' },
  { id: 'usdt', apiId: 'tether', symbol: 'USDT', type: 'crypto' },
  { id: 'sol', apiId: 'solana', symbol: 'SOL', type: 'crypto' },
  { id: 'bnb', apiId: 'binancecoin', symbol: 'BNB', type: 'crypto' },
];

// Computed property to merge lists for the dropdown
const allAssets = computed(() => [...cryptoList, ...fiatList]);

// Calculation State
const calc = reactive({
  amount: 1,
  fromId: 'btc',
  toId: 'usd'
});

// --- HELPERS ---
const getAsset = (id) => allAssets.value.find(a => a.id === id);
const getSymbol = (id) => getAsset(id)?.symbol || '';

const formatRate = (rate) => {
  if (rate < 0.0001) return rate.toFixed(8);
  if (rate < 1) return rate.toFixed(4);
  return rate.toFixed(2);
};

// --- LOGIC ---
const switchAssets = () => {
  const temp = calc.fromId;
  calc.fromId = calc.toId;
  calc.toId = temp;
  calculateRate();
};

const goToAuth = () => { router.push('/login'); };

watch(activeTab, (newTab) => {
  if (newTab === 'swap') {
    calc.fromId = 'btc';
    calc.toId = 'eth';
  } else if (newTab === 'exchange') {
    calc.fromId = 'btc';
    calc.toId = 'usd';
  }
  if (['swap', 'exchange'].includes(newTab)) calculateRate();
});

const calculateRate = async () => {
  if (!calc.amount) { resultAmount.value = ''; return; }

  loading.value = true;
  try {
    const fromAsset = getAsset(calc.fromId);
    const toAsset = getAsset(calc.toId);

    // Mock Pricing Logic (In production, replace with CoinGecko API)
    const prices = {
      usd: 1, eur: 1.09, gbp: 1.27, ngn: 0.00065,
      btc: 98500, eth: 3850, usdt: 1, sol: 145, bnb: 620
    };

    const fromPrice = prices[fromAsset.id] || 0;
    const toPrice = prices[toAsset.id] || 1;

    exchangeRate.value = fromPrice / toPrice;
    const res = calc.amount * exchangeRate.value;

    resultAmount.value = toAsset.type === 'fiat'
      ? res.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : res.toFixed(6);

  } catch (e) {
    resultAmount.value = '---';
  } finally {
    loading.value = false;
  }
};

onMounted(() => { calculateRate(); });
</script>

<style scoped>
/* CARD CONTAINER */
.exchange-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  width: 100%;
  border: 1px solid #f3f4f6;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
}

/* NAVIGATION */
.tab-nav {
  display: flex;
  background: #fcfcfc;
  border-bottom: 1px solid #f1f5f9;
}
.tab-nav button {
  flex: 1;
  padding: 12px 0;
  border: none;
  background: transparent;
  color: #94a3b8;
  font-size: 10px;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: all 0.2s;
}
.tab-nav button i { font-size: 14px; margin-bottom: 2px; }
.tab-nav button:hover { background: #f8fafc; color: #64748b; }
.tab-nav button.active { color: #1bac4b; background: white; border-bottom: 2px solid #1bac4b; margin-bottom: -1px; }

/* CONTENT AREA */
.tab-content { padding: 16px; }

/* INPUT CONTAINERS */
.input-container {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 8px 12px;
  transition: border-color 0.2s;
}
.input-container:focus-within { border-color: #1bac4b; background: white; }

.input-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2px;
  font-size: 9px;
  color: #94a3b8;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.input-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

/* INPUT FIELDS */
input {
  width: 100%;
  background: transparent;
  border: none;
  font-size: 16px;
  font-weight: 700;
  color: #334155;
  outline: none;
  padding: 0;
}
input.readonly { color: #64748b; }

/* CUSTOM SELECT - SWEET & INTUITIVE */
.select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 20px; /* Pill Shape */
  padding: 4px 10px;
  border: 1px solid #e2e8f0; /* Thin border */
  min-width: 80px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.02); /* Very subtle depth */
  transition: all 0.2s ease;
}
.select-wrapper:hover { border-color: #cbd5e1; background: #fcfcfc; }

.select-wrapper select {
  appearance: none;
  background: transparent;
  border: none;
  font-size: 11px;
  font-weight: 600; /* Medium weight */
  color: #1e293b;
  padding-right: 18px;
  cursor: pointer;
  outline: none;
  width: 100%;
}
.select-wrapper i {
  position: absolute;
  right: 8px;
  font-size: 9px;
  color: #64748b;
  pointer-events: none;
}

/* SWITCHER */
.switcher-row {
  display: flex;
  align-items: center;
  margin: -10px 0;
  z-index: 10;
  position: relative;
}
.line { flex: 1; height: 1px; background: transparent; }
.switcher-btn {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: white;
  border: 1px solid #e2e8f0;
  color: #1bac4b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.04);
  transition: transform 0.2s;
}
.switcher-btn:hover { transform: rotate(180deg); border-color: #1bac4b; }

/* BUTTONS */
.main-btn {
  width: 100%;
  padding: 12px;
  border-radius: 4px;
  background: #1bac4b;
  color: white;
  font-size: 12px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: 0.2s;
  letter-spacing: 0.3px;
}
.main-btn:hover { background: #16a34a; transform: translateY(-1px); }
.main-btn.small-btn { width: auto; padding: 10px 24px; margin: 0 auto; }

/* UTILS */
.tiny-label { font-size: 9px; color: #94a3b8; font-weight: 600; display: block; margin-bottom: 2px; }
.rate-badge { background: #f0fdf4; color: #15803d; padding: 1px 6px; border-radius: 4px; font-size: 8px; }

/* INFO GRID (Swap) */
.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  background: #f8fafc;
  padding: 8px;
  border-radius: 8px;
}
.info-item { display: flex; flex-direction: column; align-items: center; text-align: center; }
.info-item span { font-size: 8px; color: #94a3b8; text-transform: uppercase; margin-bottom: 2px; }
.info-item strong { font-size: 10px; color: #334155; }

/* CENTER PANE */
.center-pane {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 240px;
}
.icon-circle {
  width: 50px; height: 50px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 12px;
}

/* ANIMATION */
.fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

/* Responsive Adjustments */
@media (max-width: 576px) {
  .exchange-card { border-radius: 0; border: none; box-shadow: none; }
  .tab-nav button span { font-size: 9px; }
}
</style>
