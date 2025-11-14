-- Add Business Name Generator block as FREE
INSERT INTO blocks_pricing (block_name, is_free, pricing_type, description, price_cents, monthly_price_cents)
VALUES ('Business Name Generator', true, 'free', 'AI-powered business name generation with 20 creative suggestions', 0, 0)
ON CONFLICT (block_name) DO NOTHING;

-- Add to Foundation category
INSERT INTO block_category_assignments (block_name, category_id)
SELECT 'Business Name Generator', id 
FROM block_categories 
WHERE name = 'Foundation'
ON CONFLICT DO NOTHING;