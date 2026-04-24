import type { CoffeeDiaryEntry } from '../types/coffee';

const STORAGE_KEY = 'beanlog_coffee_diary';

export const coffeeDiaryService = {
  getAll(): CoffeeDiaryEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load coffee diary entries:', error);
      return [];
    }
  },

  save(entry: CoffeeDiaryEntry): void {
    const entries = this.getAll();
    const existingIndex = entries.findIndex(e => e.id === entry.id);
    
    if (existingIndex >= 0) {
      entries[existingIndex] = entry;
    } else {
      entries.push(entry);
    }
    
    // 日付でソート（新しい順）
    entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
      console.error('Failed to save coffee diary entry:', error);
      throw error;
    }
  },

  delete(id: string): void {
    const entries = this.getAll().filter(e => e.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
      console.error('Failed to delete coffee diary entry:', error);
      throw error;
    }
  },

  getByDate(date: string): CoffeeDiaryEntry[] {
    const dateStr = date.split('T')[0];
    return this.getAll().filter(e => e.date.startsWith(dateStr));
  },

  getByDateRange(startDate: string, endDate: string): CoffeeDiaryEntry[] {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    return this.getAll().filter(e => {
      const entryDate = new Date(e.date).getTime();
      return entryDate >= start && entryDate <= end;
    });
  },
};
