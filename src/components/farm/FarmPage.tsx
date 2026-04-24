import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import { TabFilter } from '../ui/TabFilter';
import { AreaCard } from './AreaCard';
import { TreeList } from './TreeList';
import { AddAreaForm, AddTreeForm } from './AddAreaForm';
import { farmService } from '../../services/farm';
import type { FarmArea } from '../../types';

type FarmFilter = 'all' | 'active' | 'resting' | 'new';

const filterTabs: { id: FarmFilter; label: string }[] = [
  { id: 'all', label: '全て' },
  { id: 'active', label: '稼働中' },
  { id: 'resting', label: '休止中' },
  { id: 'new', label: '新規' },
];

export function FarmPage() {
  const [filter, setFilter] = useState<FarmFilter>('all');
  const [selectedArea, setSelectedArea] = useState<FarmArea | null>(null);
  const [showAddArea, setShowAddArea] = useState(false);
  const [showAddTree, setShowAddTree] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey(k => k + 1), []);

  const areas = farmService.getAllAreas();
  const filteredAreas = filter === 'all' ? areas : areas.filter(a => a.status === filter);

  const handleDeleteArea = (area: FarmArea) => {
    if (confirm(`${area.name} とその中の木をすべて削除しますか？`)) {
      farmService.deleteArea(area.id);
      refresh();
    }
  };

  if (selectedArea) {
    return (
      <div key={refreshKey}>
        <TreeList
          area={selectedArea}
          onBack={() => setSelectedArea(null)}
          onAddTree={() => setShowAddTree(true)}
          onRefresh={refresh}
        />
        <AddTreeForm
          isOpen={showAddTree}
          onClose={() => setShowAddTree(false)}
          areaId={selectedArea.id}
          onSaved={refresh}
        />
      </div>
    );
  }

  return (
    <motion.div
      key={refreshKey}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-text-primary">農園管理</h1>
        <button
          onClick={() => setShowAddArea(true)}
          className="flex items-center gap-1 px-4 py-2 bg-forest-600 text-white text-sm font-medium rounded-full"
        >
          <Plus size={16} />
          エリア追加
        </button>
      </div>

      {/* Filter tabs */}
      <TabFilter tabs={filterTabs} activeTab={filter} onTabChange={setFilter} />

      {/* Summary */}
      <div className="flex gap-3">
        <div className="flex-1 bg-forest-50 rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-forest-700">{areas.length}</p>
          <p className="text-xs text-forest-600">エリア</p>
        </div>
        <div className="flex-1 bg-terracotta-50 rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-terracotta-700">{farmService.getTotalTreeCount()}</p>
          <p className="text-xs text-terracotta-600">総木数</p>
        </div>
      </div>

      {/* Area list */}
      {filteredAreas.length === 0 ? (
        <div className="text-center py-12 text-text-muted text-sm">
          {filter === 'all' ? 'エリアが登録されていません' : '該当するエリアはありません'}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAreas.map((area, i) => (
            <div key={area.id} className="relative group">
              <AreaCard
                area={area}
                onClick={() => setSelectedArea(area)}
                index={i}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteArea(area);
                }}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={14} className="text-red-400" />
              </button>
            </div>
          ))}
        </div>
      )}

      <AddAreaForm
        isOpen={showAddArea}
        onClose={() => setShowAddArea(false)}
        onSaved={refresh}
      />
    </motion.div>
  );
}
