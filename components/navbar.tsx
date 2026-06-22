"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShieldAlert, PhoneCall } from 'lucide-react';
import { cn } from '@/lib/utils';
import { InteractiveButton } from '@/components/ui/interactive-button';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Schools', href: '/schools' },
    { name: 'Products', href: '/products' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b",
        scrolled 
          ? "bg-navy-deep/80 backdrop-blur-md border-gold-primary/10 py-3 shadow-lg" 
          : "bg-transparent border-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex flex-col group">
          <div className="flex items-center gap-1">
            <span className="text-xl md:text-2xl font-black font-sans tracking-wider text-white group-hover:text-gold-primary transition-colors duration-300">
              CHINKY
            </span>
            <span className="text-xl md:text-2xl font-black font-sans tracking-wider text-gold-primary group-hover:text-white transition-colors duration-300">
              GARMENTS
            </span>
          </div>
          <span className="text-[9px] uppercase tracking-[0.2em] text-white-muted -mt-1 font-semibold group-hover:text-gold-light transition-colors duration-300">
            A Legacy of Trust
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href}
                className={cn(
                  "text-sm font-medium tracking-wide transition-all duration-300 relative py-1 hover:text-gold-primary",
                  isActive ? "text-gold-primary" : "text-white-soft/80"
                )}
              >
                {link.name}
                {isActive && (
                  <motion.span 
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold-dark to-gold-accent rounded-full" 
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* CTA BUTTONS */}
        <div className="hidden md:flex items-center gap-4">
          {isAdminRoute ? (
            <Link href="/admin/dashboard">
              <InteractiveButton variant="secondary" size="sm" className="flex items-center gap-2 border-gold-primary/30">
                <ShieldAlert size={14} className="text-gold-primary" />
                Admin Dashboard
              </InteractiveButton>
            </Link>
          ) : (
            <Link href="/admin">
              <InteractiveButton variant="ghost" size="sm" className="text-white-muted hover:text-white">
                Admin Area
              </InteractiveButton>
            </Link>
          )}
          <Link href="/contact">
            <InteractiveButton variant="gold" size="sm" className="flex items-center gap-2">
              <PhoneCall size={14} />
              Inquire Now
            </InteractiveButton>
          </Link>
        </div>

        {/* MOBILE HAMBURGER BUTTON */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white-soft hover:text-gold-primary p-2 transition-colors focus:outline-none"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE NAV OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden bg-navy-deep/95 backdrop-blur-xl border-b border-gold-primary/10 overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "text-lg font-medium tracking-wide py-2 border-b border-white-pure/5 transition-colors",
                      isActive ? "text-gold-primary border-gold-primary/20" : "text-white-soft/80"
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <div className="flex flex-col gap-4 pt-4">
                <Link href="/admin" className="w-full">
                  <InteractiveButton variant="secondary" size="md" fullWidth>
                    Admin Area
                  </InteractiveButton>
                </Link>
                <Link href="/contact" className="w-full">
                  <InteractiveButton variant="gold" size="md" fullWidth className="flex items-center gap-2">
                    <PhoneCall size={16} />
                    Inquire Now
                  </InteractiveButton>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
