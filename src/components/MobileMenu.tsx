import { motion } from 'framer-motion';
import { Home, TreePine, BookOpen, Settings, Camera } from 'lucide-react';
import { PulseButton } from './AnimatedComponents';

export type MenuItem = 'home' | 'trees' | 'camera' | 'journal' | 'settings';

interface MobileMenuProps {
  currentView: MenuItem;
  onNavigate: (view: MenuItem) => void;
  onCameraClick: () => void;
}

const menuItems: { id: MenuItem; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'ホーム', icon: Home },
  { id: 'trees', label: '樹木', icon: TreePine },
  { id: 'journal', label: '日誌', icon: BookOpen },
  { id: 'settings', label: '設定', icon: Settings },
];

export function MobileMenu({ currentView, onNavigate, onCameraClick }: MobileMenuProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      {/* Background with soft shadow - supports dark mode */}
      <div className="absolute inset-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]" />
      
      <div className="max-w-4xl mx-auto px-2 py-2 relative">
        <div className="flex items-end justify-around relative">
          {/* Left menu items */}
          <div className="flex items-center justify-around flex-1 gap-1">
            {menuItems.slice(0, 2).map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all flex-1 relative ${
                    isActive
                      ? 'text-terracotta-500'
                      : 'text-text-secondary dark:text-gray-400 hover:text-terracotta-400'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute inset-0 bg-terracotta-50 dark:bg-terracotta-900/30 rounded-2xl"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <Icon className="w-6 h-6 mb-1 relative z-10" />
                  <span className="text-xs font-medium relative z-10">{item.label}</span>
                </motion.button>
              );
            })}
          </div>
          
          {/* Camera button (red - maintained) */}
          <PulseButton
            onClick={onCameraClick}
            className="flex flex-col items-center justify-center -mt-6"
          >
            <div className="relative">
              {/* Soft glow */}
              <div className="absolute inset-0 rounded-full bg-coffee-red/30 blur-lg" 
                   style={{ transform: 'scale(1.2)' }} />
              
              {/* Main button */}
              <div className="relative w-16 h-16 bg-coffee-red rounded-full flex items-center justify-center shadow-lg">
                <Camera className="w-7 h-7 text-white" />
              </div>
            </div>
          </PulseButton>
          
          {/* Right menu items */}
          <div className="flex items-center justify-around flex-1 gap-1">
            {menuItems.slice(2).map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all flex-1 relative ${
                    isActive
                      ? 'text-terracotta-500'
                      : 'text-text-secondary dark:text-gray-400 hover:text-terracotta-400'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute inset-0 bg-terracotta-50 dark:bg-terracotta-900/30 rounded-2xl"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <Icon className="w-6 h-6 mb-1 relative z-10" />
                  <span className="text-xs font-medium relative z-10">{item.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
