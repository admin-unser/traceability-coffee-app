import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { revenueService } from '../../services/revenue';
import type { Transaction, TransactionType, TransactionCategory } from '../../types';

interface AddTransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

const incomeCategories: { value: TransactionCategory; label: string }[] = [
  { value: 'harvest_sale', label: '収穫販売' },
  { value: 'bean_sale', label: '豆販売' },
  { value: 'other', label: 'その他' },
];

const expenseCategories: { value: TransactionCategory; label: string }[] = [
  { value: 'fertilizer', label: '肥料' },
  { value: 'equipment', label: '機材' },
  { value: 'labor', label: '人件費' },
  { value: 'utilities', label: '光熱費' },
  { value: 'transport', label: '運搬費' },
  { value: 'other', label: 'その他' },
];

export function AddTransactionForm({ isOpen, onClose, onSaved }: AddTransactionFormProps) {
  const [type, setType] = useState<TransactionType>('income');
  const [category, setCategory] = useState<TransactionCategory>('harvest_sale');
  const [amount, setAmount] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kg');
  const [unitPrice, setUnitPrice] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [memo, setMemo] = useState('');

  const categories = type === 'income' ? incomeCategories : expenseCategories;

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    setCategory(newType === 'income' ? 'harvest_sale' : 'fertilizer');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    const now = new Date().toISOString();
    const transaction: Transaction = {
      id: `txn_${Date.now()}`,
      type,
      category,
      amount: amountNum,
      quantity: quantity ? parseFloat(quantity) : undefined,
      unit: quantity ? unit : undefined,
      unitPrice: unitPrice ? parseFloat(unitPrice) : undefined,
      date,
      memo: memo.trim(),
      createdAt: now,
      updatedAt: now,
    };

    revenueService.save(transaction);
    resetForm();
    onSaved();
    onClose();
  };

  const resetForm = () => {
    setType('income');
    setCategory('harvest_sale');
    setAmount('');
    setQuantity('');
    setUnit('kg');
    setUnitPrice('');
    setDate(new Date().toISOString().split('T')[0]);
    setMemo('');
  };

  // Auto-calculate amount from quantity * unitPrice
  const handleQuantityOrPriceChange = (q: string, p: string) => {
    setQuantity(q);
    setUnitPrice(p);
    const qNum = parseFloat(q);
    const pNum = parseFloat(p);
    if (!isNaN(qNum) && !isNaN(pNum) && qNum > 0 && pNum > 0) {
      setAmount(String(Math.round(qNum * pNum)));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="取引を追加">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              type === 'income' ? 'bg-white text-emerald-600 shadow-sm' : 'text-text-secondary'
            }`}
          >
            収入
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              type === 'expense' ? 'bg-white text-terracotta-600 shadow-sm' : 'text-text-secondary'
            }`}
          >
            経費
          </button>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">カテゴリ</label>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                className={`px-3 py-2 rounded-full text-xs font-medium transition-colors ${
                  category === cat.value
                    ? type === 'income' ? 'bg-emerald-600 text-white' : 'bg-terracotta-500 text-white'
                    : 'bg-gray-100 text-text-secondary'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity + Unit Price (for income) */}
        {type === 'income' && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">数量</label>
              <div className="flex gap-1">
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => handleQuantityOrPriceChange(e.target.value, unitPrice)}
                  placeholder="0"
                  step="0.1"
                  className="flex-1 px-3 py-3 rounded-xl border border-gray-200 focus:border-forest-500 focus:ring-1 focus:ring-forest-500 outline-none text-sm"
                />
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="px-2 py-3 rounded-xl border border-gray-200 text-sm bg-white"
                >
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="袋">袋</option>
                  <option value="杯">杯</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">単価(円)</label>
              <input
                type="number"
                value={unitPrice}
                onChange={(e) => handleQuantityOrPriceChange(quantity, e.target.value)}
                placeholder="0"
                className="w-full px-3 py-3 rounded-xl border border-gray-200 focus:border-forest-500 focus:ring-1 focus:ring-forest-500 outline-none text-sm"
              />
            </div>
          </div>
        )}

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">金額(円)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-forest-500 focus:ring-1 focus:ring-forest-500 outline-none text-sm"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">日付</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-forest-500 focus:ring-1 focus:ring-forest-500 outline-none text-sm"
          />
        </div>

        {/* Memo */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">メモ</label>
          <input
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="メモ（任意）"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-forest-500 focus:ring-1 focus:ring-forest-500 outline-none text-sm"
          />
        </div>

        <button
          type="submit"
          className={`w-full py-3 text-white rounded-xl font-medium text-sm transition-colors ${
            type === 'income' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-terracotta-500 hover:bg-terracotta-600'
          }`}
        >
          追加する
        </button>
      </form>
    </Modal>
  );
}
