"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Award, ShieldCheck, Clock, Users, Building, HeartHandshake } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';

export default function AboutPage() {
  
  const stats = [
    { icon: <Clock className="text-gold-primary" size={24} />, label: "Years of Legacy", value: "40+" },
    { icon: <Users className="text-gold-primary" size={24} />, label: "Happy Institutions", value: "150+" },
    { icon: <Building className="text-gold-primary" size={24} />, label: "Storefronts & Hubs", value: "3" },
    { icon: <ShieldCheck className="text-gold-primary" size={24} />, label: "Quality Checks", value: "100%" }
  ];

  const timeline = [
    {
      year: "1985",
      title: "The Genesis",
      description: "Our founders established a small textile manufacturing hub in Delhi, specializing in high-quality woven cotton shirting."
    },
    {
      year: "1995",
      title: "Chinky Garments Brand Launch",
      description: "Launched the dedicated institutional uniform brand 'Chinky Garments', catering to prominent local private schools with custom-tailored blazers and skirts."
    },
    {
      year: "2008",
      title: "Government Service Expansion",
      description: "Approved as a certified supplier for state board municipal uniforms, starting high-volume automated manufacturing lines."
    },
    {
      year: "2018",
      title: "Modernized Machinery",
      description: "Integrated computerized CAD pattern-cutting and automated embroidery systems to increase design precision and reduce wait times."
    },
    {
      year: "2026",
      title: "The Digital Era",
      description: "Digitized institutional ordering and sizing with a bespoke platform powered by modern Next.js systems to serve parents remotely."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen">
      
      {/* Header */}
      <div className="text-center mb-20 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gold-primary/5 rounded-full blur-3xl pointer-events-none" />
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold-primary flex items-center justify-center gap-2">
          <HeartHandshake size={14} /> Heritage
        </span>
        <h1 className="text-4xl md:text-6xl font-black uppercase text-white mt-3 tracking-tight">
          A Legacy of Trust
        </h1>
        <p className="text-white-muted text-sm md:text-base max-w-xl mx-auto mt-4">
          Chinky Garments has been crafting premium uniforms with uncompromising quality and absolute trust for four decades.
        </p>
      </div>

      {/* Main Story Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center mb-28">
        
        {/* Story Text */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-7 flex flex-col gap-6"
        >
          <h2 className="text-2xl md:text-4xl font-black uppercase text-white leading-tight">
            Crafting Identity & Excellence In Every Thread
          </h2>
          
          <p className="text-sm md:text-base text-white-muted leading-relaxed">
            At Chinky Garments, we believe school uniforms are not just clothing; they are symbols of identity, unity, and pride. Since our inception in 1985, our focus has been simple: providing schools and parents with superior materials, flawless fit, and enduring durability.
          </p>

          <p className="text-sm md:text-base text-white-muted leading-relaxed">
            We source raw yarn and premium long-staple cotton directly, managing the production line from spinning and dyeing to tailoring and final embroidery checks. By cutting out middlemen, we maintain absolute control over standards while offering value pricing to parents.
          </p>

          <div className="inline-flex items-center gap-3 p-4 rounded-xl glass border-gold-primary/20 bg-gold-primary/[0.02] mt-2">
            <Award className="text-gold-primary shrink-0" size={24} />
            <p className="text-xs md:text-sm text-gold-light font-bold">
              Trusted by 150+ academic boards and municipal councils nationwide.
            </p>
          </div>
        </motion.div>

        {/* Story Image */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-5 relative h-[420px] rounded-3xl overflow-hidden border border-white-pure/5 shadow-2xl"
        >
          <Image 
            src="https://images.unsplash.com/photo-1528570688546-22466044e13e?auto=format&fit=crop&q=80&w=800"
            alt="Tailoring Heritage"
            fill
            sizes="(max-w-1024px) 100vw, 40vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-transparent to-transparent opacity-80" />
          <div className="absolute bottom-6 left-6 right-6">
            <span className="text-[10px] uppercase tracking-widest text-gold-primary font-black">Quality First</span>
            <p className="text-sm text-white font-bold mt-1">Stitching trust, weaving traditions since 1985.</p>
          </div>
        </motion.div>
      </div>

      {/* Stats Section */}
      <section className="mb-28">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <GlassCard key={i} delay={i * 0.05} className="text-center p-6 border-white-pure/5 hover:border-gold-primary/30">
              <div className="w-12 h-12 rounded-xl bg-navy-light flex items-center justify-center mx-auto mb-4 border border-white-pure/5">
                {stat.icon}
              </div>
              <h4 className="text-3xl md:text-4xl font-black text-white">{stat.value}</h4>
              <p className="text-xs text-white-muted uppercase tracking-wider font-semibold mt-2">{stat.label}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="text-center text-3xl md:text-4xl font-black uppercase text-white mb-16">
          Our Journey
        </h2>

        <div className="relative border-l border-white-pure/10 pl-6 md:pl-10 flex flex-col gap-12">
          {timeline.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              {/* Timeline Indicator Dot */}
              <div className="absolute -left-[31px] md:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-navy-dark border-2 border-gold-primary shadow-gold-glow flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-gold-primary" />
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-lg md:text-xl font-black font-sans text-gold-primary">
                  {item.year}
                </span>
                <GlassCard hoverEffect={false} animate={false} className="p-5 border-white-pure/5 bg-white-pure/[0.01]">
                  <h3 className="font-bold text-white text-base md:text-lg">{item.title}</h3>
                  <p className="text-sm text-white-muted leading-relaxed mt-2">{item.description}</p>
                </GlassCard>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}
