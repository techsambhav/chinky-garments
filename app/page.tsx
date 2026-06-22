"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Star, HelpCircle, Award, ShieldCheck, Sparkles, CheckCircle2, ChevronDown } from 'lucide-react';
import { dbService } from '@/lib/supabase/services';
import { School, Product, Review } from '@/types/database';
import { GlassCard } from '@/components/ui/glass-card';
import { InteractiveButton } from '@/components/ui/interactive-button';

export default function HomePage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const allSchools = await dbService.getSchools();
      const allProducts = await dbService.getProducts();
      const allReviews = await dbService.getReviews();
      
      setSchools(allSchools.filter(s => s.is_featured));
      setProducts(allProducts);
      setReviews(allReviews);
    };
    fetchData();
  }, []);

  const mostSelling = products.filter(p => p.is_most_selling);
  const kidsWear = products.filter(p => p.is_kids_wear);
  const govUniforms = products.filter(p => p.is_government_uniform);

  const faqs = [
    {
      q: "How do I ensure the perfect fit for my child?",
      a: "We have an extensive size guide for each school on their product catalog page. Additionally, we provide custom tailoring sizing details and suggest ordering a size slightly larger for fast-growing kids."
    },
    {
      q: "Can I get customized sizing for blazer stitching?",
      a: "Yes! Jain Traders provides bespoke measurement support. You can visit our retail store or coordinate via our Contact form to submit custom collar, chest, and sleeve lengths."
    },
    {
      q: "Are these uniforms compliant with the official school guidelines?",
      a: "100%. We collaborate closely with school boards and administrations. All colors, checkers, weaves, and logos are strictly approved and compliant."
    },
    {
      q: "What is your return or exchange policy?",
      a: "We offer hassle-free exchanges within 14 days of purchase at our physical store, provided tags are intact and uniforms are unwashed."
    }
  ];

  return (
    <div className="relative overflow-hidden w-full pb-20">
      {/* Background Ambient Lights */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-navy-accent/20 blur-[150px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[45%] h-[45%] rounded-full bg-gold-primary/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[10%] w-[40%] h-[40%] rounded-full bg-navy-light/30 blur-[120px] pointer-events-none" />

      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 pt-12 md:pt-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-gold-primary/20 mb-8"
        >
          <Sparkles size={14} className="text-gold-primary animate-pulse" />
          <span className="text-xs font-semibold tracking-wider text-gold-light uppercase">
            A Legacy of Trust Since 1985
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-6xl md:text-8xl font-black font-sans tracking-tighter text-white leading-none max-w-5xl uppercase"
        >
          FIND YOUR SCHOOL.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-dark via-gold-primary to-gold-accent text-glow-gold">
            FIND THE PERFECT FIT.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-white-muted text-base md:text-xl max-w-2xl mt-6 font-medium leading-relaxed"
        >
          Premium custom-tailored institutional uniforms and playwear manufactured with grade-A durable fabrics by Chinky Garments.
        </motion.p>

        {/* Search & Actions */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-full max-w-xl mt-10"
        >
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = `/schools?search=${encodeURIComponent(searchQuery)}`;
            }}
            className="flex items-center p-2 rounded-2xl glass border-white-pure/10 shadow-2xl shadow-gold-primary/5 focus-within:border-gold-primary/50 transition-all duration-300"
          >
            <Search className="text-white-muted ml-3 shrink-0" size={20} />
            <input
              type="text"
              placeholder="Search your school name (e.g. St. Xavier's, DPS...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-0 outline-none text-white text-sm px-3 py-2 placeholder-white-muted/60"
            />
            <InteractiveButton variant="gold" size="sm" type="submit" className="shrink-0 flex items-center gap-1">
              Search School
            </InteractiveButton>
          </form>

          {/* Secondary CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
            <Link href="/contact">
              <InteractiveButton variant="secondary" size="md" className="flex items-center gap-2">
                Contact Us
                <ArrowRight size={16} />
              </InteractiveButton>
            </Link>
            <Link href="/products">
              <InteractiveButton variant="ghost" size="md" className="text-white hover:text-gold-primary transition-colors">
                Browse All Uniforms
              </InteractiveButton>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ================= FEATURED SCHOOLS ================= */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gold-primary flex items-center gap-2">
              <Award size={14} /> Partner Institutions
            </h2>
            <h3 className="text-3xl md:text-5xl font-black uppercase text-white mt-2">
              Featured Schools
            </h3>
          </div>
          <Link href="/schools" className="text-sm font-semibold text-gold-primary hover:text-white flex items-center gap-1 transition-colors mt-4 md:mt-0">
            View All Partner Schools <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {schools.map((school, i) => (
            <Link href={`/products?school=${school.id}`} key={school.id}>
              <GlassCard 
                delay={i * 0.1}
                className="group h-[320px] flex flex-col justify-between border border-white-pure/5 hover:border-gold-primary/30 relative cursor-pointer"
              >
                {/* School Banner Image Overlay */}
                <div className="absolute inset-0 z-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                  <Image 
                    src={school.banner_url || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=600'} 
                    alt={school.name}
                    fill
                    sizes="(max-w-768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-xl bg-navy-light border border-white-pure/10 flex items-center justify-center p-2 mb-6 group-hover:border-gold-primary/40 transition-colors">
                    <div className="relative w-full h-full">
                      <Image 
                        src={school.logo_url || ''} 
                        alt={`${school.name} Logo`}
                        fill
                        sizes="64px"
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-white group-hover:text-gold-primary transition-colors">
                    {school.name}
                  </h4>
                  <p className="text-sm text-white-muted mt-2 line-clamp-3">
                    {school.description}
                  </p>
                </div>

                <div className="relative z-10 flex items-center gap-2 text-xs font-semibold text-gold-light mt-4">
                  <span>Explore Uniforms</span>
                  <ArrowRight size={12} className="transform group-hover:translate-x-1 transition-transform" />
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= GOVERNMENT SCHOOL UNIFORMS ================= */}
      <section className="bg-navy-dark border-y border-gold-primary/10 py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-navy-deep to-navy-dark opacity-80 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Nike Aesthetic Graphic Side */}
            <motion.div 
              initial={{ opacity: 0, x: -35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative h-[480px] rounded-3xl overflow-hidden shadow-2xl border border-white-pure/5 group"
            >
              <Image 
                src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=800" 
                alt="Government Uniform Showcase"
                fill
                sizes="(max-w-1024px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-8 left-8 right-8 bg-navy-deep/80 backdrop-blur-md border border-gold-primary/20 rounded-2xl p-6">
                <span className="text-xs font-bold text-gold-primary uppercase tracking-widest">Official Standards</span>
                <h4 className="text-xl font-bold text-white mt-1">State Compliant Weaves</h4>
                <p className="text-sm text-white-muted mt-2">Durable poly-cottons designed to withstand daily school activities and rugged play.</p>
              </div>
            </motion.div>

            {/* Info & Gov List Side */}
            <motion.div
              initial={{ opacity: 0, x: 35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold-primary flex items-center gap-2">
                <ShieldCheck size={14} /> National Standard Uniforms
              </span>
              <h3 className="text-3xl md:text-5xl font-black uppercase text-white mt-2 leading-tight">
                Government School Uniforms
              </h3>
              <p className="text-white-muted mt-4 leading-relaxed">
                Chinky Garments is a trusted supplier of standardized government school uniforms. We manufacture in high volumes maintaining strict guidelines, color codes, and durability requirements set by the state departments.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                {govUniforms.map((prod) => (
                  <GlassCard key={prod.id} variant="dark" hoverEffect={false} className="border-white-pure/5 p-4 flex gap-4 items-center">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-navy-light">
                      <Image 
                        src={prod.images[0]} 
                        alt={prod.name} 
                        fill 
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-white line-clamp-1">{prod.name}</h5>
                      <p className="text-xs text-gold-primary font-semibold mt-1">₹{prod.price}</p>
                      <Link href="/products?category=Government Uniform" className="text-[10px] text-white-muted hover:text-gold-primary flex items-center gap-0.5 mt-1">
                        View Details <ArrowRight size={8} />
                      </Link>
                    </div>
                  </GlassCard>
                ))}
              </div>

              <div className="mt-10">
                <Link href="/products?category=Government Uniform">
                  <InteractiveButton variant="gold" size="md">
                    Explore Government Catalog
                  </InteractiveButton>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= MOST SELLING PRODUCTS ================= */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gold-primary flex items-center gap-2">
              <Sparkles size={14} /> Top Selections
            </h2>
            <h3 className="text-3xl md:text-5xl font-black uppercase text-white mt-2">
              Most Selling Products
            </h3>
          </div>
          <Link href="/products" className="text-sm font-semibold text-gold-primary hover:text-white flex items-center gap-1 transition-colors mt-4 md:mt-0">
            View All Products <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {mostSelling.slice(0, 4).map((product, i) => (
            <GlassCard 
              key={product.id} 
              delay={i * 0.1}
              className="group flex flex-col justify-between h-[420px] p-4 border border-white-pure/5 hover:border-gold-primary/30 relative"
            >
              {/* Product Image */}
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

              {/* Product Info */}
              <div className="mt-4 flex-grow flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-gold-primary uppercase tracking-widest font-semibold">
                    {product.category}
                  </span>
                  <h4 className="font-bold text-white text-base mt-1 line-clamp-2 group-hover:text-gold-primary transition-colors">
                    {product.name}
                  </h4>
                </div>

                <div>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-lg font-black text-white">₹{product.price}</span>
                    {product.compare_at_price && (
                      <span className="text-xs text-white-muted line-through">₹{product.compare_at_price}</span>
                    )}
                  </div>
                  
                  {/* Sizes badges */}
                  <div className="flex gap-1 flex-wrap mt-2">
                    {product.sizes.slice(0, 4).map(size => (
                      <span key={size} className="text-[9px] px-1.5 py-0.5 rounded bg-white-pure/5 text-white-muted font-medium">
                        {size}
                      </span>
                    ))}
                    {product.sizes.length > 4 && (
                      <span className="text-[9px] text-white-muted font-medium">+{product.sizes.length - 4} more</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white-pure/5">
                <Link href={`/products?search=${encodeURIComponent(product.name)}`}>
                  <InteractiveButton variant="secondary" size="sm" className="w-full text-xs font-semibold">
                    Quick View
                  </InteractiveButton>
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* ================= KIDS WEAR SECTION ================= */}
      <section className="bg-gradient-to-b from-navy-deep via-navy-dark to-navy-deep py-24 relative border-t border-gold-primary/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gold-primary flex items-center gap-2">
                <CheckCircle2 size={14} /> Soft & Safe Fabrics
              </h2>
              <h3 className="text-3xl md:text-5xl font-black uppercase text-white mt-2">
                Kids & Play School Wear
              </h3>
            </div>
            <Link href="/products?category=Kids Wear" className="text-sm font-semibold text-gold-primary hover:text-white flex items-center gap-1 transition-colors mt-4 md:mt-0">
              View Kids Catalog <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col gap-6"
            >
              <h4 className="text-2xl md:text-3xl font-black uppercase text-white leading-tight">
                COMPROMISE-FREE COMFORT FOR THE LITTLE ONES
              </h4>
              <p className="text-white-muted leading-relaxed">
                We select premium long-staple combed cotton fabrics for preschool, daycare, and playschool sets. Specially treated to avoid skin irritation, keep cool in summer, and stretch with all-day active play.
              </p>

              <ul className="flex flex-col gap-3">
                <li className="flex items-center gap-3 text-sm text-white-muted">
                  <CheckCircle2 size={16} className="text-gold-primary shrink-0" />
                  100% Breathable Hypoallergenic Cotton Blend
                </li>
                <li className="flex items-center gap-3 text-sm text-white-muted">
                  <CheckCircle2 size={16} className="text-gold-primary shrink-0" />
                  Flexible Waistbands & Stretch Weaves for Active Toddlers
                </li>
                <li className="flex items-center gap-3 text-sm text-white-muted">
                  <CheckCircle2 size={16} className="text-gold-primary shrink-0" />
                  Fade-Resistant Colors Even After Rigorous Daily Washing
                </li>
              </ul>

              <div className="pt-4">
                <Link href="/products?category=Kids Wear">
                  <InteractiveButton variant="gold" size="md">
                    Explore Play School Catalog
                  </InteractiveButton>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              {kidsWear.slice(0, 2).map((item) => (
                <GlassCard key={item.id} className="p-4 flex flex-col justify-between h-[360px] border-white-pure/5 hover:border-gold-primary/30">
                  <div className="relative w-full h-[180px] rounded-xl overflow-hidden bg-navy-light">
                    <Image 
                      src={item.images[0]} 
                      alt={item.name} 
                      fill 
                      sizes="(max-w-640px) 100vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="mt-4 flex-grow flex flex-col justify-between">
                    <div>
                      <h5 className="font-bold text-sm text-white line-clamp-2">{item.name}</h5>
                      <p className="text-xs text-white-muted mt-1 leading-snug line-clamp-2">{item.description}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white-pure/5">
                      <span className="font-bold text-sm text-white">₹{item.price}</span>
                      <Link href="/products?category=Kids Wear" className="text-xs text-gold-primary font-semibold flex items-center gap-0.5">
                        Details <ArrowRight size={10} />
                      </Link>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= REVIEWS SECTION ================= */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-gold-primary/10">
        <div className="text-center mb-16">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gold-primary flex items-center justify-center gap-2">
            <Star size={14} className="fill-gold-primary" /> Customer Voice
          </h2>
          <h3 className="text-3xl md:text-5xl font-black uppercase text-white mt-2">
            What Parents Say
          </h3>
          <p className="text-white-muted max-w-xl mx-auto mt-4 text-sm">
            Discover why generations trust Chinky Garments for school uniforms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, i) => (
            <GlassCard 
              key={rev.id} 
              delay={i * 0.1}
              className="flex flex-col justify-between h-[260px] border-white-pure/5 hover:border-gold-primary/20"
            >
              <div>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, index) => (
                    <Star 
                      key={index} 
                      size={14} 
                      className={index < rev.rating ? "text-gold-primary fill-gold-primary" : "text-white-pure/10"} 
                    />
                  ))}
                </div>
                <p className="text-sm italic text-white-soft leading-relaxed line-clamp-5">
                  "{rev.comment}"
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-white-pure/5 pt-4 mt-4">
                <span className="font-bold text-sm text-white">{rev.customer_name}</span>
                <span className="text-[10px] text-white-muted uppercase tracking-wider font-semibold bg-white-pure/5 px-2.5 py-0.5 rounded-full">
                  Verified Parent
                </span>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* ================= FAQ SECTION ================= */}
      <section className="max-w-4xl mx-auto px-6 py-24 border-t border-gold-primary/10">
        <div className="text-center mb-16">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gold-primary flex items-center justify-center gap-2">
            <HelpCircle size={14} /> Help Desk
          </h2>
          <h3 className="text-3xl md:text-4xl font-black uppercase text-white mt-2">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <GlassCard
                key={index}
                hoverEffect={false}
                animate={false}
                className="p-0 border border-white-pure/5 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className="font-bold text-white text-base md:text-lg">{faq.q}</span>
                  <ChevronDown 
                    size={18} 
                    className={`text-gold-primary shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                  />
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-40 border-t border-white-pure/5 bg-white-pure/[0.01]' : 'max-h-0'
                  }`}
                >
                  <p className="p-6 text-sm text-white-muted leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </section>
    </div>
  );
}
