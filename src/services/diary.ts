import type { DiaryEntry } from '../types';

const STORAGE_KEY = 'beanlog_diary_entries';

export const diaryService = {
  getAll(): DiaryEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load diary entries:', error);
      return [];
    }
  },

  getByDate(date: string): DiaryEntry[] {
    return this.getAll().filter(e => e.date === date);
  },

  save(entry: DiaryEntry): void {
    const entries = this.getAll();
    const idx = entries.findIndex(e => e.id === entry.id);
    if (idx >= 0) {
      entries[idx] = entry;
    } else {
      entries.push(entry);
    }
    entries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  },

  delete(id: string): void {
    const entries = this.getAll().filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  },

  getRecentEntries(limit: number = 5): DiaryEntry[] {
    return this.getAll().slice(0, limit);
  },

  getDatesWithEntries(): string[] {
    const entries = this.getAll();
    const dates = new Set(entries.map(e => e.date));
    return Array.from(dates);
  },
};
