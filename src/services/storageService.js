class StorageService {
  constructor() {
    this.prefix = 'eshop_';
  }

  setItem(key, value) {
    try {
      const prefixedKey = this.prefix + key;
      const serialized = JSON.stringify(value);
      localStorage.setItem(prefixedKey, serialized);
    } catch (error) {
      console.error(`Erreur lors de la sauvegarde de ${key}:`, error);
    }
  }

  getItem(key) {
    try {
      const prefixedKey = this.prefix + key;
      const serialized = localStorage.getItem(prefixedKey);
      return serialized ? JSON.parse(serialized) : null;
    } catch (error) {
      console.error(`Erreur lors de la récupération de ${key}:`, error);
      return null;
    }
  }

  removeItem(key) {
    try {
      const prefixedKey = this.prefix + key;
      localStorage.removeItem(prefixedKey);
    } catch (error) {
      console.error(`Erreur lors de la suppression de ${key}:`, error);
    }
  }

  hasItem(key) {
    const prefixedKey = this.prefix + key;
    return localStorage.getItem(prefixedKey) !== null;
  }

  getAllKeys() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.prefix)) {
        keys.push(key.substring(this.prefix.length));
      }
    }
    return keys;
  }

  clear() {
    const keys = this.getAllKeys();
    keys.forEach((key) => this.removeItem(key));
  }

  setItemWithExpiration(key, value, expirationMs) {
    const item = {
      value,
      expiration: Date.now() + expirationMs,
    };
    this.setItem(key, item);
  }

  getItemWithExpiration(key) {
    const item = this.getItem(key);
    if (!item) return null;

    if (item.expiration && Date.now() > item.expiration) {
      this.removeItem(key);
      return null;
    }

    return item.value;
  }

  getSize() {
    let size = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.prefix)) {
        const value = localStorage.getItem(key);
        size += key.length + (value ? value.length : 0);
      }
    }
    return size;
  }
}

export default new StorageService();
