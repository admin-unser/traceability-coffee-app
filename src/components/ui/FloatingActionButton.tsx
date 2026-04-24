import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
  icon?: React.ReactNode;
}

export function FloatingActionButton({ onClick, icon }: FloatingActionButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      className="w-14 h-14 rounded-full bg-terracotta-500 text-white shadow-terracotta flex items-center justify-center"
    >
      {icon || <Plus size={24} strokeWidth={2.5} />}
    </motion.button>
  );
}
