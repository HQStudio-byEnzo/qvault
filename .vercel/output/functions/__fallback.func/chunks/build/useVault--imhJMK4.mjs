import { j as useState } from './server.mjs';

function useCrypto() {
  async function deriveKey(masterPassword, salt) {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      encoder.encode(masterPassword),
      "PBKDF2",
      false,
      ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt,
        iterations: 1e5,
        hash: "SHA-256"
      },
      keyMaterial,
      {
        name: "AES-GCM",
        length: 256
      },
      false,
      ["encrypt", "decrypt"]
    );
  }
  function generateSalt() {
    return crypto.getRandomValues(new Uint8Array(16));
  }
  function generateIV() {
    return crypto.getRandomValues(new Uint8Array(12));
  }
  async function encrypt(plaintext, masterPassword, salt) {
    const encoder = new TextEncoder();
    const usedSalt = salt || generateSalt();
    const iv = generateIV();
    const key = await deriveKey(masterPassword, usedSalt);
    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      encoder.encode(plaintext)
    );
    return {
      ciphertext: arrayBufferToBase64(encrypted),
      iv: arrayBufferToBase64(iv),
      salt: arrayBufferToBase64(usedSalt)
    };
  }
  async function decrypt(ciphertext, iv, masterPassword, salt) {
    const decoder = new TextDecoder();
    const key = await deriveKey(masterPassword, base64ToArrayBuffer(salt));
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: base64ToArrayBuffer(iv) },
      key,
      base64ToArrayBuffer(ciphertext)
    );
    return decoder.decode(decrypted);
  }
  function arrayBufferToBase64(buffer) {
    const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
  function base64ToArrayBuffer(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }
  return {
    encrypt,
    decrypt,
    generateSalt,
    generateIV,
    deriveKey,
    arrayBufferToBase64,
    base64ToArrayBuffer
  };
}
function useVault() {
  const items = useState("vault-items", () => []);
  const stats = useState("vault-stats", () => null);
  const loading = useState("vault-loading", () => false);
  const error = useState("vault-error", () => null);
  const { encrypt, decrypt } = useCrypto();
  async function fetchItems(filters) {
    var _a;
    loading.value = true;
    error.value = null;
    try {
      const query = new URLSearchParams();
      if (filters == null ? void 0 : filters.type) query.set("type", filters.type);
      if (filters == null ? void 0 : filters.favorites) query.set("favorites", "true");
      if (filters == null ? void 0 : filters.search) query.set("search", filters.search);
      const response = await $fetch(
        `/api/vault?${query.toString()}`
      );
      items.value = response.items;
    } catch (err) {
      error.value = ((_a = err.data) == null ? void 0 : _a.message) || "Erreur lors du chargement.";
    } finally {
      loading.value = false;
    }
  }
  async function fetchStats() {
    try {
      stats.value = await $fetch("/api/vault/stats");
    } catch (err) {
      console.error("Erreur stats:", err);
    }
  }
  async function addItem(data) {
    var _a;
    error.value = null;
    let payload = data.payload;
    let iv;
    if (data.shouldEncrypt && data.masterPassword) {
      const encrypted = await encrypt(data.payload, data.masterPassword);
      payload = `${encrypted.salt}:${encrypted.ciphertext}`;
      iv = encrypted.iv;
    }
    try {
      const response = await $fetch("/api/vault", {
        method: "POST",
        body: {
          type: data.type,
          label: data.label,
          is_encrypted: data.shouldEncrypt,
          payload,
          iv
        }
      });
      await fetchItems();
      await fetchStats();
      return response;
    } catch (err) {
      error.value = ((_a = err.data) == null ? void 0 : _a.message) || "Erreur lors de l'ajout.";
      throw err;
    }
  }
  async function decryptItem(item, masterPassword) {
    if (!item.is_encrypted || !item.iv) {
      return item.payload;
    }
    const [salt, ciphertext] = item.payload.split(":");
    if (!salt || !ciphertext) {
      throw new Error("Format de payload chiffr\xE9 invalide.");
    }
    return decrypt(ciphertext, item.iv, masterPassword, salt);
  }
  async function updateItem(id, data) {
    var _a;
    try {
      await $fetch(`/api/vault/${id}`, {
        method: "PUT",
        body: data
      });
      await fetchItems();
      await fetchStats();
    } catch (err) {
      error.value = ((_a = err.data) == null ? void 0 : _a.message) || "Erreur lors de la mise \xE0 jour.";
      throw err;
    }
  }
  async function toggleFavorite(item) {
    await updateItem(item.id, { favorite: !item.favorite });
  }
  async function deleteItem(id) {
    var _a;
    try {
      await $fetch(`/api/vault/${id}`, { method: "DELETE" });
      await fetchItems();
      await fetchStats();
    } catch (err) {
      error.value = ((_a = err.data) == null ? void 0 : _a.message) || "Erreur lors de la suppression.";
      throw err;
    }
  }
  return {
    items,
    stats,
    loading,
    error,
    fetchItems,
    fetchStats,
    addItem,
    decryptItem,
    updateItem,
    toggleFavorite,
    deleteItem
  };
}

export { useVault as u };
//# sourceMappingURL=useVault--imhJMK4.mjs.map
