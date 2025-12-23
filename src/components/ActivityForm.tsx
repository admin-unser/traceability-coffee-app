import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Save, X, TreePine, Sparkles, Clock, Image } from 'lucide-react';
import type { ActivityType, Activity, WeatherData } from '../types';
import type { Tree } from '../types/tree';
import { weatherService } from '../services/weather';
import { imageUtils } from '../utils/image';
import { geminiService } from '../services/gemini';
import { treeService } from '../services/tree';
import { LoadingSpinner } from './AnimatedComponents';

interface ActivityFormProps {
  onSave: (activity: Activity) => void;
  onCancel?: () => void;
  initialActivity?: Activity;
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

export function ActivityForm({ onSave, onCancel, initialActivity }: ActivityFormProps) {
  const [type, setType] = useState<ActivityType>(initialActivity?.type || 'observe');
  const [date, setDate] = useState(initialActivity?.date || new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(
    initialActivity?.date 
      ? new Date(initialActivity.date).toTimeString().slice(0, 5)
      : new Date().toTimeString().slice(0, 5)
  );
  const [treeId, setTreeId] = useState(initialActivity?.treeId || '');
  const [description, setDescription] = useState(initialActivity?.description || '');
  const [numericValue, setNumericValue] = useState(initialActivity?.numericValue?.toString() || '');
  const [numericUnit, setNumericUnit] = useState(initialActivity?.numericUnit || 'kg');
  const [photos, setPhotos] = useState<string[]>(initialActivity?.photos || []);
  const [weather, setWeather] = useState<WeatherData | null>(initialActivity?.weather || null);
  const [loading, setLoading] = useState(false);
  const [diagnosing, setDiagnosing] = useState(false);
  const [aiDiagnosis, setAiDiagnosis] = useState(initialActivity?.aiDiagnosis);
  const [trees, setTrees] = useState<Tree[]>([]);

  useEffect(() => {
    setTrees(treeService.getAll());
    
    if (!initialActivity?.weather) {
      weatherService.getCurrentWeather()
        .then((weatherData) => {
          setWeather(weatherData);
        })
        .catch((error) => {
          console.error('Failed to load weather:', error);
          setWeather({
            temperature: 25,
            condition: 'sunny',
            timestamp: new Date().toISOString(),
          });
        });
    }
  }, []);

  const handlePhotoCapture = async () => {
    const base64 = await imageUtils.captureFromCamera();
    if (base64) {
      setPhotos([...photos, base64]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleDiagnose = async () => {
    if (photos.length === 0) {
      alert('診断するには写真が必要です。');
      return;
    }

    setDiagnosing(true);
    try {
      const diagnosis = await geminiService.diagnoseImage(photos[0], description);
      setAiDiagnosis(diagnosis);
    } catch (error) {
      console.error('Diagnosis failed:', error);
      let errorMessage = 'AI診断に失敗しました。';
      
      if (error instanceof Error) {
        if (error.message.includes('GEMINI_API_KEY')) {
          errorMessage = 'APIキーが設定されていません。.envファイルを確認してください。';
        } else if (error.message.includes('403') || error.message.includes('401')) {
          errorMessage = 'APIキーが無効です。正しいAPIキーを設定してください。';
        } else if (error.message.includes('429')) {
          errorMessage = 'APIの利用制限に達しました。しばらく待ってから再試行してください。';
        } else if (error.message.includes('400')) {
          errorMessage = 'リクエストが無効です。画像の形式を確認してください。';
        } else {
          errorMessage = `エラー: ${error.message}`;
        }
      }
      
      alert(errorMessage);
    } finally {
      setDiagnosing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const dateTime = new Date(`${date}T${time}`);
    const activity: Activity = {
      id: initialActivity?.id || `activity_${Date.now()}`,
      type,
      date: dateTime.toISOString(),
      treeId: treeId || undefined,
      description,
      numericValue: numericValue ? parseFloat(numericValue) : undefined,
      numericUnit: numericValue ? numericUnit : undefined,
      photos,
      weather: weather || undefined,
      aiDiagnosis,
      createdAt: initialActivity?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(activity);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 p-4">
      {/* Activity Type */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-3">
          活動タイプ
        </label>
        <div className="grid grid-cols-4 gap-2">
          {(Object.keys(activityTypeLabels) as ActivityType[]).map((actType) => (
            <motion.button
              key={actType}
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setType(actType)}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${
                type === actType
                  ? 'bg-terracotta-50 border-terracotta-500 text-terracotta-600'
                  : 'bg-white border-gray-200 text-text-secondary hover:border-terracotta-300'
              }`}
            >
              <span className="text-lg mb-1">{activityTypeEmojis[actType]}</span>
              <span className="text-xs font-medium">{activityTypeLabels[actType]}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Date and Time */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              日付
            </span>
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input-natural"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            時刻
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="input-natural"
            required
          />
        </div>
      </div>

      {/* Tree Selection */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          <span className="flex items-center gap-1.5">
            <TreePine className="w-4 h-4" />
            樹木（任意）
          </span>
        </label>
        {trees.length > 0 ? (
          <select
            value={treeId}
            onChange={(e) => setTreeId(e.target.value)}
            className="input-natural"
          >
            <option value="">選択しない</option>
            {trees.map((tree) => (
              <option key={tree.id} value={tree.treeId}>
                {tree.treeId} {tree.name ? `(${tree.name})` : ''} {tree.variety ? `- ${tree.variety}` : ''}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            value={treeId}
            onChange={(e) => setTreeId(e.target.value)}
            placeholder="例: No.042（樹木マスタに登録すると選択可能）"
            className="input-natural"
          />
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          説明
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="観察内容や作業内容を記録してください"
          rows={4}
          className="input-natural resize-none"
          required
        />
      </div>

      {/* Numeric Value */}
      {(type === 'harvest' || type === 'fertilize' || type === 'process') && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              数量
            </label>
            <input
              type="number"
              step="0.1"
              value={numericValue}
              onChange={(e) => setNumericValue(e.target.value)}
              placeholder="0.0"
              className="input-natural font-data"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              単位
            </label>
            <select
              value={numericUnit}
              onChange={(e) => setNumericUnit(e.target.value)}
              className="input-natural"
            >
              <option value="kg">kg</option>
              <option value="g">g</option>
            </select>
          </div>
        </div>
      )}

      {/* Photos */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          <span className="flex items-center gap-1.5">
            <Image className="w-4 h-4" />
            写真
          </span>
        </label>
        <div className="space-y-3">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePhotoCapture}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-forest-500 text-white font-semibold rounded-2xl transition-all hover:bg-forest-600"
          >
            <Camera className="w-5 h-5" />
            写真を撮影
          </motion.button>
          {photos.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {photos.map((photo, index) => (
                <motion.div 
                  key={index} 
                  className="relative group"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <img
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-24 object-cover rounded-xl border border-gray-200"
                  />
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRemovePhoto(index)}
                    className="absolute top-1 right-1 w-6 h-6 bg-coffee-red text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI Diagnosis */}
      {type === 'observe' && photos.length > 0 && (
        <div>
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDiagnose}
            disabled={diagnosing}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-terracotta-500 text-white font-semibold rounded-2xl transition-all disabled:opacity-50 hover:bg-terracotta-600"
          >
            {diagnosing ? (
              <>
                <LoadingSpinner size="sm" />
                診断中...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                AI診断を実行
              </>
            )}
          </motion.button>
          {aiDiagnosis && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-2xl bg-forest-50 border border-forest-100"
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-forest-500" />
                <h3 className="font-semibold text-text-primary">AI診断結果</h3>
              </div>
              <div className="space-y-2">
                {aiDiagnosis.disease && (
                  <p className="text-sm text-text-primary"><span className="text-text-secondary">病気:</span> {aiDiagnosis.disease}</p>
                )}
                {aiDiagnosis.pest && (
                  <p className="text-sm text-text-primary"><span className="text-text-secondary">害虫:</span> {aiDiagnosis.pest}</p>
                )}
                {aiDiagnosis.ripeness && (
                  <p className="text-sm text-text-primary"><span className="text-text-secondary">熟度:</span> {aiDiagnosis.ripeness}</p>
                )}
                <p className="text-sm text-text-primary"><span className="text-text-secondary">アドバイス:</span> {aiDiagnosis.advice}</p>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Submit Buttons */}
      <div className="flex gap-3 pt-2">
        {onCancel && (
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCancel}
            className="btn-secondary flex-1"
          >
            キャンセル
          </motion.button>
        )}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
          className="btn-primary flex-1 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <LoadingSpinner size="sm" />
              保存中...
            </>
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
