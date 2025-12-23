import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TreePine, Calendar, ChevronDown, Image, Sparkles } from 'lucide-react';
import type { Activity, ActivityType } from '../types';
import type { Tree } from '../types/tree';
import { storageService } from '../services/storage';
import { treeService } from '../services/tree';

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

export function TreeActivityHistory() {
  const [trees, setTrees] = useState<Tree[]>([]);
  const [selectedTreeId, setSelectedTreeId] = useState<string>('');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [expandedActivityId, setExpandedActivityId] = useState<string | null>(null);

  useEffect(() => {
    const loadedTrees = treeService.getAll();
    setTrees(loadedTrees);
    if (loadedTrees.length > 0 && !selectedTreeId) {
      setSelectedTreeId(loadedTrees[0].treeId);
    }
  }, []);

  useEffect(() => {
    if (selectedTreeId) {
      const allActivities = storageService.getAll();
      const treeActivities = allActivities.filter(a => a.treeId === selectedTreeId);
      treeActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setActivities(treeActivities);
    }
  }, [selectedTreeId]);

  const selectedTree = trees.find(t => t.treeId === selectedTreeId);

  return (
    <div className="card-natural p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-2xl bg-forest-100 flex items-center justify-center">
          <TreePine className="w-5 h-5 text-forest-500" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-text-primary">樹木別活動履歴</h3>
          <p className="text-sm text-text-secondary">各樹木の作業記録を確認</p>
        </div>
      </div>

      {/* Tree Selection */}
      {trees.length > 0 ? (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-text-primary mb-2">樹木を選択</label>
            <select
              value={selectedTreeId}
              onChange={(e) => setSelectedTreeId(e.target.value)}
              className="input-natural"
            >
              {trees.map((tree) => (
                <option key={tree.id} value={tree.treeId}>
                  {tree.treeId} {tree.name ? `(${tree.name})` : ''} {tree.variety ? `- ${tree.variety}` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Selected Tree Info */}
          {selectedTree && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 rounded-2xl bg-forest-50 border border-forest-100 mb-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <TreePine className="w-5 h-5 text-forest-500" />
                <h4 className="font-semibold text-text-primary">{selectedTree.treeId}</h4>
                {selectedTree.name && (
                  <span className="text-sm text-text-secondary">({selectedTree.name})</span>
                )}
              </div>
              <div className="text-sm text-text-secondary space-y-1">
                {selectedTree.variety && <p>品種: {selectedTree.variety}</p>}
                {selectedTree.location && <p>場所: {selectedTree.location}</p>}
                {selectedTree.plantedDate && (
                  <p className="font-data">植栽日: {new Date(selectedTree.plantedDate).toLocaleDateString('ja-JP')}</p>
                )}
              </div>
            </motion.div>
          )}

          {/* Activity List */}
          {activities.length > 0 ? (
            <div className="space-y-2">
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-100 last:border-0"
                >
                  <button
                    onClick={() => setExpandedActivityId(expandedActivityId === activity.id ? null : activity.id)}
                    className="w-full flex items-center justify-between py-3 text-left hover:bg-base-cream/50 px-2 -mx-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{activityTypeEmojis[activity.type]}</span>
                      <div>
                        <span className="font-medium text-text-primary">{activityTypeLabels[activity.type]}</span>
                        <p className="text-sm text-text-secondary font-data">
                          {new Date(activity.date).toLocaleDateString('ja-JP')}
                        </p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: expandedActivityId === activity.id ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-5 h-5 text-text-muted" />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {expandedActivityId === activity.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 bg-base-cream/50 rounded-xl mb-2">
                          <p className="text-sm text-text-primary mb-2 leading-relaxed">{activity.description}</p>
                          {activity.numericValue && (
                            <p className="text-sm text-text-secondary mb-2">
                              数量: <span className="font-data font-medium text-text-primary">{activity.numericValue} {activity.numericUnit}</span>
                            </p>
                          )}
                          {activity.photos.length > 0 && (
                            <div className="flex items-center gap-2 mb-2">
                              <Image className="w-4 h-4 text-text-muted" />
                              <span className="text-sm text-text-secondary">{activity.photos.length}枚の写真</span>
                            </div>
                          )}
                          {activity.aiDiagnosis && (
                            <div className="mt-2 p-3 bg-forest-50 rounded-xl border border-forest-100">
                              <div className="flex items-center gap-2 mb-1">
                                <Sparkles className="w-4 h-4 text-forest-500" />
                                <span className="text-xs font-semibold text-forest-600">AI診断</span>
                              </div>
                              <p className="text-sm text-text-primary">{activity.aiDiagnosis.advice}</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-10 h-10 mx-auto mb-2 text-text-muted" />
              <p className="text-text-secondary">この樹木の活動記録はありません</p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <TreePine className="w-10 h-10 mx-auto mb-2 text-text-muted" />
          <p className="text-text-secondary mb-2">樹木が登録されていません</p>
          <p className="text-sm text-text-muted">「樹木マスタ」から樹木を登録してください</p>
        </div>
      )}
    </div>
  );
}
