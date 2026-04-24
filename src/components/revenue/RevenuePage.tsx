import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { SummaryCards } from './SummaryCards';
import { RevenueChart } from './RevenueChart';
import { TransactionList } from './TransactionList';
import { AddTransactionForm } from './AddTransactionForm';
import { revenueService } from '../../services/revenue';

export function RevenuePage() {
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey(k => k + 1), []);

  const summary = revenueService.getSummary();
  const monthlyData = revenueService.getMonthlyData();
  const transactions = revenueService.getAll();

  const handleDelete = (id: string) => {
    revenueService.delete(id);
    refresh();
  };

  return (
    <motion.div
      key={refreshKey}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-text-primary">収量管理</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1 px-4 py-2 bg-forest-600 text-white text-sm font-medium rounded-full"
        >
          <Plus size={16} />
          取引追加
        </button>
      </div>

      {/* Summary cards */}
      <SummaryCards summary={summary} />

      {/* Chart */}
      <RevenueChart data={monthlyData} />

      {/* Transaction list */}
      <TransactionList transactions={transactions} onDelete={handleDelete} />

      {/* Form modal */}
      <AddTransactionForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSaved={refresh}
      />
    </motion.div>
  );
}
