"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { RefreshCw, Lock, ArrowLeft } from 'lucide-react';
import { InteractiveButton } from '../ui/interactive-button';
import Link from 'next/link';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if user has an active mock admin session
    const session = sessionStorage.getItem('cg_admin_session');
    if (session === 'active') {
      setIsAuthenticated(true);
    }
    setChecking(false);
  }, []);

  const login = async (password: string): Promise<boolean> => {
    // Simple secure credentials. In production, this verifies against Supabase Auth.
    if (password === 'admin123') {
      sessionStorage.setItem('cg_admin_session', 'active');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem('cg_admin_session');
    setIsAuthenticated(false);
    router.push('/admin');
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout }}>
      <AdminRouteGuard checking={checking} isAuthenticated={isAuthenticated} pathname={pathname}>
        {children}
      </AdminRouteGuard>
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}

// Inner Guard to protect routes starting with /admin/
function AdminRouteGuard({
  children,
  checking,
  isAuthenticated,
  pathname
}: {
  children: React.ReactNode;
  checking: boolean;
  isAuthenticated: boolean;
  pathname: string;
}) {
  const router = useRouter();

  // Route starting with /admin but NOT exactly /admin (which is the login page)
  const isProtectedRoute = pathname?.startsWith('/admin') && pathname !== '/admin';

  useEffect(() => {
    if (!checking && isProtectedRoute && !isAuthenticated) {
      router.push('/admin');
    }
  }, [checking, isAuthenticated, isProtectedRoute, router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-navy-deep flex flex-col items-center justify-center gap-4 text-white-muted">
        <RefreshCw className="animate-spin text-gold-primary" size={32} />
        <p className="text-sm font-semibold tracking-wide uppercase">Securing Admin Console...</p>
      </div>
    );
  }

  // If trying to access protected admin pages without login, show access denied prompt
  if (isProtectedRoute && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-navy-deep flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-navy-dark border border-red-500/20 rounded-3xl p-8 text-center flex flex-col items-center gap-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-400 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
            <Lock size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase text-white tracking-wide">Access Denied</h2>
            <p className="text-sm text-white-muted mt-2 leading-relaxed">
              You must be authenticated as an administrator to access dashboard control paths.
            </p>
          </div>
          <div className="flex gap-4 w-full">
            <Link href="/" className="w-1/2">
              <InteractiveButton variant="secondary" size="sm" className="w-full flex items-center justify-center gap-1.5">
                <ArrowLeft size={14} /> Back Home
              </InteractiveButton>
            </Link>
            <Link href="/admin" className="w-1/2">
              <InteractiveButton variant="gold" size="sm" className="w-full">
                Login
              </InteractiveButton>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
