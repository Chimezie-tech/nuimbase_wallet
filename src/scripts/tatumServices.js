// services/tatumServices.js

import { ethers } from 'ethers';


// ✅ CONFIGURATION
const TATUM_API_KEY = import.meta.env.VITE_TATUM_MAINNET_API;
const USE_TESTNET = false;

const BASE_URL = 'https://api.tatum.io/v3';

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';
// exchangerate.host is free and requires no API key for basic USD conversion
const FIAT_EXCHANGE_BASE_URL = 'https://api.exchangerate.host';

// --- COINGECKO MAPPING ---
// Maps internal asset symbols to CoinGecko IDs
const COINGECKO_MAP = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  BSC: 'binancecoin',
  SOL: 'solana',
  USDT: 'tether',
  USDC: 'usd-coin',
  KLAYTN: 'klaytn',
  XDC: 'xdce-crowd-sale',
  ONE: 'harmony',
  LTC: 'litecoin',
  CELO: 'celo',
  // ... add other crypto assets as needed ...
};

// =======================================================
// ⭐ DYNAMIC EXCHANGE RATE FUNCTIONS
// =======================================================

/**
 * Fetches the current USD price for a given cryptocurrency symbol from CoinGecko.
 * @param {string} symbol - The crypto symbol (e.g., 'BTC', 'ETH').
 * @returns {Promise<number>} The price in USD, or 0 on error/not found.
 */
export const getCryptoPriceUSD = async (symbol) => {
  const id = COINGECKO_MAP[symbol.toUpperCase()];

  if (!id) {
    console.warn(`CoinGecko ID not found for ${symbol}. Using fallback rate.`);
    return 0;
  }

  try {
    const url = `${COINGECKO_BASE_URL}/simple/price?ids=${id}&vs_currencies=usd`;
    const res = await fetch(url);
   
    if (!res.ok) {
      throw new Error(`CoinGecko API call failed with status ${res.status}`);
    }

    const data = await res.json();
    return data[id]?.usd || 0;
  } catch (e) {
    console.error('Error fetching crypto price:', e.message);
    return 0;
  }
};

/**
 * Fetches the exchange rate multiplier from USD to a target fiat currency.
 * @param {string} fiat - The target fiat currency (e.g., 'EUR', 'NGN').
 * @returns {Promise<number>} The multiplier (e.g., USD -> EUR rate), or 1 on error.
 */
export const getFiatRateUSD = async (fiat) => {
  // USD is the base currency for crypto prices, so multiplier is 1
  if (fiat.toUpperCase() === 'USD') return 1;

  try {
    // We query the exchange rate from USD to the target fiat
    const url = `${FIAT_EXCHANGE_BASE_URL}/latest?base=USD&symbols=${fiat}`;
    const res = await fetch(url);
   
    if (!res.ok) {
      throw new Error(`Fiat exchange API call failed with status ${res.status}`);
    }

    const data = await res.json();
    // The result format is { "rates": { "EUR": 0.92 } }
    return data.rates?.[fiat.toUpperCase()] || 1;

  } catch (e) {
    console.error('Error fetching fiat rate:', e.message);
    // Fallback: default to 1 so the crypto USD price is used directly (if fiat is not found)
    return 1;
  }
};

/**
 * ⭐ NEW FUNCTION: Calculates the conversion rate from a crypto symbol to a target fiat.
 * Formula: Crypto/Fiat Rate = (Crypto/USD Rate) * (USD/Fiat Multiplier)
 * @param {string} cryptoSymbol - The crypto symbol (e.g., 'BTC').
 * @param {string} fiatSymbol - The target fiat symbol (e.g., 'EUR').
 * @returns {Promise<number>} The rate (e.g., BTC/EUR), or 0 on failure.
 */
