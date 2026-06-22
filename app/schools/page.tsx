"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Search, MapPin, School as SchoolIcon, Filter, RefreshCw, Star } from 'lucide-react';
import { dbService } from '@/lib/supabase/services';
import { School } from '@/types/database';
import { GlassCard } from '@/components/ui/glass-card';
import { InteractiveButton } from '@/components/ui/interactive-button';

function SchoolsContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams?.get('search') || '';

  const [schools, setSchools] = useState<School[]>([]);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'private' | 'government'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchools = async () => {
      setLoading(true);
      const data = await dbService.getSchools();
      setSchools(data);
      setLoading(false);
    };
    fetchSchools();
  }, []);

  const filteredSchools = schools.filter((school) => {
    const matchesSearch = school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          school.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      categoryFilter === 'all' ||
      (categoryFilter === 'government' && school.is_government) ||
      (categoryFilter === 'private' && !school.is_government);

    return matchesSearch && matchesCategory;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen">
      {/* Page Header */}
      <div className="text-center mb-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gold-primary/5 rounded-full blur-3xl pointer-events-none" />
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold-primary flex items-center justify-center gap-2">
          <SchoolIcon size={14} /> Institution Index
        </span>
        <h1 className="text-4xl md:text-6xl font-black uppercase text-white mt-3 tracking-tight">
          Find Your School
        </h1>
        <p className="text-white-muted text-sm md:text-base max-w-xl mx-auto mt-4 leading-relaxed">
          Locate your educational institution to explore tailored uniforms, accessories, and size charts designed specifically to comply with board guidelines.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-10 p-4 glass rounded-2xl border-white-pure/5">
        <div className="w-full md:max-w-md flex items-center px-4 py-2 bg-navy-deep/60 border border-white-pure/10 rounded-xl focus-within:border-gold-primary/40 transition-colors">
          <Search size={18} className="text-white-muted mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Search school name or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-0 outline-none text-white text-sm py-1 placeholder-white-muted/50"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto shrink-0 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <span className="text-xs font-bold text-white-muted flex items-center gap-1.5 shrink-0">
            <Filter size={12} /> Filter:
          </span>
          <button
            onClick={() => setCategoryFilter('all')}
            className={`text-xs font-semibold px-4 py-2 rounded-xl border transition-all duration-300 shrink-0 ${
              categoryFilter === 'all'
                ? 'bg-gold-primary text-navy-deep border-gold-primary shadow-gold-glow'
                : 'bg-navy-light/40 text-white-soft border-white-pure/5 hover:border-white-pure/20'
            }`}
          >
            All Schools
          </button>
          <button
            onClick={() => setCategoryFilter('private')}
            className={`text-xs font-semibold px-4 py-2 rounded-xl border transition-all duration-300 shrink-0 ${
              categoryFilter === 'private'
                ? 'bg-gold-primary text-navy-deep border-gold-primary shadow-gold-glow'
                : 'bg-navy-light/40 text-white-soft border-white-pure/5 hover:border-white-pure/20'
            }`}
          >
            Private / Trust Schools
          </button>
          <button
            onClick={() => setCategoryFilter('government')}
            className={`text-xs font-semibold px-4 py-2 rounded-xl border transition-all duration-300 shrink-0 ${
              categoryFilter === 'government'
                ? 'bg-gold-primary text-navy-deep border-gold-primary shadow-gold-glow'
                : 'bg-navy-light/40 text-white-soft border-white-pure/5 hover:border-white-pure/20'
            }`}
          >
            Govt. Uniforms
          </button>
        </div>
      </div>

      {/* Grid listing */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-white-muted">
          <RefreshCw size={36} className="animate-spin text-gold-primary" />
          <p className="text-sm font-semibold">Retrieving institution list...</p>
        </div>
      ) : filteredSchools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSchools.map((school, i) => (
            <Link href={`/products?school=${school.id}`} key={school.id}>
              <GlassCard
                delay={i * 0.05}
                className="group h-[380px] flex flex-col justify-between border-white-pure/5 hover:border-gold-primary/30 relative"
              >
                {/* School Banner Image Background Overlay */}
                <div className="absolute inset-0 z-0 opacity-5 group-hover:opacity-15 transition-opacity duration-500">
                  {school.banner_url && (
                    <Image
                      src={school.banner_url}
                      alt={school.name}
                      fill
                      sizes="(max-w-768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  )}
                </div>

                <div className="relative z-10">
                  {/* Badge */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-16 h-16 rounded-xl bg-navy-light border border-white-pure/10 flex items-center justify-center p-2 group-hover:border-gold-primary/30 transition-colors">
                      {school.logo_url && (
                        <div className="relative w-full h-full">
                          <Image
                            src={school.logo_url}
                            alt={`${school.name} Logo`}
                            fill
                            sizes="64px"
                            className="object-contain"
                          />
                        </div>
                      )}
                    </div>
                    {school.is_featured && (
                      <span className="text-[9px] font-black uppercase tracking-wider text-gold-primary bg-gold-primary/10 px-2.5 py-1 rounded-md border border-gold-primary/20 flex items-center gap-1 shadow-gold-glow">
                        <Star size={8} className="fill-gold-primary" /> Featured
                      </span>
                    )}
                    {school.is_government && (
                      <span className="text-[9px] font-black uppercase tracking-wider text-white-muted bg-white-pure/5 px-2.5 py-1 rounded-md border border-white-pure/10">
                        Government
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-gold-primary transition-colors leading-tight">
                    {school.name}
                  </h3>
                  
                  <p className="text-sm text-white-muted mt-3 line-clamp-3 leading-relaxed">
                    {school.description}
                  </p>
                </div>

                <div className="relative z-10 border-t border-white-pure/5 pt-4">
                  <div className="flex items-center gap-2 text-xs text-white-muted mb-4">
                    <MapPin size={14} className="text-gold-primary shrink-0" />
                    <span className="line-clamp-1">{school.address}</span>
                  </div>
                  <InteractiveButton variant="secondary" size="sm" className="w-full text-xs flex items-center gap-1">
                    Select School & Browse Uniforms
                  </InteractiveButton>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      ) : (
        <GlassCard className="py-20 text-center flex flex-col items-center max-w-xl mx-auto border-white-pure/5">
          <SchoolIcon size={48} className="text-white-muted opacity-40 mb-4 animate-bounce" />
          <h3 className="text-lg font-bold text-white uppercase">No institutions found</h3>
          <p className="text-sm text-white-muted mt-2">
            No school matched your search query "{searchQuery}". Try spelling out the name, or check your category filter settings.
          </p>
          <div className="mt-6 flex gap-4">
            <InteractiveButton variant="gold" size="sm" onClick={clearFilters}>
              Reset Filters
            </InteractiveButton>
            <Link href="/contact">
              <InteractiveButton variant="secondary" size="sm">
                Request Your School
              </InteractiveButton>
            </Link>
          </div>
        </GlassCard>
      )}
    </div>
  );
}

export default function SchoolsPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-white-muted min-h-screen">
        <RefreshCw size={36} className="animate-spin text-gold-primary" />
        <p className="text-sm font-semibold">Loading search space...</p>
      </div>
    }>
      <SchoolsContent />
    </Suspense>
  );
}
