// Browser-Native Crypto Service (No Buffer/Node deps)

const ALGORITHM = 'AES-GCM';
const SALT_LENGTH = 32;
const IV_LENGTH = 12;
const ITERATIONS = 310000;
const KEY_LENGTH = 256;

// Utility: Uint8Array <-> Base64
const toBase64 = (u8) => {
  const binaryString = Array.from(u8).map(b => String.fromCharCode(b)).join('');
  return window.btoa(binaryString);
};

const fromBase64 = (str) => {
  const binaryString = window.atob(str);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

const strToU8 = (str) => new TextEncoder().encode(str);
const u8ToStr = (u8) => new TextDecoder().decode(u8);

// Utility: Concatenate Uint8Arrays
const concat = (a, b) => {
  const c = new Uint8Array(a.length + b.length);
  c.set(a);
  c.set(b, a.length);
  return c;
};

export default {
  toBase64,
  fromBase64,

  generateSalt() {
    return window.crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  },

  generateDEK() {
    return window.crypto.getRandomValues(new Uint8Array(32));
  },

  async deriveKEK(pin, salt) {
    const pinBuffer = strToU8(pin);

    // Import PIN as KeyMaterial
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      pinBuffer,
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    // Derive the KEK
    return window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: ITERATIONS,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: ALGORITHM, length: KEY_LENGTH },
      false, // Key is not extractable (security best practice)
      ['encrypt', 'decrypt', 'wrapKey', 'unwrapKey']
    );
  },

  // Encrypt Data (String -> Base64)
  async encryptThis(plaintext, dekBytes) {
    const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH));
    const dataBuffer = strToU8(plaintext);

    // Import DEK bytes as CryptoKey
    const dekKey = await window.crypto.subtle.importKey(
      'raw',
      dekBytes,
      { name: ALGORITHM },
      false,
      ['encrypt']
    );

    const encryptedBuffer = await window.crypto.subtle.encrypt(
      { name: ALGORITHM, iv },
      dekKey,
      dataBuffer
    );

    // Combine IV + Ciphertext
    const combined = concat(iv, new Uint8Array(encryptedBuffer));
    return toBase64(combined);
  },

  // Decrypt Data (Base64 -> String)
  async decryptThis(encryptedStr, dekBytes) {
    const combined = fromBase64(encryptedStr);

    // Split IV and Cipher
    const iv = combined.slice(0, IV_LENGTH);
    const ciphertext = combined.slice(IV_LENGTH);

    const dekKey = await window.crypto.subtle.importKey(
      'raw',
      dekBytes,
      { name: ALGORITHM },
      false,
      ['decrypt']
    );

    try {
      const decryptedBuffer = await window.crypto.subtle.decrypt(
        { name: ALGORITHM, iv },
        dekKey,
        ciphertext
      );
      return u8ToStr(new Uint8Array(decryptedBuffer));
    } catch (e) {
      console.error('Decryption failed:', e);
      throw new Error('Decryption failed');
    }
  },

  // Wrap DEK (Raw Bytes -> Base64) using KEK (CryptoKey)
  async wrapThis(dekBytes, kekKey) {
    const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH));

    // Encrypt the DEK bytes using the KEK
    // We treat the DEK bytes as data to be encrypted
    const encryptedDEK = await window.crypto.subtle.encrypt(
      { name: ALGORITHM, iv },
      kekKey,
      dekBytes
    );

    const combined = concat(iv, new Uint8Array(encryptedDEK));
    return toBase64(combined);
  },

  // Unwrap DEK (Base64 -> Raw Bytes) using KEK (CryptoKey)
  async unwrapThis(wrappedStr, kekKey) {
    const combined = fromBase64(wrappedStr);
    const iv = combined.slice(0, IV_LENGTH);
    const ciphertext = combined.slice(IV_LENGTH);

    try {
      const decryptedBuffer = await window.crypto.subtle.decrypt(
        { name: ALGORITHM, iv },
        kekKey,
        ciphertext
      );
      return new Uint8Array(decryptedBuffer);
    } catch (e) {
      console.error('Unwrap failed:', e);
      throw new Error('Invalid PIN or Corrupted Key');
    }
  }
};
