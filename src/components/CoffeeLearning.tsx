import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, CheckCircle2, Calendar, Lightbulb } from 'lucide-react';
import type { CoffeeLearningContent } from '../types/coffee';
import { coffeeLearningService } from '../services/coffeeLearning';
import { StaggerContainer, StaggerItem } from './AnimatedComponents';

const categoryLabels: Record<CoffeeLearningContent['category'], string> = {
  history: '歴史',
  cultivation: '栽培',
  processing: '精製',
  brewing: '抽出',
  tasting: 'テイスティング',
  general: '一般',
};

const categoryColors: Record<CoffeeLearningContent['category'], string> = {
  history: 'bg-purple-100 text-purple-600',
  cultivation: 'bg-green-100 text-green-600',
  processing: 'bg-blue-100 text-blue-600',
  brewing: 'bg-orange-100 text-orange-600',
  tasting: 'bg-pink-100 text-pink-600',
  general: 'bg-gray-100 text-gray-600',
};

export function CoffeeLearning() {
  const [todayContent, setTodayContent] = useState<CoffeeLearningContent | null>(null);
  const [allContents, setAllContents] = useState<CoffeeLearningContent[]>([]);
  const [selectedContent, setSelectedContent] = useState<CoffeeLearningContent | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = () => {
    const today = coffeeLearningService.getTodayContent();
    const all = coffeeLearningService.getAllContents();
    setTodayContent(today);
    setAllContents(all);
    if (today && !today.read) {
      setSelectedContent(today);
    }
  };

  const handleMarkAsRead = (id: string) => {
    coffeeLearningService.markAsRead(id);
    loadContent();
    if (selectedContent?.id === id) {
      setSelectedContent({ ...selectedContent, read: true });
    }
  };

  const handleSelectContent = (content: CoffeeLearningContent) => {
    setSelectedContent(content);
    if (!content.read) {
      handleMarkAsRead(content.id);
    }
  };

  return (
    <div className="space-y-4 p-4 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center">
          <GraduationCap className="w-6 h-6 text-amber-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">珈琲学習</h1>
          <p className="text-sm text-text-secondary">毎日コーヒーについて学ぶ</p>
        </div>
      </div>

      {/* Today's Content */}
      {todayContent && (
        <StaggerItem>
          <motion.div
            className="card-natural p-5"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-base font-bold text-text-primary">今日の学習</h2>
                <p className="text-sm text-text-secondary">
                  {new Date().toLocaleDateString('ja-JP', {
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long',
                  })}
                </p>
              </div>
              {todayContent.read && (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              )}
            </div>
            <div
              onClick={() => handleSelectContent(todayContent)}
              className="cursor-pointer"
            >
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {todayContent.title}
              </h3>
              <p className="text-sm text-text-secondary line-clamp-3 mb-3">
                {todayContent.content}
              </p>
              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[todayContent.category]}`}
                >
                  {categoryLabels[todayContent.category]}
                </span>
                {!todayContent.read && (
                  <span className="text-xs text-amber-600 font-medium">
                    未読
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </StaggerItem>
      )}

      {/* All Contents */}
      <div>
        <h2 className="text-lg font-bold text-text-primary mb-3">すべての学習コンテンツ</h2>
        <StaggerContainer className="space-y-3">
          {allContents.map((content) => (
            <StaggerItem key={content.id}>
              <motion.div
                className={`card-natural p-4 cursor-pointer ${
                  selectedContent?.id === content.id ? 'ring-2 ring-terracotta-500' : ''
                }`}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
                onClick={() => handleSelectContent(content)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-semibold text-text-primary">
                        {content.title}
                      </h3>
                      {content.read && (
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-text-secondary line-clamp-2 mb-2">
                      {content.content}
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[content.category]}`}
                      >
                        {categoryLabels[content.category]}
                      </span>
                      <span className="text-xs text-text-muted flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(content.date).toLocaleDateString('ja-JP')}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>

      {/* Detail Modal */}
      {selectedContent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedContent(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-soft-lg max-w-2xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[selectedContent.category]}`}
                    >
                      {categoryLabels[selectedContent.category]}
                    </span>
                    {selectedContent.read && (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-text-primary dark:text-white mb-2">
                    {selectedContent.title}
                  </h2>
                  <p className="text-sm text-text-secondary dark:text-gray-400">
                    {new Date(selectedContent.date).toLocaleDateString('ja-JP', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedContent(null)}
                  className="w-8 h-8 rounded-full bg-base-cream dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-text-secondary dark:text-gray-400 hover:text-text-primary dark:hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)] custom-scrollbar">
              <p className="text-base text-text-secondary dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {selectedContent.content}
              </p>
            </div>
            {!selectedContent.read && (
              <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    handleMarkAsRead(selectedContent.id);
                    setSelectedContent({ ...selectedContent, read: true });
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-terracotta-500 text-white rounded-xl font-medium hover:bg-terracotta-600 transition-colors"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  読了済みにする
                </motion.button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
