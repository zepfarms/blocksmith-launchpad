-- Create subscription payment failures tracking table
CREATE TABLE public.subscription_payment_failures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subscription_id UUID NOT NULL REFERENCES public.user_subscriptions(id) ON DELETE CASCADE,
  stripe_invoice_id TEXT NOT NULL,
  failure_reason TEXT,
  attempt_count INTEGER NOT NULL DEFAULT 1,
  next_retry_date TIMESTAMP WITH TIME ZONE,
  resolved BOOLEAN NOT NULL DEFAULT false,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on subscription_payment_failures
ALTER TABLE public.subscription_payment_failures ENABLE ROW LEVEL SECURITY;

-- Users can view their own payment failures
CREATE POLICY "Users can view their own payment failures"
ON public.subscription_payment_failures
FOR SELECT
USING (auth.uid() = user_id);

-- System/authenticated users can insert payment failures
CREATE POLICY "System can insert payment failures"
ON public.subscription_payment_failures
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- System can update payment failures
CREATE POLICY "System can update payment failures"
ON public.subscription_payment_failures
FOR UPDATE
USING (auth.uid() = user_id);

-- Admins can view all payment failures
CREATE POLICY "Admins can view all payment failures"
ON public.subscription_payment_failures
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Enhance user_subscriptions table with payment tracking columns
ALTER TABLE public.user_subscriptions
ADD COLUMN last_payment_status TEXT DEFAULT 'succeeded',
ADD COLUMN payment_retry_count INTEGER DEFAULT 0,
ADD COLUMN grace_period_end TIMESTAMP WITH TIME ZONE;

-- Add index for querying failed payments
CREATE INDEX idx_subscription_payment_failures_user_id ON public.subscription_payment_failures(user_id);
CREATE INDEX idx_subscription_payment_failures_resolved ON public.subscription_payment_failures(resolved) WHERE resolved = false;
CREATE INDEX idx_user_subscriptions_payment_status ON public.user_subscriptions(last_payment_status) WHERE last_payment_status = 'failed';