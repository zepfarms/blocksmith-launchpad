-- Rename "Name & Logo" to "Logo Generator" in blocks_pricing
UPDATE blocks_pricing 
SET block_name = 'Logo Generator',
    description = 'AI-powered professional logo design and generation',
    updated_at = now()
WHERE block_name = 'Name & Logo';

-- Update category assignments to use new name
UPDATE block_category_assignments
SET block_name = 'Logo Generator'
WHERE block_name = 'Name & Logo';

-- Delete all other blocks from pricing (keep only Logo Generator)
DELETE FROM blocks_pricing 
WHERE block_name != 'Logo Generator';

-- Delete all other category assignments (keep only Logo Generator)
DELETE FROM block_category_assignments 
WHERE block_name != 'Logo Generator';