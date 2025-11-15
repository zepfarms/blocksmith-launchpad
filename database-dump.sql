-- ============================================================
-- COMPLETE DATABASE DUMP FOR MIGRATION
-- Generated from Lovable Cloud Supabase Project
-- ============================================================
-- This file contains:
-- 1. Extensions
-- 2. Custom Types (Enums)
-- 3. Tables Schema
-- 4. Functions
-- 5. Triggers
-- 6. Row Level Security Policies
-- 7. Storage Buckets
-- 8. Data Inserts
-- ============================================================

-- ============================================================
-- 1. EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";

-- ============================================================
-- 2. CUSTOM TYPES (ENUMS)
-- ============================================================
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- ============================================================
-- 3. TABLES SCHEMA
-- ============================================================

-- Profiles Table
CREATE TABLE public.profiles (
    id uuid PRIMARY KEY,
    email text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    email_verified boolean NOT NULL DEFAULT false
);

-- User Roles Table
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    role public.app_role NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE(user_id, role)
);

-- User Businesses Table
CREATE TABLE public.user_businesses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    business_idea text NOT NULL,
    business_name text NOT NULL,
    ai_analysis text,
    selected_blocks text[],
    status text DEFAULT 'building'::text,
    payment_status text DEFAULT 'pending'::text,
    stripe_session_id text,
    total_cost_cents integer DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Blocks Pricing Table
