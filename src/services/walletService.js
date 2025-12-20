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
  const map = USE_TESTNET ? {
    ETH: 11155111, BSC: 97, POLYGON: 80002, CELO: 44787, XDC: 51, ONE: 1666700000, KLAYTN: 1001, AVAX: 43113,
  } : {
    ETH: 1, BSC: 56, POLYGON: 137, CELO: 42220, XDC: 50, ONE: 1666600000, KLAYTN: 8217, AVAX: 43114,
  }
  return map[chain] || 1
}

// ✅ FIXED PLATFORM ADDRESSES
const PLATFORM_ADDRESSES = {
  ETH: '0xb1d2f548b1569556EB405934B92b0c42a6bEE73e',
  BTC: '3LQWg1QjEXvQWttCnCxLQzWaiV9rRvCfnC', // Mainnet
  // BTC_TESTNET: 'tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx', // Add a testnet addr if needed
  LTC: 'ltc1qptnqhpjw3urr095xyzrmacdc73y4q8xmk0r08e',
  DEFAULT: '0xb1d2f548b1569556EB405934B92b0c42a6bEE73e',
}

const FEES = {
  BTC: { min: 0.00001, percent: 0.005 },
  ETH: { min: 0.0001, percent: 0.01 },
  DEFAULT: { min: 0.001, percent: 0.01 },
}

export default {
  getTransferFees(chain, amount) {
    const config = FEES[chain.toUpperCase()] || FEES.DEFAULT;
    const sendAmount = parseFloat(amount);
    let platformFee = Math.max(sendAmount * config.percent, config.min);
    return { platformFee: parseFloat(platformFee.toFixed(18)), config };
  },

  async generateWallet(chain) {
    const mnemonic = bip39.generateMnemonic(256)
    const seed = await bip39.mnemonicToSeed(mnemonic)
    let address = '', privateKey = '', xpub = ''
    chain = chain.toUpperCase()

    if (chain === 'BTC' || chain === 'LTC') {
      const network = NETWORK_BTC
      const path = chain === 'BTC' ? (USE_TESTNET ? "m/84'/1'/0'/0/0" : "m/84'/0'/0'/0/0") : "m/84'/2'/0'/0/0"
      const root = bip32.fromSeed(seed, network)
      const child = root.derivePath(path)
      const { address: addr } = bitcoin.payments.p2wpkh({ pubkey: child.publicKey, network })
      address = addr
      privateKey = child.toWIF()
      xpub = root.neutered().toBase58()
    } else if (chain === 'SOL' || chain === 'SOLANA') {
      const keypair = Keypair.fromSeed(seed.slice(0, 32))
      address = keypair.publicKey.toBase58()
      privateKey = Buffer.from(keypair.secretKey).toString('hex')
    } else {
      const wallet = ethers.Wallet.fromPhrase(mnemonic)
      address = wallet.address
      privateKey = wallet.privateKey
    }
    return { mnemonic, privateKey, address, xpub, blockchain: chain }
  },

  async prepareTransactionWithFee(chain, { privateKey, to, amount, nonce, gasPrice, utxos }) {
    const config = FEES[chain] || FEES.DEFAULT
    to = to ? String(to).trim().replace(/\s+/g, '') : ''
    if (!to) throw new Error('Recipient address is required')

    // ✅ FIXED: Correct address selection logic
    let platformAddr = PLATFORM_ADDRESSES[chain] || PLATFORM_ADDRESSES.DEFAULT
    if (chain === 'BTC' && USE_TESTNET) platformAddr = PLATFORM_ADDRESSES.BTC_TESTNET

    // --- EVM LOGIC ---
    if (['ETH', 'BSC', 'POLYGON', 'CELO', 'XDC', 'ONE', 'KLAYTN'].includes(chain)) {
      const wallet = new ethers.Wallet(privateKey)
      const amountBN = ethers.parseEther(amount.toString())
      const chainId = getChainId(chain)
      let feeVal = Math.max(parseFloat(amount) * config.percent, config.min)
      const feeBN = ethers.parseEther(feeVal.toFixed(18))
      const price = gasPrice ? ethers.parseUnits(gasPrice.toString(), 'gwei') : undefined

      const txMain = { to, value: amountBN, gasLimit: 21000n, gasPrice: price, nonce, chainId }
      const signedMainTx = await wallet.signTransaction(txMain)
      const txFee = { to: platformAddr, value: feeBN, gasLimit: 21000n, gasPrice: price, nonce: nonce + 1, chainId }
      const signedFeeTx = await wallet.signTransaction(txFee)

      return { signedMainTx, signedFeeTx, platformFee: feeVal, blockchainFee: 0 }
    }

    // --- BITCOIN LOGIC (AMENDED) ---
    if (chain === 'BTC') {
      const network = NETWORK_BTC
      const SATOSHI_PER_BTC = 100000000
      const DUST_LIMIT = 546n

      if (!utxos || utxos.length === 0) throw new Error('No UTXOs available.')

      const keyPair = ECPair.fromWIF(privateKey, network)
      const p2wpkh = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey, network })
      const psbt = new bitcoin.Psbt({ network })

      let inputSum = 0n
      utxos.forEach((u) => {
        // ✅ FIX: Ensure value is BigInt and correctly scaled
        const valSats = typeof u.value === 'bigint' ? u.value : BigInt(Math.round(Number(u.value)))
        inputSum += valSats
        psbt.addInput({
          hash: u.txHash,
          index: u.index,
          witnessUtxo: { script: p2wpkh.output, value: valSats },
        })
      })

      // ✅ FIX: Safe rounding to avoid "not an integer" error
      const amountSat = BigInt(Math.round(parseFloat(amount) * SATOSHI_PER_BTC))
      const feeSat = BigInt(Math.round(Math.max(parseFloat(amount) * config.percent, config.min) * SATOSHI_PER_BTC))
      const minerFee = 3000n // Standard Miner Fee

      psbt.addOutput({ address: to, value: amountSat })

      if (feeSat > 0n && platformAddr) {
        try {
          psbt.addOutput({ address: platformAddr, value: feeSat })
        } catch (e) { console.warn("Platform fee skipped:", e.message) }
      }

      const totalSpend = amountSat + feeSat + minerFee
      const change = inputSum - totalSpend

      if (change < 0n) {
        throw new Error(`Insufficient funds. Need ${Number(totalSpend)/1e8} BTC, have ${Number(inputSum)/1e8} BTC`)
      }

      if (change > DUST_LIMIT) {
        psbt.addOutput({ address: p2wpkh.address, value: change })
      }

      psbt.signAllInputs(keyPair)
      psbt.finalizeAllInputs()
      const txHex = psbt.extractTransaction().toHex()

      return {
        signedMainTx: txHex,
        signedFeeTx: null,
        platformFee: Number(feeSat) / SATOSHI_PER_BTC,
        blockchainFee: Number(minerFee) / SATOSHI_PER_BTC
      }
    }
    throw new Error(`Chain ${chain} not supported`)
  },
}
