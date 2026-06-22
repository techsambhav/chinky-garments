"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { dbService } from '@/lib/supabase/services';
import { School, Product, Order } from '@/types/database';
import { GlassCard } from '@/components/ui/glass-card';
import { InteractiveButton } from '@/components/ui/interactive-button';
import { 
  DollarSign, 
  School as SchoolIcon, 
  ShoppingBag, 
  ClipboardList, 
  TrendingUp, 
  ChevronRight,
  Clock,
  ArrowUpRight
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [schoolsCount, setSchoolsCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [revenue, setRevenue] = useState(0);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const allSchools = await dbService.getSchools();
      const allProducts = await dbService.getProducts();
      const allOrders = await dbService.getOrders();

      setSchoolsCount(allSchools.length);
      setProductsCount(allProducts.length);
      setOrders(allOrders);

      // Compute total revenue
      const totalRev = allOrders.reduce((sum, order) => sum + Number(order.total_amount), 0);
      setRevenue(totalRev);

      // Compute pending orders
      const pending = allOrders.filter(o => o.status === 'pending').length;
      setPendingOrdersCount(pending);
    };
    fetchData();
  }, []);

  const stats = [
    {
      label: 'Gross Revenue',
      value: `₹${revenue.toLocaleString()}`,
      change: '+18.4% this month',
      icon: <DollarSign className="text-gold-primary" size={20} />,
      color: 'border-gold-primary/20'
    },
    {
      label: 'Partner Schools',
      value: schoolsCount.toString(),
      change: 'Active partnerships',
      icon: <SchoolIcon className="text-blue-400" size={20} />,
      color: 'border-blue-400/20'
    },
    {
      label: 'Total Products',
      value: productsCount.toString(),
      change: 'Catalog items count',
      icon: <ShoppingBag className="text-emerald-400" size={20} />,
      color: 'border-emerald-400/20'
    },
    {
      label: 'Pending Inquiries',
      value: pendingOrdersCount.toString(),
      change: 'Awaiting WhatsApp dispatch',
      icon: <ClipboardList className="text-orange-400" size={20} />,
      color: 'border-orange-400/20'
    }
  ];

  return (
    <div className="flex flex-col gap-8">
      
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase text-white tracking-wide">Dashboard</h1>
          <p className="text-sm text-white-muted">Welcome back! Here is a summary of Chinky Garments operations.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/products">
            <InteractiveButton variant="gold" size="sm" className="flex items-center gap-1.5 text-xs">
              Add New Product <ArrowUpRight size={14} />
            </InteractiveButton>
          </Link>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <GlassCard key={index} hoverEffect={true} animate={false} className={`border-white-pure/5 hover:${stat.color}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-white-muted">{stat.label}</span>
              <div className="w-10 h-10 rounded-xl bg-navy-deep/60 border border-white-pure/5 flex items-center justify-center shrink-0">
                {stat.icon}
              </div>
            </div>
            <h2 className="text-3xl font-black text-white mt-4">{stat.value}</h2>
            <p className="text-[10px] text-white-muted font-medium mt-1 flex items-center gap-1">
              <TrendingUp size={10} className="text-gold-primary" /> {stat.change}
            </p>
          </GlassCard>
        ))}
      </div>

      {/* Details Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Col: Recent Orders */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold uppercase tracking-wider text-white">Recent Customer Inquiries</h2>
            <Link href="/admin/orders" className="text-xs text-gold-primary hover:text-white flex items-center gap-1 transition-colors">
              View All Queue <ChevronRight size={14} />
            </Link>
          </div>

          <GlassCard hoverEffect={false} animate={false} className="border-white-pure/5 p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white-pure/5 text-[10px] uppercase tracking-wider text-white-muted bg-white-pure/[0.01]">
                    <th className="p-4 font-bold">Order Number</th>
                    <th className="p-4 font-bold">Customer</th>
                    <th className="p-4 font-bold">Total Amount</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 font-bold">Date Received</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white-pure/5 text-sm text-white-soft">
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="hover:bg-white-pure/[0.01] transition-colors">
                      <td className="p-4 font-bold text-gold-primary">{order.order_number}</td>
                      <td className="p-4">
                        <div className="font-semibold">{order.customer_name}</div>
                        <div className="text-xs text-white-muted mt-0.5">{order.customer_phone}</div>
                      </td>
                      <td className="p-4 font-bold">₹{order.total_amount}</td>
                      <td className="p-4">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                          order.status === 'delivered' ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/10' :
                          order.status === 'processing' ? 'bg-blue-400/10 text-blue-400 border border-blue-400/10' :
                          order.status === 'cancelled' ? 'bg-red-400/10 text-red-400 border border-red-400/10' :
                          'bg-orange-400/10 text-orange-400 border border-orange-400/10'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-white-muted">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        {/* Right Col: Admin Console Shortcuts */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <h2 className="text-lg font-bold uppercase tracking-wider text-white">Console Operations</h2>
          
          <GlassCard hoverEffect={false} animate={false} className="border-white-pure/5 flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-white uppercase border-b border-white-pure/5 pb-2 mb-2">
              Fast Control Shortcuts
            </h3>
            
            <Link href="/admin/schools" className="flex items-center justify-between p-3 rounded-xl bg-navy-deep/60 border border-white-pure/5 hover:border-gold-primary/30 transition-all group">
              <div className="flex items-center gap-3">
                <SchoolIcon size={16} className="text-gold-primary" />
                <span className="text-xs font-bold text-white">Add/Edit Schools</span>
              </div>
              <ChevronRight size={14} className="text-white-muted group-hover:text-gold-primary transition-colors" />
            </Link>

            <Link href="/admin/products" className="flex items-center justify-between p-3 rounded-xl bg-navy-deep/60 border border-white-pure/5 hover:border-gold-primary/30 transition-all group">
              <div className="flex items-center gap-3">
                <ShoppingBag size={16} className="text-gold-primary" />
                <span className="text-xs font-bold text-white">Add/Edit Products</span>
              </div>
              <ChevronRight size={14} className="text-white-muted group-hover:text-gold-primary transition-colors" />
            </Link>

            <Link href="/admin/orders" className="flex items-center justify-between p-3 rounded-xl bg-navy-deep/60 border border-white-pure/5 hover:border-gold-primary/30 transition-all group">
              <div className="flex items-center gap-3">
                <ClipboardList size={16} className="text-gold-primary" />
                <span className="text-xs font-bold text-white">Review Pending Orders</span>
              </div>
              <ChevronRight size={14} className="text-white-muted group-hover:text-gold-primary transition-colors" />
            </Link>

            <div className="flex gap-2 p-3.5 rounded-xl border border-gold-primary/10 bg-gold-primary/[0.01] text-xs text-white-muted mt-2">
              <Clock size={16} className="shrink-0 text-gold-primary" />
              <span>
                All database modifications will instantly persist to local storage cache.
              </span>
            </div>

          </GlassCard>
        </div>

      </div>

    </div>
  );
}
