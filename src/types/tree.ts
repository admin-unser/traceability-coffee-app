export interface Tree {
  id: string;
  treeId: string; // 木番号（例: No.042）
  name?: string; // 木の名前（任意）
  location?: string; // 位置情報（任意）
  plantedDate?: string; // 植栽日
  variety?: string; // 品種
  notes?: string; // メモ
  initialHeight?: number; // 植栽時の高さ (cm)
  targetHeight?: number; // 目標の高さ (cm)
  createdAt: string;
  updatedAt: string;
}

// 健康状態
export type HealthStatus = 'excellent' | 'good' | 'fair' | 'poor';

// 成長記録
export interface GrowthRecord {
  id: string;
  treeId: string; // 紐付く樹木ID
  date: string; // 記録日
  height?: number; // 高さ (cm)
  trunkDiameter?: number; // 幹の直径 (cm)
  leafCount?: number; // 葉の枚数
  healthStatus?: HealthStatus; // 健康状態
  fertilizers?: string[]; // 使用肥料
  notes?: string; // メモ
  photos?: string[]; // 写真
  createdAt: string;
  updatedAt: string;
}