export const getConversionRate = async (cryptoSymbol, fiatSymbol) => {
    try {
        const usdPrice = await getCryptoPriceUSD(cryptoSymbol);
        if (usdPrice === 0) {
            console.warn(`Could not get USD price for ${cryptoSymbol}.`);
            return 0;
        }

        const fiatMultiplier = await getFiatRateUSD(fiatSymbol);

        // Final Rate = USD Price * USD/Fiat Multiplier
        return usdPrice * fiatMultiplier;
    } catch (e) {
        console.error('Error calculating conversion rate:', e.message);
        return 0;
    }
};

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'x-api-key': TATUM_API_KEY
});

const getChainConfig = (chain) => {
  chain = chain.toUpperCase();
  const apiSlugs = {
    ETH: 'ethereum', BSC: 'bsc', POLYGON: 'polygon', BTC: 'bitcoin', LTC: 'litecoin',
    SOL: 'solana', CELO: 'celo', TRON: 'tron', ALGO: 'algorand', KLAYTN: 'klaytn',
    XDC: 'xdc', ONE: 'one', KCS: 'kcs'
  };
  const rpcSlugs = USE_TESTNET ? {
    ETH: 'ethereum-sepolia', BSC: 'bsc-testnet', SOL: 'solana-devnet', CELO: 'celo-alfajores',
    KLAYTN: 'klaytn-baobab', XDC: 'xdc-apothem', ONE: 'harmony-shard0-testnet'
  } : {
    ETH: 'ethereum-mainnet', BSC: 'bsc-mainnet', SOL: 'solana-mainnet', CELO: 'celo-mainnet',
    KLAYTN: 'klaytn-mainnet', XDC: 'xdc-mainnet', ONE: 'harmony-shard0'
  };
  return { apiSlug: apiSlugs[chain] || 'ethereum', rpcSlug: rpcSlugs[chain] || '' };
};

const FEES = {
  BTC: { min: 0.00001, percent: 0.005 },
  ETH: { min: 0.0001, percent: 0.01 },
  DEFAULT: { min: 0.001, percent: 0.01 }
};

