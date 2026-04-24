import { useState, useRef } from 'react';
import { Camera, X } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { diaryService } from '../../services/diary';
import type { DiaryEntry, ActivityType } from '../../types';

interface DiaryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  initialDate: string;
}

const activityOptions: { value: ActivityType; label: string; emoji: string }[] = [
  { value: 'harvest', label: '収穫', emoji: '🫘' },
  { value: 'fertilize', label: '施肥', emoji: '🌱' },
  { value: 'prune', label: '剪定', emoji: '✂️' },
  { value: 'observe', label: '観察', emoji: '👀' },
  { value: 'pestControl', label: '防除', emoji: '🐛' },
  { value: 'mowing', label: '草刈り', emoji: '🌿' },
  { value: 'planting', label: '植栽', emoji: '🌳' },
  { value: 'process', label: '加工', emoji: '⚙️' },
];

export function DiaryForm({ isOpen, onClose, onSaved, initialDate }: DiaryFormProps) {
  const [selectedTypes, setSelectedTypes] = useState<ActivityType[]>(['observe']);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleActivityType = (type: ActivityType) => {
    setSelectedTypes(prev => {
      if (prev.includes(type)) {
        // 最低1つは選択必須
        if (prev.length === 1) return prev;
        return prev.filter(t => t !== type);
      }
      return [...prev, type];
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result;
        if (typeof result === 'string') {
          setPhotos(prev => [...prev, result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || selectedTypes.length === 0) return;

    const now = new Date().toISOString();
    const entry: DiaryEntry = {
      id: `diary_${Date.now()}`,
      date: initialDate,
      activityType: selectedTypes[0],       // 後方互換性
      activityTypes: selectedTypes,          // 複数選択
      title: title.trim(),
      description: description.trim(),
      photos,
      createdAt: now,
      updatedAt: now,
    };

    diaryService.save(entry);
    resetForm();
    onSaved();
    onClose();
  };

  const resetForm = () => {
    setSelectedTypes(['observe']);
    setTitle('');
    setDescription('');
    setPhotos([]);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="作業日誌を記録">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Activity type selector - multiple */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            活動タイプ
            <span className="text-xs text-text-muted ml-2">（複数選択可）</span>
          </label>
          <div className="grid grid-cols-4 gap-2">
            {activityOptions.map(opt => {
              const isSelected = selectedTypes.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggleActivityType(opt.value)}
                  className={`flex flex-col items-center py-2.5 px-1 rounded-xl text-center transition-all ${
                    isSelected
                      ? 'bg-forest-600 text-white ring-2 ring-forest-400 ring-offset-1'
                      : 'bg-gray-50 text-text-secondary hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg mb-0.5">{opt.emoji}</span>
                  <span className="text-[10px] font-medium">{opt.label}</span>
                </button>
              );
            })}
          </div>
          {selectedTypes.length > 1 && (
            <p className="text-xs text-forest-600 mt-1.5">
              {selectedTypes.length}件選択中
            </p>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">タイトル</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例：第1区画の収穫と施肥作業"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-forest-500 focus:ring-1 focus:ring-forest-500 outline-none text-sm"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">詳細</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="作業内容の詳細を記録..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-forest-500 focus:ring-1 focus:ring-forest-500 outline-none text-sm resize-none"
          />
        </div>

        {/* Photo upload */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">写真</label>
          <div className="flex gap-2 flex-wrap">
            {photos.map((photo, i) => (
              <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden">
                <img src={photo} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 flex items-center justify-center"
                >
                  <X size={12} className="text-white" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center hover:border-forest-400 transition-colors"
            >
              <Camera size={20} className="text-text-muted" />
              <span className="text-[10px] text-text-muted mt-1">追加</span>
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-forest-600 text-white rounded-xl font-medium text-sm hover:bg-forest-700 transition-colors"
        >
          記録する
        </button>
      </form>
    </Modal>
  );
}
