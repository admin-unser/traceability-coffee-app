import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet, Package } from 'lucide-react';
import type { RevenueSummary } from '../../types';

interface SummaryCardsProps {
  summary: RevenueSummary;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const cards = [
    {
      label: '総収量',
      value: `${summary.totalHarvestKg.toFixed(1)}`,
      unit: 'kg',
      icon: Package,
      bg: 'bg-forest-50',
      iconBg: 'bg-forest-100',
      iconColor: 'text-forest-600',
      valueColor: 'text-forest-700',
    },
    {
      label: '売上',
      value: formatCurrency(summary.totalRevenue),
      unit: '',
      icon: TrendingUp,
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      valueColor: 'text-blue-700',
    },
    {
      label: '経費',
      value: formatCurrency(summary.totalExpense),
      unit: '',
      icon: TrendingDown,
      bg: 'bg-terracotta-50',
      iconBg: 'bg-terracotta-100',
      iconColor: 'text-terracotta-600',
      valueColor: 'text-terracotta-700',
    },
    {
      label: '利益',
      value: formatCurrency(summary.profit),
      unit: '',
      icon: Wallet,
      bg: summary.profit >= 0 ? 'bg-emerald-50' : 'bg-red-50',
      iconBg: summary.profit >= 0 ? 'bg-emerald-100' : 'bg-red-100',
      iconColor: summary.profit >= 0 ? 'text-emerald-600' : 'text-red-600',
      valueColor: summary.profit >= 0 ? 'text-emerald-700' : 'text-red-700',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`${card.bg} rounded-2xl p-4`}
          >
            <div className={`w-8 h-8 rounded-lg ${card.iconBg} flex items-center justify-center mb-2`}>
              <Icon size={16} className={card.iconColor} />
            </div>
            <p className="text-xs text-text-secondary mb-0.5">{card.label}</p>
            <p className={`text-lg font-bold ${card.valueColor}`}>
              {card.value}
              {card.unit && <span className="text-xs font-normal ml-0.5">{card.unit}</span>}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}

function formatCurrency(value: number): string {
  if (value >= 10000) {
    return `¥${(value / 10000).toFixed(1)}万`;
  }
  return `¥${value.toLocaleString()}`;
}
