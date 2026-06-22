"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface InteractiveButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'gold' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const InteractiveButton = React.forwardRef<HTMLButtonElement, InteractiveButtonProps>(
  ({ children, className, variant = 'primary', size = 'md', fullWidth = false, ...props }, ref) => {
    
    const sizeClasses = {
      sm: 'px-4 py-2 text-xs font-semibold rounded-lg',
      md: 'px-6 py-3 text-sm font-medium rounded-xl',
      lg: 'px-8 py-4 text-base font-bold rounded-2xl tracking-wide',
    };

    const variantClasses = {
      primary: 'bg-white text-navy-deep hover:bg-white-soft shadow-lg border border-white-soft/20',
      secondary: 'bg-navy-light/80 text-white hover:bg-navy-light/100 border border-white-pure/10 glass',
      outline: 'bg-transparent text-white border border-white-pure/20 hover:border-gold-primary/50 hover:text-gold-primary',
      gold: 'bg-gradient-to-r from-gold-dark via-gold-primary to-gold-accent text-navy-deep font-semibold shadow-gold-glow hover:shadow-gold-glow-hover hover:scale-[1.02] border border-gold-light/20',
      ghost: 'bg-transparent text-white hover:bg-white-pure/5',
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        className={cn(
          "inline-flex items-center justify-center font-sans select-none active:scale-[0.98] transition-all duration-300 pointer-events-auto cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold-primary/50",
          sizeClasses[size],
          variantClasses[variant],
          fullWidth && 'w-full',
          className
        )}
        {...(props as any)}
      >
        {children}
      </motion.button>
    );
  }
);

InteractiveButton.displayName = 'InteractiveButton';
export default InteractiveButton;
