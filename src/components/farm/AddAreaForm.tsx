import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { farmService } from '../../services/farm';
import type { FarmArea, FarmTree, TreeHealthStatus } from '../../types';

interface AddAreaFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function AddAreaForm({ isOpen, onClose, onSaved }: AddAreaFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<FarmArea['status']>('active');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const now = new Date().toISOString();
    const area: FarmArea = {
      id: `area_${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      treeCount: 0,
      status,
      createdAt: now,
      updatedAt: now,
    };

    farmService.saveArea(area);
    setName('');
    setDescription('');
    setStatus('active');
    onSaved();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="エリアを追加">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">エリア名</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例：第1区画"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-forest-500 focus:ring-1 focus:ring-forest-500 outline-none text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">説明</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="エリアの説明（任意）"
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-forest-500 focus:ring-1 focus:ring-forest-500 outline-none text-sm resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">ステータス</label>
          <div className="flex gap-2">
            {([
              { value: 'active', label: '稼働中' },
              { value: 'resting', label: '休止中' },
              { value: 'new', label: '新規' },
            ] as const).map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStatus(opt.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  status === opt.value
                    ? 'bg-forest-600 text-white'
                    : 'bg-gray-100 text-text-secondary'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-forest-600 text-white rounded-xl font-medium text-sm hover:bg-forest-700 transition-colors"
        >
          追加する
        </button>
      </form>
    </Modal>
  );
}

// ===== Add Tree Form =====
interface AddTreeFormProps {
  isOpen: boolean;
  onClose: () => void;
  areaId: string;
  onSaved: () => void;
}

export function AddTreeForm({ isOpen, onClose, areaId, onSaved }: AddTreeFormProps) {
  const [name, setName] = useState('');
  const [variety, setVariety] = useState('ティピカ');
  const [plantedDate, setPlantedDate] = useState(new Date().toISOString().split('T')[0]);
  const [health, setHealth] = useState<TreeHealthStatus>('good');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const now = new Date().toISOString();
    const tree: FarmTree = {
      id: `tree_${Date.now()}`,
      areaId,
      name: name.trim(),
      variety,
      plantedDate,
      health,
      notes: notes.trim() || undefined,
      createdAt: now,
      updatedAt: now,
    };

    farmService.saveTree(tree);
    setName('');
    setVariety('ティピカ');
    setPlantedDate(new Date().toISOString().split('T')[0]);
    setHealth('good');
    setNotes('');
    onSaved();
    onClose();
  };

  const varieties = ['ティピカ', 'ブルボン', 'カトゥーラ', 'ムンドノーボ', 'SL28', 'ゲイシャ', 'その他'];
  const healthOptions: { value: TreeHealthStatus; label: string }[] = [
    { value: 'excellent', label: '優良' },
    { value: 'good', label: '良好' },
    { value: 'fair', label: '普通' },
    { value: 'poor', label: '要注意' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="木を追加">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">名前</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例：A-001"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-forest-500 focus:ring-1 focus:ring-forest-500 outline-none text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">品種</label>
          <select
            value={variety}
            onChange={(e) => setVariety(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-forest-500 focus:ring-1 focus:ring-forest-500 outline-none text-sm bg-white"
          >
            {varieties.map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">植栽日</label>
          <input
            type="date"
            value={plantedDate}
            onChange={(e) => setPlantedDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-forest-500 focus:ring-1 focus:ring-forest-500 outline-none text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">健康状態</label>
          <div className="grid grid-cols-4 gap-2">
            {healthOptions.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setHealth(opt.value)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  health === opt.value
                    ? 'bg-forest-600 text-white'
                    : 'bg-gray-100 text-text-secondary'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">メモ</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="任意のメモ"
            rows={2}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-forest-500 focus:ring-1 focus:ring-forest-500 outline-none text-sm resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-forest-600 text-white rounded-xl font-medium text-sm hover:bg-forest-700 transition-colors"
        >
          追加する
        </button>
      </form>
    </Modal>
  );
}
