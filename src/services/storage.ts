import type { Activity } from '../types';

const STORAGE_KEY = 'beanlog_activities';

export const storageService = {
  getAll(): Activity[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load activities from storage:', error);
      return [];
    }
  },

  save(activity: Activity): void {
    const activities = this.getAll();
    const existingIndex = activities.findIndex(a => a.id === activity.id);
    
    if (existingIndex >= 0) {
      activities[existingIndex] = activity;
    } else {
      activities.push(activity);
    }
    
    activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
    } catch (error) {
      console.error('Failed to save activity to storage:', error);
      throw error;
    }
  },

  delete(id: string): void {
    const activities = this.getAll().filter(a => a.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
    } catch (error) {
      console.error('Failed to delete activity from storage:', error);
      throw error;
    }
  },

  clearAll(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear storage:', error);
      throw error;
    }
  },

  exportToCSV(): string {
    const activities = this.getAll();
    
    if (activities.length === 0) {
      return '';
    }

    const headers = [
      'ID',
      'タイプ',
      '日付',
      '木番号',
      '説明',
      '数値',
      '単位',
      '写真数',
      '天気',
      '気温',
      'AI診断',
      '作成日時',
    ];

    const rows = activities.map(activity => [
      activity.id,
      activity.type,
      activity.date,
      activity.treeId || '',
      activity.description.replace(/,/g, '，'), // CSV用にカンマを全角に
      activity.numericValue?.toString() || '',
      activity.numericUnit || '',
      activity.photos.length.toString(),
      activity.weather?.condition || '',
      activity.weather?.temperature?.toString() || '',
      activity.aiDiagnosis?.advice?.replace(/,/g, '，') || '',
      activity.createdAt,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csvContent;
  },
};

