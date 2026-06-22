"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'dark' | 'gold';
  hoverEffect?: boolean;
  animate?: boolean;
  delay?: number;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className, variant = 'default', hoverEffect = true, animate = true, delay = 0, ...props }, ref) => {
    
    const cardClasses = cn(
      "rounded-2xl p-6 relative overflow-hidden transition-all duration-500",
      {
        "glass": variant === 'default',
        "glass-dark": variant === 'dark',
        "glass-gold": variant === 'gold',
      },
      hoverEffect && "hover:border-gold-primary/40 hover:shadow-gold-glow hover:translate-y-[-4px]",
      className
    );

    if (!animate) {
      return (
        <div ref={ref} className={cardClasses} {...props}>
          {/* Gold ambient background glow */}
          {variant === 'gold' && (
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-gold-primary/10 rounded-full blur-2xl pointer-events-none" />
          )}
          {children}
        </div>
      );
    }

    return (
      <motion.div
        ref={ref as any}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
        className={cardClasses}
        {...(props as any)}
      >
        {/* Ambient gold glow decoration inside the card */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold-primary/5 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 group-hover:bg-gold-primary/10" />
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = 'GlassCard';
export default GlassCard;
