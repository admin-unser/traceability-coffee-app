import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Ruler, Circle, Leaf, Heart, Droplets, Camera, X, Image } from 'lucide-react';
import type { GrowthRecord, HealthStatus, Tree } from '../types/tree';
import { imageUtils } from '../utils/image';
import { LoadingSpinner } from './AnimatedComponents';

interface GrowthRecordFormProps {
  tree: Tree;
  onSave: (record: GrowthRecord) => void;
  onCancel: () => void;
  initialRecord?: GrowthRecord;
}

const healthStatusLabels: Record<HealthStatus, { label: string; color: string; emoji: string }> = {
  excellent: { label: '非常に良好', color: 'text-green-600 bg-green-100', emoji: '🌟' },
  good: { label: '良好', color: 'text-forest-600 bg-forest-100', emoji: '😊' },
  fair: { label: '普通', color: 'text-yellow-600 bg-yellow-100', emoji: '😐' },
  poor: { label: '要注意', color: 'text-red-600 bg-red-100', emoji: '⚠️' },
};

const commonFertilizers = [
  '堆肥',
  '腐葉土',
  '油粕',
  '化成肥料',
  '有機肥料',
  '鶏糞',
  '牛糞',
  '骨粉',
  'バーク堆肥',
  '液体肥料',
];

