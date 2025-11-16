-- Add constraint to prevent empty category values in affiliate_blocks
ALTER TABLE affiliate_blocks 
ADD CONSTRAINT category_not_empty 
CHECK (category IS NOT NULL AND trim(category) != '');

-- Also ensure the column is NOT NULL
ALTER TABLE affiliate_blocks 
ALTER COLUMN category SET NOT NULL;