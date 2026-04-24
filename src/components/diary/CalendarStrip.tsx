import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarStripProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  datesWithEntries: string[];
}

export function CalendarStrip({ selectedDate, onDateChange, datesWithEntries }: CalendarStripProps) {
  const selectedDateObj = new Date(selectedDate);

  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

  const dates = useMemo(() => {
    const result: Date[] = [];
    for (let i = -3; i <= 3; i++) {
      const d = new Date(selectedDateObj);
      d.setDate(d.getDate() + i);
      result.push(d);
    }
    return result;
  }, [selectedDate]);

  const goToPrev = () => {
    const prev = new Date(selectedDateObj);
    prev.setDate(prev.getDate() - 1);
    onDateChange(formatISO(prev));
  };

  const goToNext = () => {
    const next = new Date(selectedDateObj);
    next.setDate(next.getDate() + 1);
    onDateChange(formatISO(next));
  };

  const monthLabel = `${selectedDateObj.getFullYear()}年${selectedDateObj.getMonth() + 1}月`;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-soft">
      {/* Month header */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={goToPrev} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
          <ChevronLeft size={18} className="text-text-secondary" />
        </button>
        <span className="text-sm font-semibold text-text-primary">{monthLabel}</span>
        <button onClick={goToNext} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
          <ChevronRight size={18} className="text-text-secondary" />
        </button>
      </div>

      {/* Date strip */}
      <div className="flex gap-1 justify-between">
        {dates.map(date => {
          const iso = formatISO(date);
          const isSelected = iso === selectedDate;
          const isToday = iso === formatISO(new Date());
          const hasEntries = datesWithEntries.includes(iso);

          return (
            <button
              key={iso}
              onClick={() => onDateChange(iso)}
              className={`flex flex-col items-center py-2 px-2 rounded-xl min-w-[40px] transition-all relative ${
                isSelected
                  ? 'bg-forest-600 text-white'
                  : isToday
                  ? 'bg-forest-50'
                  : ''
              }`}
            >
              <span className={`text-[10px] mb-1 ${
                isSelected ? 'text-white/80' : 'text-text-muted'
              }`}>
                {weekDays[date.getDay()]}
              </span>
              <span className={`text-sm font-semibold ${
                isSelected ? 'text-white' : isToday ? 'text-forest-700' : 'text-text-primary'
              }`}>
                {date.getDate()}
              </span>
              {hasEntries && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`w-1.5 h-1.5 rounded-full mt-1 ${
                    isSelected ? 'bg-white' : 'bg-terracotta-400'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function formatISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
