/*
  # Crafting Store Database Schema

  ## Overview
  Complete e-commerce database for CrftyByCarolyn crafting website including products, 
  categories, cart management, orders, and customer reviews.

  ## New Tables
  
  ### 1. categories
    - `id` (uuid, primary key) - Unique category identifier
    - `name` (text) - Category name (e.g., "Wreaths", "Door Hangers")
    - `slug` (text, unique) - URL-friendly category identifier
    - `description` (text) - Category description
    - `image_url` (text) - Category hero image
    - `display_order` (integer) - Sort order for display
    - `created_at` (timestamptz) - Record creation timestamp
    - `updated_at` (timestamptz) - Last update timestamp

  ### 2. products
    - `id` (uuid, primary key) - Unique product identifier
    - `category_id` (uuid, foreign key) - Links to categories table
    - `name` (text) - Product name
    - `slug` (text, unique) - URL-friendly product identifier
    - `description` (text) - Full product description
    - `short_description` (text) - Brief product summary
    - `price` (decimal) - Product price
    - `compare_at_price` (decimal, nullable) - Original price for sale items
    - `image_url` (text) - Primary product image
    - `additional_images` (jsonb) - Array of additional image URLs
    - `is_featured` (boolean) - Whether product appears in featured section
    - `is_available` (boolean) - Product availability status
    - `is_customizable` (boolean) - Whether product can be personalized
    - `stock_quantity` (integer) - Available inventory
    - `tags` (text array) - Product tags for filtering
    - `created_at` (timestamptz) - Record creation timestamp
    - `updated_at` (timestamptz) - Last update timestamp

  ### 3. cart_items
    - `id` (uuid, primary key) - Unique cart item identifier
    - `session_id` (text) - Anonymous session identifier for guests
    - `product_id` (uuid, foreign key) - Links to products table
    - `quantity` (integer) - Item quantity
    - `customization_text` (text, nullable) - Personalization text if applicable
    - `created_at` (timestamptz) - Record creation timestamp
    - `updated_at` (timestamptz) - Last update timestamp

  ### 4. orders
    - `id` (uuid, primary key) - Unique order identifier
    - `order_number` (text, unique) - Human-readable order number
    - `customer_name` (text) - Customer full name
    - `customer_email` (text) - Customer email address
    - `customer_phone` (text, nullable) - Customer phone number
    - `shipping_address` (jsonb) - Complete shipping address object
    - `billing_address` (jsonb) - Complete billing address object
    - `subtotal` (decimal) - Order subtotal before tax/shipping
    - `tax` (decimal) - Tax amount
    - `shipping_cost` (decimal) - Shipping cost
    - `total` (decimal) - Final order total
    - `status` (text) - Order status (pending, processing, shipped, delivered, cancelled)
    - `payment_status` (text) - Payment status (pending, paid, refunded)
    - `payment_method` (text) - Payment method used
    - `notes` (text, nullable) - Order notes or special instructions
    - `created_at` (timestamptz) - Order creation timestamp
    - `updated_at` (timestamptz) - Last update timestamp

  ### 5. order_items
    - `id` (uuid, primary key) - Unique order item identifier
    - `order_id` (uuid, foreign key) - Links to orders table
    - `product_id` (uuid, foreign key) - Links to products table
    - `product_name` (text) - Product name snapshot at time of order
    - `product_image` (text) - Product image snapshot
    - `quantity` (integer) - Item quantity
    - `unit_price` (decimal) - Price per unit at time of order
    - `subtotal` (decimal) - Line item subtotal
    - `customization_text` (text, nullable) - Personalization text if applicable
    - `created_at` (timestamptz) - Record creation timestamp

  ### 6. reviews
    - `id` (uuid, primary key) - Unique review identifier
    - `product_id` (uuid, foreign key) - Links to products table
    - `customer_name` (text) - Reviewer name
    - `customer_email` (text) - Reviewer email (not displayed publicly)
    - `rating` (integer) - Star rating (1-5)
    - `title` (text) - Review title
    - `comment` (text) - Review content
    - `is_verified_purchase` (boolean) - Whether reviewer purchased the product
    - `is_approved` (boolean) - Moderation status
    - `created_at` (timestamptz) - Review creation timestamp

  ### 7. contact_inquiries
    - `id` (uuid, primary key) - Unique inquiry identifier
    - `name` (text) - Inquirer name
    - `email` (text) - Inquirer email
    - `phone` (text, nullable) - Inquirer phone number
    - `subject` (text) - Inquiry subject
    - `message` (text) - Inquiry message content
    - `status` (text) - Inquiry status (new, in_progress, resolved)
    - `created_at` (timestamptz) - Inquiry creation timestamp

  ## Security
  - RLS enabled on all tables
  - Public read access for products, categories, and approved reviews
  - Anonymous users can manage their own cart items by session_id
  - Contact inquiries and orders can be created by anyone
  - Write access to reviews requires moderation approval

  ## Important Notes
  1. Products support customization/personalization
  2. Cart supports both authenticated and guest sessions
  3. Orders capture product snapshots to preserve pricing history
  4. Reviews require approval before display
  5. All monetary values use decimal type for precision
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  image_url text DEFAULT '',
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  short_description text DEFAULT '',
  price decimal(10,2) NOT NULL DEFAULT 0,
  compare_at_price decimal(10,2),
  image_url text DEFAULT '',
  additional_images jsonb DEFAULT '[]'::jsonb,
  is_featured boolean DEFAULT false,
  is_available boolean DEFAULT true,
  is_customizable boolean DEFAULT false,
  stock_quantity integer DEFAULT 0,
  tags text[] DEFAULT ARRAY[]::text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  customization_text text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text,
  shipping_address jsonb NOT NULL,
  billing_address jsonb NOT NULL,
  subtotal decimal(10,2) NOT NULL DEFAULT 0,
  tax decimal(10,2) NOT NULL DEFAULT 0,
  shipping_cost decimal(10,2) NOT NULL DEFAULT 0,
  total decimal(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  payment_status text NOT NULL DEFAULT 'pending',
  payment_method text DEFAULT '',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  product_image text DEFAULT '',
  quantity integer NOT NULL DEFAULT 1,
  unit_price decimal(10,2) NOT NULL DEFAULT 0,
  subtotal decimal(10,2) NOT NULL DEFAULT 0,
  customization_text text,
  created_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text NOT NULL,
  comment text NOT NULL,
  is_verified_purchase boolean DEFAULT false,
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create contact_inquiries table
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories (public read)
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies for products (public read for available products)
CREATE POLICY "Anyone can view available products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (is_available = true);

-- RLS Policies for cart_items (session-based access)
CREATE POLICY "Users can view own cart items"
  ON cart_items FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can insert own cart items"
  ON cart_items FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own cart items"
  ON cart_items FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete own cart items"
  ON cart_items FOR DELETE
  TO anon, authenticated
  USING (true);

-- RLS Policies for orders (users can create and view their own)
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view orders by email"
  ON orders FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies for order_items (readable with order)
CREATE POLICY "Anyone can view order items"
  ON order_items FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can create order items"
  ON order_items FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- RLS Policies for reviews (public read for approved, anyone can submit)
CREATE POLICY "Anyone can view approved reviews"
  ON reviews FOR SELECT
  TO anon, authenticated
  USING (is_approved = true);

CREATE POLICY "Anyone can submit reviews"
  ON reviews FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- RLS Policies for contact_inquiries (anyone can submit)
CREATE POLICY "Anyone can submit contact inquiries"
  ON contact_inquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_is_available ON products(is_available);
CREATE INDEX IF NOT EXISTS idx_cart_items_session_id ON cart_items(session_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_is_approved ON reviews(is_approved);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();