export default {
  // Export the new helper for easy access
  getCryptoPriceUSD,
  getFiatRateUSD,
  getConversionRate,

  getFeeConfig(chain) { return FEES[chain.toUpperCase()] || FEES.DEFAULT; },

  async getBalance(chain, address) {
    if (!address || address === 'undefined') return '0';
    chain = chain.toUpperCase();

    if (['SOL', 'ALGO', 'TRON', 'BTC', 'LTC'].includes(chain)) {
      if (address.startsWith('0x') && chain !== 'XDC') return '0';
    }

    try {
      const { apiSlug, rpcSlug } = getChainConfig(chain);
      let url = '';

      if (['BTC', 'LTC'].includes(chain)) {
        url = `${BASE_URL}/${apiSlug}/address/balance/${address}`;
        const res = await fetch(url, { headers: getHeaders() });
        if (!res.ok) return '0';
        const data = await res.json();
        return (parseFloat(data.incoming || 0) - parseFloat(data.outgoing || 0)).toString();
      }

      if (chain === 'SOL' || chain === 'SOLANA') {
        url = `${BASE_URL}/blockchain/node/${rpcSlug}`;
        const res = await fetch(url, {
          method: 'POST', headers: getHeaders(),
          body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "getBalance", params: [address] })
        });
        const data = await res.json();
        if (data.result?.value) return (data.result.value / 1000000000).toString();
        return '0';
      }

      url = `${BASE_URL}/${apiSlug}/account/balance/${address}`;
      const res = await fetch(url, { headers: getHeaders() });
      if (!res.ok) return '0';
      const data = await res.json();
      return data.balance || '0';

    } catch (e) {
      return '0';
    }
  },

  async getNonce(chain, address) {
    if (['BTC', 'LTC', 'SOL', 'ALGO', 'TRON'].includes(chain)) return 0;
    try {
      const { apiSlug } = getChainConfig(chain);
      const url = `${BASE_URL}/${apiSlug}/transaction/count/${address}`;
      const res = await fetch(url, { headers: getHeaders() });
      const data = await res.json();
      return typeof data === 'number' ? data : 0;
    } catch(e) { return 0; }
  },

  async getUTXOs(chain, address) {
    if (!['BTC', 'LTC'].includes(chain)) return [];
    try {
      const { apiSlug } = getChainConfig(chain);
      let url = `${BASE_URL}/${apiSlug}/utxo/${address}`;
      let res = await fetch(url, { headers: getHeaders() });

      // 1. FALLBACK TO BLOCKSTREAM (TESTNET)
      if (!res.ok && chain === 'BTC' && USE_TESTNET) {
        console.log('Falling back to Blockstream API...');
        url = `https://blockstream.info/testnet/api/address/${address}/utxo`;
        res = await fetch(url);

        if (res.ok) {
          const data = await res.json();
          return Array.isArray(data) ? data
            .filter(u => u.status && u.status.confirmed)
            .map(u => ({
              txHash: u.txid,
              index: u.vout,
              // FIX 1: Ensure value is BigInt for Blockstream UTXO
              value: BigInt(u.value),
              address
            })) : [];
        }
      }

      // 2. TATUM API RESPONSE
      if (!res.ok) {
        console.warn(`UTXO lookup failed (${res.status}) for ${address}`);
        return [];
      }

      const data = await res.json();
      return Array.isArray(data) ? data.map(u => ({
        txHash: u.txHash,
        index: u.index,
        // FIX 2: Ensure value is BigInt for Tatum UTXO
        value: BigInt(u.value),
        address
      })) : [];
    } catch (e) {
      console.warn('UTXO fetch error:', e.message);
      return [];
    }
  },

  async getGasPrice(chain) {
    try {
      const { rpcSlug } = getChainConfig(chain);
      if (rpcSlug) {
        const url = `${BASE_URL}/blockchain/node/${rpcSlug}`;
        const res = await fetch(url, {
          method: 'POST', headers: getHeaders(),
          body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_gasPrice", params: [] })
        });
        const data = await res.json();
        if (data.result) return ethers.formatUnits(BigInt(data.result), 'gwei');
      }
      return '20';
    } catch (e) { return '20'; }
  },

  async broadcast(chain, signedMainTx, signedFeeTx) {
    try {
      chain = chain.toUpperCase();
      const { apiSlug, rpcSlug } = getChainConfig(chain);

      const broadcastSingle = async (txData) => {
        let url;

        if (chain === 'SOL') {
          url = `${BASE_URL}/blockchain/node/${rpcSlug}`;
          const res = await fetch(url, {
            method: 'POST', headers: getHeaders(),
            body: JSON.stringify({
              jsonrpc: "2.0", id: 1, method: "sendTransaction", params: [txData, { encoding: "base64" }]
            })
          });
          const data = await res.json();
          if (data.error) throw new Error(data.error.message);
          return data.result;
        }

        url = `${BASE_URL}/${apiSlug}/broadcast`;
        let res = await fetch(url, {
          method: 'POST', headers: getHeaders(), body: JSON.stringify({ txData })
        });

        if (!res.ok && chain === 'BTC' && USE_TESTNET) {
          console.log('⚠️ Tatum broadcast failed (403), using Blockstream API...');
          url = 'https://blockstream.info/testnet/api/tx';
          res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: txData
          });

          if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Broadcast failed: ${errorText}`);
          }

          const txId = await res.text();
          return txId;
        }

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || (data.data && data.data.join(' ')) || 'Broadcast failed');
        }
        return data.txId;
      };

      const txId1 = await broadcastSingle(signedMainTx);

      if (signedFeeTx) {
        await new Promise(r => setTimeout(r, 2000));
        try {
          await broadcastSingle(signedFeeTx);
        } catch (e) {
          console.warn('⚠️ Fee transaction broadcast failed:', e.message);
        }
      }

      return txId1;
    } catch (e) {
      throw new Error(e.message);
    }
  },

  isTestnet() { return USE_TESTNET; }
};
