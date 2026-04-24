import type { FarmArea, FarmTree } from '../types';

const AREAS_KEY = 'beanlog_farm_areas';
const TREES_KEY = 'beanlog_farm_trees';

export const farmService = {
  // ===== Areas =====
  getAllAreas(): FarmArea[] {
    try {
      const data = localStorage.getItem(AREAS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load areas:', error);
      return [];
    }
  },

  saveArea(area: FarmArea): void {
    const areas = this.getAllAreas();
    const idx = areas.findIndex(a => a.id === area.id);
    if (idx >= 0) {
      areas[idx] = area;
    } else {
      areas.push(area);
    }
    localStorage.setItem(AREAS_KEY, JSON.stringify(areas));
  },

  deleteArea(id: string): void {
    const areas = this.getAllAreas().filter(a => a.id !== id);
    localStorage.setItem(AREAS_KEY, JSON.stringify(areas));
    // Also delete trees in this area
    const trees = this.getAllTrees().filter(t => t.areaId !== id);
    localStorage.setItem(TREES_KEY, JSON.stringify(trees));
  },

  // ===== Trees =====
  getAllTrees(): FarmTree[] {
    try {
      const data = localStorage.getItem(TREES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load trees:', error);
      return [];
    }
  },

  getTreesByArea(areaId: string): FarmTree[] {
    return this.getAllTrees().filter(t => t.areaId === areaId);
  },

  saveTree(tree: FarmTree): void {
    const trees = this.getAllTrees();
    const idx = trees.findIndex(t => t.id === tree.id);
    if (idx >= 0) {
      trees[idx] = tree;
    } else {
      trees.push(tree);
    }
    localStorage.setItem(TREES_KEY, JSON.stringify(trees));
  },

  deleteTree(id: string): void {
    const trees = this.getAllTrees().filter(t => t.id !== id);
    localStorage.setItem(TREES_KEY, JSON.stringify(trees));
  },

  getTotalTreeCount(): number {
    return this.getAllTrees().length;
  },
};
