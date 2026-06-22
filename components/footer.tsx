import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-deep border-t border-gold-primary/10 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gold-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-navy-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-white-pure/5">
          {/* Brand Column */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-xl md:text-2xl font-black font-sans tracking-wider text-white">CHINKY</span>
                <span className="text-xl md:text-2xl font-black font-sans tracking-wider text-gold-primary">GARMENTS</span>
              </div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-white-muted -mt-1 font-semibold">
                A Legacy of Trust
              </span>
            </Link>
            <p className="text-sm text-white-muted leading-relaxed mt-2">
              Serving institutions and generations since 1985 with premium school uniforms, government uniforms, and kids wear. We combine custom stitching, durable fabrics, and elegant designs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-primary mb-5">Explore</h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link href="/" className="text-sm text-white-muted hover:text-white transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/schools" className="text-sm text-white-muted hover:text-white transition-colors duration-200">
                  Find Your School
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-sm text-white-muted hover:text-white transition-colors duration-200">
                  Our Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-white-muted hover:text-white transition-colors duration-200">
                  About Heritage
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-white-muted hover:text-white transition-colors duration-200">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Uniform Categories */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-primary mb-5">Product Categories</h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link href="/products?category=Blazer" className="text-sm text-white-muted hover:text-white transition-colors duration-200 flex items-center gap-1">
                  Premium Blazers <ExternalLink size={12} className="opacity-40" />
                </Link>
              </li>
              <li>
                <Link href="/products?category=Shirt" className="text-sm text-white-muted hover:text-white transition-colors duration-200">
                  Structured Shirts
                </Link>
              </li>
              <li>
                <Link href="/products?category=Trouser" className="text-sm text-white-muted hover:text-white transition-colors duration-200 flex items-center gap-1">
                  Adjustable Trousers & Skirts
                </Link>
              </li>
              <li>
                <Link href="/products?category=Government Uniform" className="text-sm text-white-muted hover:text-white transition-colors duration-200">
                  Government Uniforms
                </Link>
              </li>
              <li>
                <Link href="/products?category=Kids Wear" className="text-sm text-white-muted hover:text-white transition-colors duration-200">
                  Toddlers & Play School
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-primary mb-1">Get In Touch</h3>
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-gold-primary shrink-0 mt-0.5" />
              <span className="text-sm text-white-muted leading-relaxed">
                Chinky Garments, Shop No. 12, Main Uniform Bazaar, New Delhi, Delhi 110006
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-gold-primary shrink-0" />
              <span className="text-sm text-white-muted">{process.env.NEXT_PUBLIC_DISPLAY_PHONE || '+91 70379 36440'}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-gold-primary shrink-0" />
              <span className="text-sm text-white-muted">info@chinkygarments.com</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-white-muted">
          <div>
            © {currentYear} Chinky Garments. All Rights Reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="hover:text-white transition-colors">Admin Console</Link>
            <span>•</span>
            <span>A Legacy of Trust Since 1985</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