CREATE TABLE public.blocks_pricing (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    block_name text NOT NULL,
    description text,
    is_free boolean NOT NULL DEFAULT false,
    pricing_type text NOT NULL DEFAULT 'free'::text,
    price_cents integer NOT NULL DEFAULT 0,
    monthly_price_cents integer NOT NULL DEFAULT 0,
    stripe_product_id text,
    stripe_price_id text,
    stripe_monthly_price_id text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Block Categories Table
CREATE TABLE public.block_categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    display_order integer NOT NULL DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Block Category Assignments Table
CREATE TABLE public.block_category_assignments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    block_name text NOT NULL,
    category_id uuid NOT NULL REFERENCES public.block_categories(id),
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- User Block Unlocks Table
CREATE TABLE public.user_block_unlocks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    business_id uuid NOT NULL,
    block_name text NOT NULL,
    unlock_type text NOT NULL,
    subscription_id uuid,
    completion_status text NOT NULL DEFAULT 'not_started'::text,
    expires_at timestamp with time zone,
    unlocked_at timestamp with time zone NOT NULL DEFAULT now(),
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- User Block Purchases Table
CREATE TABLE public.user_block_purchases (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    business_id uuid,
    block_name text NOT NULL,
    pricing_type text NOT NULL DEFAULT 'one_time'::text,
    price_paid_cents integer NOT NULL,
    stripe_payment_intent_id text,
    purchased_at timestamp with time zone NOT NULL DEFAULT now()
);

-- User Subscriptions Table
CREATE TABLE public.user_subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    business_id uuid NOT NULL,
    block_name text NOT NULL,
    stripe_subscription_id text NOT NULL,
    stripe_subscription_item_id text NOT NULL,
    status text NOT NULL DEFAULT 'active'::text,
    monthly_price_cents integer NOT NULL,
    current_period_start timestamp with time zone NOT NULL,
    current_period_end timestamp with time zone NOT NULL,
    cancel_at_period_end boolean NOT NULL DEFAULT false,
    last_payment_status text DEFAULT 'succeeded'::text,
    payment_retry_count integer DEFAULT 0,
    grace_period_end timestamp with time zone,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- User Websites Table
CREATE TABLE public.user_websites (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    business_id uuid,
    template_id text NOT NULL,
    domain_name text NOT NULL,
    domain_verified boolean NOT NULL DEFAULT false,
    domain_owned_externally boolean NOT NULL DEFAULT false,
    domain_purchase_date timestamp with time zone,
    domain_expiry_date timestamp with time zone,
    status text NOT NULL DEFAULT 'draft'::text,
    customization_data jsonb NOT NULL DEFAULT '{}'::jsonb,
    site_content jsonb DEFAULT '{}'::jsonb,
    analytics_data jsonb DEFAULT '{}'::jsonb,
    cloudflare_pages_url text,
    cloudflare_deployment_id text,
    cloudflare_domain_id text,
    subscription_id uuid,
    one_time_fee_paid boolean DEFAULT false,
    edited_by_admin boolean DEFAULT false,
    last_admin_edit_at timestamp with time zone,
    admin_notes text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- User Domain Selections Table
CREATE TABLE public.user_domain_selections (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    business_id uuid NOT NULL,
    has_existing_domain boolean NOT NULL DEFAULT false,
    domain_name text,
    existing_website_url text,
    registered_via_acari boolean NOT NULL DEFAULT false,
    domain_status text NOT NULL DEFAULT 'pending'::text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- User Assets Table
CREATE TABLE public.user_assets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    business_id uuid NOT NULL,
    asset_type text NOT NULL,
    file_url text NOT NULL,
    thumbnail_url text,
    status text NOT NULL DEFAULT 'generated'::text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Logo Generation Sessions Table
CREATE TABLE public.logo_generation_sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    business_id uuid NOT NULL,
    generation_number integer DEFAULT 1,
    logo_urls text[],
    ai_prompt text,
    user_feedback text,
    created_at timestamp with time zone DEFAULT now()
);

-- Business Plans Table
CREATE TABLE public.business_plans (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    business_id uuid NOT NULL,
    questionnaire_data jsonb NOT NULL,
    generated_content jsonb NOT NULL,
    edited_content jsonb,
    status text DEFAULT 'draft'::text,
    version integer DEFAULT 1,
    finalized_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Email Verifications Table
CREATE TABLE public.email_verifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email citext NOT NULL,
    code text NOT NULL,
    expires_at timestamp with time zone NOT NULL DEFAULT (now() + '00:10:00'::interval),
    used boolean NOT NULL DEFAULT false,
    attempts integer NOT NULL DEFAULT 0,
    created_ip text,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Subscription Payment Failures Table
CREATE TABLE public.subscription_payment_failures (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    subscription_id uuid NOT NULL,
    stripe_invoice_id text NOT NULL,
    failure_reason text,
    attempt_count integer NOT NULL DEFAULT 1,
    next_retry_date timestamp with time zone,
    reminder_count integer DEFAULT 0,
    last_reminder_sent_at timestamp with time zone,
    resolved boolean NOT NULL DEFAULT false,
    resolved_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Admin Audit Log Table
CREATE TABLE public.admin_audit_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id uuid NOT NULL,
    customer_user_id uuid,
    website_id uuid,
    action_type text NOT NULL,
    changes_made jsonb,
    notes text,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- ============================================================
-- 4. FUNCTIONS
-- ============================================================

-- Function to check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$;

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================================
-- 5. TRIGGERS
-- ============================================================

-- Trigger for updating updated_at on profiles
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updating updated_at on user_businesses
CREATE TRIGGER update_user_businesses_updated_at
BEFORE UPDATE ON public.user_businesses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updating updated_at on blocks_pricing
CREATE TRIGGER update_blocks_pricing_updated_at
BEFORE UPDATE ON public.blocks_pricing
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updating updated_at on block_categories
CREATE TRIGGER update_block_categories_updated_at
BEFORE UPDATE ON public.block_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updating updated_at on user_subscriptions
CREATE TRIGGER update_user_subscriptions_updated_at
BEFORE UPDATE ON public.user_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updating updated_at on user_websites
CREATE TRIGGER update_user_websites_updated_at
BEFORE UPDATE ON public.user_websites
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updating updated_at on user_domain_selections
CREATE TRIGGER update_user_domain_selections_updated_at
BEFORE UPDATE ON public.user_domain_selections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updating updated_at on user_assets
CREATE TRIGGER update_user_assets_updated_at
BEFORE UPDATE ON public.user_assets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updating updated_at on business_plans
CREATE TRIGGER update_business_plans_updated_at
BEFORE UPDATE ON public.business_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 6. ROW LEVEL SECURITY POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocks_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.block_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.block_category_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_block_unlocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_block_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_domain_selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logo_generation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_payment_failures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- User Roles policies
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert roles" ON public.user_roles FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update roles" ON public.user_roles FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE USING (public.has_role(auth.uid(), 'admin'::app_role));

-- User Businesses policies
CREATE POLICY "Users can view their own business" ON public.user_businesses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own business" ON public.user_businesses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own business" ON public.user_businesses FOR UPDATE USING (auth.uid() = user_id);

-- Blocks Pricing policies
CREATE POLICY "Anyone can view block pricing" ON public.blocks_pricing FOR SELECT USING (true);
CREATE POLICY "Admins can insert block pricing" ON public.blocks_pricing FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update block pricing" ON public.blocks_pricing FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete block pricing" ON public.blocks_pricing FOR DELETE USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Block Categories policies
CREATE POLICY "Anyone can view categories" ON public.block_categories FOR SELECT USING (true);
CREATE POLICY "Admins can insert categories" ON public.block_categories FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update categories" ON public.block_categories FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete categories" ON public.block_categories FOR DELETE USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Block Category Assignments policies
CREATE POLICY "Anyone can view assignments" ON public.block_category_assignments FOR SELECT USING (true);
CREATE POLICY "Admins can insert assignments" ON public.block_category_assignments FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete assignments" ON public.block_category_assignments FOR DELETE USING (public.has_role(auth.uid(), 'admin'::app_role));

-- User Block Unlocks policies
CREATE POLICY "Users can view their own unlocks" ON public.user_block_unlocks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all unlocks" ON public.user_block_unlocks FOR SELECT USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can insert their own unlocks" ON public.user_block_unlocks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own unlocks" ON public.user_block_unlocks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own unlocks" ON public.user_block_unlocks FOR DELETE USING (auth.uid() = user_id);

-- User Block Purchases policies
CREATE POLICY "Users can view their own purchases" ON public.user_block_purchases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all purchases" ON public.user_block_purchases FOR SELECT USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "System can insert purchases" ON public.user_block_purchases FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User Subscriptions policies
CREATE POLICY "Users can view their own subscriptions" ON public.user_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all subscriptions" ON public.user_subscriptions FOR SELECT USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can insert their own subscriptions" ON public.user_subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own subscriptions" ON public.user_subscriptions FOR UPDATE USING (auth.uid() = user_id);

-- User Websites policies
CREATE POLICY "Users can view their own websites" ON public.user_websites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all websites" ON public.user_websites FOR SELECT USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can insert their own websites" ON public.user_websites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own websites" ON public.user_websites FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own websites" ON public.user_websites FOR DELETE USING (auth.uid() = user_id);

-- User Domain Selections policies
CREATE POLICY "Users can view their own domain selections" ON public.user_domain_selections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own domain selections" ON public.user_domain_selections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own domain selections" ON public.user_domain_selections FOR UPDATE USING (auth.uid() = user_id);

-- User Assets policies
CREATE POLICY "Users can view their own assets" ON public.user_assets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own assets" ON public.user_assets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own assets" ON public.user_assets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own assets" ON public.user_assets FOR DELETE USING (auth.uid() = user_id);

-- Logo Generation Sessions policies
CREATE POLICY "Users can view their own sessions" ON public.logo_generation_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own sessions" ON public.logo_generation_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Business Plans policies
CREATE POLICY "Users can view own plans" ON public.business_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own plans" ON public.business_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own plans" ON public.business_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own plans" ON public.business_plans FOR DELETE USING (auth.uid() = user_id);

-- Email Verifications policies
CREATE POLICY "Anyone can read verification rows" ON public.email_verifications FOR SELECT USING (true);
CREATE POLICY "Anyone can insert verification requests" ON public.email_verifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update verification rows" ON public.email_verifications FOR UPDATE USING (true);

-- Subscription Payment Failures policies
CREATE POLICY "Users can view their own payment failures" ON public.subscription_payment_failures FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all payment failures" ON public.subscription_payment_failures FOR SELECT USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "System can insert payment failures" ON public.subscription_payment_failures FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "System can update payment failures" ON public.subscription_payment_failures FOR UPDATE USING (auth.uid() = user_id);

-- Admin Audit Log policies
CREATE POLICY "Admins can view audit logs" ON public.admin_audit_log FOR SELECT USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert audit logs" ON public.admin_audit_log FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- ============================================================
-- 7. STORAGE BUCKETS
-- ============================================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('business-assets', 'business-assets', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('qr-codes', 'qr-codes', true);

-- Storage policies for business-assets
CREATE POLICY "Users can upload their own assets" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'business-assets' AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own assets" ON storage.objects FOR SELECT USING (
  bucket_id = 'business-assets' AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own assets" ON storage.objects FOR UPDATE USING (
  bucket_id = 'business-assets' AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own assets" ON storage.objects FOR DELETE USING (
  bucket_id = 'business-assets' AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Storage policies for qr-codes
CREATE POLICY "Public QR codes are viewable" ON storage.objects FOR SELECT USING (bucket_id = 'qr-codes');

CREATE POLICY "Users can upload QR codes" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'qr-codes' AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their QR codes" ON storage.objects FOR UPDATE USING (
  bucket_id = 'qr-codes' AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their QR codes" ON storage.objects FOR DELETE USING (
  bucket_id = 'qr-codes' AND auth.uid()::text = (storage.foldername(name))[1]
);

-- ============================================================
-- 8. DATA INSERTS (Will be populated from query results)
-- ============================================================
-- NOTE: Add your actual data here after querying from your database
-- The data section will be appended below based on your actual records

-- ============================================================
-- IMPORTANT NOTES FOR MIGRATION:
-- ============================================================
-- 1. You'll need to set up Auth in your new Supabase project
-- 2. Configure these environment variables in your app:
--    - VITE_SUPABASE_URL=your_new_supabase_url
--    - VITE_SUPABASE_PUBLISHABLE_KEY=your_new_anon_key
--    - VITE_SUPABASE_PROJECT_ID=your_new_project_id
--
-- 3. Required Secrets for Edge Functions:
--    - STRIPE_SECRET_KEY (for payment processing)
--    - RESEND_API_KEY (for emails)
--    - CLOUDFLARE_API_KEY (for domain/hosting)
--    - CLOUDFLARE_ACCOUNT_ID (for domain/hosting)
--    - LOVABLE_API_KEY (for AI features - you may need alternative)
--    - SUPABASE_SERVICE_ROLE_KEY (auto-generated in new project)
--
-- 4. Deploy all edge functions from supabase/functions/ directory
-- 5. Files in storage buckets need to be manually migrated
-- 6. Test authentication flow after migration
-- ============================================================
