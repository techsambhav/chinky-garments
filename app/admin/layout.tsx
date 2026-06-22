"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AdminAuthProvider, useAdminAuth } from '@/components/admin/admin-guard';
import { 
  LayoutDashboard, 
  School, 
  ShoppingBag, 
  ClipboardList, 
  LogOut, 
  Eye, 
  ShieldAlert,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, logout } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLoginRoute = pathname === '/admin';

  // If not authenticated or on login route, just render raw page without sidebar
  if (!isAuthenticated || isLoginRoute) {
    return <div className="min-h-screen bg-navy-deep text-white-soft">{children}</div>;
  }

  const menuItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Manage Schools', href: '/admin/schools', icon: <School size={18} /> },
    { name: 'Manage Products', href: '/admin/products', icon: <ShoppingBag size={18} /> },
    { name: 'Orders Queue', href: '/admin/orders', icon: <ClipboardList size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-navy-deep text-white-soft flex flex-col md:flex-row">
      
      {/* ================= MOBILE HEADER ================= */}
      <header className="md:hidden flex items-center justify-between p-4 bg-navy-dark border-b border-gold-primary/10 sticky top-0 z-30">
        <Link href="/admin/dashboard" className="flex flex-col">
          <span className="text-sm font-black text-white tracking-widest">CHINKY GARMENTS</span>
          <span className="text-[8px] uppercase tracking-wider text-gold-primary">Admin Terminal</span>
        </Link>
        <button 
          onClick={() => setMobileOpen(!mobileOpen)} 
          className="text-white hover:text-gold-primary focus:outline-none"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* ================= SIDEBAR (DESKTOP) ================= */}
      <aside className={cn(
        "bg-navy-dark border-r border-gold-primary/10 w-64 flex flex-col justify-between shrink-0 h-screen sticky top-0 z-20 transition-all duration-300 md:translate-x-0",
        mobileOpen ? "fixed inset-y-0 left-0 translate-x-0" : "fixed inset-y-0 left-0 -translate-x-full md:relative"
      )}>
        <div>
          {/* Sidebar Brand Logo */}
          <div className="p-6 border-b border-white-pure/5 flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex flex-col">
              <span className="text-base font-black text-white tracking-wider">CHINKY ADMIN</span>
              <span className="text-[9px] uppercase tracking-[0.15em] text-gold-primary font-bold">
                Chinky Garments Console
              </span>
            </Link>
            <button className="md:hidden text-white" onClick={() => setMobileOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 flex flex-col gap-2 mt-4">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300",
                    isActive 
                      ? "bg-gold-primary/10 text-gold-primary border-r-4 border-gold-primary font-bold" 
                      : "text-white-muted hover:text-white hover:bg-white-pure/5"
                  )}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-white-pure/5 flex flex-col gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-deep/60 border border-white-pure/5">
            <ShieldAlert size={14} className="text-gold-primary shrink-0" />
            <div className="text-[10px] text-white-muted overflow-hidden">
              <span className="font-semibold block text-white">Administrator</span>
              <span className="truncate block">admin@chinkygarments.com</span>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              setMobileOpen(false);
            }}
            className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors w-full cursor-pointer focus:outline-none"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT SPACE ================= */}
      <div className="flex-grow flex flex-col min-h-screen overflow-x-hidden">
        {/* Top bar */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 border-b border-gold-primary/10 bg-navy-dark/40 sticky top-0 backdrop-blur-md z-10">
          <div className="text-xs text-white-muted font-medium flex items-center gap-2">
            <span>Terminal</span>
            <span>/</span>
            <span className="text-gold-primary capitalize">{pathname.split('/').pop() || 'Dashboard'}</span>
          </div>
          <Link href="/" target="_blank" className="text-xs text-white-muted hover:text-gold-primary flex items-center gap-1.5 transition-colors">
            <Eye size={12} /> View Live Website
          </Link>
        </header>

        {/* Dynamic page contents */}
        <main className="flex-grow p-6 md:p-8">
          {children}
        </main>
      </div>

    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminAuthProvider>
  );
}
