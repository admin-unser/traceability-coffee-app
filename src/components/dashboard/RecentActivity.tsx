import { motion } from 'framer-motion';
import {
  Scissors, Leaf, Eye, Bug, Sprout, Package, Shovel, TreePine,
} from 'lucide-react';
import { diaryService } from '../../services/diary';
import type { ActivityType } from '../../types';

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

export function RecentActivity() {
  const entries = diaryService.getRecentEntries(5);

  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-text-muted text-sm">
        まだ作業記録がありません
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-text-primary mb-3">最近の記録</h3>
      {entries.map((entry, i) => {
        const Icon = activityIcons[entry.activityType] || Eye;
        const colorClass = activityColors[entry.activityType] || 'bg-gray-100 text-gray-600';
        const [bgClass, textClass] = colorClass.split(' ');

        return (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-soft"
          >
            <div className={`w-10 h-10 rounded-xl ${bgClass} flex items-center justify-center flex-shrink-0`}>
              <Icon size={18} className={textClass} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">{entry.title}</p>
              <p className="text-xs text-text-muted">
                {activityLabels[entry.activityType]} - {formatDate(entry.date)}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return '今日';
  if (days === 1) return '昨日';
  if (days < 7) return `${days}日前`;
  return `${date.getMonth() + 1}/${date.getDate()}`;
}
