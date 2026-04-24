import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Trash2 } from 'lucide-react';
import type { Transaction, TransactionCategory } from '../../types';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const categoryLabels: Record<TransactionCategory, string> = {
  harvest_sale: '収穫販売',
  bean_sale: '豆販売',
  fertilizer: '肥料',
  equipment: '機材',
  labor: '人件費',
  utilities: '光熱費',
  transport: '運搬費',
  other: 'その他',
};

export function TransactionList({ transactions, onDelete }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-text-muted text-sm">
        取引記録がありません
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-text-primary mb-3">取引履歴</h3>
      {transactions.slice(0, 20).map((t, i) => (
        <motion.div
          key={t.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
          className="bg-white rounded-xl p-3 shadow-soft flex items-center gap-3"
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            t.type === 'income' ? 'bg-emerald-100' : 'bg-terracotta-100'
          }`}>
            {t.type === 'income' ? (
              <ArrowUpRight size={18} className="text-emerald-600" />
            ) : (
              <ArrowDownRight size={18} className="text-terracotta-600" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary">{categoryLabels[t.category]}</p>
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <span>{t.date}</span>
              {t.memo && <span className="truncate">- {t.memo}</span>}
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <p className={`text-sm font-semibold ${
              t.type === 'income' ? 'text-emerald-600' : 'text-terracotta-600'
            }`}>
              {t.type === 'income' ? '+' : '-'}¥{t.amount.toLocaleString()}
            </p>
            {t.quantity && t.unit && (
              <p className="text-[10px] text-text-muted">{t.quantity}{t.unit}</p>
            )}
          </div>

          <button
            onClick={() => {
              if (confirm('この取引を削除しますか？')) {
                onDelete(t.id);
              }
            }}
            className="w-7 h-7 rounded-full hover:bg-red-50 flex items-center justify-center flex-shrink-0"
          >
            <Trash2 size={12} className="text-text-muted" />
          </button>
        </motion.div>
      ))}
    </div>
  );
}
