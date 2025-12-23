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
  date: string; // ISO 8601 format
  treeId?: string;
  description: string;
  numericValue?: number; // 収穫量(kg)や肥料量(g)など
  numericUnit?: string; // 'kg', 'g', etc.
  photos: string[]; // Base64 encoded images
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
  totalHarvest: number; // kg
  recentActivities: Activity[];
  weeklyHarvest: { date: string; amount: number }[];
}

