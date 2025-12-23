import type { Activity, ActivityType } from '../types';

interface ActivityTypeSummaryProps {
  activities: Activity[];
}

const activityTypeLabels: Record<ActivityType, string> = {
  harvest: '収穫',
  fertilize: '施肥',
  prune: '剪定',
  process: '加工',
  observe: '観察',
  pestControl: '防除',
  mowing: '草刈り',
  planting: '植栽',
};

const activityTypeColors: Record<ActivityType, string> = {
  harvest: 'bg-green-500',
  fertilize: 'bg-yellow-500',
  prune: 'bg-blue-500',
  process: 'bg-purple-500',
  observe: 'bg-coffee-cream',
  pestControl: 'bg-red-500',
  mowing: 'bg-lime-500',
  planting: 'bg-emerald-500',
};

export function ActivityTypeSummary({ activities }: ActivityTypeSummaryProps) {
  // 活動タイプごとに集計
  const typeCounts = activities.reduce((acc, activity) => {
    acc[activity.type] = (acc[activity.type] || 0) + 1;
    return acc;
  }, {} as Record<ActivityType, number>);

  const sortedTypes = (Object.entries(typeCounts) as [ActivityType, number][]).sort(
    (a, b) => b[1] - a[1]
  );

  const total = activities.length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
        活動タイプ別集計
      </h3>
      {total === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>活動記録がありません</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedTypes.map(([type, count]) => {
            const percentage = ((count / total) * 100).toFixed(1);
            return (
              <div key={type} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded ${activityTypeColors[type]}`}
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {activityTypeLabels[type]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-100">
                      {count}回
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {percentage}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${activityTypeColors[type]}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700 mt-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                合計
              </span>
              <span className="text-lg font-bold text-coffee-brown">
                {total}回
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

