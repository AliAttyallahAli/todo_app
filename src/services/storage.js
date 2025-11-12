import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageKeys = {
  USER_DATA: 'user_data',
  AUTH_TOKEN: 'auth_token',
  RECENT_SEARCHES: 'recent_searches',
  APP_SETTINGS: 'app_settings',
  CART_ITEMS: 'cart_items',
  FAVORITE_PRODUCTS: 'favorite_products',
};

export const storage = {
  // Sauvegarder des données
  setItem: async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      return true;
    } catch (error) {
      console.error('Error saving to storage:', error);
      return false;
    }
  },

  // Récupérer des données
  getItem: async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error reading from storage:', error);
      return null;
    }
  },

  // Supprimer des données
  removeItem: async (key) => {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from storage:', error);
      return false;
    }
  },

  // Vider tout le stockage
  clear: async () => {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  },

  // Récupérer plusieurs clés
  multiGet: async (keys) => {
    try {
      return await AsyncStorage.multiGet(keys);
    } catch (error) {
      console.error('Error multi-get from storage:', error);
      return null;
    }
  },

  // Sauvegarder plusieurs clés
  multiSet: async (keyValuePairs) => {
    try {
      await AsyncStorage.multiSet(keyValuePairs);
      return true;
    } catch (error) {
      console.error('Error multi-set to storage:', error);
      return false;
    }
  },
};

// Helper pour les recherches récentes
export const recentSearches = {
  add: async (searchTerm) => {
    const searches = await storage.getItem(StorageKeys.RECENT_SEARCHES) || [];
    const updated = [searchTerm, ...searches.filter(s => s !== searchTerm)].slice(0, 10);
    await storage.setItem(StorageKeys.RECENT_SEARCHES, updated);
    return updated;
  },

  get: async () => {
    return await storage.getItem(StorageKeys.RECENT_SEARCHES) || [];
  },

  clear: async () => {
    await storage.removeItem(StorageKeys.RECENT_SEARCHES);
    return [];
  },
};