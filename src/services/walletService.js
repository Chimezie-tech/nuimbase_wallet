// services/walletServices.js

import { ethers } from 'ethers'
import * as bip39 from 'bip39'
import * as bitcoin from 'bitcoinjs-lib'
import { BIP32Factory } from 'bip32'
import ECPairFactory from 'ecpair'
import * as ecc from 'tiny-secp256k1'
import { Keypair } from '@solana/web3.js'
import { Buffer } from 'buffer'

if (typeof window !== 'undefined') window.Buffer = Buffer

const bip32 = BIP32Factory(ecc)
const ECPair = ECPairFactory(ecc)
bitcoin.initEccLib(ecc)

// ✅ CONFIGURATION
const USE_TESTNET = false
const NETWORK_BTC = USE_TESTNET ? bitcoin.networks.testnet : bitcoin.networks.bitcoin

const getChainId = (chain) => {
  chain = chain.toUpperCase()
  if (USE_TESTNET) {
    const map = {
      ETH: 11155111,
      BSC: 97,
      POLYGON: 80002,
      CELO: 44787,
      XDC: 51,
      ONE: 1666700000,
      KLAYTN: 1001,
      AVAX: 43113,
    }
    return map[chain] || 11155111
  } else {
    const map = {
      ETH: 1,
      BSC: 56,
      POLYGON: 137,
      CELO: 42220,
      XDC: 50,
      ONE: 1666600000,
      KLAYTN: 8217,
      AVAX: 43114,
    }
    return map[chain] || 1
  }
}

// Platform Fee Addresses
const PLATFORM_ADDRESSES = {
  ETH: '0xb1d2f548b1569556EB405934B92b0c42a6bEE73e',
  BTC: '3LQWg1QjEXvQWttCnCxLQzWaiV9rRvCfnC',
  LTC: 'ltc1qptnqhpjw3urr095xyzrmacdc73y4q8xmk0r08e',
  ALGO: 'ES44J7PNFPNAK5WGPIWFDLONLGT7RFCOP6MSKHE67I5AUL66UQSWXURHVU',
  DEFAULT: '0x44c0587b5900cd325a4cb2124b8c13be503a4911',
}

const FEES = {
  BTC: { min: 0.00001, percent: 0.005 },
  ETH: { min: 0.0001, percent: 0.01 },
  DEFAULT: { min: 0.001, percent: 0.01 },
}

