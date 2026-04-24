// ===== Activity Types (kept from original) =====
export type ActivityType =
  | 'harvest'      // 収穫
  | 'fertilize'    // 施肥
  | 'prune'        // 剪定
  | 'process'      // 加工
  | 'observe'      // 観察
  | 'pestControl'  // 防除
  | 'mowing'       // 草刈り
  | 'planting';    // 植栽

export type WeatherCondition =
  | 'sunny'
  | 'cloudy'
  | 'rainy'
  | 'stormy';

export interface WeatherData {
  temperature: number;
  maxTemperature?: number;
  minTemperature?: number;
  condition: WeatherCondition;
  humidity?: number;
  timestamp: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  date: string;
  plotId?: string;
  treeId?: string;
  description: string;
  numericValue?: number;
  numericUnit?: string;
  photos: string[];
  weather?: WeatherData;
  aiDiagnosis?: AIDiagnosis;
  createdAt: string;
  updatedAt: string;
}

export interface AIDiagnosis {
  disease?: string;
  pest?: string;
  ripeness?: string;
  advice: string;
  confidence?: number;
}

export interface DashboardStats {
  totalHarvest: number;
  recentActivities: Activity[];
  weeklyHarvest: { date: string; amount: number }[];
}

// ===== Farm Management Types =====
export type TreeHealthStatus = 'excellent' | 'good' | 'fair' | 'poor';

export interface FarmArea {
  id: string;
  name: string;
  description: string;
  treeCount: number;
  status: 'active' | 'resting' | 'new';
  elevation?: number;
  createdAt: string;
  updatedAt: string;
}

export interface FarmTree {
  id: string;
  areaId: string;
  name: string;
  variety: string;
  plantedDate: string;
  health: TreeHealthStatus;
  lastInspection?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ===== Diary Types =====
export interface DiaryEntry {
  id: string;
  date: string;
  activityType: ActivityType;       // 後方互換性のため残す
  activityTypes?: ActivityType[];    // 複数選択対応
  title: string;
  description: string;
  photos: string[];
  weather?: WeatherData;
  snsPost?: SNSPost;
  createdAt: string;
  updatedAt: string;
}

export type SNSPlatform = 'instagram' | 'x' | 'note';

export interface SNSPost {
  text: string;
  hashtags: string[];
  platform: SNSPlatform;
  generatedAt: string;
  generatedImageUrl?: string;   // AI生成画像URL
  coffeeNews?: string;          // 投稿に含めたコーヒーニュース
}

// ===== Revenue Types =====
export type TransactionType = 'income' | 'expense';

export type TransactionCategory =
  | 'harvest_sale'    // 収穫販売
  | 'bean_sale'       // 豆販売
  | 'fertilizer'      // 肥料
  | 'equipment'       // 機材
  | 'labor'           // 人件費
  | 'utilities'       // 光熱費
  | 'transport'       // 運搬費
  | 'other';          // その他

export interface Transaction {
  id: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  unitPrice?: number;
  quantity?: number;
  unit?: string;
  date: string;
  memo: string;
  createdAt: string;
  updatedAt: string;
}

export interface RevenueSummary {
  totalRevenue: number;
  totalExpense: number;
  profit: number;
  totalHarvestKg: number;
}

export interface MonthlyData {
  month: string;
  revenue: number;
  expense: number;
  profit: number;
}

// ===== Navigation =====
export type TabId = 'dashboard' | 'farm' | 'diary' | 'revenue';
