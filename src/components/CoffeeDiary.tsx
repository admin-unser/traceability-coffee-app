import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Coffee, Plus, Edit, Trash2, Star, Camera, X, Save } from 'lucide-react';
import type { CoffeeDiaryEntry } from '../types/coffee';
import { coffeeDiaryService } from '../services/coffeeDiary';
import { imageUtils } from '../utils/image';
import { StaggerContainer, StaggerItem, AnimatedModal, IconButton } from './AnimatedComponents';

export function CoffeeDiary() {
  const [entries, setEntries] = useState<CoffeeDiaryEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<CoffeeDiaryEntry | undefined>();
  const [formData, setFormData] = useState<Partial<CoffeeDiaryEntry>>({
    date: new Date().toISOString().split('T')[0],
    coffeeName: '',
    origin: '',
    roastLevel: 'medium',
    brewingMethod: '',
    tasteProfile: {
      acidity: 3,
      sweetness: 3,
      bitterness: 3,
      body: 3,
      aroma: 3,
    },
    notes: '',
    rating: 3,
    photos: [],
  });

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = () => {
    const loaded = coffeeDiaryService.getAll();
    setEntries(loaded);
  };

  const handleSave = () => {
    if (!formData.coffeeName?.trim()) {
      alert('コーヒー名を入力してください。');
      return;
    }

    const entry: CoffeeDiaryEntry = {
      id: editingEntry?.id || `diary-${Date.now()}`,
      date: formData.date || new Date().toISOString().split('T')[0],
      coffeeName: formData.coffeeName,
      origin: formData.origin,
      roastLevel: formData.roastLevel || 'medium',
      brewingMethod: formData.brewingMethod,
      tasteProfile: formData.tasteProfile || {
        acidity: 3,
        sweetness: 3,
        bitterness: 3,
        body: 3,
        aroma: 3,
      },
      notes: formData.notes,
      rating: formData.rating || 3,
      photos: formData.photos || [],
      createdAt: editingEntry?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    coffeeDiaryService.save(entry);
    loadEntries();
    resetForm();
  };

  const handleEdit = (entry: CoffeeDiaryEntry) => {
    setEditingEntry(entry);
    setFormData({
      date: entry.date.split('T')[0],
      coffeeName: entry.coffeeName,
      origin: entry.origin,
      roastLevel: entry.roastLevel,
      brewingMethod: entry.brewingMethod,
      tasteProfile: entry.tasteProfile,
      notes: entry.notes,
      rating: entry.rating,
      photos: entry.photos || [],
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('この記録を削除しますか？')) {
      coffeeDiaryService.delete(id);
      loadEntries();
    }
  };

  const resetForm = () => {
    setEditingEntry(undefined);
    setShowForm(false);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      coffeeName: '',
      origin: '',
      roastLevel: 'medium',
      brewingMethod: '',
      tasteProfile: {
        acidity: 3,
        sweetness: 3,
        bitterness: 3,
        body: 3,
        aroma: 3,
      },
      notes: '',
      rating: 3,
      photos: [],
    });
  };

  const handlePhotoCapture = async () => {
    const base64 = await imageUtils.captureFromCamera();
    if (base64) {
      setFormData({
        ...formData,
        photos: [...(formData.photos || []), base64],
      });
    }
  };

  const handleRemovePhoto = (index: number) => {
    const newPhotos = formData.photos?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, photos: newPhotos });
  };

  const renderStars = (rating: number, onChange?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange?.(star)}
            className={`${onChange ? 'cursor-pointer' : ''}`}
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const renderSlider = (
    label: string,
    value: number,
    onChange: (value: number) => void
  ) => {
    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-text-primary">{label}</label>
          <span className="text-sm text-text-secondary">{value}</span>
        </div>
        <input
          type="range"
          min="1"
          max="5"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-terracotta-500"
        />
      </div>
    );
  };

  return (
    <div className="space-y-4 p-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-terracotta-100 flex items-center justify-center">
            <Coffee className="w-6 h-6 text-terracotta-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">珈琲飲用日誌</h1>
            <p className="text-sm text-text-secondary">毎日のコーヒーの記録</p>
          </div>
        </div>
        <IconButton onClick={() => setShowForm(true)}>
          <Plus className="w-5 h-5" />
        </IconButton>
      </div>

      {/* Entries List */}
      {entries.length === 0 ? (
        <div className="card-natural p-8 text-center">
          <Coffee className="w-12 h-12 text-text-muted mx-auto mb-3" />
          <p className="text-text-secondary">まだ記録がありません</p>
          <p className="text-sm text-text-muted mt-2">最初のコーヒーを記録してみましょう</p>
        </div>
      ) : (
        <StaggerContainer className="space-y-3">
          {entries.map((entry) => (
            <StaggerItem key={entry.id}>
              <motion.div
                className="card-natural p-4"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-text-primary">{entry.coffeeName}</h3>
                      {entry.rating && renderStars(entry.rating)}
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm text-text-secondary mb-2">
                      {entry.origin && <span>産地: {entry.origin}</span>}
                      {entry.roastLevel && (
                        <span>焙煎: {entry.roastLevel === 'light' ? '浅煎り' : entry.roastLevel === 'medium' ? '中煎り' : '深煎り'}</span>
                      )}
                      {entry.brewingMethod && <span>抽出: {entry.brewingMethod}</span>}
                      <span>{new Date(entry.date).toLocaleDateString('ja-JP')}</span>
                    </div>
                    {entry.notes && (
                      <p className="text-sm text-text-secondary mb-2">{entry.notes}</p>
                    )}
                    {entry.tasteProfile && (
                      <div className="grid grid-cols-5 gap-2 mt-3">
                        <div className="text-center">
                          <p className="text-xs text-text-muted">酸味</p>
                          <p className="text-sm font-semibold">{entry.tasteProfile.acidity || '-'}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-text-muted">甘み</p>
                          <p className="text-sm font-semibold">{entry.tasteProfile.sweetness || '-'}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-text-muted">苦味</p>
                          <p className="text-sm font-semibold">{entry.tasteProfile.bitterness || '-'}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-text-muted">コク</p>
                          <p className="text-sm font-semibold">{entry.tasteProfile.body || '-'}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-text-muted">香り</p>
                          <p className="text-sm font-semibold">{entry.tasteProfile.aroma || '-'}</p>
                        </div>
                      </div>
                    )}
                    {entry.photos && entry.photos.length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {entry.photos.map((photo, idx) => (
                          <img
                            key={idx}
                            src={photo}
                            alt={`Photo ${idx + 1}`}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-2">
                    <IconButton onClick={() => handleEdit(entry)}>
                      <Edit className="w-4 h-4" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(entry.id)}>
                      <Trash2 className="w-4 h-4" />
                    </IconButton>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}

      {/* Form Modal */}
      <AnimatedModal isOpen={showForm} onClose={resetForm}>
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-soft-lg max-h-[90vh] overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-text-primary dark:text-white">
                {editingEntry ? '記録を編集' : '新しい記録'}
              </h2>
              <button
                onClick={resetForm}
                className="w-8 h-8 rounded-full bg-base-cream dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-text-secondary dark:text-gray-400 hover:text-text-primary dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="overflow-y-auto max-h-[calc(90vh-80px)] custom-scrollbar p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                日付
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="input-natural w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                コーヒー名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.coffeeName || ''}
                onChange={(e) => setFormData({ ...formData, coffeeName: e.target.value })}
                placeholder="例: エチオピア イルガチェフェ"
                className="input-natural w-full"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  産地
                </label>
                <input
                  type="text"
                  value={formData.origin || ''}
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  placeholder="例: エチオピア"
                  className="input-natural w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  焙煎度
                </label>
                <select
                  value={formData.roastLevel || 'medium'}
                  onChange={(e) => setFormData({ ...formData, roastLevel: e.target.value as any })}
                  className="input-natural w-full"
                >
                  <option value="light">浅煎り</option>
                  <option value="medium">中煎り</option>
                  <option value="dark">深煎り</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                抽出方法
              </label>
              <input
                type="text"
                value={formData.brewingMethod || ''}
                onChange={(e) => setFormData({ ...formData, brewingMethod: e.target.value })}
                placeholder="例: ハンドドリップ"
                className="input-natural w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                総合評価
              </label>
              <div className="flex items-center gap-2">
                {renderStars(formData.rating || 3, (rating) =>
                  setFormData({ ...formData, rating })
                )}
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-text-primary">
                味のプロファイル（1-5）
              </label>
              {formData.tasteProfile && (
                <>
                  {renderSlider('酸味', formData.tasteProfile.acidity || 3, (value) =>
                    setFormData({
                      ...formData,
                      tasteProfile: { ...formData.tasteProfile!, acidity: value },
                    })
                  )}
                  {renderSlider('甘み', formData.tasteProfile.sweetness || 3, (value) =>
                    setFormData({
                      ...formData,
                      tasteProfile: { ...formData.tasteProfile!, sweetness: value },
                    })
                  )}
                  {renderSlider('苦味', formData.tasteProfile.bitterness || 3, (value) =>
                    setFormData({
                      ...formData,
                      tasteProfile: { ...formData.tasteProfile!, bitterness: value },
                    })
                  )}
                  {renderSlider('コク', formData.tasteProfile.body || 3, (value) =>
                    setFormData({
                      ...formData,
                      tasteProfile: { ...formData.tasteProfile!, body: value },
                    })
                  )}
                  {renderSlider('香り', formData.tasteProfile.aroma || 3, (value) =>
                    setFormData({
                      ...formData,
                      tasteProfile: { ...formData.tasteProfile!, aroma: value },
                    })
                  )}
                </>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                メモ
              </label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="味わいの感想や気づきを記録..."
                className="input-natural w-full h-24 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                写真
              </label>
              <div className="flex gap-2 flex-wrap mb-2">
                {formData.photos?.map((photo, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={photo}
                      alt={`Photo ${idx + 1}`}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={handlePhotoCapture}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl hover:bg-base-cream transition-colors"
              >
                <Camera className="w-4 h-4" />
                写真を追加
              </button>
            </div>

            <div className="flex gap-3 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={resetForm}
                className="flex-1 px-4 py-3 bg-base-cream text-text-secondary rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                キャンセル
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-terracotta-500 text-white rounded-xl font-medium hover:bg-terracotta-600 transition-colors"
              >
                <Save className="w-5 h-5" />
                保存
              </motion.button>
            </div>
          </div>
        </div>
      </AnimatedModal>
    </div>
  );
}
