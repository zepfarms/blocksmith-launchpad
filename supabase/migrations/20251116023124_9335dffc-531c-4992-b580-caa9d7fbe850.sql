-- Add business_type column to user_businesses table
ALTER TABLE public.user_businesses 
ADD COLUMN business_type text CHECK (business_type IN ('existing', 'new'));