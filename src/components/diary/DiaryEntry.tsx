import { motion } from 'framer-motion';
import {
  Scissors, Leaf, Eye, Bug, Sprout, Package, Shovel, TreePine, Image, Trash2,
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import type { DiaryEntry as DiaryEntryType, ActivityType } from '../../types';

interface DiaryEntryProps {
  entry: DiaryEntryType;
  index: number;
  onDelete: (id: string) => void;
  onClick: (entry: DiaryEntryType) => void;
}

const activityIcons: Record<ActivityType, typeof Leaf> = {
  harvest: Package,
  fertilize: Sprout,
  prune: Scissors,
  process: Shovel,
  observe: Eye,
  pestControl: Bug,
  mowing: Leaf,
  planting: TreePine,
};

const activityLabels: Record<ActivityType, string> = {
  harvest: '収穫',
  fertilize: '施肥',
  prune: '剪定',
  process: '加工',
  observe: '観察',
  pestControl: '防除',
  mowing: '草刈り',
  planting: '植栽',
};

const activityColors: Record<ActivityType, string> = {
  harvest: 'bg-terracotta-100 text-terracotta-600',
  fertilize: 'bg-forest-100 text-forest-600',
  prune: 'bg-amber-100 text-amber-600',
  process: 'bg-purple-100 text-purple-600',
  observe: 'bg-blue-100 text-blue-600',
  pestControl: 'bg-red-100 text-red-600',
  mowing: 'bg-emerald-100 text-emerald-600',
  planting: 'bg-green-100 text-green-600',
};

export function DiaryEntryCard({ entry, index, onDelete, onClick }: DiaryEntryProps) {
  const types = entry.activityTypes ?? [entry.activityType];
  const primaryType = types[0];
  const Icon = activityIcons[primaryType] || Eye;
  const colorClass = activityColors[primaryType] || 'bg-gray-100 text-gray-600';
  const [bgClass, textClass] = colorClass.split(' ');
  const time = new Date(entry.createdAt).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-2xl p-4 shadow-soft cursor-pointer active:scale-[0.98] transition-transform"
      onClick={() => onClick(entry)}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl ${bgClass} flex items-center justify-center flex-shrink-0 mt-0.5`}>
          <Icon size={18} className={textClass} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            {types.map(t => (
              <Badge key={t} variant="green" size="sm">{activityLabels[t]}</Badge>
            ))}
            <span className="text-xs text-text-muted">{time}</span>
          </div>
          <h4 className="text-sm font-semibold text-text-primary mb-1">{entry.title}</h4>
          <p className="text-xs text-text-secondary line-clamp-2">{entry.description}</p>

          {entry.photos.length > 0 && (
            <div className="flex items-center gap-1 mt-2 text-xs text-text-muted">
              <Image size={12} />
              <span>{entry.photos.length} 枚の写真</span>
            </div>
          )}

          {entry.snsPost && (
            <div className="mt-2 px-2 py-1 bg-purple-50 rounded-lg">
              <span className="text-[10px] text-purple-600 font-medium">SNS投稿生成済み</span>
            </div>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(entry.id);
          }}
          className="w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center flex-shrink-0"
        >
          <Trash2 size={14} className="text-text-muted" />
        </button>
      </div>
    </motion.div>
  );
}
