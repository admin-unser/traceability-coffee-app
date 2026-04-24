import { motion } from 'framer-motion';
import { Coffee } from 'lucide-react';
import { WeatherWidget } from './WeatherWidget';
import { TaskProgress } from './TaskProgress';
import { QuickStats } from './QuickStats';
import { RecentActivity } from './RecentActivity';

export function DashboardPage() {
  const now = new Date();
  const hour = now.getHours();
  let greeting = 'おはようございます';
  if (hour >= 12 && hour < 17) greeting = 'こんにちは';
  else if (hour >= 17) greeting = 'お疲れさまです';

  const dateStr = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];
  const dayOfWeek = weekDays[now.getDay()];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5"
    >
      {/* Header greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary">{greeting}</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            {dateStr}（{dayOfWeek}）
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-terracotta-100 flex items-center justify-center">
          <Coffee size={20} className="text-terracotta-600" />
        </div>
      </div>

      {/* Weather */}
      <WeatherWidget />

      {/* Task progress */}
      <TaskProgress />

      {/* Quick stats */}
      <QuickStats />

      {/* Recent activity */}
      <RecentActivity />
    </motion.div>
  );
}
