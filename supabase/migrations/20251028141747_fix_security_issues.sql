/*
  # Fix Database Security and Performance Issues

  ## Overview
  This migration addresses security and performance issues identified in the database audit.

  ## Changes Made

  ### 1. Add Missing Index
    - Add index on `order_items.product_id` foreign key for optimal query performance

  ### 2. Remove Unused Indexes
    - Drop `idx_products_is_featured` (unused)
    - Drop `idx_products_is_available` (unused)
    - Drop `idx_orders_customer_email` (unused)
    - Drop `idx_orders_order_number` (unused)
    - Drop `idx_order_items_order_id` (unused)
    - Drop `idx_reviews_is_approved` (unused)

  ### 3. Fix Function Security Issue
    - Recreate `update_updated_at_column` function with immutable search_path
    - This prevents potential security vulnerabilities from search_path manipulation

  ## Important Notes
  1. Indexes are dropped because they are currently unused and add overhead
  2. Indexes can be recreated later if usage patterns change
  3. The function security fix prevents SQL injection via search_path
*/

-- Add missing index for order_items.product_id foreign key
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Drop unused indexes to reduce maintenance overhead
DROP INDEX IF EXISTS idx_products_is_featured;
DROP INDEX IF EXISTS idx_products_is_available;
DROP INDEX IF EXISTS idx_orders_customer_email;
DROP INDEX IF EXISTS idx_orders_order_number;
DROP INDEX IF EXISTS idx_order_items_order_id;
DROP INDEX IF EXISTS idx_reviews_is_approved;

-- Drop existing triggers before dropping function
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
DROP TRIGGER IF EXISTS update_cart_items_updated_at ON cart_items;
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;

-- Drop and recreate function with secure search_path
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate triggers
CREATE TRIGGER update_categories_updated_at 
  BEFORE UPDATE ON categories
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at 
  BEFORE UPDATE ON products
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at 
  BEFORE UPDATE ON cart_items
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at 
  BEFORE UPDATE ON orders
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
