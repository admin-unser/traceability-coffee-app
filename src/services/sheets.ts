import type { Activity } from '../types';

const STORAGE_KEY_SHEET_ID = 'beanlog_sheet_id';
const STORAGE_KEY_SHEET_NAME = 'beanlog_sheet_name';

export interface SheetsConfig {
  spreadsheetId: string;
  sheetName: string;
}

export const sheetsService = {
  getConfig(): SheetsConfig | null {
    try {
      const id = localStorage.getItem(STORAGE_KEY_SHEET_ID);
      const name = localStorage.getItem(STORAGE_KEY_SHEET_NAME);
      if (id && name) {
        return { spreadsheetId: id, sheetName: name };
      }
      return null;
    } catch (error) {
      console.error('Failed to load sheets config:', error);
      return null;
    }
  },

  saveConfig(config: SheetsConfig): void {
    try {
      localStorage.setItem(STORAGE_KEY_SHEET_ID, config.spreadsheetId);
      localStorage.setItem(STORAGE_KEY_SHEET_NAME, config.sheetName);
    } catch (error) {
      console.error('Failed to save sheets config:', error);
      throw error;
    }
  },

  clearConfig(): void {
    try {
      localStorage.removeItem(STORAGE_KEY_SHEET_ID);
      localStorage.removeItem(STORAGE_KEY_SHEET_NAME);
    } catch (error) {
      console.error('Failed to clear sheets config:', error);
    }
  },

  async syncActivity(activity: Activity): Promise<void> {
    const config = this.getConfig();
    if (!config) {
      throw new Error('スプレッドシートが設定されていません。');
    }

    // Google Apps Script Web App を使用する方法
    // または Google Sheets API を直接使用
    // ここでは、Google Apps Script Web App のURLを使用する方法を実装
    
    const scriptUrl = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL;
    if (!scriptUrl) {
      throw new Error('Google Apps Script URLが設定されていません。');
    }

    const row = this.activityToRow(activity);
    
    try {
      const response = await fetch(scriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'append',
          spreadsheetId: config.spreadsheetId,
          sheetName: config.sheetName,
          row: row,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to sync to sheets: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to sync activity to sheets:', error);
      throw error;
    }
  },

  activityToRow(activity: Activity): string[] {
    const date = new Date(activity.date);
    return [
      activity.id,
      activity.type,
      date.toLocaleDateString('ja-JP'),
      date.toLocaleTimeString('ja-JP'),
      activity.treeId || '',
      activity.description,
      activity.numericValue?.toString() || '',
      activity.numericUnit || '',
      activity.photos.length.toString(),
      activity.weather?.condition || '',
      activity.weather?.temperature?.toString() || '',
      activity.weather?.humidity?.toString() || '',
      activity.aiDiagnosis?.disease || '',
      activity.aiDiagnosis?.pest || '',
      activity.aiDiagnosis?.ripeness || '',
      activity.aiDiagnosis?.advice || '',
      activity.createdAt,
      activity.updatedAt,
    ];
  },

  getHeaders(): string[] {
    return [
      'ID',
      'タイプ',
      '日付',
      '時刻',
      '木番号',
      '説明',
      '数量',
      '単位',
      '写真数',
      '天気',
      '気温',
      '湿度',
      'AI診断-病気',
      'AI診断-害虫',
      'AI診断-熟度',
      'AI診断-アドバイス',
      '作成日時',
      '更新日時',
    ];
  },
};

