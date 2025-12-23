import { ReactNode, useEffect, useState } from 'react';
import { motion, AnimatePresence, Variants, useSpring, useTransform, MotionValue } from 'framer-motion';

// ===============================
// Page Transition Wrapper
// ===============================
interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export function PageTransition({ children, className = '' }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ===============================
// Stagger Container & Item
// ===============================
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export function StaggerContainer({ children, className = '', staggerDelay = 0.1 }: StaggerContainerProps) {
  const customVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      variants={customVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggerItem({ children, className = '' }: StaggerItemProps) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}

// ===============================
// Animated Card with Hover Effect
// ===============================
interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function AnimatedCard({ children, className = '', onClick }: AnimatedCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      onClick={onClick}
      className={`
        bg-white rounded-3xl shadow-soft
        transition-all duration-300
        hover:shadow-soft-lg
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

// ===============================
// Animated Counter for Numbers
// ===============================
interface AnimatedCounterProps {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  decimals?: number;
}

function useAnimatedValue(value: number, duration: number = 1000): MotionValue<number> {
  const spring = useSpring(0, { duration, bounce: 0 });
  
  useEffect(() => {
    spring.set(value);
  }, [value, spring]);
  
  return spring;
}

export function AnimatedCounter({ 
  value, 
  duration = 1000, 
  suffix = '', 
  prefix = '',
  className = '',
  decimals = 0
}: AnimatedCounterProps) {
  const animatedValue = useAnimatedValue(value, duration);
  const displayValue = useTransform(animatedValue, (v) => 
    `${prefix}${v.toFixed(decimals)}${suffix}`
  );
  const [display, setDisplay] = useState(`${prefix}${value.toFixed(decimals)}${suffix}`);

  useEffect(() => {
    const unsubscribe = displayValue.on('change', (v) => setDisplay(v));
    return () => unsubscribe();
  }, [displayValue]);

  return (
    <motion.span 
      className={`font-mono tabular-nums ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {display}
    </motion.span>
  );
}

// ===============================
// Pulse Button (for Camera)
// ===============================
interface PulseButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function PulseButton({ children, onClick, className = '' }: PulseButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`relative ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Pulse rings - using coffee-red color */}
      <motion.div
        className="absolute inset-0 rounded-full bg-coffee-red/30"
        animate={{
          scale: [1, 1.3, 1.3],
          opacity: [0.5, 0, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeOut',
        }}
      />
      <motion.div
        className="absolute inset-0 rounded-full bg-coffee-red/20"
        animate={{
          scale: [1, 1.5, 1.5],
          opacity: [0.3, 0, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeOut',
          delay: 0.3,
        }}
      />
      {children}
    </motion.button>
  );
}

// ===============================
// Fade In Wrapper
// ===============================
interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export function FadeIn({ 
  children, 
  delay = 0, 
  duration = 0.5, 
  className = '',
  direction = 'up'
}: FadeInProps) {
  const directionOffset = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 },
    none: {},
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directionOffset[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ===============================
// Modal with Animation
// ===============================
interface AnimatedModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export function AnimatedModal({ isOpen, onClose, children, className = '' }: AnimatedModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 
                       md:max-w-2xl md:w-full z-50 ${className}`}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ===============================
// Slide Transition for Pages
// ===============================
interface SlideTransitionProps {
  children: ReactNode;
  direction?: 'left' | 'right';
  className?: string;
}

export function SlideTransition({ children, direction = 'left', className = '' }: SlideTransitionProps) {
  const x = direction === 'left' ? -100 : 100;
  
  return (
    <motion.div
      initial={{ opacity: 0, x }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -x }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ===============================
// Loading Spinner
// ===============================
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <motion.div
      className={`${sizes[size]} rounded-full border-2 border-terracotta-200 border-t-terracotta-500`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  );
}

// ===============================
// Icon Button with Animation
// ===============================
interface IconButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export function IconButton({ children, onClick, className = '', variant = 'ghost' }: IconButtonProps) {
  const variants = {
    primary: 'bg-terracotta-500 text-white hover:bg-terracotta-600',
    secondary: 'bg-base-cream text-text-primary hover:bg-gray-200',
    ghost: 'text-text-secondary hover:bg-base-cream hover:text-text-primary',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`p-2 rounded-xl transition-colors ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
}

// ===============================
// Progress Bar with Animation
// ===============================
interface AnimatedProgressProps {
  value: number;
  max?: number;
  className?: string;
  color?: 'terracotta' | 'forest' | 'sand';
}

export function AnimatedProgress({ value, max = 100, className = '', color = 'terracotta' }: AnimatedProgressProps) {
  const percentage = (value / max) * 100;
  const colors = {
    terracotta: 'bg-terracotta-500',
    forest: 'bg-forest-500',
    sand: 'bg-sand-500',
  };

  return (
    <div className={`h-2 bg-base-cream rounded-full overflow-hidden ${className}`}>
      <motion.div
        className={`h-full ${colors[color]} rounded-full`}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
    </div>
  );
}
