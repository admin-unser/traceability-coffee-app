import { motion } from 'framer-motion';
import { Trash2, Edit, Calendar, TreePine, Sparkles } from 'lucide-react';
import type { Activity, ActivityType } from '../types';
import { StaggerContainer, StaggerItem, IconButton } from './AnimatedComponents';

interface ActivityListProps {
  activities: Activity[];
  onEdit?: (activity: Activity) => void;
  onDelete?: (id: string) => void;
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

const activityTypeStyles: Record<ActivityType, { bg: string; text: string; emoji: string }> = {
  harvest: { bg: 'bg-green-100', text: 'text-green-700', emoji: '🌿' },
  fertilize: { bg: 'bg-amber-100', text: 'text-amber-700', emoji: '🧪' },
  prune: { bg: 'bg-blue-100', text: 'text-blue-700', emoji: '✂️' },
  process: { bg: 'bg-purple-100', text: 'text-purple-700', emoji: '⚙️' },
  observe: { bg: 'bg-terracotta-100', text: 'text-terracotta-700', emoji: '👁️' },
  pestControl: { bg: 'bg-red-100', text: 'text-red-700', emoji: '🛡️' },
  mowing: { bg: 'bg-lime-100', text: 'text-lime-700', emoji: '🌾' },
  planting: { bg: 'bg-teal-100', text: 'text-teal-700', emoji: '🌱' },
};

export function ActivityList({ activities, onEdit, onDelete }: ActivityListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (activities.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-base-cream flex items-center justify-center">
          <Calendar className="w-8 h-8 text-text-muted" />
        </div>
        <p className="text-text-secondary font-medium">まだ活動記録がありません</p>
        <p className="text-sm text-text-muted mt-2">
          カメラボタンから記録を追加してください
        </p>
      </motion.div>
    );
  }

  return (
    <StaggerContainer className="space-y-3">
      {activities.map((activity) => {
        const style = activityTypeStyles[activity.type];
        
        return (
          <StaggerItem key={activity.id}>
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
              className="bg-base-cream/50 rounded-2xl p-4 hover:bg-base-cream transition-all group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium ${style.bg} ${style.text}`}
                  >
                    <span>{style.emoji}</span>
                    {activityTypeLabels[activity.type]}
                  </motion.span>
                  
                  {activity.treeId && (
                    <span className="inline-flex items-center gap-1 text-sm text-text-secondary bg-white px-2 py-1 rounded-lg">
                      <TreePine className="w-3.5 h-3.5" />
                      {activity.treeId}
                    </span>
                  )}
                </div>
                
                {/* Action buttons */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {onEdit && (
                    <IconButton
                      onClick={() => onEdit(activity)}
                      className="!p-1.5 hover:!bg-terracotta-100 hover:text-terracotta-600"
                    >
                      <Edit className="w-4 h-4" />
                    </IconButton>
                  )}
                  {onDelete && (
                    <IconButton
                      onClick={() => {
                        if (confirm('この記録を削除しますか？')) {
                          onDelete(activity.id);
                        }
                      }}
                      className="!p-1.5 hover:!bg-red-100 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </IconButton>
                  )}
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center gap-2 text-sm text-text-secondary mb-2">
                <Calendar className="w-3.5 h-3.5" />
                <span className="font-data">{formatDate(activity.date)}</span>
              </div>

              {/* Description */}
              <p className="text-sm text-text-primary mb-3 leading-relaxed">{activity.description}</p>

              {/* Numeric value */}
              {activity.numericValue && (
                <div className="inline-flex items-center gap-2 text-sm text-text-secondary mb-3 bg-white px-2.5 py-1 rounded-lg">
                  <span>数量:</span>
                  <span className="font-data text-text-primary font-medium">{activity.numericValue}</span>
                  <span>{activity.numericUnit}</span>
                </div>
              )}

              {/* Photos */}
              {activity.photos.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {activity.photos.slice(0, 3).map((photo, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.03 }}
                      className="relative aspect-video rounded-xl overflow-hidden bg-gray-100"
                    >
                      <img
                        src={photo}
                        alt={`Activity photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {index === 2 && activity.photos.length > 3 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            +{activity.photos.length - 3}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}

              {/* AI Diagnosis */}
              {activity.aiDiagnosis && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-3 rounded-xl bg-forest-50 border border-forest-100"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-forest-500" />
                    <p className="text-xs font-semibold text-forest-600">AI診断</p>
                  </div>
                  <p className="text-sm text-text-primary leading-relaxed">{activity.aiDiagnosis.advice}</p>
                </motion.div>
              )}

              {/* Weather */}
              {activity.weather && (
                <div className="flex items-center gap-2 text-xs text-text-muted mt-3 pt-3 border-t border-gray-100">
                  <span>天気:</span>
                  <span>{activity.weather.condition}</span>
                  <span className="font-data">{activity.weather.temperature}°C</span>
                </div>
              )}
            </motion.div>
          </StaggerItem>
        );
      })}
    </StaggerContainer>
  );
}
