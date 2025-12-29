<template>
  <div class="market-section mt-4 mb-5">

    <!-- 1. CUSTOM MENU TABS -->
    <div class="menu-table">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        class="tab-btn"
        :class="{ active: activeTab === index }"
        @click="activeTab = index"
      >
        {{ tab }}
      </button>
    </div>

    <!-- CONTENT AREA -->
    <div class="tab-content mt-3">

      <!-- LOADING -->
      <div v-if="loading" class="loading-container">
        <div class="spinner-border text-brand" role="status"></div>
      </div>

      <!-- COIN LISTS (Tab 0, 1, 2) -->
      <div v-else-if="activeTab < 3" class="coin-list fade-in">
        <div
          v-for="coin in getActiveCoinList()"
          :key="coin.id"
          class="coin-row"
          @click="openCoinDetails(coin)"
        >
          <div class="flex align-items-center gap-3">
            <img :src="coin.image" alt="icon" class="coin-icon">
            <div class="flex flex-column">
              <span class="font-bold text-sm">{{ coin.symbol.toUpperCase() }}</span>
              <span class="text-[10px] text-gray-400">{{ coin.name }}</span>
            </div>
          </div>

          <div class="text-right">
            <div class="font-bold text-sm">${{ coin.current_price.toLocaleString() }}</div>
            <div
              :class="coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'"
              class="text-[10px] font-medium"
            >
              {{ coin.price_change_percentage_24h > 0 ? '+' : '' }}{{ coin.price_change_percentage_24h.toFixed(2) }}%
            </div>
          </div>
        </div>
      </div>

      <!-- TRANSACTIONS (Tab 3) -->
      <div v-else class="transactions-list fade-in">

        <div v-if="transactions.length === 0" class="empty-tx">
          <i class="pi pi-history"></i>
          <p>No transactions yet.</p>
        </div>

        <div v-for="tx in transactions" :key="tx.id" class="tx-card-compact">
          <!-- Icon -->
          <div class="tx-icon-box">
            <i class="pi pi-arrow-up-right text-red-500 text-xs"></i>
          </div>

          <!-- Info -->
          <div class="tx-info">
            <div class="flex justify-between items-center">
              <span class="font-bold text-xs">Sent {{ tx.blockchain }}</span>
              <span class="font-bold text-xs text-red-500">-{{ parseFloat(tx.amount).toFixed(4) }}</span>
            </div>
            <div class="flex justify-between items-center mt-1">
              <span class="text-[10px] text-gray-400 font-mono">{{ truncate(tx.toAddress) }}</span>
              <span class="text-[10px] text-gray-400">{{ formatDate(tx.createdAt) }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="tx-actions">
            <!-- REPEAT TRANSACTION BUTTON -->
            <button class="action-icon-btn" @click.stop="$emit('repeat-transaction', tx)" title="Send Again">
              <i class="pi pi-replay"></i>
            </button>
            <button class="action-icon-btn" @click.stop="generatePDF(tx)" title="Receipt">
              <i class="pi pi-file-pdf"></i>
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- ============================================ -->
    <!-- COIN DETAIL & GRAPH MODAL                    -->
    <!-- ============================================ -->
    <Dialog
      v-model:visible="keys.modalGraph"
      modal
      class="custom-dialog"
      :style="{ width: '340px' }"
      :showHeader="false"
      :contentStyle="{ padding: '0' }"
    >
      <div class="graph-modal-content" v-if="selectedCoin">

        <!-- Header -->
        <div class="flex justify-between items-center p-4 pb-0">
          <div class="flex items-center gap-2">
            <img :src="selectedCoin.image" class="w-8 h-8 rounded-full" />
            <div>
              <h3 class="font-bold text-lg leading-tight">{{ selectedCoin.name }}</h3>
              <span class="text-xs text-gray-500">{{ selectedCoin.symbol.toUpperCase() }}</span>
            </div>
          </div>
          <div class="text-right">
            <div class="font-bold text-lg">${{ selectedCoin.current_price.toLocaleString() }}</div>
            <div :class="selectedCoin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'" class="text-xs font-bold">
              {{ selectedCoin.price_change_percentage_24h.toFixed(2) }}%
            </div>
          </div>
        </div>

        <!-- Graph Container -->
        <div class="chart-container mt-6 mb-2">
            <svg v-if="graphPath" viewBox="0 0 300 100" class="chart-svg">
            <!-- Gradient Definition -->
            <defs>
              <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stop-color="#1bac4b" stop-opacity="0.4"/>
                <stop offset="100%" stop-color="#1bac4b" stop-opacity="0"/>
              </linearGradient>
            </defs>
            <!-- Area Fill -->
            <path :d="`M0,100 ${graphPath} V100 Z`" fill="url(#chartGradient)" stroke="none" />
            <!-- Line -->
            <path :d="graphPath" fill="none" stroke="#1bac4b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <div v-else class="h-[100px] flex items-center justify-center">
            <i class="pi pi-spin pi-spinner text-green-500"></i>
          </div>
        </div>

        <!-- Time Filters -->
        <div class="flex justify-center gap-4 mb-4">
          <button
            v-for="range in timeRanges"
            :key="range.days"
            class="time-btn"
            :class="{ active: selectedRange === range.days }"
            @click="fetchGraphData(range.days)"
          >
            {{ range.label }}
          </button>
        </div>

        <!-- Close & Footer -->
        <div class="bg-gray-50 p-3 text-center border-t border-gray-100">
          <p class="text-[10px] text-gray-400 uppercase tracking-widest mb-3">Powered by Nuimbase</p>
          <button @click="keys.modalGraph = false" class="w-full bg-white border border-gray-200 text-gray-600 font-bold text-xs py-3 rounded-lg shadow-sm hover:bg-gray-50">
            Close Details
          </button>
        </div>

      </div>
    </Dialog>

  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue'
import { supabase } from '@/scripts/supabase'
import { Button, Dialog } from 'primevue' // Ensure Dialog is imported
import jsPDF from 'jspdf'

const tabs = ['Prices', 'Gainers', 'Losers', 'Activity']
const activeTab = ref(0)
const loading = ref(true)
const coinData = ref([])
const transactions = ref([])

// Graph State
const keys = reactive({ modalGraph: false })
const selectedCoin = ref(null)
const selectedRange = ref(1) // Default 1 Day
const graphData = ref([])

const timeRanges = [
  { label: '24H', days: 1 },
  { label: '1W', days: 7 },
  { label: '1M', days: 30 },
  { label: '1Y', days: 365 },
]

// --- DATA FETCHING ---
const initData = async () => {
  loading.value = true
  await Promise.all([fetchCoins(), fetchTransactions()])
  loading.value = false
}

const fetchCoins = async () => {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=1&sparkline=false&price_change_percentage=24h')

    // Check if the server actually returned data
    if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`)
    }

    coinData.value = await res.json()
  } catch (err) {
    console.error("Fetch failed:", err.message)
    // Optional: Set an error state to show in UI
  }
}

const fetchTransactions = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('transactions').select('*').eq('uuid', user.id).order('createdAt', { ascending: false })
    transactions.value = data || []
  } catch (err) { console.error(err) }
}

// --- GRAPH LOGIC ---
const openCoinDetails = (coin) => {
  selectedCoin.value = coin
  keys.modalGraph = true
  fetchGraphData(1) // Fetch 24h default
}

const fetchGraphData = async (days) => {
  selectedRange.value = days
  graphData.value = [] // Reset to trigger spinner
  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/${selectedCoin.value.id}/market_chart?vs_currency=usd&days=${days}`)
    const data = await res.json()
    // Extract only prices (index 1 of array)
    graphData.value = data.prices.map(p => p[1])
  } catch (e) { console.error("Graph Error", e) }
}