export function GrowthRecordForm({ tree, onSave, onCancel, initialRecord }: GrowthRecordFormProps) {
  const [date, setDate] = useState(initialRecord?.date || new Date().toISOString().split('T')[0]);
  const [height, setHeight] = useState(initialRecord?.height?.toString() || '');
  const [trunkDiameter, setTrunkDiameter] = useState(initialRecord?.trunkDiameter?.toString() || '');
  const [leafCount, setLeafCount] = useState(initialRecord?.leafCount?.toString() || '');
  const [healthStatus, setHealthStatus] = useState<HealthStatus | undefined>(initialRecord?.healthStatus);
  const [fertilizers, setFertilizers] = useState<string[]>(initialRecord?.fertilizers || []);
  const [customFertilizer, setCustomFertilizer] = useState('');
  const [notes, setNotes] = useState(initialRecord?.notes || '');
  const [photos, setPhotos] = useState<string[]>(initialRecord?.photos || []);
  const [loading, setLoading] = useState(false);

  const handlePhotoCapture = async () => {
    const base64 = await imageUtils.captureFromCamera();
    if (base64) {
      setPhotos([...photos, base64]);
    }
  };

  const handlePhotoSelect = async () => {
    const base64 = await imageUtils.selectFromGallery();
    if (base64) {
      setPhotos([...photos, base64]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const toggleFertilizer = (fertilizer: string) => {
    if (fertilizers.includes(fertilizer)) {
      setFertilizers(fertilizers.filter(f => f !== fertilizer));
    } else {
      setFertilizers([...fertilizers, fertilizer]);
    }
  };

  const addCustomFertilizer = () => {
    if (customFertilizer.trim() && !fertilizers.includes(customFertilizer.trim())) {
      setFertilizers([...fertilizers, customFertilizer.trim()]);
      setCustomFertilizer('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const record: GrowthRecord = {
      id: initialRecord?.id || `growth_${Date.now()}`,
      treeId: tree.id,
      date,
      height: height ? parseFloat(height) : undefined,
      trunkDiameter: trunkDiameter ? parseFloat(trunkDiameter) : undefined,
      leafCount: leafCount ? parseInt(leafCount) : undefined,
      healthStatus,
      fertilizers: fertilizers.length > 0 ? fertilizers : undefined,
      notes: notes || undefined,
      photos: photos.length > 0 ? photos : undefined,
      createdAt: initialRecord?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(record);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-5">
      {/* 対象樹木の表示 */}
      <div className="bg-forest-50 dark:bg-forest-900/20 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-forest-100 dark:bg-forest-800 flex items-center justify-center">
            <span className="text-lg">🌳</span>
          </div>
          <div>
            <p className="text-sm text-text-secondary dark:text-gray-400">対象樹木</p>
            <p className="font-bold text-text-primary dark:text-white">{tree.treeId}</p>
            {tree.name && <p className="text-xs text-text-muted dark:text-gray-500">({tree.name})</p>}
          </div>
        </div>
      </div>

      {/* 記録日 */}
      <div>
        <label className="block text-sm font-medium text-text-primary dark:text-white mb-2">
          記録日 <span className="text-coffee-red">*</span>
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input-natural dark:bg-gray-700 dark:text-white dark:border-gray-600"
          required
        />
      </div>

      {/* 計測値 */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-text-primary dark:text-white flex items-center gap-2">
          <Ruler className="w-4 h-4 text-terracotta-500" />
          計測値
        </h3>
        
        <div className="grid grid-cols-3 gap-3">
          {/* 高さ */}
          <div>
            <label className="block text-xs text-text-secondary dark:text-gray-400 mb-1">
              高さ (cm)
            </label>
            <div className="relative">
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="150"
                className="input-natural pr-10 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                min="0"
                step="0.1"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted dark:text-gray-500">cm</span>
            </div>
          </div>

          {/* 幹直径 */}
          <div>
            <label className="block text-xs text-text-secondary dark:text-gray-400 mb-1">
              幹直径 (cm)
            </label>
            <div className="relative">
              <input
                type="number"
                value={trunkDiameter}
                onChange={(e) => setTrunkDiameter(e.target.value)}
                placeholder="5"
                className="input-natural pr-10 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                min="0"
                step="0.1"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted dark:text-gray-500">cm</span>
            </div>
          </div>

          {/* 葉の枚数 */}
          <div>
            <label className="block text-xs text-text-secondary dark:text-gray-400 mb-1">
              葉の枚数
            </label>
            <input
              type="number"
              value={leafCount}
              onChange={(e) => setLeafCount(e.target.value)}
              placeholder="20"
              className="input-natural dark:bg-gray-700 dark:text-white dark:border-gray-600"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* 健康状態 */}
      <div>
        <label className="block text-sm font-medium text-text-primary dark:text-white mb-2 flex items-center gap-2">
          <Heart className="w-4 h-4 text-red-500" />
          健康状態
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(Object.entries(healthStatusLabels) as [HealthStatus, typeof healthStatusLabels[HealthStatus]][]).map(([status, { label, color, emoji }]) => (
            <motion.button
              key={status}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setHealthStatus(status)}
              className={`p-3 rounded-xl border-2 transition-all ${
                healthStatus === status
                  ? `${color} border-current`
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <span className="text-lg mr-2">{emoji}</span>
              <span className="text-sm font-medium">{label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* 使用肥料 */}
      <div>
        <label className="block text-sm font-medium text-text-primary dark:text-white mb-2 flex items-center gap-2">
          <Droplets className="w-4 h-4 text-blue-500" />
          使用肥料
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {commonFertilizers.map((fertilizer) => (
            <motion.button
              key={fertilizer}
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleFertilizer(fertilizer)}
              className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                fertilizers.includes(fertilizer)
                  ? 'bg-terracotta-500 text-white'
                  : 'bg-base-cream dark:bg-gray-700 text-text-secondary dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {fertilizer}
            </motion.button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={customFertilizer}
            onChange={(e) => setCustomFertilizer(e.target.value)}
            placeholder="その他の肥料を追加"
            className="input-natural flex-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCustomFertilizer();
              }
            }}
          />
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addCustomFertilizer}
            className="btn-secondary px-4"
          >
            追加
          </motion.button>
        </div>
        {fertilizers.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {fertilizers.filter(f => !commonFertilizers.includes(f)).map((fertilizer) => (
              <span
                key={fertilizer}
                className="inline-flex items-center gap-1 px-2 py-1 bg-terracotta-100 dark:bg-terracotta-900/30 text-terracotta-700 dark:text-terracotta-300 rounded-full text-xs"
              >
                {fertilizer}
                <button
                  type="button"
                  onClick={() => toggleFertilizer(fertilizer)}
                  className="hover:text-terracotta-900 dark:hover:text-terracotta-100"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 写真 */}
      <div>
        <label className="block text-sm font-medium text-text-primary dark:text-white mb-2 flex items-center gap-2">
          <Camera className="w-4 h-4 text-purple-500" />
          写真
        </label>
        <div className="flex gap-2 mb-3">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePhotoCapture}
            className="flex-1 py-3 px-4 bg-base-cream dark:bg-gray-700 rounded-xl flex items-center justify-center gap-2 text-text-secondary dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Camera className="w-5 h-5" />
            <span className="text-sm font-medium">撮影</span>
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePhotoSelect}
            className="flex-1 py-3 px-4 bg-base-cream dark:bg-gray-700 rounded-xl flex items-center justify-center gap-2 text-text-secondary dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Image className="w-5 h-5" />
            <span className="text-sm font-medium">選択</span>
          </motion.button>
        </div>
        {photos.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {photos.map((photo, index) => (
              <div key={index} className="relative aspect-square rounded-xl overflow-hidden">
                <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(index)}
                  className="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* メモ */}
      <div>
        <label className="block text-sm font-medium text-text-primary dark:text-white mb-2">
          メモ
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="成長の様子、気づいたことなど"
          className="input-natural resize-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
      </div>

      {/* ボタン */}
      <div className="flex gap-3 pt-4">
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCancel}
          className="btn-secondary flex-1"
        >
          キャンセル
        </motion.button>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
          className="btn-primary flex-1 flex items-center justify-center gap-2"
        >
          {loading ? (
            <LoadingSpinner size="sm" />
          ) : (
            <>
              <Save className="w-5 h-5" />
              保存
            </>
          )}
        </motion.button>
      </div>
    </form>
  );
}


