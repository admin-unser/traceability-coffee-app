import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'green' | 'terracotta' | 'sand' | 'gray' | 'red';
  size?: 'sm' | 'md';
}

const variantClasses = {
  green: 'bg-forest-100 text-forest-700',
  terracotta: 'bg-terracotta-100 text-terracotta-700',
  sand: 'bg-amber-100 text-amber-700',
  gray: 'bg-gray-100 text-gray-600',
  red: 'bg-red-100 text-red-700',
};

export function Badge({ children, variant = 'green', size = 'sm' }: BadgeProps) {
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variantClasses[variant]} ${sizeClass}`}>
      {children}
    </span>
  );
}
