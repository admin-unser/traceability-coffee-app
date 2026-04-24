import type { Tree, Plot } from '../types/tree';

const STORAGE_KEY = 'beanlog_trees';
const PLOT_STORAGE_KEY = 'beanlog_plots';

export const treeService = {
  getAll(): Tree[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load trees from storage:', error);
      return [];
    }
  },

  save(tree: Tree): void {
    const trees = this.getAll();
    const existingIndex = trees.findIndex(t => t.id === tree.id);
    
    if (existingIndex >= 0) {
      trees[existingIndex] = tree;
    } else {
      trees.push(tree);
    }
    
    trees.sort((a, b) => a.treeId.localeCompare(b.treeId));
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trees));
    } catch (error) {
      console.error('Failed to save tree to storage:', error);
      throw error;
    }
  },

  delete(id: string): void {
    const trees = this.getAll().filter(t => t.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trees));
    } catch (error) {
      console.error('Failed to delete tree from storage:', error);
      throw error;
    }
  },

  getByTreeId(treeId: string): Tree | undefined {
    return this.getAll().find(t => t.treeId === treeId);
  },

  saveBatch(trees: Omit<Tree, 'id' | 'createdAt' | 'updatedAt'>[]): void {
    const existingTrees = this.getAll();
    const now = new Date().toISOString();
    
    trees.forEach((treeData) => {
      // 既存の樹木番号と重複チェック
      const existing = existingTrees.find(t => t.treeId === treeData.treeId);
      if (!existing) {
        const tree: Tree = {
          ...treeData,
          id: `tree_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: now,
          updatedAt: now,
        };
        existingTrees.push(tree);
      }
    });
    
    existingTrees.sort((a, b) => a.treeId.localeCompare(b.treeId));
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingTrees));
    } catch (error) {
      console.error('Failed to save trees to storage:', error);
      throw error;
    }
  },

  getByPlotId(plotId: string): Tree[] {
    return this.getAll().filter(t => t.plotId === plotId);
  },

  // 各行に異なるデータを設定できる一括登録
  saveBatchWithIndividualData(trees: Array<{
    treeId: string;
    variety?: string;
    plantedDate?: string;
    plotId?: string;
    location?: string;
    name?: string;
    notes?: string;
  }>): { added: number; skipped: number } {
    const existingTrees = this.getAll();
    const now = new Date().toISOString();
    let addedCount = 0;
    let skippedCount = 0;
    
    trees.forEach((treeData) => {
      // 既存の樹木番号と重複チェック
      const existing = existingTrees.find(t => t.treeId === treeData.treeId);
      if (!existing) {
        const tree: Tree = {
          id: `tree_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          treeId: treeData.treeId,
          variety: treeData.variety,
          plantedDate: treeData.plantedDate,
          plotId: treeData.plotId,
          location: treeData.location,
          name: treeData.name,
          notes: treeData.notes,
          createdAt: now,
          updatedAt: now,
        };
        existingTrees.push(tree);
        addedCount++;
      } else {
        skippedCount++;
      }
    });
    
    // 数値順にソート
    existingTrees.sort((a, b) => {
      const numA = parseInt(a.treeId) || 0;
      const numB = parseInt(b.treeId) || 0;
      return numA - numB;
    });
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingTrees));
    } catch (error) {
      console.error('Failed to save trees to storage:', error);
      throw error;
    }

    return { added: addedCount, skipped: skippedCount };
  },
};

// 区画管理サービス
export const plotService = {
  getAll(): Plot[] {
    try {
      const data = localStorage.getItem(PLOT_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load plots from storage:', error);
      return [];
    }
  },

  save(plot: Plot): void {
    const plots = this.getAll();
    const existingIndex = plots.findIndex(p => p.id === plot.id);
    
    if (existingIndex >= 0) {
      plots[existingIndex] = plot;
    } else {
      plots.push(plot);
    }
    
    plots.sort((a, b) => a.name.localeCompare(b.name));
    
    try {
      localStorage.setItem(PLOT_STORAGE_KEY, JSON.stringify(plots));
    } catch (error) {
      console.error('Failed to save plot to storage:', error);
      throw error;
    }
  },

  delete(id: string): void {
    const plots = this.getAll().filter(p => p.id !== id);
    try {
      localStorage.setItem(PLOT_STORAGE_KEY, JSON.stringify(plots));
    } catch (error) {
      console.error('Failed to delete plot from storage:', error);
      throw error;
    }
  },

  getById(id: string): Plot | undefined {
    return this.getAll().find(p => p.id === id);
  },
};

