import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Clock, AlertTriangle } from 'lucide-react';
import { reminderService, type Reminder } from '../services/reminder';
import type { ActivityType } from '../types';

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

const activityTypeEmojis: Record<ActivityType, string> = {
  harvest: '🌿',
  fertilize: '🧪',
  prune: '✂️',
  process: '⚙️',
  observe: '👁️',
  pestControl: '🛡️',
  mowing: '🌾',
  planting: '🌱',
};

export function ReminderSettings() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [lastActivityDates, setLastActivityDates] = useState<Record<ActivityType, string | null>>({
    harvest: null,
    fertilize: null,
    prune: null,
    process: null,
    observe: null,
    pestControl: null,
    mowing: null,
    planting: null,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setReminders(reminderService.getReminders());
    setLastActivityDates(reminderService.getLastActivityDates());
  };

  const handleToggle = (reminderId: string) => {
    const reminder = reminders.find(r => r.id === reminderId);
    if (reminder) {
      reminder.enabled = !reminder.enabled;
      reminderService.updateReminder(reminder);
      loadData();
    }
  };

  const handleIntervalChange = (reminderId: string, days: number) => {
    const reminder = reminders.find(r => r.id === reminderId);
    if (reminder) {
      reminder.intervalDays = days;
      reminderService.updateReminder(reminder);
      loadData();
    }
  };

  const formatLastActivity = (date: string | null) => {
    if (!date) return '記録なし';
    const d = new Date(date);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diff === 0) return '今日';
    if (diff === 1) return '昨日';
    if (diff < 7) return `${diff}日前`;
    return d.toLocaleDateString('ja-JP');
  };

  const getDaysUntilReminder = (reminder: Reminder, lastDate: string | null) => {
    if (!lastDate) return 0;
    const d = new Date(lastDate);
    const now = new Date();
    const daysSinceLastActivity = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, reminder.intervalDays - daysSinceLastActivity);
  };

  return (
    <div className="card-natural p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-2xl bg-terracotta-100 flex items-center justify-center">
          <Bell className="w-5 h-5 text-terracotta-500" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-text-primary">リマインダー設定</h3>
          <p className="text-sm text-text-secondary">定期的な作業の通知設定</p>
        </div>
      </div>

      <div className="space-y-3">
        {reminders.map((reminder, index) => {
          const lastDate = lastActivityDates[reminder.type];
          const daysUntil = getDaysUntilReminder(reminder, lastDate);
          const isUrgent = reminder.enabled && lastDate && daysUntil === 0;
          
          return (
            <motion.div
              key={reminder.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 rounded-2xl border-2 transition-all ${
                reminder.enabled
                  ? isUrgent
                    ? 'border-terracotta-300 bg-terracotta-50'
                    : 'border-forest-200 bg-forest-50'
                  : 'border-gray-200 bg-base-cream/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  {/* Toggle Switch */}
                  <button
                    onClick={() => handleToggle(reminder.id)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      reminder.enabled ? 'bg-forest-500' : 'bg-gray-300'
                    }`}
                  >
                    <motion.div
                      className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                      animate={{ left: reminder.enabled ? 28 : 4 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{activityTypeEmojis[reminder.type]}</span>
                    <span className={`font-medium ${reminder.enabled ? 'text-text-primary' : 'text-text-muted'}`}>
                      {activityTypeLabels[reminder.type]}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-text-muted" />
                  <select
                    value={reminder.intervalDays}
                    onChange={(e) => handleIntervalChange(reminder.id, parseInt(e.target.value))}
                    disabled={!reminder.enabled}
                    className="text-sm bg-white border border-gray-200 rounded-lg px-2 py-1 text-text-primary disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <option value={7}>7日</option>
                    <option value={14}>14日</option>
                    <option value={21}>21日</option>
                    <option value={30}>30日</option>
                    <option value={60}>60日</option>
                    <option value={90}>90日</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted">最終活動: {formatLastActivity(lastDate)}</span>
                {reminder.enabled && lastDate && daysUntil > 0 && (
                  <span className="text-forest-600 font-medium">
                    あと{daysUntil}日
                  </span>
                )}
                {isUrgent && (
                  <span className="flex items-center gap-1 text-terracotta-600 font-medium">
                    <AlertTriangle className="w-3 h-3" />
                    作業時期です
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
