import { motion } from 'framer-motion';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { farmService } from '../../services/farm';
import type { FarmArea, FarmTree, TreeHealthStatus } from '../../types';

interface TreeListProps {
  area: FarmArea;
  onBack: () => void;
  onAddTree: () => void;
  onRefresh: () => void;
}

const healthLabels: Record<TreeHealthStatus, string> = {
  excellent: '優良',
  good: '良好',
  fair: '普通',
  poor: '要注意',
};

const healthVariants: Record<TreeHealthStatus, 'green' | 'terracotta' | 'sand' | 'red'> = {
  excellent: 'green',
  good: 'green',
  fair: 'sand',
  poor: 'red',
};

const healthDots: Record<TreeHealthStatus, string> = {
  excellent: 'bg-emerald-400',
  good: 'bg-forest-400',
  fair: 'bg-amber-400',
  poor: 'bg-red-400',
};

export function TreeList({ area, onBack, onAddTree, onRefresh }: TreeListProps) {
  const trees = farmService.getTreesByArea(area.id);

  const handleDeleteTree = (tree: FarmTree) => {
    if (confirm(`${tree.name} を削除しますか？`)) {
      farmService.deleteTree(tree.id);
      onRefresh();
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
          <ArrowLeft size={18} className="text-text-primary" />
        </button>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-text-primary">{area.name}</h2>
          <p className="text-xs text-text-secondary">{trees.length} 本の木</p>
        </div>
        <button
          onClick={onAddTree}
          className="px-4 py-2 bg-forest-600 text-white text-sm font-medium rounded-full"
        >
          木を追加
        </button>
      </div>

      {/* Tree list */}
      {trees.length === 0 ? (
        <div className="text-center py-12 text-text-muted text-sm">
          まだ木が登録されていません
        </div>
      ) : (
        <div className="space-y-2">
          {trees.map((tree, i) => (
            <motion.div
              key={tree.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-white rounded-xl p-4 shadow-soft flex items-center gap-3"
            >
              <div className="flex-shrink-0">
                <div className={`w-3 h-3 rounded-full ${healthDots[tree.health]}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-text-primary">{tree.name}</span>
                  <Badge variant={healthVariants[tree.health]} size="sm">
                    {healthLabels[tree.health]}
                  </Badge>
                </div>
                <p className="text-xs text-text-secondary mt-0.5">
                  品種: {tree.variety} | 植栽: {tree.plantedDate}
                </p>
                {tree.notes && (
                  <p className="text-xs text-text-muted mt-0.5 truncate">{tree.notes}</p>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTree(tree);
                }}
                className="w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center"
              >
                <Trash2 size={14} className="text-text-muted hover:text-red-500" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
