-- Phase 1: Database Schema for One-Time + Monthly Pricing System

-- 1. Update blocks_pricing table with new pricing structure
ALTER TABLE blocks_pricing 
ADD COLUMN IF NOT EXISTS pricing_type text NOT NULL DEFAULT 'free' CHECK (pricing_type IN ('free', 'one_time', 'monthly')),
ADD COLUMN IF NOT EXISTS monthly_price_cents integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS stripe_product_id text,
ADD COLUMN IF NOT EXISTS stripe_monthly_price_id text;

-- Update existing blocks to have proper pricing_type based on current data
UPDATE blocks_pricing 
SET pricing_type = CASE 
  WHEN is_free = true THEN 'free'
  WHEN price_cents > 0 THEN 'one_time'
  ELSE 'free'
END
WHERE pricing_type = 'free'; -- Only update if not already set

-- 2. Create user_subscriptions table to track individual subscription items
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  business_id uuid NOT NULL REFERENCES user_businesses(id) ON DELETE CASCADE,
  block_name text NOT NULL,
  stripe_subscription_id text NOT NULL,
  stripe_subscription_item_id text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid')),
  current_period_start timestamp with time zone NOT NULL,
  current_period_end timestamp with time zone NOT NULL,
  cancel_at_period_end boolean NOT NULL DEFAULT false,
  monthly_price_cents integer NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, block_name, stripe_subscription_id)
);

-- Enable RLS on user_subscriptions
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_subscriptions
CREATE POLICY "Users can view their own subscriptions"
  ON user_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions"
  ON user_subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions"
  ON user_subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all subscriptions"
  ON user_subscriptions FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at on user_subscriptions
CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 3. Create user_block_unlocks table to track access to blocks
CREATE TABLE IF NOT EXISTS user_block_unlocks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  business_id uuid NOT NULL REFERENCES user_businesses(id) ON DELETE CASCADE,
  block_name text NOT NULL,
  unlock_type text NOT NULL CHECK (unlock_type IN ('free', 'one_time_purchase', 'subscription')),
  unlocked_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone,
  subscription_id uuid REFERENCES user_subscriptions(id) ON DELETE SET NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, business_id, block_name)
);

-- Enable RLS on user_block_unlocks
ALTER TABLE user_block_unlocks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_block_unlocks
CREATE POLICY "Users can view their own unlocks"
  ON user_block_unlocks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own unlocks"
  ON user_block_unlocks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own unlocks"
  ON user_block_unlocks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own unlocks"
  ON user_block_unlocks FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all unlocks"
  ON user_block_unlocks FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 4. Update user_block_purchases table to track pricing type at purchase time
ALTER TABLE user_block_purchases
ADD COLUMN IF NOT EXISTS pricing_type text NOT NULL DEFAULT 'one_time',
ADD COLUMN IF NOT EXISTS business_id uuid REFERENCES user_businesses(id) ON DELETE CASCADE;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_business_id ON user_subscriptions(business_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_subscription_id ON user_subscriptions(stripe_subscription_id);

CREATE INDEX IF NOT EXISTS idx_user_block_unlocks_user_id ON user_block_unlocks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_block_unlocks_business_id ON user_block_unlocks(business_id);
CREATE INDEX IF NOT EXISTS idx_user_block_unlocks_expires_at ON user_block_unlocks(expires_at);

CREATE INDEX IF NOT EXISTS idx_user_block_purchases_business_id ON user_block_purchases(business_id);