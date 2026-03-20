(async () => {
  // ===== CONFIG =====
  const password = 'f6f8blue';
  const url = 'https://29miaoet.github.io/Andrew_WebPage/';

  // ===== HELPER FUNCTIONS =====
  function hexToUint8Array(hex) {
    const bytes = [];
    for (let c = 0; c < hex.length; c += 2)
      bytes.push(parseInt(hex.substr(c, 2), 16));
    return new Uint8Array(bytes);
  }

  function uint8ArrayToHex(uint8arr) {
    return Array.from(uint8arr).map(b => b.toString(16).padStart(2,'0')).join('');
  }

  async function deriveKey(password, salt) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      enc.encode(password),
      'PBKDF2',
      false,
      ['deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 150000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt','decrypt']
    );
  }

  // ===== GENERATE SALT + IV =====
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));

  console.log('Salt (hex):', uint8ArrayToHex(salt));
  console.log('IV (hex):', uint8ArrayToHex(iv));

  // ===== ENCRYPT =====
  const key = await deriveKey(password, salt);
  const enc = new TextEncoder();
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    enc.encode(url)
  );

  const encrypted = new Uint8Array(encryptedBuffer);
  console.log('Encrypted Data (hex):', uint8ArrayToHex(encrypted));

  // ===== DECRYPT =====
  try {
    const key2 = await deriveKey(password, salt);
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      key2,
      encrypted
    );

    const dec = new TextDecoder();
    const decryptedUrl = dec.decode(decryptedBuffer);
    console.log('Decrypted URL:', decryptedUrl);
  } catch (e) {
    console.error('Decryption failed:', e);
  }
})();