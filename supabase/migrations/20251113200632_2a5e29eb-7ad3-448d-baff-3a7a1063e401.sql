-- Add email_verified column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email_verified boolean NOT NULL DEFAULT false;

-- Backfill existing users to true so they aren't blocked
UPDATE public.profiles 
SET email_verified = true 
WHERE email_verified = false;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email_verified 
ON public.profiles(email_verified);

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.email_verified IS 'Whether the user has verified their email address via verification code';