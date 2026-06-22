"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminAuth } from '@/components/admin/admin-guard';
import { Lock, ArrowLeft, ShieldAlert, KeyRound } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { InteractiveButton } from '@/components/ui/interactive-button';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login, isAuthenticated } = useAdminAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate small latency for premium UI response
    setTimeout(async () => {
      const success = await login(password);
      setLoading(false);
      if (success) {
        router.push('/admin/dashboard');
      } else {
        setError('Invalid administrator access code. Please try again.');
        setPassword('');
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-navy-deep">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-navy-accent/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-1 text-xs text-white-muted hover:text-white mb-8 transition-colors">
          <ArrowLeft size={12} /> Back to main store website
        </Link>

        {/* Card */}
        <GlassCard hoverEffect={false} animate={true} className="border-white-pure/5 p-8 relative">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gold-primary/10 border border-gold-primary/20 flex items-center justify-center text-gold-primary mx-auto mb-4 shadow-gold-glow">
              <Lock size={24} />
            </div>
            <h1 className="text-2xl font-black uppercase text-white tracking-wide">Admin Terminal</h1>
            <p className="text-xs text-white-muted uppercase tracking-wider font-semibold mt-1">
              Chinky Garments
            </p>
          </div>

          {/* Alert Note */}
          <div className="flex gap-3 p-3.5 rounded-xl border border-gold-primary/10 bg-gold-primary/[0.02] text-xs text-gold-light mb-6">
            <KeyRound size={16} className="shrink-0" />
            <div>
              <span className="font-bold block">Developer Access Note:</span>
              Use code <span className="underline font-bold">admin123</span> to login and check administrative grids.
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white">
                Enter Console Passcode
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="bg-navy-deep border border-white-pure/10 rounded-xl px-4 py-3.5 text-center tracking-widest text-white focus:outline-none focus:border-gold-primary transition-colors text-base"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs font-semibold text-red-400 bg-red-400/5 border border-red-500/10 p-3.5 rounded-xl">
                <ShieldAlert size={14} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <InteractiveButton
              variant="gold"
              size="md"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-navy-deep border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Secure Log In'
              )}
            </InteractiveButton>
          </form>

        </GlassCard>

      </div>
    </div>
  );
}
