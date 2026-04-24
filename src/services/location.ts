export interface LocationConfig {
  name: string;
  latitude: number;
  longitude: number;
}

const STORAGE_KEY = 'beanlog_location_config';
const DEFAULT_LOCATION: LocationConfig = {
  name: '沖縄県大宜味村',
  latitude: 26.7,
  longitude: 128.1,
};

export const locationService = {
  getConfig(): LocationConfig {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      return DEFAULT_LOCATION;
    } catch (error) {
      console.error('Failed to load location config:', error);
      return DEFAULT_LOCATION;
    }
  },

  saveConfig(config: LocationConfig): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (error) {
      console.error('Failed to save location config:', error);
      throw error;
    }
  },

  resetToDefault(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to reset location config:', error);
    }
  },
};
