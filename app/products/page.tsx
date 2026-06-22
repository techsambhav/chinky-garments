"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Eye, X, MessageCircle, Info, RefreshCw, SlidersHorizontal, Check } from 'lucide-react';
import { dbService } from '@/lib/supabase/services';
import { Product, School } from '@/types/database';
import { GlassCard } from '@/components/ui/glass-card';
import { InteractiveButton } from '@/components/ui/interactive-button';
import { cn } from '@/lib/utils';

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialSchool = searchParams?.get('school') || 'all';
  const initialCategory = searchParams?.get('category') || 'all';
  const initialSearch = searchParams?.get('search') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [schoolFilter, setSchoolFilter] = useState(initialSchool);
  const [categoryFilter, setCategoryFilter] = useState(initialCategory);
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  // Delivery & Live Location States
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custAddress, setCustAddress] = useState('');
  const [gpsCoords, setGpsCoords] = useState<{lat: number, lng: number} | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsShared, setGpsShared] = useState(false);

  const handleGetGpsLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGpsCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setGpsLoading(false);
        setGpsShared(true);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve location. Please check your browser location permissions.");
        setGpsLoading(false);
      }
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const allProducts = await dbService.getProducts();
      const allSchools = await dbService.getSchools();
      setProducts(allProducts);
      setSchools(allSchools);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Update filters if query parameters change
  useEffect(() => {
    if (searchParams) {
      const school = searchParams.get('school');
      if (school) setSchoolFilter(school);
      const category = searchParams.get('category');
      if (category) setCategoryFilter(category);
      const search = searchParams.get('search');
      if (search) setSearchQuery(search);
    }
  }, [searchParams]);

  // Categories list derived from seed data
  const categories = [
    { name: 'All Categories', value: 'all' },
    { name: 'Blazers & Sweaters', value: 'Blazer' },
    { name: 'Structured Shirts', value: 'Shirt' },
    { name: 'Trousers & Skirts', value: 'Trouser' },
    { name: 'Kids Playwear', value: 'Kids Wear' },
    { name: 'Government Uniforms', value: 'Government Uniform' },
    { name: 'Accessories', value: 'Tie' }
  ];

  // Filtering Logic
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSchool = schoolFilter === 'all' || product.school_id === schoolFilter;
    
    // Category mapping matches category strings
    let matchesCategory = false;
    if (categoryFilter === 'all') {
      matchesCategory = true;
    } else if (categoryFilter === 'Blazer') {
      matchesCategory = product.category === 'Blazer' || product.category === 'Sweater';
    } else if (categoryFilter === 'Trouser') {
      matchesCategory = product.category === 'Trouser' || product.category === 'Skirt';
    } else if (categoryFilter === 'Tie') {
      matchesCategory = product.category === 'Tie' || product.category === 'Belt';
    } else {
      matchesCategory = product.category === categoryFilter;
    }

    return matchesSearch && matchesSchool && matchesCategory;
  });

  const handleOpenQuickView = (product: Product) => {
    setSelectedProduct(product);
    setSelectedSize(product.sizes[0] || 'One Size');
    setQuantity(1);
    setCustName('');
    setCustPhone('');
    setCustAddress('');
    setGpsCoords(null);
    setGpsLoading(false);
    setGpsShared(false);
  };

  const handleSendWhatsAppOrder = (product: Product) => {
    if (!custName || !custAddress) {
      alert("Please fill in your Name and Delivery Address.");
      return;
    }
    // Generate pre-composed WhatsApp message link
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '917037936440'; // Chinky Garments Contact
    const locationLink = gpsCoords 
      ? `https://www.google.com/maps?q=${gpsCoords.lat},${gpsCoords.lng}`
      : "Not shared";

    const currentPrice = product.size_prices?.[selectedSize] ?? product.price;

    const message = `Hi Chinky Garments, I would like to place an order:
*Customer Name:* ${custName}
*Contact Phone:* ${custPhone || 'Not provided'}
*Product:* ${product.name}
*Size:* ${selectedSize}
*Quantity:* ${quantity}
*Price (Each):* ₹${currentPrice}
*Total Amount:* ₹${currentPrice * quantity}

*Delivery Address:* ${custAddress}
*Live GPS Location:* ${locationLink}

Please confirm availability and dispatch details.`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSchoolFilter('all');
    setCategoryFilter('all');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen">
      {/* Header */}
      <div className="text-center mb-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gold-primary/5 rounded-full blur-3xl pointer-events-none" />
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold-primary flex items-center justify-center gap-2">
          <ShoppingBag size={14} /> Catalog
        </span>
        <h1 className="text-4xl md:text-6xl font-black uppercase text-white mt-3 tracking-tight">
          Explore Uniforms
        </h1>
        <p className="text-white-muted text-sm md:text-base max-w-xl mx-auto mt-4">
          Browse premium school blazers, shirts, tunics, skirts, trousers, and accessories. Select sizing and trigger custom inquiries.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* ================= SIDEBAR FILTERS (DESKTOP) ================= */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="glass rounded-2xl border-white-pure/5 p-6 sticky top-28 flex flex-col gap-8">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gold-primary mb-4">Search Catalog</h3>
              <div className="flex items-center px-3 py-2 bg-navy-deep/60 border border-white-pure/10 rounded-xl focus-within:border-gold-primary/40 transition-colors">
                <Search size={16} className="text-white-muted mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Keyword search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-0 outline-none text-white text-xs py-1 placeholder-white-muted/50"
                />
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gold-primary mb-4">Filter by School</h3>
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto scrollbar-thin">
                <label className="flex items-center gap-3 cursor-pointer text-sm text-white-muted hover:text-white transition-colors">
                  <input
                    type="radio"
                    name="school"
                    checked={schoolFilter === 'all'}
                    onChange={() => setSchoolFilter('all')}
                    className="accent-gold-primary"
                  />
                  <span>All Schools</span>
                </label>
                {schools.map((school) => (
                  <label key={school.id} className="flex items-center gap-3 cursor-pointer text-sm text-white-muted hover:text-white transition-colors">
                    <input
                      type="radio"
                      name="school"
                      checked={schoolFilter === school.id}
                      onChange={() => setSchoolFilter(school.id)}
                      className="accent-gold-primary"
                    />
                    <span className="line-clamp-1">{school.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gold-primary mb-4">Categories</h3>
              <div className="flex flex-col gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setCategoryFilter(cat.value)}
                    className={`text-left text-sm py-1.5 px-3 rounded-lg transition-colors ${
                      categoryFilter === cat.value
                        ? 'bg-gold-primary/10 text-gold-primary font-bold border-l-2 border-gold-primary'
                        : 'text-white-muted hover:text-white hover:bg-white-pure/5'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <InteractiveButton variant="secondary" size="sm" onClick={resetFilters} className="w-full">
              Reset Filters
            </InteractiveButton>
          </div>
        </aside>

        {/* ================= MOBILE FILTERS BUTTON ================= */}
        <div className="lg:hidden flex items-center justify-between gap-4 p-4 glass rounded-2xl border-white-pure/5">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-gold-primary" />
            <span className="text-sm font-bold text-white">Catalog Filters</span>
          </div>
          <InteractiveButton
            variant="gold"
            size="sm"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
          </InteractiveButton>
        </div>

        {/* ================= MOBILE FILTERS OVERLAY ================= */}
        <AnimatePresence>
          {showMobileFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden glass rounded-2xl border-white-pure/5 p-6 flex flex-col gap-6"
            >
              <div className="flex flex-col gap-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gold-primary">Search</h3>
                <div className="flex items-center px-3 py-2 bg-navy-deep/60 border border-white-pure/10 rounded-xl">
                  <Search size={16} className="text-white-muted mr-2" />
                  <input
                    type="text"
                    placeholder="Keyword search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border-0 outline-none text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gold-primary mb-3">School</h3>
                <select
                  value={schoolFilter}
                  onChange={(e) => setSchoolFilter(e.target.value)}
                  className="w-full bg-navy-deep border border-white-pure/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-gold-primary"
                >
                  <option value="all">All Schools</option>
                  {schools.map((school) => (
                    <option key={school.id} value={school.id}>
                      {school.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gold-primary mb-3">Category</h3>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full bg-navy-deep border border-white-pure/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-gold-primary"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <InteractiveButton variant="secondary" size="sm" onClick={resetFilters} className="w-full">
                Reset Filters
              </InteractiveButton>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================= PRODUCT GRID ================= */}
        <div className="flex-grow">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-white-muted">
              <RefreshCw size={36} className="animate-spin text-gold-primary" />
              <p className="text-sm font-semibold">Loading catalog items...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredProducts.map((product, i) => (
                <GlassCard
                  key={product.id}
                  delay={i * 0.05}
                  className="group flex flex-col justify-between h-[420px] p-4 border-white-pure/5 hover:border-gold-primary/30 relative"
                >
                  <div className="relative w-full h-[220px] rounded-xl overflow-hidden bg-navy-light">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="(max-w-640px) 100vw, (max-w-1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.compare_at_price && (
                      <span className="absolute top-3 left-3 bg-gold-primary text-navy-deep text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md">
                        Offer
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gold-primary uppercase tracking-widest font-semibold">
                          {product.category}
                        </span>
                        {product.stock_status === 'out_of_stock' && (
                          <span className="text-[8px] uppercase tracking-wider text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded font-black">
                            Out of stock
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-white text-base mt-1 line-clamp-2 group-hover:text-gold-primary transition-colors">
                        {product.name}
                      </h4>
                    </div>

                    <div>
                      <div className="flex items-baseline gap-2 mt-2">
                        {product.size_prices && Object.keys(product.size_prices).length > 0 ? (
                          (() => {
                            const prices = Object.values(product.size_prices);
                            const min = Math.min(...prices);
                            const max = Math.max(...prices);
                            return (
                              <span className="text-lg font-black text-white">
                                {min === max ? `₹${min}` : `₹${min} - ₹${max}`}
                              </span>
                            );
                          })()
                        ) : (
                          <span className="text-lg font-black text-white">₹{product.price}</span>
                        )}
                        {product.compare_at_price && (
                          <span className="text-xs text-white-muted line-through">₹{product.compare_at_price}</span>
                        )}
                      </div>
                      
                      {/* Size Tags */}
                      <div className="flex gap-1 flex-wrap mt-2">
                        {product.sizes.map(size => (
                          <span key={size} className="text-[9px] px-1.5 py-0.5 rounded bg-white-pure/5 text-white-muted font-medium border border-white-pure/5">
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white-pure/5 flex gap-2">
                    <InteractiveButton
                      variant="secondary"
                      size="sm"
                      onClick={() => handleOpenQuickView(product)}
                      className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold"
                    >
                      <Eye size={12} /> Quick View
                    </InteractiveButton>
                  </div>
                </GlassCard>
              ))}
            </div>
          ) : (
            <GlassCard className="py-20 text-center flex flex-col items-center max-w-xl mx-auto border-white-pure/5">
              <ShoppingBag size={48} className="text-white-muted opacity-40 mb-4 animate-bounce" />
              <h3 className="text-lg font-bold text-white uppercase">No Products Found</h3>
              <p className="text-sm text-white-muted mt-2">
                No uniforms matched your search filters. Try search keywords or select a different school catalog.
              </p>
              <InteractiveButton variant="gold" size="sm" onClick={resetFilters} className="mt-6">
                Reset Filters
              </InteractiveButton>
            </GlassCard>
          )}
        </div>
      </div>

      {/* ================= QUICK VIEW MODAL OVERLAY ================= */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-navy-deep/80 backdrop-blur-md">
          {/* Animated Card Container */}
          <div className="relative w-full max-w-3xl bg-navy-dark border border-gold-primary/20 rounded-3xl overflow-hidden shadow-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8 max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 text-white-muted hover:text-white p-2 focus:outline-none"
            >
              <X size={20} />
            </button>

            {/* Left: Product Images */}
            <div className="w-full md:w-1/2 flex flex-col gap-4">
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-navy-light border border-white-pure/5">
                <Image 
                  src={selectedProduct.images[0]} 
                  alt={selectedProduct.name}
                  fill 
                  sizes="(max-w-768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="flex gap-2">
                {selectedProduct.images.map((img, index) => (
                  <div key={index} className="relative w-16 h-16 rounded-xl overflow-hidden bg-navy-light border border-white-pure/5 shrink-0">
                    <Image src={img} alt="" fill sizes="64px" className="object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Info & Inquiry Details */}
            <div className="w-full md:w-1/2 flex flex-col justify-between">
              <div>
                <span className="text-xs text-gold-primary font-bold uppercase tracking-wider bg-gold-primary/10 px-2.5 py-1 rounded-md border border-gold-primary/15 inline-block">
                  {selectedProduct.category}
                </span>
                
                <h2 className="text-xl md:text-2xl font-black uppercase text-white mt-3 leading-tight">
                  {selectedProduct.name}
                </h2>

                 {(() => {
                   const currentPrice = selectedProduct.size_prices?.[selectedSize] ?? selectedProduct.price;
                   return (
                     <div className="flex items-baseline gap-2 mt-4">
                       <span className="text-2xl font-black text-white">₹{currentPrice}</span>
                       {selectedProduct.compare_at_price && !selectedProduct.size_prices && (
                         <span className="text-sm text-white-muted line-through">₹{selectedProduct.compare_at_price}</span>
                       )}
                     </div>
                   );
                 })()}

                <p className="text-sm text-white-muted mt-4 leading-relaxed">
                  {selectedProduct.description}
                </p>

                {/* Sizing selection */}
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Select Size</span>
                    <span className="text-[10px] text-gold-primary flex items-center gap-1">
                      <Info size={10} /> Custom tailoring supported
                    </span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {selectedProduct.sizes.map((size) => {
                      const isChosen = selectedSize === size;
                      const sizePrice = selectedProduct.size_prices?.[size];
                      return (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`text-xs font-bold px-3 py-2 rounded-lg border transition-all ${
                            isChosen 
                              ? 'bg-gold-primary border-gold-primary text-navy-deep shadow-gold-glow' 
                              : 'bg-navy-light border-white-pure/10 text-white-soft hover:border-white-pure/30'
                          }`}
                        >
                          {size}{sizePrice ? ` (₹${sizePrice})` : ''}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quantity selection */}
                <div className="mt-6">
                  <span className="text-xs font-bold text-white uppercase tracking-wider block mb-2">Quantity</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg bg-navy-light border border-white-pure/10 flex items-center justify-center font-bold hover:border-white-pure/30 transition-colors"
                    >
                      -
                    </button>
                    <span className="text-base font-bold text-white w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-lg bg-navy-light border border-white-pure/10 flex items-center justify-center font-bold hover:border-white-pure/30 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Delivery Information */}
                <div className="mt-6 border-t border-white-pure/5 pt-4 flex flex-col gap-4">
                  <span className="text-xs font-bold text-white uppercase tracking-wider block">Delivery Details</span>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-white-muted uppercase font-bold">Your Name *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="E.g. Ramesh Kumar"
                        value={custName}
                        onChange={(e) => setCustName(e.target.value)}
                        className="bg-navy-deep border border-white-pure/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-primary"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-white-muted uppercase font-bold">Phone Number</label>
                      <input 
                        type="tel" 
                        placeholder="E.g. 9812345678"
                        value={custPhone}
                        onChange={(e) => setCustPhone(e.target.value)}
                        className="bg-navy-deep border border-white-pure/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-primary"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-white-muted uppercase font-bold">Manual Delivery Address *</label>
                    <textarea 
                      required
                      placeholder="Enter house/flat number, block, society/colony..."
                      value={custAddress}
                      onChange={(e) => setCustAddress(e.target.value)}
                      rows={2}
                      className="bg-navy-deep border border-white-pure/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-primary resize-none"
                    />
                  </div>

                  {/* Geolocation Button */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-white-muted uppercase font-bold">GPS Live Location</label>
                    <button
                      type="button"
                      onClick={handleGetGpsLocation}
                      disabled={gpsLoading}
                      className={cn(
                        "text-xs font-bold py-2.5 px-4 rounded-lg border transition-all flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none",
                        gpsShared
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                          : "bg-navy-light border-white-pure/10 text-white hover:border-gold-primary/50"
                      )}
                    >
                      {gpsLoading ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Fetching GPS...
                        </>
                      ) : gpsShared ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                          GPS Coordinates Attached ✓
                        </>
                      ) : (
                        "Share Live GPS Location"
                      )}
                    </button>
                    {gpsCoords && (
                      <span className="text-[9px] text-emerald-400/80 text-center font-medium mt-1">
                        Coordinates: {gpsCoords.lat.toFixed(6)}, {gpsCoords.lng.toFixed(6)} (will be shared on WhatsApp)
                      </span>
                    )}
                  </div>
                </div>

              </div>

              {/* Inquiry Action */}
              <div className="mt-8 pt-4 border-t border-white-pure/5 flex flex-col gap-3">
                <InteractiveButton
                  variant="gold"
                  size="md"
                  fullWidth
                  onClick={() => handleSendWhatsAppOrder(selectedProduct)}
                  className="flex items-center justify-center gap-2"
                >
                  <MessageCircle size={18} /> Order on WhatsApp
                </InteractiveButton>
                
                <span className="text-[10px] text-white-muted text-center italic">
                  Pressing this compiles sizing and orders directly to Chinky Garments chat line.
                </span>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-white-muted min-h-screen">
        <RefreshCw size={36} className="animate-spin text-gold-primary" />
        <p className="text-sm font-semibold">Loading catalogs...</p>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
