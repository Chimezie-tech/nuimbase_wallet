import { createClient } from '@supabase/supabase-js';
import cryptoService from '@/scripts/encrytpion';
import walletService from '@/services/walletService';
import tatumService from '@/scripts/tatumServices';

// SUPABASE INIT
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

// --- AUTH HELPER ---
const getUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');
  return user;
};

// --- PIN VERIFICATION HELPER ---
const verifyPinAndGetDEK = async (pin) => {
  const user = await getUser();
  // ✅ FIX: Use maybeSingle() to avoid 406 error if no vault exists
  const { data: vault, error } = await supabase.from('vault').select('*').eq('uuid', user.id).maybeSingle();

  if (error) throw error;
  if (!vault) throw new Error('Security record not found. Please create a PIN.');
  if (vault.blocked) throw new Error('Account blocked');

  const salt = cryptoService.fromBase64(vault.salt);
  const kek = await cryptoService.deriveKEK(pin, salt);

  try {
    const dekBytes = await cryptoService.unwrapThis(vault.wrappedDEK, kek);
    if (vault.attempts > 0) {
      await supabase.from('vault').update({ attempts: 0 }).eq('uuid', user.id);
    }
    return dekBytes;
  } catch (e) {
    const newAttempts = (vault.attempts || 0) + 1;
    await supabase.from('vault').update({
      attempts: newAttempts,
      blocked: newAttempts >= 3
    }).eq('uuid', user.id);
    throw new Error('Invalid PIN');
  }
};

// ==========================================================
// ⭐ NEW SERVICE LAYER FUNCTIONS FOR CRYPTO SEND FORM
// ==========================================================

/**
 * Retrieves the public wallet address for a given customer UUID and blockchain.
 * This is used by the CryptoSendForm to find the recipient's address.
 * @param {string} recipientUuid - The UUID of the user to send the payment to.
 * @param {string} asset - The blockchain symbol (e.g., 'ETH', 'BTC').
 * @returns {Promise<string>} The recipient's public address.
 */
export const getRecipientAddress = async (recipientUuid, asset) => {
    // Note: This does not require PIN validation as it retrieves public, non-sensitive data.
    try {
        const { data, error } = await supabase
            .from('customerWalletAddr')
            .select('address')
            .eq('uuid', recipientUuid)
            .eq('blockchain', asset.toUpperCase())
            .maybeSingle();

        if (error) throw error;
        if (!data || !data.address) throw new Error(`Recipient does not have a ${asset} wallet.`);

        return data.address;
    } catch (error) {
        console.error("getRecipientAddress Error:", error.message);
        throw new Error(error.message || `Could not find wallet for ${asset}.`);
    }
};

/**
 * Executes a crypto transfer using the existing 'transfer/send' logic.
 * This function handles fetching the sender's private key and broadcasting.
 * It is called by the CryptoSendForm.
 * @param {object} transferData - The data required for the transfer.
 * @param {string} transferData.recipientAddress - The address to send to.
 * @param {number} transferData.amount - The amount to send.
 * @param {string} transferData.asset - The blockchain symbol (e.g., 'ETH', 'BTC').
 * @param {string} transferData.pin - The user's wallet PIN.
 * @returns {Promise<string>} The transaction ID (txId).
 */
export const executeCryptoTransfer = async ({ recipientAddress, amount, asset, pin }) => {
    // This is a direct wrapper around the existing 'transfer/send' logic
    const body = {
        pin: pin,
        to: recipientAddress,
        amount: amount,
        blockchain: asset.toUpperCase()
    };

    // We reuse the existing transfer logic from the $POST handler for simplicity and security.
    const result = await $POST(body, 'transfer/send');

    if (result.error) {
        throw new Error(result.error);
    }
    return result.txId;
};

