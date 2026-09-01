-- Row Level Security (RLS) policies for e-commerce schema
-- Enable RLS and add per-table policies

-- NOTE: For admin actions, set a JWT claim `role='admin'` and adjust policies accordingly.

-- Helper: Enable RLS on tables and create example policies

-- Profiles
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS profiles_select ON public.profiles
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY IF NOT EXISTS profiles_insert ON public.profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY IF NOT EXISTS profiles_update ON public.profiles
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Addresses
ALTER TABLE IF EXISTS public.addresses ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS addresses_select ON public.addresses
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY IF NOT EXISTS addresses_insert ON public.addresses
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY IF NOT EXISTS addresses_update ON public.addresses
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY IF NOT EXISTS addresses_delete ON public.addresses
  FOR DELETE USING (user_id = auth.uid());

-- Cart items
ALTER TABLE IF EXISTS public.cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS cart_items_select ON public.cart_items
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY IF NOT EXISTS cart_items_insert ON public.cart_items
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY IF NOT EXISTS cart_items_update ON public.cart_items
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY IF NOT EXISTS cart_items_delete ON public.cart_items
  FOR DELETE USING (user_id = auth.uid());

-- Orders
ALTER TABLE IF EXISTS public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS orders_select ON public.orders
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY IF NOT EXISTS orders_insert ON public.orders
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY IF NOT EXISTS orders_update ON public.orders
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Order items: allow access only if parent order belongs to auth.uid()
ALTER TABLE IF EXISTS public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS order_items_select ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders o WHERE o.id = public.order_items.order_id AND o.user_id = auth.uid()
    )
  );
CREATE POLICY IF NOT EXISTS order_items_insert ON public.order_items
  FOR INSERT USING (true) WITH CHECK (true); -- inserts are mediated by server-side routines

-- Payments
ALTER TABLE IF EXISTS public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS payments_select ON public.payments
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY IF NOT EXISTS payments_insert ON public.payments
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Payment events: server-side only, no direct client access
ALTER TABLE IF EXISTS public.payment_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS payment_events_server_only ON public.payment_events
  FOR ALL USING (current_setting('jwt.claims.role', true) = 'service' OR current_setting('jwt.claims.role', true) = 'admin');

-- Wishlists
ALTER TABLE IF EXISTS public.wishlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS wishlists_select ON public.wishlists
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY IF NOT EXISTS wishlists_insert ON public.wishlists
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY IF NOT EXISTS wishlists_delete ON public.wishlists
  FOR DELETE USING (user_id = auth.uid());

-- Reviews: allow select for all, insert/update/delete only for owner
ALTER TABLE IF EXISTS public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS reviews_select_public ON public.reviews
  FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS reviews_insert ON public.reviews
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY IF NOT EXISTS reviews_update ON public.reviews
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY IF NOT EXISTS reviews_delete ON public.reviews
  FOR DELETE USING (user_id = auth.uid());

-- Email OTPs and password_resets: server-side only
ALTER TABLE IF EXISTS public.email_otps ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS email_otps_server_only ON public.email_otps
  FOR ALL USING (current_setting('jwt.claims.role', true) = 'service' OR current_setting('jwt.claims.role', true) = 'admin');

ALTER TABLE IF EXISTS public.password_resets ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS password_resets_server_only ON public.password_resets
  FOR ALL USING (current_setting('jwt.claims.role', true) = 'service' OR current_setting('jwt.claims.role', true) = 'admin');

-- Notifications: user-only
ALTER TABLE IF EXISTS public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS notifications_select ON public.notifications
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY IF NOT EXISTS notifications_insert_server ON public.notifications
  FOR INSERT USING (current_setting('jwt.claims.role', true) = 'service' OR current_setting('jwt.claims.role', true) = 'admin');

-- Products and categories: public SELECT, admin-only write
ALTER TABLE IF EXISTS public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS products_select_public ON public.products
  FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS products_admin_write ON public.products
  FOR ALL USING (current_setting('jwt.claims.role', true) = 'admin');

ALTER TABLE IF EXISTS public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS categories_select_public ON public.categories
  FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS categories_admin_write ON public.categories
  FOR ALL USING (current_setting('jwt.claims.role', true) = 'admin');

-- Notes:
-- 1) For admin-managed actions, add `role` claim to service JWT or use service_role key server-side.
-- 2) Keep webhook and payment processing on server-side with elevated privileges (use service_role key).
-- 3) The policies above are minimal examples; review and harden them before production.
