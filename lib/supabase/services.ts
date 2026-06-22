// Supabase Live Database Services for Chinky Garments
// Connects to Supabase tables matching the schema definitions in schema.sql.

import { School, Product, Order, Review, GalleryItem } from '@/types/database';
import { supabase } from './client';

export const dbService = {
  // SCHOOLS
  async getSchools(): Promise<School[]> {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Error fetching schools from Supabase:', error);
      return [];
    }
    return data || [];
  },

  async getSchoolBySlug(slug: string): Promise<School | null> {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      console.error(`Error fetching school with slug ${slug}:`, error);
      return null;
    }
    return data;
  },

  async addSchool(school: Omit<School, 'id' | 'created_at'>): Promise<School> {
    const { data, error } = await supabase
      .from('schools')
      .insert(school)
      .select()
      .single();

    if (error) {
      console.error('Error adding school to Supabase:', error);
      throw error;
    }
    return data;
  },

  async updateSchool(id: string, updatedData: Partial<School>): Promise<School> {
    const { id: _, created_at: __, ...payload } = updatedData as any;
    const { data, error } = await supabase
      .from('schools')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating school ${id} in Supabase:`, error);
      throw error;
    }
    return data;
  },

  async deleteSchool(id: string): Promise<void> {
    const { error } = await supabase
      .from('schools')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting school ${id} from Supabase:`, error);
      throw error;
    }
  },

  // PRODUCTS
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products from Supabase:', error);
      return [];
    }
    return data || [];
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      console.error(`Error fetching product with slug ${slug}:`, error);
      return null;
    }
    return data;
  },

  async getProductsBySchool(schoolId: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('school_id', schoolId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Error fetching products for school ${schoolId}:`, error);
      return [];
    }
    return data || [];
  },

  async getFeaturedProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching featured products from Supabase:', error);
      return [];
    }
    return data || [];
  },

  async addProduct(product: Omit<Product, 'id' | 'created_at'>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();

    if (error) {
      console.error('Error adding product to Supabase:', error);
      throw error;
    }
    return data;
  },

  async updateProduct(id: string, updatedData: Partial<Product>): Promise<Product> {
    const { id: _, created_at: __, ...payload } = updatedData as any;
    const { data, error } = await supabase
      .from('products')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating product ${id} in Supabase:`, error);
      throw error;
    }
    return data;
  },

  async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting product ${id} from Supabase:`, error);
      throw error;
    }
  },

  // REVIEWS
  async getReviews(schoolId?: string, productId?: string): Promise<Review[]> {
    let query = supabase.from('reviews').select('*');

    if (schoolId) {
      query = query.eq('school_id', schoolId).eq('is_approved', true);
    } else if (productId) {
      query = query.eq('product_id', productId).eq('is_approved', true);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews from Supabase:', error);
      return [];
    }
    return data || [];
  },

  async addReview(review: Omit<Review, 'id' | 'created_at' | 'is_approved'>): Promise<Review> {
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        ...review,
        is_approved: false
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding review to Supabase:', error);
      throw error;
    }
    return data;
  },

  async approveReview(id: string): Promise<Review> {
    const { data, error } = await supabase
      .from('reviews')
      .update({ is_approved: true })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error approving review ${id} in Supabase:`, error);
      throw error;
    }
    return data;
  },

  async deleteReview(id: string): Promise<void> {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting review ${id} from Supabase:`, error);
      throw error;
    }
  },

  // GALLERY
  async getGallery(): Promise<GalleryItem[]> {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching gallery items from Supabase:', error);
      return [];
    }
    return data || [];
  },

  async addGalleryItem(item: Omit<GalleryItem, 'id' | 'created_at'>): Promise<GalleryItem> {
    const { data, error } = await supabase
      .from('gallery')
      .insert(item)
      .select()
      .single();

    if (error) {
      console.error('Error adding gallery item to Supabase:', error);
      throw error;
    }
    return data;
  },

  // ORDERS
  async getOrders(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders from Supabase:', error);
      return [];
    }
    return data || [];
  },

  async createOrder(orderData: Omit<Order, 'id' | 'order_number' | 'created_at' | 'status'>): Promise<Order> {
    const orderNum = 'CG-' + Math.floor(1000 + Math.random() * 9000).toString();
    const { data, error } = await supabase
      .from('orders')
      .insert({
        ...orderData,
        order_number: orderNum,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating order in Supabase:', error);
      throw error;
    }
    return data;
  },

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating order status ${id} in Supabase:`, error);
      throw error;
    }
    return data;
  },

  async deleteOrder(id: string): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting order ${id} from Supabase:`, error);
      throw error;
    }
  },

  // MEDIA UPLOADER (using the user's chinky-media bucket)
  async uploadImage(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { data, error } = await supabase.storage
      .from('chinky-media')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading image to Supabase Storage:', error);
      throw error;
    }

    const { data: publicUrlData } = supabase.storage
      .from('chinky-media')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  }
};
