"use client";

import React, { useState, useEffect } from 'react';
import { dbService } from '@/lib/supabase/services';
import { Product, School } from '@/types/database';
import { GlassCard } from '@/components/ui/glass-card';
import { InteractiveButton } from '@/components/ui/interactive-button';
import { Plus, Trash2, Edit3, X, RefreshCw, ShoppingBag, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Form State
  const [name, setName] = useState('');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const url = await dbService.uploadImage(files[i]);
        uploadedUrls.push(url);
      }
      const currentImages = images ? images.split(',').map(s => s.trim()).filter(Boolean) : [];
      const updatedImages = [...currentImages, ...uploadedUrls].join(', ');
      setImages(updatedImages);
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Failed to upload image. Please verify you ran the Storage Policy SQL queries in Supabase.");
    } finally {
      setUploading(false);
    }
  };
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [comparePrice, setComparePrice] = useState<number>(0);
  const [images, setImages] = useState<string>('');
  const [category, setCategory] = useState('Blazer');
  const [schoolId, setSchoolId] = useState<string>('');
  const [sizes, setSizes] = useState<string>('');
  const [stockStatus, setStockStatus] = useState<'in_stock' | 'low_stock' | 'out_of_stock'>('in_stock');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isGovUniform, setIsGovUniform] = useState(false);
  const [isKidsWear, setIsKidsWear] = useState(false);
  const [isMostSelling, setIsMostSelling] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const prods = await dbService.getProducts();
    const schs = await dbService.getSchools();
    setProducts(prods);
    setSchools(schs);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editProductId) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleOpenAdd = () => {
    setEditProductId(null);
    setName('');
    setSlug('');
    setDescription('');
    setPrice(0);
    setComparePrice(0);
    setImages('');
    setCategory('Blazer');
    setSchoolId('');
    setSizes('28, 30, 32, 34');
    setStockStatus('in_stock');
    setIsFeatured(false);
    setIsGovUniform(false);
    setIsKidsWear(false);
    setIsMostSelling(false);
    setShowModal(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditProductId(product.id);
    setName(product.name);
    setSlug(product.slug);
    setDescription(product.description || '');
    setPrice(product.price);
    setComparePrice(product.compare_at_price || 0);
    setImages(product.images.join(', '));
    setCategory(product.category);
    setSchoolId(product.school_id || '');
    
    if (product.size_prices && Object.keys(product.size_prices).length > 0) {
      const formattedSizes = product.sizes.map(s => {
        const priceVal = product.size_prices?.[s];
        return priceVal ? `${s}:${priceVal}` : s;
      }).join(', ');
      setSizes(formattedSizes);
    } else {
      setSizes(product.sizes.join(', '));
    }

    setStockStatus(product.stock_status);
    setIsFeatured(product.is_featured);
    setIsGovUniform(product.is_government_uniform);
    setIsKidsWear(product.is_kids_wear);
    setIsMostSelling(product.is_most_selling);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      await dbService.deleteProduct(id);
      fetchData();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse sizes and optional size_prices input
    const sizesArray: string[] = [];
    const sizePricesObj: Record<string, number> = {};

    sizes
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s !== '')
      .forEach((item) => {
        if (item.includes(':')) {
          const [size, priceVal] = item.split(':').map((x) => x.trim());
          if (size && priceVal) {
            sizesArray.push(size);
            sizePricesObj[size] = Number(priceVal);
          }
        } else {
          sizesArray.push(item);
        }
      });

    // Parse image links input
    const imagesArray = images
      .split(',')
      .map((img) => img.trim())
      .filter((img) => img !== '');

    if (imagesArray.length === 0) {
      // Set a sensible default image based on category
      imagesArray.push('https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=600');
    }

    // Determine the base price. If size_prices are provided, let's use the first one as base price if main price is 0
    let basePrice = Number(price);
    if (basePrice === 0 && Object.keys(sizePricesObj).length > 0) {
      basePrice = sizePricesObj[sizesArray[0]];
    }

    const payload = {
      name,
      slug,
      description,
      price: basePrice,
      compare_at_price: comparePrice > 0 ? Number(comparePrice) : undefined,
      images: imagesArray,
      category,
      school_id: schoolId || null,
      sizes: sizesArray,
      size_prices: Object.keys(sizePricesObj).length > 0 ? sizePricesObj : undefined,
      stock_status: stockStatus,
      is_featured: isFeatured,
      is_government_uniform: isGovUniform,
      is_kids_wear: isKidsWear,
      is_most_selling: isMostSelling
    };

    if (editProductId) {
      await dbService.updateProduct(editProductId, payload);
    } else {
      await dbService.addProduct(payload);
    }

    setShowModal(false);
    fetchData();
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase text-white tracking-wide">Manage Products</h1>
          <p className="text-sm text-white-muted">Manage your stock, uniform pricing, and categorization rules.</p>
        </div>
        <InteractiveButton variant="gold" size="sm" onClick={handleOpenAdd} className="flex items-center gap-1.5 text-xs">
          <Plus size={16} /> Add Product
        </InteractiveButton>
      </div>

      {/* Product List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-white-muted">
          <RefreshCw size={36} className="animate-spin text-gold-primary" />
          <p className="text-sm font-semibold">Retrieving product stock databases...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {products.map((product) => {
            const schoolName = schools.find((s) => s.id === product.school_id)?.name || 'Generic / Accessories';
            return (
              <GlassCard key={product.id} hoverEffect={false} animate={false} className="border-white-pure/5 flex flex-col justify-between p-4">
                
                <div>
                  <div className="flex gap-4">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-navy-light border border-white-pure/10">
                      <Image 
                        src={product.images[0]} 
                        alt="" 
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex flex-col justify-between flex-grow">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[9px] text-gold-primary tracking-widest uppercase font-bold">
                            {product.category}
                          </span>
                          <span className={`text-[8px] uppercase font-black px-1.5 py-0.5 rounded ${
                            product.stock_status === 'in_stock' ? 'bg-emerald-400/10 text-emerald-400' :
                            product.stock_status === 'low_stock' ? 'bg-orange-400/10 text-orange-400' :
                            'bg-red-400/10 text-red-400'
                          }`}>
                            {product.stock_status.replace('_', ' ')}
                          </span>
                        </div>
                        <h3 className="font-bold text-white text-sm line-clamp-2 mt-1 leading-snug">{product.name}</h3>
                      </div>

                      <div className="flex items-baseline gap-1.5 mt-2">
                        <span className="text-sm font-black text-white">₹{product.price}</span>
                        {product.compare_at_price && (
                          <span className="text-[10px] text-white-muted line-through">₹{product.compare_at_price}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white-pure/5 flex flex-col gap-2">
                    <div className="text-[10px] text-white-muted">
                      <span className="font-bold block text-white-soft">Associated School:</span>
                      <span className="truncate block mt-0.5">{schoolName}</span>
                    </div>

                    <div className="text-[10px] text-white-muted">
                      <span className="font-bold block text-white-soft">Available Sizes:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {product.sizes.map(s => (
                          <span key={s} className="bg-white-pure/5 px-1 py-0.2 rounded font-medium border border-white-pure/5">{s}</span>
                        ))}
                      </div>
                    </div>

                    {/* Tag Summary */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {product.is_featured && <span className="text-[8px] font-bold text-gold-primary bg-gold-primary/5 border border-gold-primary/20 px-1 py-0.2 rounded">Featured</span>}
                      {product.is_government_uniform && <span className="text-[8px] font-bold text-blue-400 bg-blue-400/5 border border-blue-400/20 px-1 py-0.2 rounded">Gov Govt.</span>}
                      {product.is_kids_wear && <span className="text-[8px] font-bold text-emerald-400 bg-emerald-400/5 border border-emerald-400/20 px-1 py-0.2 rounded">Kids Play</span>}
                      {product.is_most_selling && <span className="text-[8px] font-bold text-purple-400 bg-purple-400/5 border border-purple-400/20 px-1 py-0.2 rounded">Best Seller</span>}
                    </div>

                  </div>
                </div>

                {/* Operations buttons */}
                <div className="flex gap-2 mt-6 pt-3 border-t border-white-pure/5 justify-end">
                  <InteractiveButton 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => handleOpenEdit(product)}
                    className="px-3.5 py-2 flex items-center gap-1.5 text-xs font-semibold"
                  >
                    <Edit3 size={12} /> Edit
                  </InteractiveButton>
                  <InteractiveButton 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDelete(product.id)}
                    className="px-3.5 py-2 flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/5 border border-red-500/10"
                  >
                    <Trash2 size={12} /> Delete
                  </InteractiveButton>
                </div>

              </GlassCard>
            );
          })}
        </div>
      )}

      {/* ================= ADD/EDIT PRODUCT DIALOG OVERLAY ================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-navy-deep/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-navy-dark border border-gold-primary/20 rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-white-muted hover:text-white p-2"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-black uppercase text-white mb-6">
              {editProductId ? 'Edit Product Parameters' : 'Add New Uniform Catalog Item'}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="E.g. DPS Navy Blazer"
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
                    placeholder="dps-navy-blazer"
                    className="bg-navy-deep border border-white-pure/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={price || ''}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    placeholder="E.g. 850"
                    className="bg-navy-deep border border-white-pure/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-primary"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white">Compare at Price (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={comparePrice || ''}
                    onChange={(e) => setComparePrice(Number(e.target.value))}
                    placeholder="E.g. 1000"
                    className="bg-navy-deep border border-white-pure/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="bg-navy-deep border border-white-pure/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-primary"
                  >
                    <option value="Blazer">Blazer</option>
                    <option value="Sweater">Sweater</option>
                    <option value="Shirt">Shirt</option>
                    <option value="Trouser">Trouser</option>
                    <option value="Skirt">Skirt</option>
                    <option value="Tie">Tie</option>
                    <option value="Belt">Belt</option>
                    <option value="Kids Wear">Kids Wear</option>
                    <option value="Government Uniform">Government Uniform</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white">School Association</label>
                  <select
                    value={schoolId}
                    onChange={(e) => setSchoolId(e.target.value)}
                    className="bg-navy-deep border border-white-pure/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-primary"
                  >
                    <option value="">Generic / No Association</option>
                    {schools.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white">Stock Status *</label>
                  <select
                    value={stockStatus}
                    onChange={(e) => setStockStatus(e.target.value as any)}
                    className="bg-navy-deep border border-white-pure/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-primary"
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="low_stock">Low Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white">Available Sizes *</label>
                  <input
                    type="text"
                    required
                    value={sizes}
                    onChange={(e) => setSizes(e.target.value)}
                    placeholder="28:480, 30:500, 32:520"
                    className="bg-navy-deep border border-white-pure/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-primary"
                  />
                  <span className="text-[9px] text-white-muted">Separate with commas (e.g., 28, 30) or add custom size prices (e.g., 28:480, 30:500)</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white">Product Images</label>
                
                {/* File Uploader */}
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    disabled={uploading}
                    onChange={handleImageUpload}
                    className="hidden"
                    id="product-image-upload"
                  />
                  <label
                    htmlFor="product-image-upload"
                    className="bg-navy-light hover:bg-navy-deep border border-white-pure/10 hover:border-gold-primary/40 px-4 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer transition-all flex items-center gap-2 select-none"
                  >
                    {uploading ? 'Uploading...' : 'Upload Images from Device'}
                  </label>
                  {uploading && (
                    <div className="w-4 h-4 border-2 border-gold-primary border-t-transparent rounded-full animate-spin" />
                  )}
                </div>

                <input
                  type="text"
                  value={images}
                  onChange={(e) => setImages(e.target.value)}
                  placeholder="Or paste comma-separated image URLs..."
                  className="bg-navy-deep border border-white-pure/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-primary mt-2"
                />
                <span className="text-[9px] text-white-muted">Upload directly or separate multiple URLs with commas</span>

                {/* Previews grid */}
                {images.split(',').map(s=>s.trim()).filter(Boolean).length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2 p-3 bg-navy-deep/40 rounded-xl border border-white-pure/5">
                    {images.split(',').map(s=>s.trim()).filter(Boolean).map((img, index) => (
                      <div key={index} className="relative w-12 h-12 rounded-lg overflow-hidden border border-white-pure/10 shrink-0 group">
                        <Image src={img} alt="" fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            const newImgs = images.split(',').map(s=>s.trim()).filter((_, i) => i !== index).join(', ');
                            setImages(newImgs);
                          }}
                          className="absolute inset-0 bg-red-600/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={12} className="text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white">Product Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe material compositions, embroidery details..."
                  className="bg-navy-deep border border-white-pure/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-primary resize-none"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-4 py-2 border-y border-white-pure/5 my-2">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="accent-gold-primary w-4 h-4"
                  />
                  <span className="text-xs font-bold text-white-soft">Featured Product</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isGovUniform}
                    onChange={(e) => setIsGovUniform(e.target.checked)}
                    className="accent-gold-primary w-4 h-4"
                  />
                  <span className="text-xs font-bold text-white-soft">Government Uniform Set</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isKidsWear}
                    onChange={(e) => setIsKidsWear(e.target.checked)}
                    className="accent-gold-primary w-4 h-4"
                  />
                  <span className="text-xs font-bold text-white-soft">Kids / Daycare Playwear</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isMostSelling}
                    onChange={(e) => setIsMostSelling(e.target.checked)}
                    className="accent-gold-primary w-4 h-4"
                  />
                  <span className="text-xs font-bold text-white-soft">Most Selling / Best Seller</span>
                </label>
              </div>

              <div className="flex gap-4 pt-2">
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
                  Save Product
                </InteractiveButton>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
