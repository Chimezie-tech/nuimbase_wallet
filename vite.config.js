import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// Import the plugins
import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
    // 1. Handle Node.js modules (Buffer, process, etc.)
    nodePolyfills(),
    // 2. Handle WASM files
    wasm(),
    // 3. Handle Top Level Await (required by the WASM plugin)
    topLevelAwait()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // 4. Force Vite to NOT bundle these, so the WASM plugin can handle them
  optimizeDeps: {
    exclude: ['tiny-secp256k1', 'bip32', 'ecpair']
  }
})
