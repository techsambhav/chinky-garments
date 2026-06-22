"use client";

import React, { useState, useEffect } from 'react';
import { dbService } from '@/lib/supabase/services';
import { School } from '@/types/database';
import { GlassCard } from '@/components/ui/glass-card';
import { InteractiveButton } from '@/components/ui/interactive-button';
import { School as SchoolIcon, Plus, Trash2, Edit3, X, RefreshCw, Star, MapPin } from 'lucide-react';
import Image from 'next/image';

export default function AdminSchoolsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editSchoolId, setEditSchoolId] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const url = await dbService.uploadImage(file);
      setLogoUrl(url);
    } catch (err) {
      console.error("Logo upload failed:", err);
      alert("Failed to upload logo. Please check your Supabase Storage bucket policy.");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBanner(true);
    try {
      const url = await dbService.uploadImage(file);
      setBannerUrl(url);
    } catch (err) {
      console.error("Banner upload failed:", err);
      alert("Failed to upload banner. Please check your Supabase Storage bucket policy.");
    } finally {
      setUploadingBanner(false);
    }
  };

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isGovernment, setIsGovernment] = useState(false);

  const fetchSchools = async () => {
    setLoading(true);
    const data = await dbService.getSchools();
    setSchools(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  // Autofill slug on name change
  const handleNameChange = (val: string) => {
    setName(val);
    if (!editSchoolId) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleOpenAdd = () => {
    setEditSchoolId(null);
    setName('');
    setSlug('');
    setLogoUrl('');
    setBannerUrl('');
    setAddress('');
    setDescription('');
    setIsFeatured(false);
    setIsGovernment(false);
    setShowModal(true);
  };

  const handleOpenEdit = (school: School) => {
    setEditSchoolId(school.id);
    setName(school.name);
    setSlug(school.slug);
    setLogoUrl(school.logo_url || '');
    setBannerUrl(school.banner_url || '');
    setAddress(school.address || '');
    setDescription(school.description || '');
    setIsFeatured(school.is_featured);
    setIsGovernment(school.is_government);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this school? All associated products will lose their school reference.')) {
      await dbService.deleteSchool(id);
      fetchSchools();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      slug,
      logo_url: logoUrl || 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=200',
      banner_url: bannerUrl || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200',
      address,
      description,
      is_featured: isFeatured,
      is_government: isGovernment
    };

    if (editSchoolId) {
      await dbService.updateSchool(editSchoolId, payload);
    } else {
      await dbService.addSchool(payload);
    }

    setShowModal(false);
    fetchSchools();
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase text-white tracking-wide">Manage Schools</h1>
          <p className="text-sm text-white-muted">Register, edit, and categorize partner academic institutions.</p>
        </div>
        <InteractiveButton variant="gold" size="sm" onClick={handleOpenAdd} className="flex items-center gap-1.5 text-xs">
          <Plus size={16} /> Add School
        </InteractiveButton>
      </div>

      {/* Main List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-white-muted">
          <RefreshCw size={36} className="animate-spin text-gold-primary" />
          <p className="text-sm font-semibold">Loading school administration data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {schools.map((school) => (
            <GlassCard key={school.id} hoverEffect={false} animate={false} className="border-white-pure/5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-xl bg-navy-deep/60 border border-white-pure/10 flex items-center justify-center p-1 overflow-hidden shrink-0">
                      <Image 
                        src={school.logo_url || 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=200'} 
                        alt="" 
                        fill
                        sizes="48px"
                        className="object-contain p-1"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base leading-snug">{school.name}</h3>
                      <span className="text-[10px] text-gold-primary tracking-widest block mt-0.5 font-bold uppercase">
                        /{school.slug}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {school.is_featured && (
                      <span className="text-[9px] font-bold uppercase tracking-wider text-gold-primary bg-gold-primary/10 border border-gold-primary/25 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                        <Star size={8} className="fill-gold-primary" /> Featured
                      </span>
                    )}
                    {school.is_government && (
                      <span className="text-[9px] font-bold uppercase tracking-wider text-white-muted bg-white-pure/5 border border-white-pure/10 px-2 py-0.5 rounded-md">
                        Govt.
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-white-muted line-clamp-2 leading-relaxed mt-2">
                  {school.description}
                </p>

                <div className="flex items-start gap-1.5 text-xs text-white-muted mt-4 border-t border-white-pure/5 pt-3">
                  <MapPin size={12} className="text-gold-primary shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{school.address}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-6 pt-3 border-t border-white-pure/5 justify-end">
                <InteractiveButton 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => handleOpenEdit(school)}
                  className="px-3.5 py-2 flex items-center gap-1.5 text-xs font-semibold"
                >
                  <Edit3 size={12} /> Edit
                </InteractiveButton>
                <InteractiveButton 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleDelete(school.id)}
                  className="px-3.5 py-2 flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/5 border border-red-500/10"
                >
                  <Trash2 size={12} /> Delete
                </InteractiveButton>
              </div>

            </GlassCard>
          ))}
        </div>
      )}

      {/* ================= ADD/EDIT SCHOOL DIALOG OVERLAY ================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-navy-deep/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-navy-dark border border-gold-primary/20 rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-white-muted hover:text-white p-2"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-black uppercase text-white mb-6">
              {editSchoolId ? 'Edit School Profile' : 'Register New School'}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white">School Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="E.g. St. Xavier's High School"
                  className="bg-navy-deep border border-white-pure/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-primary"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white">URL Slug *</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="E.g. st-xaviers"
                  className="bg-navy-deep border border-white-pure/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Logo Uploader */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white">School Logo</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingLogo}
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="school-logo-upload"
                    />
                    <label
                      htmlFor="school-logo-upload"
                      className="bg-navy-light hover:bg-navy-deep border border-white-pure/10 hover:border-gold-primary/40 px-4 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer transition-all flex items-center gap-2 select-none"
                    >
                      {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                    </label>
                    {uploadingLogo && (
                      <div className="w-4 h-4 border-2 border-gold-primary border-t-transparent rounded-full animate-spin" />
                    )}
                  </div>
                  <input
                    type="text"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="Or paste logo image URL..."
                    className="bg-navy-deep border border-white-pure/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-gold-primary mt-1"
                  />
                  {logoUrl && (
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-white-pure/10 mt-1 bg-navy-deep/40 p-1 flex items-center justify-center">
                      <Image src={logoUrl} alt="Logo preview" fill className="object-contain p-1" />
                    </div>
                  )}
                </div>

                {/* Banner Uploader */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white">School Banner</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingBanner}
                      onChange={handleBannerUpload}
                      className="hidden"
                      id="school-banner-upload"
                    />
                    <label
                      htmlFor="school-banner-upload"
                      className="bg-navy-light hover:bg-navy-deep border border-white-pure/10 hover:border-gold-primary/40 px-4 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer transition-all flex items-center gap-2 select-none"
                    >
                      {uploadingBanner ? 'Uploading...' : 'Upload Banner'}
                    </label>
                    {uploadingBanner && (
                      <div className="w-4 h-4 border-2 border-gold-primary border-t-transparent rounded-full animate-spin" />
                    )}
                  </div>
                  <input
                    type="text"
                    value={bannerUrl}
                    onChange={(e) => setBannerUrl(e.target.value)}
                    placeholder="Or paste banner image URL..."
                    className="bg-navy-deep border border-white-pure/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-gold-primary mt-1"
                  />
                  {bannerUrl && (
                    <div className="relative w-20 h-12 rounded-lg overflow-hidden border border-white-pure/10 mt-1">
                      <Image src={bannerUrl} alt="Banner preview" fill className="object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white">School Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="E.g. Sector 15, Near Central Park"
                  className="bg-navy-deep border border-white-pure/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-primary"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summary description of school heritage, board values..."
                  className="bg-navy-deep border border-white-pure/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-primary resize-none"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-6 py-2 border-y border-white-pure/5 my-2">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="accent-gold-primary w-4 h-4"
                  />
                  <span className="text-sm font-bold text-white-soft">Featured Institution</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isGovernment}
                    onChange={(e) => setIsGovernment(e.target.checked)}
                    className="accent-gold-primary w-4 h-4"
                  />
                  <span className="text-sm font-bold text-white-soft">Government Uniform Compliance</span>
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <InteractiveButton
                  variant="secondary"
                  size="sm"
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-1/2"
                >
                  Cancel
                </InteractiveButton>
                <InteractiveButton
                  variant="gold"
                  size="sm"
                  type="submit"
                  className="w-1/2"
                >
                  Save Profile
                </InteractiveButton>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
