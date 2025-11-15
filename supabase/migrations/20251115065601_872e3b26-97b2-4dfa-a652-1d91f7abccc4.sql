-- Add completion_status to user_block_unlocks table
ALTER TABLE public.user_block_unlocks 
ADD COLUMN completion_status TEXT NOT NULL DEFAULT 'not_started';

-- Add check constraint to ensure valid values
ALTER TABLE public.user_block_unlocks 
ADD CONSTRAINT completion_status_check 
CHECK (completion_status IN ('not_started', 'in_progress', 'completed'));

-- Create index for faster queries on completion_status
CREATE INDEX idx_user_block_unlocks_completion_status 
ON public.user_block_unlocks(user_id, completion_status);