import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ArrowLeft } from 'lucide-react';
import { CalendarStrip } from './CalendarStrip';
import { DiaryEntryCard } from './DiaryEntry';
import { DiaryForm } from './DiaryForm';
import { SNSPreview } from './SNSPreview';
import { diaryService } from '../../services/diary';
import type { DiaryEntry, SNSPost } from '../../types';

export function DiaryPage() {
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [showForm, setShowForm] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey(k => k + 1), []);

  const entries = diaryService.getByDate(selectedDate);
  const datesWithEntries = diaryService.getDatesWithEntries();

  const handleDelete = (id: string) => {
    if (confirm('この記録を削除しますか？')) {
      diaryService.delete(id);
      refresh();
    }
  };

  const handleSNSGenerated = (post: SNSPost) => {
    if (!selectedEntry) return;
    const updated = { ...selectedEntry, snsPost: post, updatedAt: new Date().toISOString() };
    diaryService.save(updated);
    setSelectedEntry(updated);
    refresh();
  };

  // Detail view for a single entry
  if (selectedEntry) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedEntry(null)}
            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <ArrowLeft size={18} className="text-text-primary" />
          </button>
          <h2 className="text-lg font-bold text-text-primary flex-1">{selectedEntry.title}</h2>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-soft space-y-3">
          <p className="text-xs text-text-muted">{selectedEntry.date}</p>
          {/* Activity type badges */}
          <div className="flex flex-wrap gap-1.5">
            {(selectedEntry.activityTypes ?? [selectedEntry.activityType]).map(t => {
              const labels: Record<string, string> = {
                harvest: '🫘 収穫', fertilize: '🌱 施肥', prune: '✂️ 剪定',
                process: '⚙️ 加工', observe: '👀 観察', pestControl: '🐛 防除',
                mowing: '🌿 草刈り', planting: '🌳 植栽',
              };
              return (
                <span key={t} className="text-xs bg-forest-100 text-forest-700 px-2.5 py-1 rounded-full font-medium">
                  {labels[t] || t}
                </span>
              );
            })}
          </div>
          <p className="text-sm text-text-primary leading-relaxed">{selectedEntry.description}</p>

          {selectedEntry.photos.length > 0 && (
            <div className="flex gap-2 overflow-x-auto">
              {selectedEntry.photos.map((photo, i) => (
                <img
                  key={i}
                  src={photo}
                  alt=""
                  className="w-32 h-32 rounded-xl object-cover flex-shrink-0"
                />
              ))}
            </div>
          )}
        </div>

        <SNSPreview entry={selectedEntry} onPostGenerated={handleSNSGenerated} />
      </motion.div>
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
        <h1 className="text-xl font-bold text-text-primary">作業日誌</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1 px-4 py-2 bg-forest-600 text-white text-sm font-medium rounded-full"
        >
          <Plus size={16} />
          記録する
        </button>
      </div>

      {/* Calendar strip */}
      <CalendarStrip
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        datesWithEntries={datesWithEntries}
      />

      {/* Entries list */}
      <AnimatePresence mode="wait">
        {entries.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <p className="text-text-muted text-sm mb-3">この日の記録はありません</p>
            <button
              onClick={() => setShowForm(true)}
              className="text-sm text-forest-600 font-medium"
            >
              + 記録を追加する
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {entries.map((entry, i) => (
              <DiaryEntryCard
                key={entry.id}
                entry={entry}
                index={i}
                onDelete={handleDelete}
                onClick={setSelectedEntry}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating add button */}
      <div className="fixed bottom-24 right-5 z-20">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowForm(true)}
          className="w-14 h-14 rounded-full bg-terracotta-500 text-white shadow-terracotta flex items-center justify-center"
        >
          <Plus size={24} strokeWidth={2.5} />
        </motion.button>
      </div>

      {/* Form modal */}
      <DiaryForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSaved={refresh}
        initialDate={selectedDate}
      />
    </motion.div>
  );
}
