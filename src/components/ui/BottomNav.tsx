import { motion } from 'framer-motion';
import { Home, TreePine, BookOpen, TrendingUp, Plus } from 'lucide-react';
import type { TabId } from '../../types';

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  onFabClick: () => void;
}

const navItems: { id: TabId; label: string; icon: typeof Home }[] = [
  { id: 'dashboard', label: 'ホーム', icon: Home },
  { id: 'farm', label: '農園管理', icon: TreePine },
  { id: 'diary', label: '作業日誌', icon: BookOpen },
  { id: 'revenue', label: '収量管理', icon: TrendingUp },
];

export function BottomNav({ activeTab, onTabChange, onFabClick }: BottomNavProps) {
  const leftItems = navItems.slice(0, 2);
  const rightItems = navItems.slice(2);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30">
      <div className="bg-white border-t border-gray-100 shadow-soft-lg">
        <div className="max-w-lg mx-auto flex items-end justify-between px-2 relative">
          {/* Left tabs */}
          {leftItems.map(item => (
            <NavButton
              key={item.id}
              item={item}
              isActive={activeTab === item.id}
              onClick={() => onTabChange(item.id)}
            />
          ))}

          {/* Center FAB */}
          <div className="flex flex-col items-center -mt-5 px-1">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onFabClick}
              className="w-14 h-14 rounded-full bg-terracotta-500 text-white shadow-terracotta flex items-center justify-center mb-1"
            >
              <Plus size={26} strokeWidth={2.5} />
            </motion.button>
            <span className="text-[10px] text-text-muted">新規記録</span>
          </div>

          {/* Right tabs */}
          {rightItems.map(item => (
            <NavButton
              key={item.id}
              item={item}
              isActive={activeTab === item.id}
              onClick={() => onTabChange(item.id)}
            />
          ))}
        </div>
        {/* Safe area padding for iPhone */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>
    </div>
  );
}

function NavButton({
  item,
  isActive,
  onClick,
}: {
  item: { id: TabId; label: string; icon: typeof Home };
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center py-2 px-3 min-w-[60px] relative"
    >
      {isActive && (
        <motion.div
          layoutId="navIndicator"
          className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-forest-600 rounded-full"
          transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
        />
      )}
      <Icon
        size={22}
        className={isActive ? 'text-forest-600' : 'text-text-muted'}
        strokeWidth={isActive ? 2.5 : 1.5}
      />
      <span
        className={`text-[10px] mt-0.5 ${
          isActive ? 'text-forest-600 font-semibold' : 'text-text-muted'
        }`}
      >
        {item.label}
      </span>
    </button>
  );
}
