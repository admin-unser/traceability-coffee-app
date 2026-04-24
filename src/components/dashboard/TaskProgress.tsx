import { Card } from '../ui/Card';
import { diaryService } from '../../services/diary';

export function TaskProgress() {
  const today = new Date().toISOString().split('T')[0];
  const allEntries = diaryService.getAll();
  const todayEntries = allEntries.filter(e => e.date === today);

  // Simple daily goal: 3 entries per day
  const dailyGoal = 3;
  const completed = todayEntries.length;
  const progress = Math.min(completed / dailyGoal, 1);
  const percentage = Math.round(progress * 100);

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <Card className="flex items-center gap-4">
      {/* Circular progress */}
      <div className="relative w-24 h-24 flex-shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#F0F5F1"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#4A7C59"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-forest-700">{percentage}%</span>
        </div>
      </div>

      <div className="flex-1">
        <h3 className="text-sm font-semibold text-text-primary mb-1">今日の作業</h3>
        <p className="text-xs text-text-secondary mb-2">
          {completed} / {dailyGoal} 件完了
        </p>
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div
            className="bg-forest-500 rounded-full h-1.5 transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </Card>
  );
}
