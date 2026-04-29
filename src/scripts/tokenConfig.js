// services/tokenConfig.js

export const TOKEN_DATA = {
  // --- ETHEREUM MAINNET ---
  ETH: {
    USDT: { address: '0xdac17f958d2ee523a2206206994597c13d831ec7', decimals: 6 },
    USDC: { address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', decimals: 6 },
    DAI:  { address: '0x6b175474e89094c44da98b954eedeac495271d0f', decimals: 18 }
  },

  // --- BSC MAINNET (Binance Smart Chain) ---
  // Note: BSC USDT usually uses 18 decimals, unlike ETH which uses 6
  BSC: {
    USDT: { address: '0x55d398326f99059fF775485246999027B3197955', decimals: 18 },
    USDC: { address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d', decimals: 18 }
  },

  // --- POLYGON MAINNET ---
  POLYGON: {
    USDT: { address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f', decimals: 6 },
    USDC: { address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', decimals: 6 }
  },

  // Suggested Addition to TOKEN_DATA
  SOL: {
    USDC: { address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', decimals: 6 },
    USDT: { address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', decimals: 6 }
  },
  CELO: {
    USDT: { address: '0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e', decimals: 6 },
    USDC: { address: '0x765DE816845861e75A25fCA122bb6898B8B1282a', decimals: 6 }
  }
}

/**
 * Helper to check if a symbol is a Token (USDT) or Native Coin (ETH)
 */
export const getTokenInfo = (chain, symbol) => {
  if (!symbol) return null;
  // If the symbol IS the chain (e.g. Chain ETH, Symbol ETH), it's native.
  if (chain.toUpperCase() === symbol.toUpperCase()) return null;

  return TOKEN_DATA[chain.toUpperCase()]?.[symbol.toUpperCase()] || null;
}
