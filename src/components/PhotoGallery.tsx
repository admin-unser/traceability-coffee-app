import { useState, useEffect } from 'react';
import { Image, X, Filter, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Activity, ActivityType } from '../types';
import { storageService } from '../services/storage';

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

interface PhotoItem {
  photo: string;
  activity: Activity;
  index: number;
}

export function PhotoGallery() {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [filteredPhotos, setFilteredPhotos] = useState<PhotoItem[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterMonth, setFilterMonth] = useState<string>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadPhotos();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [photos, filterType, filterMonth]);

  const loadPhotos = () => {
    const activities = storageService.getAll();
    const allPhotos: PhotoItem[] = [];

    activities.forEach((activity) => {
      activity.photos.forEach((photo, index) => {
        allPhotos.push({ photo, activity, index });
      });
    });

    // 日付順にソート（新しい順）
    allPhotos.sort((a, b) => new Date(b.activity.date).getTime() - new Date(a.activity.date).getTime());
    setPhotos(allPhotos);
  };

  const applyFilters = () => {
    let filtered = [...photos];

    if (filterType !== 'all') {
      filtered = filtered.filter((p) => p.activity.type === filterType);
    }

    if (filterMonth !== 'all') {
      filtered = filtered.filter((p) => {
        const date = new Date(p.activity.date);
        const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        return monthStr === filterMonth;
      });
    }

    setFilteredPhotos(filtered);
  };

  // 利用可能な月のリストを生成
  const getAvailableMonths = () => {
    const months = new Set<string>();
    photos.forEach((p) => {
      const date = new Date(p.activity.date);
      const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months.add(monthStr);
    });
    return Array.from(months).sort().reverse();
  };

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    return `${year}年${parseInt(month)}月`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const navigatePhoto = (direction: 'prev' | 'next') => {
    if (!selectedPhoto) return;
    
    const currentIndex = filteredPhotos.findIndex(
      (p) => p.photo === selectedPhoto.photo && p.activity.id === selectedPhoto.activity.id
    );
    
    let newIndex: number;
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredPhotos.length - 1;
    } else {
      newIndex = currentIndex < filteredPhotos.length - 1 ? currentIndex + 1 : 0;
    }
    
    setSelectedPhoto(filteredPhotos[newIndex]);
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <Image className="w-6 h-6 text-coffee-brown" />
          写真ギャラリー
        </h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
            showFilters || filterType !== 'all' || filterMonth !== 'all'
              ? 'bg-coffee-brown text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
          }`}
        >
          <Filter className="w-4 h-4" />
          フィルター
        </button>
      </div>

      {/* フィルターパネル */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                活動タイプ
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
              >
                <option value="all">すべて</option>
                {Object.entries(activityTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                月
              </label>
              <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
              >
                <option value="all">すべて</option>
                {getAvailableMonths().map((month) => (
                  <option key={month} value={month}>
                    {formatMonth(month)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {(filterType !== 'all' || filterMonth !== 'all') && (
            <button
              onClick={() => {
                setFilterType('all');
                setFilterMonth('all');
              }}
              className="text-sm text-coffee-brown hover:underline"
            >
              フィルターをクリア
            </button>
          )}
        </div>
      )}

      {/* 統計 */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {filteredPhotos.length}枚の写真
        {(filterType !== 'all' || filterMonth !== 'all') && ` (全${photos.length}枚中)`}
      </div>

      {/* 写真グリッド */}
      {filteredPhotos.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <Image className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <p className="text-gray-500 dark:text-gray-400">写真がありません</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            活動記録で写真を撮影すると、ここに表示されます
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {filteredPhotos.map((item, idx) => (
            <button
              key={`${item.activity.id}-${item.index}-${idx}`}
              onClick={() => setSelectedPhoto(item)}
              className="aspect-square relative overflow-hidden rounded-lg hover:opacity-80 transition-opacity"
            >
              <img
                src={item.photo}
                alt={`${activityTypeLabels[item.activity.type]}の写真`}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1">
                <span className="text-[10px] text-white">
                  {activityTypeLabels[item.activity.type]}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* 写真詳細モーダル */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <X className="w-8 h-8" />
          </button>

          {/* 前へボタン */}
          <button
            onClick={() => navigatePhoto('prev')}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          {/* 次へボタン */}
          <button
            onClick={() => navigatePhoto('next')}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div className="max-w-4xl w-full mx-4">
            <img
              src={selectedPhoto.photo}
              alt={`${activityTypeLabels[selectedPhoto.activity.type]}の写真`}
              className="max-h-[70vh] mx-auto object-contain rounded-lg"
            />
            <div className="mt-4 text-center text-white">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="bg-coffee-brown px-3 py-1 rounded-full text-sm">
                  {activityTypeLabels[selectedPhoto.activity.type]}
                </span>
                <span className="flex items-center gap-1 text-sm text-gray-300">
                  <Calendar className="w-4 h-4" />
                  {formatDate(selectedPhoto.activity.date)}
                </span>
              </div>
              {selectedPhoto.activity.description && (
                <p className="text-sm text-gray-300 max-w-lg mx-auto">
                  {selectedPhoto.activity.description}
                </p>
              )}
              {selectedPhoto.activity.treeId && (
                <p className="text-xs text-gray-400 mt-2">
                  樹木: {selectedPhoto.activity.treeId}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

