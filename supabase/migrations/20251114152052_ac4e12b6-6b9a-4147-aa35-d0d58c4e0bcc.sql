-- Add columns to track reminder history in subscription_payment_failures
ALTER TABLE public.subscription_payment_failures
ADD COLUMN last_reminder_sent_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN reminder_count INTEGER DEFAULT 0;

-- Add index for querying reminder history
CREATE INDEX idx_subscription_payment_failures_last_reminder 
ON public.subscription_payment_failures(last_reminder_sent_at) 
WHERE resolved = false;

-- Add comment for documentation
COMMENT ON COLUMN public.subscription_payment_failures.last_reminder_sent_at 
IS 'Timestamp of when the last payment reminder email was sent to the user';

COMMENT ON COLUMN public.subscription_payment_failures.reminder_count 
IS 'Number of reminder emails sent for this payment failure';