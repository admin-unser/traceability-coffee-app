import type { Tree } from '../types/tree';

const STORAGE_KEY = 'beanlog_trees';

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
};

