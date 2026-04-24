import { motion } from 'framer-motion';
import { TreePine, ChevronRight } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { farmService } from '../../services/farm';
import type { FarmArea } from '../../types';

interface AreaCardProps {
  area: FarmArea;
  onClick: () => void;
  index: number;
}

const statusLabels: Record<FarmArea['status'], string> = {
  active: '稼働中',
  resting: '休止中',
  new: '新規',
};

const statusVariants: Record<FarmArea['status'], 'green' | 'sand' | 'terracotta'> = {
  active: 'green',
  resting: 'sand',
  new: 'terracotta',
};

export function AreaCard({ area, onClick, index }: AreaCardProps) {
  const treeCount = farmService.getTreesByArea(area.id).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={onClick}
      className="bg-white rounded-2xl p-4 shadow-soft flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-transform"
    >
      <div className="w-12 h-12 rounded-xl bg-forest-100 flex items-center justify-center flex-shrink-0">
        <TreePine size={22} className="text-forest-600" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-sm font-semibold text-text-primary truncate">{area.name}</h3>
          <Badge variant={statusVariants[area.status]}>{statusLabels[area.status]}</Badge>
        </div>
        <p className="text-xs text-text-secondary truncate">{area.description || '説明なし'}</p>
        <p className="text-xs text-text-muted mt-1">{treeCount} 本の木</p>
      </div>

      <ChevronRight size={18} className="text-text-muted flex-shrink-0" />
    </motion.div>
  );
}
