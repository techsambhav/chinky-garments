"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, MessageSquare, Send, CheckCircle2, MessageCircle } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { InteractiveButton } from '@/components/ui/interactive-button';
import confetti from 'canvas-confetti';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    school: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate sending API request
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      
      // Trigger canvas-confetti for a premium experience
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#0A192F', '#FFFFFF']
      });

      // Clear form
      setFormData({
        name: '',
        email: '',
        phone: '',
        school: '',
        message: ''
      });
    }, 1200);
  };

  const handleStartWhatsAppChat = () => {
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '917037936440';
    const message = `Hi Jain Traders (Chinky Garments), I have an inquiry about school uniforms. Could you please help me?`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen">
      
      {/* Page Header */}
      <div className="text-center mb-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gold-primary/5 rounded-full blur-3xl pointer-events-none" />
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold-primary flex items-center justify-center gap-2">
          <MessageSquare size={14} /> Help Desk
        </span>
        <h1 className="text-4xl md:text-6xl font-black uppercase text-white mt-3 tracking-tight">
          Contact Us
        </h1>
        <p className="text-white-muted text-sm md:text-base max-w-xl mx-auto mt-4">
          Connect with Chinky Garments regarding institutional accounts, bulk purchases, customized uniform sizing, or stock inquiries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* ================= LEFT SIDE: CONTACT INFO CARDS ================= */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <h2 className="text-2xl font-bold uppercase text-white tracking-wide mb-2">
            Get In Touch Directly
          </h2>

          <GlassCard hoverEffect={true} animate={false} className="border-white-pure/5 flex gap-4 p-5">
            <div className="w-12 h-12 rounded-xl bg-navy-light flex items-center justify-center shrink-0 border border-white-pure/5">
              <MapPin className="text-gold-primary" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Retail Store & Warehouse</h3>
              <p className="text-sm text-white-muted mt-2 leading-relaxed">
                Chinky Garments, Shop No. 12, Main Uniform Bazaar, Near Clock Tower, New Delhi, Delhi 110006
              </p>
            </div>
          </GlassCard>

          <GlassCard hoverEffect={true} animate={false} className="border-white-pure/5 flex gap-4 p-5">
            <div className="w-12 h-12 rounded-xl bg-navy-light flex items-center justify-center shrink-0 border border-white-pure/5">
              <Phone className="text-gold-primary" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Call Support</h3>
              <p className="text-sm text-white-muted mt-2">
                Mobile: {process.env.NEXT_PUBLIC_DISPLAY_PHONE || '+91 70379 36440'}<br />
                Landline: 011-2391XXXX
              </p>
            </div>
          </GlassCard>

          <GlassCard hoverEffect={true} animate={false} className="border-white-pure/5 flex gap-4 p-5">
            <div className="w-12 h-12 rounded-xl bg-navy-light flex items-center justify-center shrink-0 border border-white-pure/5">
              <Mail className="text-gold-primary" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Email Inquiries</h3>
              <p className="text-sm text-white-muted mt-2">
                support@chinkygarments.com<br />
                jaintraders@example.com
              </p>
            </div>
          </GlassCard>

          <GlassCard hoverEffect={true} animate={false} className="border-white-pure/5 flex gap-4 p-5">
            <div className="w-12 h-12 rounded-xl bg-navy-light flex items-center justify-center shrink-0 border border-white-pure/5">
              <Clock className="text-gold-primary" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Operating Hours</h3>
              <p className="text-sm text-white-muted mt-2">
                Monday to Saturday: 10:00 AM – 8:00 PM<br />
                Sunday: Closed
              </p>
            </div>
          </GlassCard>

          {/* Quick WhatsApp Action */}
          <InteractiveButton
            variant="gold"
            size="md"
            onClick={handleStartWhatsAppChat}
            className="flex items-center justify-center gap-2 mt-4 w-full"
          >
            <MessageCircle size={20} /> Instant Chat on WhatsApp
          </InteractiveButton>
        </div>

        {/* ================= RIGHT SIDE: CONTACT INQUIRY FORM ================= */}
        <div className="lg:col-span-7">
          <GlassCard hoverEffect={false} animate={false} className="border-white-pure/5 p-8 relative">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h2 className="text-2xl font-bold uppercase text-white tracking-wide mb-2">
                    Send an Inquiry
                  </h2>
                  <p className="text-sm text-white-muted mb-8">
                    Fill out the form below. Our support coordinators at Chinky Garments will respond to you within 24 business hours.
                  </p>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-white">Your Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="E.g. Sumeet Kumar"
                          className="bg-navy-deep border border-white-pure/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-primary transition-colors"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-white">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="E.g. sumeet@example.com"
                          className="bg-navy-deep border border-white-pure/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-primary transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-white">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="E.g. +91 98100 12345"
                          className="bg-navy-deep border border-white-pure/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-primary transition-colors"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-white">Associated School</label>
                        <input
                          type="text"
                          value={formData.school}
                          onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                          placeholder="E.g. St. Xavier's High School"
                          className="bg-navy-deep border border-white-pure/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-primary transition-colors"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-white">Inquiry Details *</label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Please describe your sizing issues, custom requests, or school uniform needs..."
                        className="bg-navy-deep border border-white-pure/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-primary transition-colors resize-none"
                      />
                    </div>

                    <div className="mt-4">
                      <InteractiveButton
                        variant="gold"
                        size="md"
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-navy-deep border-t-transparent rounded-full animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send size={16} /> Submit Message
                          </>
                        )}
                      </InteractiveButton>
                    </div>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-16 text-center flex flex-col items-center gap-4"
                >
                  <CheckCircle2 size={56} className="text-gold-primary shadow-gold-glow rounded-full" />
                  <h2 className="text-2xl font-bold uppercase text-white mt-4">
                    Inquiry Submitted!
                  </h2>
                  <p className="text-sm text-white-muted max-w-md mx-auto leading-relaxed">
                    Thank you. Your request was successfully submitted to Chinky Garments. A dedicated support representative will contact you via phone or email shortly.
                  </p>
                  <InteractiveButton
                    variant="secondary"
                    size="sm"
                    onClick={() => setSubmitted(false)}
                    className="mt-6"
                  >
                    Send Another Inquiry
                  </InteractiveButton>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        </div>

      </div>

    </div>
  );
}
