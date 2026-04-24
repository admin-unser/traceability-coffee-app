export interface CoffeeDiaryEntry {
  id: string;
  date: string; // ISO 8601 format
  coffeeName: string; // コーヒー名
  origin?: string; // 産地
  roastLevel?: 'light' | 'medium' | 'dark'; // 焙煎度
  brewingMethod?: string; // 抽出方法
  tasteProfile: {
    acidity?: number; // 1-5
    sweetness?: number; // 1-5
    bitterness?: number; // 1-5
    body?: number; // 1-5
    aroma?: number; // 1-5
  };
  notes?: string; // メモ
  rating?: number; // 1-5
  photos?: string[]; // Base64 encoded images
  createdAt: string;
  updatedAt: string;
}

export interface CoffeeLearningContent {
  id: string;
  date: string; // ISO 8601 format
  title: string;
  content: string;
  category: 'history' | 'cultivation' | 'processing' | 'brewing' | 'tasting' | 'general';
  read: boolean;
  createdAt: string;
}
