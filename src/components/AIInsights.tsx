import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Leaf, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Calendar,
  BarChart3,
  Lightbulb
} from 'lucide-react';
import type { Activity } from '../types';
import { geminiService } from '../services/gemini';
import { StaggerContainer, StaggerItem } from './AnimatedComponents';

interface AIInsightsProps {
  activities: Activity[];
}

interface InsightResult {
  summary: string;
  trends: string[];
  warnings: string[];
  recommendations: string[];
}

interface BestPracticeResult {
  fertilization: string;
  pruning: string;
  pestControl: string;
  general: string;
}

export function AIInsights({ activities }: AIInsightsProps) {
  const [generalInsight, setGeneralInsight] = useState<InsightResult | null>(null);
  const [bestPractices, setBestPractices] = useState<BestPracticeResult | null>(null);
  const [isLoadingGeneral, setIsLoadingGeneral] = useState(false);
  const [isLoadingBestPractices, setIsLoadingBestPractices] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [errorBestPractices, setErrorBestPractices] = useState<string | null>(null);

  const generateGeneralInsight = async () => {
    if (activities.length === 0) {
      setErrorGeneral('活動記録がありません。まず活動を記録してください。');
      return;
    }

    setIsLoadingGeneral(true);
    setErrorGeneral(null);
    try {
      const result = await geminiService.generateCultivationInsights(activities);
      setGeneralInsight(result);
    } catch (error) {
      console.error('Failed to generate insight:', error);
      setErrorGeneral(error instanceof Error ? error.message : 'インサイトの生成に失敗しました。');
    } finally {
      setIsLoadingGeneral(false);
    }
  };

  const generateBestPractices = async () => {
    if (activities.length === 0) {
      setErrorBestPractices('活動記録がありません。まず活動を記録してください。');
      return;
    }

    setIsLoadingBestPractices(true);
    setErrorBestPractices(null);
    try {
      const result = await geminiService.generateBestPractices(activities);
      setBestPractices(result);
    } catch (error) {
      console.error('Failed to generate best practices:', error);
      setErrorBestPractices(error instanceof Error ? error.message : '提案の生成に失敗しました。');
    } finally {
      setIsLoadingBestPractices(false);
    }
  };

  // 活動タイプの集計
  const activityStats = activities.reduce((acc, activity) => {
    acc[activity.type] = (acc[activity.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const activityTypeLabels: Record<string, string> = {
    harvest: '収穫',
    fertilize: '施肥',
    prune: '剪定',
    process: '加工',
    observe: '観察',
    pestControl: '防除',
    mowing: '草刈り',
    planting: '植栽',
  };

  return (
    <StaggerContainer className="space-y-4 p-4">
      {/* Header */}
      <StaggerItem>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary dark:text-white">AIインサイト</h1>
            <p className="text-sm text-text-secondary dark:text-gray-400">
              活動記録に基づくAI分析
            </p>
          </div>
        </div>
      </StaggerItem>

      {/* Activity Stats Overview */}
      <StaggerItem>
        <motion.div 
          className="card-natural p-5"
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-forest-100 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-forest-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text-primary dark:text-white">活動記録の概要</h2>
              <p className="text-sm text-text-secondary dark:text-gray-400">
                合計 {activities.length} 件の記録
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(activityStats).slice(0, 4).map(([type, count]) => (
              <div key={type} className="bg-base-cream dark:bg-gray-700 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-terracotta-500">{count}</p>
                <p className="text-xs text-text-secondary dark:text-gray-400">
                  {activityTypeLabels[type] || type}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </StaggerItem>

      {/* General Cultivation Insights */}
      <StaggerItem>
        <motion.div 
          className="card-natural p-5"
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-terracotta-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-terracotta-500" />
            </div>
            <div className="flex-1">
              <h2 className="text-base font-bold text-text-primary dark:text-white">一般的な栽培インサイト</h2>
              <p className="text-sm text-text-secondary dark:text-gray-400">
                利用可能なすべてのログに基づいて、栽培プロセス全体に関するAI駆動のインサイトを取得します。
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {generalInsight ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* Summary */}
                <div className="bg-base-cream dark:bg-gray-700 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-terracotta-500" />
                    <h3 className="font-semibold text-text-primary dark:text-white text-sm">サマリー</h3>
                  </div>
                  <p className="text-sm text-text-secondary dark:text-gray-300 whitespace-pre-wrap">
                    {generalInsight.summary}
                  </p>
                </div>

                {/* Trends */}
                {generalInsight.trends.length > 0 && (
                  <div className="bg-forest-50 dark:bg-forest-900/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-forest-500" />
                      <h3 className="font-semibold text-forest-700 dark:text-forest-300 text-sm">傾向</h3>
                    </div>
                    <ul className="space-y-2">
                      {generalInsight.trends.map((trend, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-forest-600 dark:text-forest-300">
                          <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>{trend}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Warnings */}
                {generalInsight.warnings.length > 0 && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <h3 className="font-semibold text-amber-700 dark:text-amber-300 text-sm">注意点</h3>
                    </div>
                    <ul className="space-y-2">
                      {generalInsight.warnings.map((warning, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-amber-600 dark:text-amber-300">
                          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommendations */}
                {generalInsight.recommendations.length > 0 && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-blue-500" />
                      <h3 className="font-semibold text-blue-700 dark:text-blue-300 text-sm">推奨事項</h3>
                    </div>
                    <ul className="space-y-2">
                      {generalInsight.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-blue-600 dark:text-blue-300">
                          <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <motion.button
                  onClick={generateGeneralInsight}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-base-cream dark:bg-gray-700 text-text-primary dark:text-white rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  再生成
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {errorGeneral && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-600 dark:text-red-300 text-sm">
                    {errorGeneral}
                  </div>
                )}
                <motion.button
                  onClick={generateGeneralInsight}
                  disabled={isLoadingGeneral}
                  whileHover={{ scale: isLoadingGeneral ? 1 : 1.02 }}
                  whileTap={{ scale: isLoadingGeneral ? 1 : 0.98 }}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-terracotta-500 text-white rounded-xl font-medium hover:bg-terracotta-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingGeneral ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      インサイトを生成
                    </>
                  )}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </StaggerItem>

      {/* Best Practices Recommendations */}
      <StaggerItem>
        <motion.div 
          className="card-natural p-5"
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-forest-100 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-forest-500" />
            </div>
            <div className="flex-1">
              <h2 className="text-base font-bold text-text-primary dark:text-white">最適な実践方法を提案</h2>
              <p className="text-sm text-text-secondary dark:text-gray-400">
                施肥、剪定、その他の活動に関するカスタマイズされた提案を受け取ります。
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {bestPractices ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* Fertilization */}
                <div className="bg-forest-50 dark:bg-forest-900/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🌱</span>
                    <h3 className="font-semibold text-forest-700 dark:text-forest-300 text-sm">施肥について</h3>
                  </div>
                  <p className="text-sm text-forest-600 dark:text-forest-300 whitespace-pre-wrap">
                    {bestPractices.fertilization}
                  </p>
                </div>

                {/* Pruning */}
                <div className="bg-terracotta-50 dark:bg-terracotta-900/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">✂️</span>
                    <h3 className="font-semibold text-terracotta-700 dark:text-terracotta-300 text-sm">剪定について</h3>
                  </div>
                  <p className="text-sm text-terracotta-600 dark:text-terracotta-300 whitespace-pre-wrap">
                    {bestPractices.pruning}
                  </p>
                </div>

                {/* Pest Control */}
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🛡️</span>
                    <h3 className="font-semibold text-amber-700 dark:text-amber-300 text-sm">病害虫対策</h3>
                  </div>
                  <p className="text-sm text-amber-600 dark:text-amber-300 whitespace-pre-wrap">
                    {bestPractices.pestControl}
                  </p>
                </div>

                {/* General Tips */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">💡</span>
                    <h3 className="font-semibold text-blue-700 dark:text-blue-300 text-sm">その他のヒント</h3>
                  </div>
                  <p className="text-sm text-blue-600 dark:text-blue-300 whitespace-pre-wrap">
                    {bestPractices.general}
                  </p>
                </div>

                <motion.button
                  onClick={generateBestPractices}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-base-cream dark:bg-gray-700 text-text-primary dark:text-white rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  再生成
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {errorBestPractices && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-600 dark:text-red-300 text-sm">
                    {errorBestPractices}
                  </div>
                )}
                <motion.button
                  onClick={generateBestPractices}
                  disabled={isLoadingBestPractices}
                  whileHover={{ scale: isLoadingBestPractices ? 1 : 1.02 }}
                  whileTap={{ scale: isLoadingBestPractices ? 1 : 0.98 }}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-forest-500 text-white rounded-xl font-medium hover:bg-forest-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingBestPractices ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Leaf className="w-5 h-5" />
                      提案を取得
                    </>
                  )}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </StaggerItem>
    </StaggerContainer>
  );
}