// Convert Array of Numbers to SVG Path
const graphPath = computed(() => {
  const data = graphData.value
  if (!data.length) return ''

  const width = 300
  const height = 100
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min

  // Map points to SVG coordinates
  const points = data.map((val, index) => {
    const x = (index / (data.length - 1)) * width
    // Flip Y axis because SVG 0 is top
    const y = height - ((val - min) / range) * height
    return `${x},${y}`
  })

  // Smooth line logic could go here, but polyline is faster/lighter
  return `M${points.join(' L')}`
})

// --- HELPERS ---
const getActiveCoinList = () => {
  if (activeTab.value === 0) return coinData.value
  if (activeTab.value === 1) return [...coinData.value].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h).slice(0, 5)
  if (activeTab.value === 2) return [...coinData.value].sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h).slice(0, 5)
  return []
}

const truncate = (str) => str ? `${str.substring(0, 6)}...${str.substring(str.length - 4)}` : ''
const formatDate = (str) => new Date(str).toLocaleDateString()

const generatePDF = (tx) => {
  const doc = new jsPDF({ unit: 'mm', format: [80, 120] })
  doc.setFontSize(10); doc.text("Transaction Receipt", 40, 10, { align: "center" })
  doc.setFontSize(8); doc.text(`Amount: ${tx.amount} ${tx.blockchain}`, 10, 30)
  doc.text(`To: ${tx.toAddress}`, 10, 40)
  doc.save(`tx-${tx.txId.substring(0,6)}.pdf`)
}

