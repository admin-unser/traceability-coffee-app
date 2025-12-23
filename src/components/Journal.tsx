import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  ChevronDown, 
  ChevronUp,
  Calendar,
  TrendingUp,
  Clock
} from 'lucide-react';
import type { Activity, ActivityType } from '../types';
import { StaggerContainer, StaggerItem, AnimatedCounter, FadeIn } from './AnimatedComponents';

interface JournalProps {
  activities: Activity[];
  onNewActivity: () => void;
  onActivityEdit?: (activity: Activity) => void;
  onActivityDelete?: (id: string) => void;
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

// Get week range for a given date
function getWeekRange(date: Date): { start: Date; end: Date; label: string } {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start
  const start = new Date(d.setDate(diff));
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  
  const now = new Date();
  const thisWeekStart = new Date(now);
  const thisDay = thisWeekStart.getDay();
  const thisDiff = thisWeekStart.getDate() - thisDay + (thisDay === 0 ? -6 : 1);
  thisWeekStart.setDate(thisDiff);
  thisWeekStart.setHours(0, 0, 0, 0);
  
  const isThisWeek = start.getTime() === thisWeekStart.getTime();
  
  const formatDate = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;
  const label = isThisWeek 
    ? `${formatDate(start)} - ${formatDate(end)} (今週)` 
    : `${formatDate(start)} - ${formatDate(end)}`;
  
  return { start, end, label };
}

// Get week key for grouping
function getWeekKey(date: Date): string {
  const { start } = getWeekRange(date);
  return start.toISOString().split('T')[0];
}

export function Journal({ activities, onNewActivity, onActivityEdit, onActivityDelete }: JournalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<ActivityType | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedWeeks, setExpandedWeeks] = useState<Set<string>>(new Set(['current']));

  // Calculate stats
  const stats = useMemo(() => {
    const now = new Date();
    const { start: weekStart } = getWeekRange(now);
    
    const thisWeekActivities = activities.filter(a => {
      const actDate = new Date(a.date);
      return actDate >= weekStart;
    });
    
    const lastActivity = activities.length > 0 
      ? activities.reduce((latest, a) => new Date(a.date) > new Date(latest.date) ? a : latest)
      : null;
    
    return {
      total: activities.length,
      thisWeek: thisWeekActivities.length,
      lastActivityDate: lastActivity?.date,
    };
  }, [activities]);