export default {

    // ⭐ NEW HELPER FUNCTION FOR FRONT-END FEE ESTIMATION
    /**
     * Calculates the platform fee based on the amount and chain configuration.
     * This is separate from the prepareTransactionWithFee function for simpler front-end display.
     * Note: This does not calculate network gas/miner fee, which requires external data (Tatum).
     * @param {string} chain - The blockchain symbol.
     * @param {number} amount - The amount to send.
     * @returns {{platformFee: number, config: object}}
     */
    getTransferFees(chain, amount) {
        const config = FEES[chain.toUpperCase()] || FEES.DEFAULT;
        const sendAmount = parseFloat(amount);

        let platformFee = sendAmount * config.percent;
        if (platformFee < config.min) {
            platformFee = config.min;
        }

        return {
            platformFee: parseFloat(platformFee.toFixed(18)), // Use a high precision for safety
            config
        };
    },

  // 1. GENERATE WALLET
  async generateWallet(chain) {
    const mnemonic = bip39.generateMnemonic(256)
    const seed = await bip39.mnemonicToSeed(mnemonic)
    let address = '',
      privateKey = '',
      xpub = ''
    chain = chain.toUpperCase()

    if (chain === 'BTC' || chain === 'LTC') {
      const network = chain === 'BTC' ? NETWORK_BTC : NETWORK_BTC
      const path =
        chain === 'BTC' ? (USE_TESTNET ? "m/84'/1'/0'/0/0" : "m/84'/0'/0'/0/0") : "m/84'/2'/0'/0/0"

      const root = bip32.fromSeed(seed, network)
      const child = root.derivePath(path)
      const { address: addr } = bitcoin.payments.p2wpkh({ pubkey: child.publicKey, network })

      address = addr
      privateKey = child.toWIF()
      xpub = root.neutered().toBase58()
    } else if (chain === 'SOL' || chain === 'SOLANA') {
      const seed32 = seed.slice(0, 32)
      const keypair = Keypair.fromSeed(seed32)
      address = keypair.publicKey.toBase58()
      privateKey = Buffer.from(keypair.secretKey).toString('hex')
    } else if (['ETH', 'BSC', 'POLYGON', 'CELO', 'XDC', 'ONE', 'KLAYTN', 'KCS', 'TRON'].includes(chain)) {
      const wallet = ethers.Wallet.fromPhrase(mnemonic)
      address = wallet.address
      privateKey = wallet.privateKey
      xpub = wallet.extendedKey || ''
    } else {
      throw new Error(`Chain ${chain} not supported locally.`)
    }

    return { mnemonic, privateKey, address, xpub, blockchain: chain }
  },

  // 2. IMPORT WALLET
  async importWallet(chain, data) {
    if (['ETH', 'BSC', 'POLYGON', 'CELO', 'XDC'].includes(chain)) {
      try {
        const isMnemonic = data.includes(' ')
        const wallet = isMnemonic ? ethers.Wallet.fromPhrase(data) : new ethers.Wallet(data)
        return {
          address: wallet.address,
          privateKey: wallet.privateKey,
          mnemonic: isMnemonic ? data : null,
        }
      } catch (e) {
        throw new Error('Invalid Key')
      }
    }

    // --- BTC/LTC CHAINS ---
  if (['BTC', 'LTC'].includes(chain) && isMnemonic) {
    try {
      const seed = await bip39.mnemonicToSeed(data);
      const network = chain === 'BTC' ? NETWORK_BTC : NETWORK_BTC;

      // Use the same derivation path logic as generateWallet
      const path =
        chain === 'BTC' ? (USE_TESTNET ? "m/84'/1'/0'/0/0" : "m/84'/0'/0'/0/0") : "m/84'/2'/0'/0/0";

      const root = bip32.fromSeed(seed, network);
      const child = root.derivePath(path);
      const { address: addr } = bitcoin.payments.p2wpkh({ pubkey: child.publicKey, network });

      // Get the private key (WIF format)
      const privateKey = child.toWIF();

      return {
        address: addr,
        privateKey: privateKey,
        mnemonic: data,
        blockchain: chain
      };

    } catch (e) {
      throw new Error('Invalid BTC/LTC Mnemonic');
    }
  }

    return {}
  },

  // 3. PREPARE TRANSACTION
  async prepareTransactionWithFee(chain, { privateKey, to, amount, nonce, gasPrice, utxos }) {
    const config = FEES[chain] || FEES.DEFAULT

    // ✅ Clean address
    to = to ? String(to).trim().replace(/\s+/g, '') : ''

    if (!to) {
      throw new Error('Recipient address is required')
    }

    // Select correct Platform Address
    let platformAddr = PLATFORM_ADDRESSES.DEFAULT
    if (chain === 'BTC') {
      platformAddr = USE_TESTNET ? PLATFORM_ADDRESSES.BTC_TESTNET : PLATFORM_ADDRESSES.BTC_MAINNET
    } else {
      platformAddr = PLATFORM_ADDRESSES[chain] || PLATFORM_ADDRESSES.DEFAULT
    }

    // --- EVM ---
    if (['ETH', 'BSC', 'POLYGON', 'CELO', 'XDC', 'ONE', 'KLAYTN'].includes(chain)) {
      const wallet = new ethers.Wallet(privateKey)
      const amountBN = ethers.parseEther(amount.toString())
      const chainId = getChainId(chain)

      // Calculate Platform Fee
      let feeVal = parseFloat(amount) * config.percent
      if (feeVal < config.min) feeVal = config.min
      const feeBN = ethers.parseEther(feeVal.toFixed(18))
      const price = gasPrice ? ethers.parseUnits(gasPrice.toString(), 'gwei') : undefined

      const txMain = { to, value: amountBN, gasLimit: 21000n, gasPrice: price, nonce, chainId }
      const signedMainTx = await wallet.signTransaction(txMain)

      let signedFeeTx = null
      if (feeVal > 0) {
        const txFee = {
          to: platformAddr,
          value: feeBN,
          gasLimit: 21000n,
          gasPrice: price,
          nonce: nonce + 1,
          chainId,
        }
        signedFeeTx = await wallet.signTransaction(txFee)
      }

      //Return calculated fees (in ETH units)
      const platformFee = feeVal;
      // EVM blockchain fee (gas) is calculated by the network on broadcast.
      // We default to 0 here since the gas cost is paid on the main/fee tx separately
      const blockchainFee = 0;
     
      return { signedMainTx, signedFeeTx, platformFee, blockchainFee }; // ✅ Now returns fees
    }

    // --- BITCOIN (AMENDED) ---
    if (chain === 'BTC') {
      const network = NETWORK_BTC
      const SATOSHI_PER_BTC = 100000000
      const DUST_LIMIT = 546n

      console.log(`\n Bitcoin Transaction:`)
      console.log(`   Network: ${USE_TESTNET ? 'TESTNET' : 'MAINNET'}`)
      console.log(`   Recipient: ${to}`)
      console.log(`   Amount: ${amount} BTC`)

      if (!utxos || utxos.length === 0) {
        throw new Error(
          'No UTXOs available. Your wallet may be empty or transactions are unconfirmed.',
        )
      }

      const keyPair = ECPair.fromWIF(privateKey, network)
      const p2wpkh = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey, network })

      console.log(`\n Wallet Info:`)
      console.log(`   Address: ${p2wpkh.address}`)
      console.log(`   PubKey: ${keyPair.publicKey.toString('hex')}`)

      // ✅ USE PSBT
      const psbt = new bitcoin.Psbt({ network })

      // FIX 3: Initialize inputSum as BigInt
      let inputSum = 0n

      console.log(`\n Adding ${utxos.length} input(s)...`)
      utxos.forEach((u, idx) => {
        // u.value is already BigInt from getUTXOs
        const valueBigInt = u.value
        inputSum += valueBigInt

        // Add input with witnessUtxo for SegWit
        psbt.addInput({
          hash: u.txHash,
          index: u.index,
          witnessUtxo: {
            script: p2wpkh.output, // Use Buffer directly
            // FIX 4: Pass BigInt to value to match 'Expected { ..., value: bigint }'
            value: valueBigInt,
          },
        })

        console.log(`   Input ${idx + 1}: ${valueBigInt.toString()} sats from ${u.txHash.substring(0, 8)}...`)
      })

      // FIX 5: Calculate amounts as BigInt
      const amountSat = BigInt(Math.floor(parseFloat(amount) * SATOSHI_PER_BTC))
      // Calculate Platform Fee (in Sats)
      const feeSat = BigInt(Math.floor(Math.max(parseFloat(amount) * config.percent, config.min) * SATOSHI_PER_BTC))
      // FIX 6: Miner fee constant as BigInt
      const minerFee = 3000n

      console.log(`\n Adding outputs...`)
      console.log(`   1. Recipient: ${amountSat.toString()} sats → ${to}`)

      // Add recipient output using script method
      try {
        const recipientScript = bitcoin.address.toOutputScript(to, network)
        psbt.addOutput({ script: recipientScript, value: amountSat })
        console.log(`   ✅ Recipient output added`)
      } catch (e) {
        console.error(`   ❌ Invalid recipient address:`, e.message)
        throw new Error(`Invalid Bitcoin address: ${to}`)
      }

      // Add platform fee output
      if (feeSat > 0n) {
        console.log(`   2. Platform Fee: ${feeSat.toString()} sats → ${platformAddr}`)
        try {
          const feeScript = bitcoin.address.toOutputScript(platformAddr, network)
          psbt.addOutput({ script: feeScript, value: feeSat })
          console.log(`   ✅ Platform fee output added`)
        } catch (e) {
          console.warn(`   ⚠️ Skipping platform fee:`, e.message)
        }
      }

      // Calculate and add change
      const totalSpend = amountSat + feeSat + minerFee
      const change = inputSum - totalSpend

      console.log(`\n💸 Balance:`)
      console.log(`   Available: ${inputSum.toString()} sats`)
      console.log(`   Total Spend: ${totalSpend.toString()} sats`)
      console.log(`   Change: ${change.toString()} sats`)

      if (change < 0n) { // Compare BigInt with BigInt
        throw new Error(
          `Insufficient balance.\n\n` +
            `Available: ${(Number(inputSum) / SATOSHI_PER_BTC).toFixed(8)} BTC\n` +
            `Required: ${(Number(totalSpend) / SATOSHI_PER_BTC).toFixed(8)} BTC`,
        )
      }

      // Add change output (if above dust limit)
      if (change > DUST_LIMIT) {
        psbt.addOutput({ address: p2wpkh.address, value: change })
        console.log(`   3. Change: ${change.toString()} sats → ${p2wpkh.address}`)
      } else if (change > 0n) {
        console.log(`   ⚠️ Change (${change.toString()} sats) below dust limit`)
      }

      // Sign all inputs
      console.log(`\n🔏 Signing transaction...`)
      psbt.signAllInputs(keyPair)
      console.log(`   ✅ All inputs signed`)

      // Finalize and extract
      console.log(`\n🔨 Finalizing transaction...`)
      psbt.finalizeAllInputs()

      const tx = psbt.extractTransaction()
      const txHex = tx.toHex()
      const txId = tx.getId()

      console.log(`\n✅ Transaction complete!`)
      console.log(`   TX ID: ${txId}`)
      console.log(`   Size: ${txHex.length / 2} bytes`)
      console.log(`   Hex (first 100 chars): ${txHex.substring(0, 100)}...`)

      // 🛑 FIX APPLIED: Return calculated fees (in BTC units)
      const platformFee = Number(feeSat) / SATOSHI_PER_BTC; // Convert platform fee from sats to BTC
      const blockchainFee = Number(minerFee) / SATOSHI_PER_BTC; // Convert miner fee from sats to BTC

      return { signedMainTx: txHex, signedFeeTx: null, platformFee, blockchainFee }; // ✅ Now returns fees
    }

    throw new Error(`Chain ${chain} not supported`)
  },
}
