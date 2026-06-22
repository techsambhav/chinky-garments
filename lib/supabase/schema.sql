-- Supabase Database Schema for Chinky Garments
-- A Legacy of Trust, Powered by Jain Traders

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Drop existing tables to ensure clean rebuild with all columns (like slug)
drop table if exists public.reviews cascade;
drop table if exists public.products cascade;
drop table if exists public.schools cascade;
drop table if exists public.orders cascade;
drop table if exists public.gallery cascade;
drop table if exists public.users cascade;

-- 1. SCHOOLS TABLE
create table if not exists public.schools (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    slug text not null unique,
    logo_url text,
    banner_url text,
    description text,
    address text,
    is_featured boolean default false,
    is_government boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for school slug searches
create index if not exists schools_slug_idx on public.schools(slug);

-- 2. PRODUCTS TABLE
create table if not exists public.products (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    slug text not null unique,
    description text,
    price numeric(10, 2) not null,
    compare_at_price numeric(10, 2),
    images text[] not null default '{}',
    category text not null, -- 'Blazer', 'Shirt', 'Trouser', 'Skirt', 'Socks', 'Tie', 'Belt', 'Kids Wear', 'Government Uniform'
    school_id uuid references public.schools(id) on delete set null,
    sizes text[] not null default '{}', -- e.g., ['22', '24', '26', '28']
    stock_status text not null default 'in_stock', -- 'in_stock', 'low_stock', 'out_of_stock'
    is_featured boolean default false,
    is_government_uniform boolean default false,
    is_kids_wear boolean default false,
    is_most_selling boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes for products searches
create index if not exists products_slug_idx on public.products(slug);
create index if not exists products_school_id_idx on public.products(school_id);
create index if not exists products_category_idx on public.products(category);

-- 3. ORDERS TABLE
create table if not exists public.orders (
    id uuid default uuid_generate_v4() primary key,
    order_number text not null unique,
    customer_name text not null,
    customer_email text not null,
    customer_phone text not null,
    shipping_address text not null,
    total_amount numeric(10, 2) not null,
    status text not null default 'pending', -- 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
    items jsonb not null default '[]'::jsonb, -- Array of objects: {product_id, name, size, quantity, price}
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for orders listing
create index if not exists orders_order_number_idx on public.orders(order_number);
create index if not exists orders_created_at_idx on public.orders(created_at desc);

-- 4. REVIEWS TABLE
create table if not exists public.reviews (
    id uuid default uuid_generate_v4() primary key,
    customer_name text not null,
    rating integer check (rating >= 1 and rating <= 5) not null,
    comment text,
    school_id uuid references public.schools(id) on delete cascade,
    product_id uuid references public.products(id) on delete cascade,
    is_approved boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for reviews approvals
create index if not exists reviews_is_approved_idx on public.reviews(is_approved);

-- 5. GALLERY TABLE
create table if not exists public.gallery (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    image_url text not null,
    category text not null, -- 'Store', 'Manufacturing', 'Uniforms'
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. USERS TABLE
create table if not exists public.users (
    id uuid references auth.users(id) on delete cascade primary key,
    email text not null,
    role text not null default 'customer', -- 'admin', 'customer'
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS) policies placeholder
alter table public.schools enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.reviews enable row level security;
alter table public.gallery enable row level security;
alter table public.users enable row level security;

-- Public read policies
create policy "Allow public read access to schools" on public.schools for select using (true);
create policy "Allow public read access to products" on public.products for select using (true);
create policy "Allow public read access to reviews" on public.reviews for select using (is_approved = true);
create policy "Allow public read access to gallery" on public.gallery for select using (true);

-- Admin write policies (placeholder matching role = 'admin' in public.users)
create policy "Allow admin write access to schools" on public.schools for all 
    using (exists (select 1 from public.users where users.id = auth.uid() and users.role = 'admin'));

create policy "Allow admin write access to products" on public.products for all 
    using (exists (select 1 from public.users where users.id = auth.uid() and users.role = 'admin'));

create policy "Allow admin write access to gallery" on public.gallery for all 
    using (exists (select 1 from public.users where users.id = auth.uid() and users.role = 'admin'));

-- Order policies: public can insert, admin can do all
create policy "Allow public to insert orders" on public.orders for insert with check (true);
create policy "Allow admin full access to orders" on public.orders for all 
    using (exists (select 1 from public.users where users.id = auth.uid() and users.role = 'admin'));
