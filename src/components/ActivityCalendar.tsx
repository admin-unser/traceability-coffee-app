import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Calendar as CalendarIcon } from 'lucide-react';
import type { Activity } from '../types';
import { ActivityList } from './ActivityList';
import { AnimatedModal } from './AnimatedComponents';

interface ActivityCalendarProps {
  activities: Activity[];
  onActivityEdit?: (activity: Activity) => void;
  onActivityDelete?: (id: string) => void;
}

export function ActivityCalendar({ activities, onActivityEdit, onActivityDelete }: ActivityCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedActivities, setSelectedActivities] = useState<Activity[]>([]);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const activitiesByDate = new Map<string, Activity[]>();
  activities.forEach(activity => {
    const date = new Date(activity.date);
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    if (!activitiesByDate.has(dateStr)) {
      activitiesByDate.set(dateStr, []);
    }
    activitiesByDate.get(dateStr)!.push(activity);
  });

  const hasActivity = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return activitiesByDate.has(dateStr);
  };

  const getActivityCount = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return activitiesByDate.get(dateStr)?.length || 0;
  };

  const isWeekend = (day: number) => {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      year === today.getFullYear() &&
      month === today.getMonth() &&
      day === today.getDate()
    );
  };

  const handleDateClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayActivities = activitiesByDate.get(dateStr) || [];
    
    if (dayActivities.length > 0) {
      setSelectedDate(dateStr);
      setSelectedActivities(dayActivities);
    }
  };

  const goToPreviousMonth = () => {
    setSlideDirection('right');
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setSlideDirection('left');
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const prevMonthLastDay = new Date(year, month, 0).getDate();
  const prevMonthDays: number[] = [];
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    prevMonthDays.push(prevMonthLastDay - i);
  }

  const totalCells = startingDayOfWeek + daysInMonth;
  const nextMonthDays: number[] = [];
  const remainingCells = 42 - totalCells;
  for (let i = 1; i <= remainingCells && i <= 7; i++) {
    nextMonthDays.push(i);
  }

  const weekDays = ['月', '火', '水', '木', '金', '土', '日'];

  const formatSelectedDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <div className="card-natural p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-forest-100 flex items-center justify-center">
              <CalendarIcon className="w-5 h-5 text-forest-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text-primary">活動カレンダー</h2>
              <p className="text-sm text-text-secondary">日々の記録を確認</p>
            </div>
          </div>
        </div>
        
        {/* Month navigation */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={goToPreviousMonth}
            className="w-8 h-8 rounded-full bg-base-cream hover:bg-terracotta-50 flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-text-secondary" />
          </motion.button>
          
          <AnimatePresence mode="wait">
            <motion.h3 
              key={`${year}-${month}`}
              initial={{ opacity: 0, x: slideDirection === 'left' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: slideDirection === 'left' ? -20 : 20 }}
              transition={{ duration: 0.2 }}
              className="text-lg font-bold text-text-primary min-w-[120px] text-center"
            >
              {year}年 {month + 1}月
            </motion.h3>
          </AnimatePresence>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={goToNextMonth}
            className="w-8 h-8 rounded-full bg-base-cream hover:bg-terracotta-50 flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-text-secondary" />
          </motion.button>
        </div>

        {/* Weekday header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day, index) => (
            <div
              key={day}
              className={`text-center text-xs font-medium py-1 ${
                index >= 5 ? 'text-coffee-red/70' : 'text-text-secondary'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={`${year}-${month}`}
            initial={{ opacity: 0, x: slideDirection === 'left' ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: slideDirection === 'left' ? -50 : 50 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-7 gap-1"
          >
            {/* Previous month days */}
            {prevMonthDays.map((day) => (
              <div
                key={`prev-${day}`}
                className="aspect-square flex items-center justify-center text-xs text-text-muted rounded-xl"
              >
                {day}
              </div>
            ))}

            {/* Current month days */}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const hasActivityOnDay = hasActivity(day);
              const activityCount = getActivityCount(day);
              const isWeekendDay = isWeekend(day);
              const isTodayDay = isToday(day);

              return (
                <motion.button
                  key={day}
                  whileHover={hasActivityOnDay ? { scale: 1.1 } : {}}
                  whileTap={hasActivityOnDay ? { scale: 0.95 } : {}}
                  onClick={() => handleDateClick(day)}
                  disabled={!hasActivityOnDay}
                  className={`
                    aspect-square flex flex-col items-center justify-center text-xs font-medium rounded-xl
                    transition-all duration-200 relative
                    ${hasActivityOnDay ? 'cursor-pointer' : 'cursor-default'}
                    ${isTodayDay 
                      ? 'bg-terracotta-500 text-white font-bold shadow-terracotta' 
                      : hasActivityOnDay 
                        ? 'bg-red-100 text-blue-600 font-semibold hover:bg-red-200' 
                        : isWeekendDay
                          ? 'text-coffee-red/50'
                          : 'text-text-secondary'
                    }
                  `}
                >
                  <span>{day}</span>
                  {hasActivityOnDay && !isTodayDay && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute bottom-0.5 flex gap-0.5"
                    >
                      {Array.from({ length: Math.min(activityCount, 3) }).map((_, i) => (
                        <div key={i} className="w-1 h-1 rounded-full bg-blue-500" />
                      ))}
                    </motion.div>
                  )}
                </motion.button>
              );
            })}

            {/* Next month days */}
            {nextMonthDays.map((day) => (
              <div
                key={`next-${day}`}
                className="aspect-square flex items-center justify-center text-xs text-text-muted rounded-xl"
              >
                {day}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-xs text-text-secondary">
            <div className="w-3 h-3 rounded-md bg-terracotta-500" />
            <span>今日</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-text-secondary">
            <div className="w-3 h-3 rounded-md bg-red-100 border border-red-200" />
            <span className="text-blue-600">記録あり</span>
          </div>
        </div>
      </div>

      {/* Selected date modal */}
      <AnimatedModal
        isOpen={selectedDate !== null && selectedActivities.length > 0}
        onClose={() => {
          setSelectedDate(null);
          setSelectedActivities([]);
        }}
      >
        <div className="bg-white rounded-3xl shadow-soft-lg max-h-[80vh] overflow-hidden">
          <div className="p-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-terracotta-100 flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5 text-terracotta-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary">
                    {selectedDate && formatSelectedDate(selectedDate)}
                  </h3>
                  <p className="text-sm text-text-secondary">{selectedActivities.length}件の活動</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setSelectedDate(null);
                  setSelectedActivities([]);
                }}
                className="w-8 h-8 rounded-full bg-base-cream hover:bg-gray-200 flex items-center justify-center text-text-secondary"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
          <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)] custom-scrollbar">
            <ActivityList
              activities={selectedActivities}
              onEdit={onActivityEdit}
              onDelete={onActivityDelete}
            />
          </div>
        </div>
      </AnimatedModal>
    </>
  );
}
