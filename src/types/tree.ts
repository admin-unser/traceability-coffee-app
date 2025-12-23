export interface Tree {
  id: string;
  treeId: string; // 木番号（例: No.042）
  name?: string; // 木の名前（任意）
  location?: string; // 位置情報（任意）
  plantedDate?: string; // 植栽日
  variety?: string; // 品種
  notes?: string; // メモ
  createdAt: string;
  updatedAt: string;
}

