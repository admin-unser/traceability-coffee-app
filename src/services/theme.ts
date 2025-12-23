export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'coffee_traceability_theme';

export const themeService = {
  getTheme(): Theme {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'dark' || saved === 'light') {
        return saved;
      }
      // システム設定を確認
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
      return 'light';
    } catch (error) {
      console.error('Failed to load theme:', error);
      return 'light';
    }
  },

  setTheme(theme: Theme): void {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
      this.applyTheme(theme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  },

  applyTheme(theme: Theme): void {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  },
};