// ==========================================================
// ROUTER REPLACEMENT (Existing $POST and $GET remain)
// ==========================================================
export const $POST = async (body, endpoint) => {
  try {
    const user = await getUser();

    // ------------------------------------------
    // PIN / AUTH ROUTES
    // ------------------------------------------
    if (endpoint === 'pin/check') {
      const { data } = await supabase.from('vault').select('uuid').eq('uuid', user.id).maybeSingle();
      return { hasPin: !!data };
    }

    if (endpoint === 'pin/create') {
      const salt = cryptoService.generateSalt();
      const dek = cryptoService.generateDEK();
      const kek = await cryptoService.deriveKEK(body.pin, salt);
      const wrappedDEK = await cryptoService.wrapThis(dek, kek);

      const { error } = await supabase.from('vault').insert({
        uuid: user.id,
        salt: cryptoService.toBase64(salt),
        wrappedDEK: wrappedDEK,
        attempts: 0,
        blocked: false
      });
      if (error) throw error;
      return { success: true };
    }

    if (endpoint === 'pin/change') {
      const dek = await verifyPinAndGetDEK(body.oldPin);
      const newSalt = cryptoService.generateSalt();
      const newKEK = await cryptoService.deriveKEK(body.newPin, newSalt);
      const newWrappedDEK = await cryptoService.wrapThis(dek, newKEK);

      const { error } = await supabase.from('vault').update({
        wrappedDEK: newWrappedDEK,
        salt: cryptoService.toBase64(newSalt),
        attempts: 0
      }).eq('uuid', user.id);
      if (error) throw error;
      return { success: true };
    }

    // ------------------------------------------
    // WALLET ROUTES
    // ------------------------------------------
    if (endpoint === 'wallet/create') {
      const dek = await verifyPinAndGetDEK(body.pin);

      const { data: existing } = await supabase.from('customerWallets').select('*').eq('uuid', user.id).eq('blockchain', body.blockchain).maybeSingle();
      if (existing) throw new Error(`You already have a ${body.blockchain} wallet`);

      const wallet = await walletService.generateWallet(body.blockchain);

      const encMnemonic = await cryptoService.encryptThis(wallet.mnemonic, dek);
      const encPrivKey = await cryptoService.encryptThis(wallet.privateKey, dek);

      await supabase.from('customerWallets').insert({
        uuid: user.id,
        blockchain: body.blockchain,
        xpub: wallet.xpub,
        mnemonic: encMnemonic,
        privateKey: encPrivKey
      });

      await supabase.from('customerWalletAddr').insert({
        uuid: user.id,
        blockchain: body.blockchain,
        address: wallet.address,
        incomingBalance: '0',
        outgoingBalance: '0'
      });

      return { success: true, mnemonic: wallet.mnemonic, address: wallet.address };
    }

    if (endpoint === 'wallet/import') {
      const dek = await verifyPinAndGetDEK(body.pin);
      const { data: existing } = await supabase.from('customerWallets').select('*').eq('uuid', user.id).eq('blockchain', body.blockchain).maybeSingle();
      if (existing) throw new Error(`You already have a ${body.blockchain} wallet`);
      const wallet = await walletService.importWallet(body.blockchain, body.importData);

      const encMnemonic = wallet.mnemonic ? await cryptoService.encryptThis(wallet.mnemonic, dek) : 'IMPORTED';
      const encPrivKey = await cryptoService.encryptThis(wallet.privateKey, dek);

      await supabase.from('customerWallets').insert({
        uuid: user.id,
        blockchain: body.blockchain,
        mnemonic: encMnemonic,
        privateKey: encPrivKey,
        xpub: 'IMPORTED'
      });

      await supabase.from('customerWalletAddr').insert({
        uuid: user.id,
        blockchain: body.blockchain,
        address: wallet.address,
        incomingBalance: '0'
      });

      return { success: true };
    }

    if (endpoint === 'wallet/balance') {
      const { data } = await supabase.from('customerWalletAddr').select('address').eq('uuid', user.id).eq('blockchain', body.blockchain).maybeSingle();
      if (!data) return { success: false };

      const balance = await tatumService.getBalance(body.blockchain, data.address);
      return { success: true, balance: { availBalance: balance, incoming: balance } };
    }

    if (endpoint === 'wallet/view-mnemonic') {
      const dek = await verifyPinAndGetDEK(body.pin);
      const { data } = await supabase.from('customerWallets').select('mnemonic').eq('uuid', user.id).eq('blockchain', body.blockchain).single();
      if (!data) throw new Error('Wallet not found');

      const mnemonic = await cryptoService.decryptThis(data.mnemonic, dek);
      return { mnemonic };
    }

    // ------------------------------------------
    // TRANSACTION ROUTES (CORRECTED WITH FEES)
    // ------------------------------------------
    if (endpoint === 'transfer/fee') {
      const config = tatumService.getFeeConfig(body.blockchain);
      const gasPrice = await tatumService.getGasPrice(body.blockchain);

      let networkFee = 0.0005;
      // Estimate simple network fee for display (approximate)
      if (['ETH', 'BSC'].includes(body.blockchain)) {
        networkFee = (21000 * gasPrice) / 1e9;
      } else if (body.blockchain === 'BTC') {
        networkFee = 0.00005; // ~5000 sats average
      }

      const amount = parseFloat(body.amount);
      const platformFee = Math.max(amount * config.percent, config.min);

      return {
        networkFee: networkFee.toFixed(6),
        platformFee: platformFee.toFixed(6),
        totalAmount: (amount + networkFee + platformFee).toFixed(6)
      };
    }

   if (endpoint === 'transfer/send') {
      const dek = await verifyPinAndGetDEK(body.pin);

      const { data: wData } = await supabase.from('customerWallets').select('privateKey').eq('uuid', user.id).eq('blockchain', body.blockchain).single();
      const { data: wAddr } = await supabase.from('customerWalletAddr').select('address').eq('uuid', user.id).eq('blockchain', body.blockchain).single();

      const privateKey = await cryptoService.decryptThis(wData.privateKey, dek);

      // 1. Get Network Data needed for signing (Nonce for ETH, UTXOs for BTC)
      const nonce = await tatumService.getNonce(body.blockchain, wAddr.address);
      const gasPrice = await tatumService.getGasPrice(body.blockchain);
      const utxos = await tatumService.getUTXOs(body.blockchain, wAddr.address);

      // 2. Prepare Signed Transactions (Main + Fee)
      const { signedMainTx, signedFeeTx, platformFee, blockchainFee } = await walletService.prepareTransactionWithFee(body.blockchain, {
        privateKey,
        to: body.to,
        amount: body.amount,
        nonce,
        gasPrice,
        utxos
      });

      if (!signedMainTx) throw new Error('Signing failed');

      // 3. Broadcast both transactions
      const txId = await tatumService.broadcast(body.blockchain, signedMainTx, signedFeeTx);

      // 4. Save to DB
      await supabase.from('transactions').insert({
        uuid: user.id,
        toAddress: body.to,
        fromAddress: wAddr.address,
        amount: body.amount,
        txId: txId || 'Pending',
        platformFee: platformFee,
        blockchainFee: blockchainFee,
        blockchain: body.blockchain,
        status: 'completed'
      });

      return { success: true, txId };
    }

    throw new Error('Endpoint not found');

  } catch (error) {
    console.error(`$POST Error [${endpoint}]:`, error);
    return { error: error.message || 'Request failed' };
  }
};

export const $GET = async (endpoint) => {
  const user = await getUser();

  if (endpoint === 'wallets') {
    const { data } = await supabase.from('customerWalletAddr').select('*').eq('uuid', user.id);
    return { wallets: data || [] };
  }

  return {};
};
