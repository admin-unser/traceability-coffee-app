import { motion } from 'framer-motion';
import { TreePine, Package, ClipboardList } from 'lucide-react';
import { farmService } from '../../services/farm';
import { revenueService } from '../../services/revenue';
import { diaryService } from '../../services/diary';

export function QuickStats() {
  const totalTrees = farmService.getTotalTreeCount();
  const monthHarvest = revenueService.getCurrentMonthHarvest();
  const activeTasks = diaryService.getAll().filter(e => {
    const entryDate = new Date(e.date);
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return entryDate >= weekAgo;
  }).length;

  const stats = [
    {
      label: '総木数',
      value: totalTrees.toString(),
      unit: '本',
      icon: TreePine,
      color: 'bg-forest-50 text-forest-600',
      iconBg: 'bg-forest-100',
    },
    {
      label: '今月の収穫',
      value: monthHarvest > 0 ? monthHarvest.toFixed(1) : '0',
      unit: 'kg',
      icon: Package,
      color: 'bg-terracotta-50 text-terracotta-600',
      iconBg: 'bg-terracotta-100',
    },
    {
      label: '今週の作業',
      value: activeTasks.toString(),
      unit: '件',
      icon: ClipboardList,
      color: 'bg-amber-50 text-amber-600',
      iconBg: 'bg-amber-100',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
            className="bg-white rounded-2xl p-3 shadow-soft text-center"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center mx-auto mb-2`}>
              <Icon size={18} className={stat.color.split(' ')[1]} />
            </div>
            <div className="flex items-baseline justify-center gap-0.5">
              <span className="text-xl font-bold text-text-primary">{stat.value}</span>
              <span className="text-xs text-text-muted">{stat.unit}</span>
            </div>
            <p className="text-[10px] text-text-secondary mt-0.5">{stat.label}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
