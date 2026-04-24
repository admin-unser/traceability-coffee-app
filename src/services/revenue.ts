import type { Transaction, RevenueSummary, MonthlyData } from '../types';

const STORAGE_KEY = 'beanlog_transactions';

export const revenueService = {
  getAll(): Transaction[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load transactions:', error);
      return [];
    }
  },

  save(transaction: Transaction): void {
    const transactions = this.getAll();
    const idx = transactions.findIndex(t => t.id === transaction.id);
    if (idx >= 0) {
      transactions[idx] = transaction;
    } else {
      transactions.push(transaction);
    }
    transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  },

  delete(id: string): void {
    const transactions = this.getAll().filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  },

  getSummary(): RevenueSummary {
    const transactions = this.getAll();
    const totalRevenue = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalHarvestKg = transactions
      .filter(t => t.type === 'income' && t.category === 'harvest_sale' && t.unit === 'kg')
      .reduce((sum, t) => sum + (t.quantity || 0), 0);

    return {
      totalRevenue,
      totalExpense,
      profit: totalRevenue - totalExpense,
      totalHarvestKg,
    };
  },

  getMonthlyData(year?: number): MonthlyData[] {
    const targetYear = year || new Date().getFullYear();
    const transactions = this.getAll();
    const monthlyMap = new Map<string, { revenue: number; expense: number }>();

    for (let m = 1; m <= 12; m++) {
      const key = `${targetYear}-${String(m).padStart(2, '0')}`;
      monthlyMap.set(key, { revenue: 0, expense: 0 });
    }

    for (const t of transactions) {
      const month = t.date.substring(0, 7); // "YYYY-MM"
      if (!month.startsWith(String(targetYear))) continue;
      const entry = monthlyMap.get(month);
      if (entry) {
        if (t.type === 'income') {
          entry.revenue += t.amount;
        } else {
          entry.expense += t.amount;
        }
      }
    }

    return Array.from(monthlyMap.entries()).map(([month, data]) => ({
      month,
      revenue: data.revenue,
      expense: data.expense,
      profit: data.revenue - data.expense,
    }));
  },

  getCurrentMonthHarvest(): number {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    return this.getAll()
      .filter(t =>
        t.type === 'income' &&
        t.category === 'harvest_sale' &&
        t.date.startsWith(currentMonth)
      )
      .reduce((sum, t) => sum + (t.quantity || 0), 0);
  },
};
