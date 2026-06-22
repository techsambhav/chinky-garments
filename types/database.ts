// Database Types for Chinky Garments

export interface School {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  banner_url?: string;
  description?: string;
  address?: string;
  is_featured: boolean;
  is_government: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  compare_at_price?: number;
  images: string[];
  category: string; // e.g., 'Blazer', 'Shirt', 'Trouser', 'Skirt', 'Socks', 'Tie', 'Belt', 'Kids Wear', 'Government Uniform'
  school_id?: string | null;
  sizes: string[];
  size_prices?: Record<string, number>;
  stock_status: 'in_stock' | 'low_stock' | 'out_of_stock';
  is_featured: boolean;
  is_government_uniform: boolean;
  is_kids_wear: boolean;
  is_most_selling: boolean;
  created_at: string;
}

export interface OrderItem {
  product_id: string;
  name: string;
  size: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  created_at: string;
}

export interface Review {
  id: string;
  customer_name: string;
  rating: number; // 1 to 5
  comment?: string;
  school_id?: string | null;
  product_id?: string | null;
  is_approved: boolean;
  created_at: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  image_url: string;
  category: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  role: 'admin' | 'customer';
  created_at: string;
}