  // Filter activities
  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      // Type filter
      if (selectedType !== 'all' && activity.type !== selectedType) {
        return false;
      }
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          activity.description.toLowerCase().includes(query) ||
          activityTypeLabels[activity.type].toLowerCase().includes(query) ||
          activity.treeId?.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [activities, selectedType, searchQuery]);

  // Group activities by week
  const weeklyGroups = useMemo(() => {
    const groups = new Map<string, { label: string; activities: Activity[] }>();
    
    // Sort by date descending
    const sorted = [...filteredActivities].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    sorted.forEach(activity => {
      const date = new Date(activity.date);
      const weekKey = getWeekKey(date);
      const { label } = getWeekRange(date);
      
      if (!groups.has(weekKey)) {
        groups.set(weekKey, { label, activities: [] });
      }
      groups.get(weekKey)!.activities.push(activity);
    });
    
    // Convert to array and sort by week (most recent first)
    return Array.from(groups.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filteredActivities]);

  // Toggle week expansion
  const toggleWeek = (weekKey: string) => {
    setExpandedWeeks(prev => {
      const next = new Set(prev);
      if (next.has(weekKey)) {
        next.delete(weekKey);
      } else {
        next.add(weekKey);
      }
      return next;
    });
  };

  // Export to CSV
  const handleExport = () => {
    const headers = ['日付', '種類', '樹木ID', '説明', '数量', '単位'];
    const rows = filteredActivities.map(a => [
      new Date(a.date).toLocaleDateString('ja-JP'),
      activityTypeLabels[a.type],
      a.treeId || '',
      a.description,
      a.numericValue?.toString() || '',
      a.numericUnit || '',
    ]);
    
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const bom = '\uFEFF'; // UTF-8 BOM for Excel
    const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `作業日誌_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric',
      weekday: 'short',
    });
  };

  const formatLastActivity = (dateString?: string) => {
    if (!dateString) return '記録なし';
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diff === 0) return '今日';
    if (diff === 1) return '昨日';
    if (diff < 7) return `${diff}日前`;
    return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <FadeIn>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-terracotta-100 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-terracotta-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text-primary">作業日誌</h2>
              <p className="text-sm text-text-secondary">活動記録を管理</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNewActivity}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            新規記録
          </motion.button>
        </div>
      </FadeIn>

      {/* Stats Cards */}
      <StaggerContainer className="grid grid-cols-3 gap-3">
        <StaggerItem>
          <div className="card-natural p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-forest-500" />
              <span className="text-xs text-text-secondary">総記録</span>
            </div>
            <AnimatedCounter 
              value={stats.total}
              className="text-2xl font-bold text-forest-500 font-data"
            />
            <span className="text-sm text-text-secondary">件</span>
          </div>
        </StaggerItem>
        <StaggerItem>
          <div className="card-natural p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-terracotta-500" />
              <span className="text-xs text-text-secondary">今週</span>
            </div>
            <AnimatedCounter 
              value={stats.thisWeek}
              className="text-2xl font-bold text-terracotta-500 font-data"
            />
            <span className="text-sm text-text-secondary">件</span>
          </div>
        </StaggerItem>
        <StaggerItem>
          <div className="card-natural p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-sand-600" />
              <span className="text-xs text-text-secondary">最終</span>
            </div>
            <p className="text-sm font-semibold text-text-primary">
              {formatLastActivity(stats.lastActivityDate)}
            </p>
          </div>
        </StaggerItem>
      </StaggerContainer>

      {/* Search and Filter Bar */}
      <FadeIn delay={0.2}>
        <div className="card-natural p-4">
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-natural pl-10 py-2.5"
              />
            </div>
            
            {/* Filter button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2.5 rounded-xl transition-colors ${
                showFilters || selectedType !== 'all'
                  ? 'bg-terracotta-100 text-terracotta-600'
                  : 'bg-base-cream text-text-secondary hover:text-terracotta-500'
              }`}
            >
              <Filter className="w-5 h-5" />
            </motion.button>
            
            {/* Export button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExport}
              className="p-2.5 rounded-xl bg-base-cream text-text-secondary hover:text-terracotta-500 transition-colors"
            >
              <Download className="w-5 h-5" />
            </motion.button>
          </div>
          
          {/* Filter options */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-4 mt-4 border-t border-gray-100">
                  <p className="text-xs font-medium text-text-secondary mb-2">活動タイプで絞り込み</p>
                  <div className="flex flex-wrap gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedType('all')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                        selectedType === 'all'
                          ? 'bg-terracotta-500 text-white'
                          : 'bg-base-cream text-text-secondary hover:bg-terracotta-50'
                      }`}
                    >
                      すべて
                    </motion.button>
                    {(Object.keys(activityTypeLabels) as ActivityType[]).map((type) => (
                      <motion.button
                        key={type}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedType(type)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors flex items-center gap-1 ${
                          selectedType === type
                            ? 'bg-terracotta-500 text-white'
                            : 'bg-base-cream text-text-secondary hover:bg-terracotta-50'
                        }`}
                      >
                        <span>{activityTypeEmojis[type]}</span>
                        {activityTypeLabels[type]}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </FadeIn>

      {/* Weekly Activity Groups */}
      <FadeIn delay={0.3}>
        {weeklyGroups.length === 0 ? (
          <div className="card-natural text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-base-cream flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-text-muted" />
            </div>
            <p className="text-text-secondary font-medium">
              {searchQuery || selectedType !== 'all' 
                ? '条件に一致する記録がありません' 
                : '活動記録がありません'
              }
            </p>
            <p className="text-sm text-text-muted mt-2">
              「新規記録」ボタンから活動を追加してください
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {weeklyGroups.map(([weekKey, { label, activities: weekActivities }], index) => {
              const isExpanded = expandedWeeks.has(weekKey) || (index === 0 && expandedWeeks.has('current'));
              
              return (
                <motion.div
                  key={weekKey}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="card-natural overflow-hidden"
                >
                  {/* Week header */}
                  <button
                    onClick={() => toggleWeek(weekKey)}
                    className="w-full flex items-center justify-between p-4 hover:bg-base-cream/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-terracotta-100 flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-terracotta-500" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-text-primary">{label}</h3>
                        <p className="text-xs text-text-secondary">{weekActivities.length}件の活動</p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-5 h-5 text-text-muted" />
                    </motion.div>
                  </button>
                  
                  {/* Week activities */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 space-y-2">
                          {weekActivities.map((activity) => (
                            <motion.div
                              key={activity.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex items-start gap-3 p-3 rounded-xl bg-base-cream/50 hover:bg-base-cream transition-colors group"
                            >
                              {/* Activity indicator */}
                              <div className="flex flex-col items-center mt-1">
                                <span className="text-lg">{activityTypeEmojis[activity.type]}</span>
                                <div className="w-0.5 h-full bg-gray-200 mt-1" />
                              </div>
                              
                              {/* Activity content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-medium text-terracotta-600 font-data">
                                    {formatDate(activity.date)}
                                  </span>
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-white text-text-secondary">
                                    {activityTypeLabels[activity.type]}
                                  </span>
                                  {activity.treeId && (
                                    <span className="text-xs text-text-muted">
                                      {activity.treeId}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-text-primary line-clamp-2 leading-relaxed">
                                  {activity.description}
                                </p>
                                {activity.numericValue && (
                                  <p className="text-xs text-text-secondary mt-1 font-data">
                                    数量: {activity.numericValue} {activity.numericUnit}
                                  </p>
                                )}
                              </div>
                              
                              {/* Action buttons (show on hover) */}
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {onActivityEdit && (
                                  <button
                                    onClick={() => onActivityEdit(activity)}
                                    className="p-1.5 rounded-lg hover:bg-terracotta-100 text-text-secondary hover:text-terracotta-600 transition-colors"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </button>
                                )}
                                {onActivityDelete && (
                                  <button
                                    onClick={() => {
                                      if (confirm('この記録を削除しますか？')) {
                                        onActivityDelete(activity.id);
                                      }
                                    }}
                                    className="p-1.5 rounded-lg hover:bg-red-100 text-text-secondary hover:text-red-600 transition-colors"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </FadeIn>
    </div>
  );
}
