import { motion } from 'framer-motion';

interface TabFilterProps<T extends string> {
  tabs: { id: T; label: string }[];
  activeTab: T;
  onTabChange: (tab: T) => void;
}

export function TabFilter<T extends string>({ tabs, activeTab, onTabChange }: TabFilterProps<T>) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`relative px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            activeTab === tab.id
              ? 'text-white'
              : 'text-text-secondary bg-gray-100 hover:bg-gray-200'
          }`}
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="activeTabBg"
              className="absolute inset-0 bg-forest-600 rounded-full"
              transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
            />
          )}
          <span className="relative z-10">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
