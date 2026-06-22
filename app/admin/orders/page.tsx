"use client";

import React, { useState, useEffect } from 'react';
import { dbService } from '@/lib/supabase/services';
import { Order } from '@/types/database';
import { GlassCard } from '@/components/ui/glass-card';
import { InteractiveButton } from '@/components/ui/interactive-button';
import { Search, ClipboardList, Trash2, CheckCircle2, MessageCircle, X, RefreshCw, Eye } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Selected Order Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    const data = await dbService.getOrders();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
    await dbService.updateOrderStatus(orderId, newStatus);
    fetchOrders();
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (confirm('Are you sure you want to delete this order inquiry? This cannot be undone.')) {
      await dbService.deleteOrder(id);
      fetchOrders();
      setSelectedOrder(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_phone.includes(searchQuery);

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleWhatsAppContact = (order: Order) => {
    const message = `Hi ${order.customer_name}, this is Chinky Garments regarding your order inquiry ${order.order_number}. We are processing your request for uniform components. How can we help you complete the dispatch details?`;
    const whatsappUrl = `https://wa.me/${order.customer_phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black uppercase text-white tracking-wide">Orders & Inquiries Queue</h1>
        <p className="text-sm text-white-muted">Review, organize, and update customer inquiries compiled from WhatsApp links.</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 glass rounded-2xl border-white-pure/5">
        <div className="w-full sm:max-w-xs flex items-center px-3 py-2 bg-navy-deep/60 border border-white-pure/10 rounded-xl focus-within:border-gold-primary/40 transition-colors">
          <Search size={16} className="text-white-muted mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search order #, customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-0 outline-none text-white text-xs py-1 placeholder-white-muted/50"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto shrink-0 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {['all', 'pending', 'processing', 'delivered', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`text-xs font-semibold px-3.5 py-2 rounded-xl border transition-all shrink-0 capitalize ${
                statusFilter === status
                  ? 'bg-gold-primary text-navy-deep border-gold-primary shadow-gold-glow'
                  : 'bg-navy-light/40 text-white-soft border-white-pure/5 hover:border-white-pure/20'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-white-muted">
          <RefreshCw size={36} className="animate-spin text-gold-primary" />
          <p className="text-sm font-semibold">Refreshing orders pipeline...</p>
        </div>
      ) : filteredOrders.length > 0 ? (
        <GlassCard hoverEffect={false} animate={false} className="border-white-pure/5 p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white-pure/5 text-[10px] uppercase tracking-wider text-white-muted bg-white-pure/[0.01]">
                  <th className="p-4 font-bold">Inquiry #</th>
                  <th className="p-4 font-bold">Customer Details</th>
                  <th className="p-4 font-bold">Items Count</th>
                  <th className="p-4 font-bold">Total Amount</th>
                  <th className="p-4 font-bold">Inquiry Status</th>
                  <th className="p-4 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white-pure/5 text-sm text-white-soft">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white-pure/[0.01] transition-colors">
                    <td className="p-4 font-black text-gold-primary">{order.order_number}</td>
                    <td className="p-4">
                      <div className="font-bold text-white">{order.customer_name}</div>
                      <div className="text-xs text-white-muted mt-0.5">{order.customer_phone}</div>
                    </td>
                    <td className="p-4 font-semibold">
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                    </td>
                    <td className="p-4 font-black text-white">₹{order.total_amount}</td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value as any)}
                        className={`text-xs font-black uppercase tracking-wider p-1.5 rounded bg-navy-deep border outline-none ${
                          order.status === 'delivered' ? 'text-emerald-400 border-emerald-400/20' :
                          order.status === 'processing' ? 'text-blue-400 border-blue-400/20' :
                          order.status === 'cancelled' ? 'text-red-400 border-red-400/20' :
                          'text-orange-400 border-orange-400/20'
                        }`}
                      >
                        <option value="pending" className="text-orange-400 bg-navy-dark">Pending</option>
                        <option value="processing" className="text-blue-400 bg-navy-dark">Processing</option>
                        <option value="delivered" className="text-emerald-400 bg-navy-dark">Delivered</option>
                        <option value="cancelled" className="text-red-400 bg-navy-dark">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <InteractiveButton
                          variant="secondary"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 rounded-lg"
                          title="View Details"
                        >
                          <Eye size={14} />
                        </InteractiveButton>
                        <InteractiveButton
                          variant="secondary"
                          size="sm"
                          onClick={() => handleWhatsAppContact(order)}
                          className="p-2 rounded-lg text-emerald-400 hover:text-emerald-300 border-emerald-500/10"
                          title="Contact via WhatsApp"
                        >
                          <MessageCircle size={14} />
                        </InteractiveButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      ) : (
        <GlassCard className="py-20 text-center flex flex-col items-center max-w-xl mx-auto border-white-pure/5">
          <ClipboardList size={48} className="text-white-muted opacity-40 mb-4 animate-bounce" />
          <h3 className="text-lg font-bold text-white uppercase">Queue is empty</h3>
          <p className="text-sm text-white-muted mt-2">
            No order inquiries matched your current filters.
          </p>
        </GlassCard>
      )}

      {/* ================= ORDER DETAIL DIALOG OVERLAY ================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-navy-deep/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-navy-dark border border-gold-primary/20 rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-white-muted hover:text-white p-2"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 mb-6">
              <ClipboardList size={22} className="text-gold-primary" />
              <h2 className="text-2xl font-black uppercase text-white">
                Inquiry Details
              </h2>
              <span className="ml-auto text-sm font-black text-gold-primary bg-gold-primary/10 border border-gold-primary/25 px-2.5 py-1 rounded-lg">
                {selectedOrder.order_number}
              </span>
            </div>

            {/* Customer Details block */}
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-white-pure/5 text-xs">
              <div>
                <span className="font-bold text-white-muted block uppercase tracking-wider mb-1">Customer Name</span>
                <span className="text-sm font-bold text-white">{selectedOrder.customer_name}</span>
              </div>
              <div>
                <span className="font-bold text-white-muted block uppercase tracking-wider mb-1">Phone Number</span>
                <span className="text-sm font-bold text-white">{selectedOrder.customer_phone}</span>
              </div>
              <div className="col-span-2 mt-2">
                <span className="font-bold text-white-muted block uppercase tracking-wider mb-1">Shipping Address</span>
                <span className="text-sm text-white-soft leading-relaxed">{selectedOrder.shipping_address}</span>
              </div>
            </div>

            {/* Items list */}
            <div className="py-4">
              <span className="font-bold text-xs text-white-muted uppercase tracking-wider block mb-3">Order Composition</span>
              <div className="flex flex-col gap-2.5 max-h-40 overflow-y-auto">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-navy-deep/60 border border-white-pure/5 rounded-xl p-3 text-xs">
                    <div>
                      <span className="font-bold text-white block">{item.name}</span>
                      <span className="text-white-muted mt-1 block">Size: {item.size} • Qty: {item.quantity}</span>
                    </div>
                    <div className="font-bold text-white text-right">
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Row */}
            <div className="flex justify-between items-center py-4 border-y border-white-pure/5">
              <span className="font-bold text-sm text-white-soft uppercase tracking-wider">Total amount calculated:</span>
              <span className="text-xl font-black text-gold-primary shadow-gold-glow-hover">₹{selectedOrder.total_amount}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-6">
              <InteractiveButton
                variant="gold"
                size="sm"
                onClick={() => handleWhatsAppContact(selectedOrder)}
                className="w-1/2 flex items-center justify-center gap-1.5"
              >
                <MessageCircle size={16} /> Contact via WA
              </InteractiveButton>
              <InteractiveButton
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteOrder(selectedOrder.id)}
                className="w-1/2 text-red-400 hover:text-red-300 hover:bg-red-500/5 border border-red-500/10"
              >
                Delete Record
              </InteractiveButton>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
