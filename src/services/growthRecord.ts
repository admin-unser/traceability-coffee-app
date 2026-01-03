import type { GrowthRecord } from '../types/tree';

const STORAGE_KEY = 'beanlog_growth_records';

export const growthRecordService = {
  getAll(): GrowthRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load growth records from storage:', error);
      return [];
    }
  },

  getByTreeId(treeId: string): GrowthRecord[] {
    const records = this.getAll();
    return records
      .filter(r => r.treeId === treeId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  save(record: GrowthRecord): void {
    const records = this.getAll();
    const existingIndex = records.findIndex(r => r.id === record.id);
    
    if (existingIndex >= 0) {
      records[existingIndex] = record;
    } else {
      records.push(record);
    }
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (error) {
      console.error('Failed to save growth record to storage:', error);
      throw error;
    }
  },

  delete(id: string): void {
    const records = this.getAll().filter(r => r.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (error) {
      console.error('Failed to delete growth record from storage:', error);
      throw error;
    }
  },

  getLatestByTreeId(treeId: string): GrowthRecord | undefined {
    const records = this.getByTreeId(treeId);
    return records[0];
  },

  // 成長統計を取得
  getGrowthStats(treeId: string): {
    totalGrowth: number;
    averageGrowthPerMonth: number;
    recordCount: number;
  } {
    const records = this.getByTreeId(treeId);
    if (records.length < 2) {
      return { totalGrowth: 0, averageGrowthPerMonth: 0, recordCount: records.length };
    }

    const heightRecords = records.filter(r => r.height !== undefined);
    if (heightRecords.length < 2) {
      return { totalGrowth: 0, averageGrowthPerMonth: 0, recordCount: records.length };
    }

    // 最新と最古の記録から成長量を計算
    const latestHeight = heightRecords[0].height!;
    const oldestHeight = heightRecords[heightRecords.length - 1].height!;
    const totalGrowth = latestHeight - oldestHeight;

    // 期間を計算（月単位）
    const latestDate = new Date(heightRecords[0].date);
    const oldestDate = new Date(heightRecords[heightRecords.length - 1].date);
    const monthsDiff = (latestDate.getTime() - oldestDate.getTime()) / (1000 * 60 * 60 * 24 * 30);

    const averageGrowthPerMonth = monthsDiff > 0 ? totalGrowth / monthsDiff : 0;

    return {
      totalGrowth,
      averageGrowthPerMonth: Math.round(averageGrowthPerMonth * 10) / 10,
      recordCount: records.length,
    };
  },
};