onMounted(() => { initData() })
</script>

<style scoped>
.market-section { width: 100%; max-width: 800px; margin: 0 auto; }
.text-brand { color: #1bac4b; }

/* TABS */
.menu-table { display: flex; background: #f8fafc; padding: 4px; border-radius: 10px; gap: 4px; border: 1px solid #f1f5f9; }
.tab-btn { flex: 1; padding: 8px 0; border: none; background: transparent; font-size: 11px; font-weight: 600; color: #94a3b8; border-radius: 8px; cursor: pointer; transition: 0.2s; }
.tab-btn.active { background: white; color: #1bac4b; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }

/* COIN LIST - Sleek Rows */
.coin-list { display: flex; flex-direction: column; }
.coin-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 12px 8px;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer; transition: background 0.1s;
}
.coin-row:last-child { border-bottom: none; }
.coin-row:hover { background: #fcfcfc; }
.coin-icon { width: 28px; height: 28px; border-radius: 50%; }

/* COMPACT TX CARD */
.transactions-list { display: flex; flex-direction: column; gap: 8px; }
.tx-card-compact {
  display: flex; align-items: center; gap: 10px;
  background: white; border: 1px solid #f1f5f9;
  padding: 8px 12px; border-radius: 10px;
}
.tx-icon-box {
  width: 32px; height: 32px; border-radius: 50%;
  background: #fef2f2; display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.tx-info { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.tx-actions { display: flex; gap: 4px; }
.action-icon-btn {
  width: 28px; height: 28px; border-radius: 50%; border: 1px solid #e2e8f0;
  background: white; color: #64748b; display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: 0.2s;
}
.action-icon-btn:hover { border-color: #1bac4b; color: #1bac4b; }

/* GRAPH MODAL */
.graph-modal-content { overflow: hidden; }
.chart-container { width: 100%; height: 120px; overflow: hidden; }
.chart-svg { width: 100%; height: 100%; transform: scale(1.02); } /* Slight scale to hide edges */

.time-btn {
  padding: 4px 12px; border-radius: 20px; font-size: 10px; font-weight: 700;
  border: 1px solid #e2e8f0; background: white; color: #64748b; cursor: pointer;
}
.time-btn.active { background: #1bac4b; color: white; border-color: #1bac4b; }

.loading-container { padding: 30px; text-align: center; }
.empty-tx { padding: 30px; text-align: center; color: #cbd5e1; font-size: 12px; }

/* ANIMATION */
.fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
</style>
