-- Add description column to blocks_pricing table
ALTER TABLE public.blocks_pricing ADD COLUMN IF NOT EXISTS description TEXT;