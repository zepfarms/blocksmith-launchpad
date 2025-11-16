-- Populate block_categories table with all categories used in affiliate_blocks
INSERT INTO block_categories (name, description, display_order)
VALUES 
  ('Foundation', 'Core business foundation tools', 1),
  ('Business Formation & Legal', 'Legal structure and compliance', 2),
  ('Business Banking', 'Banking and financial services', 3),
  ('Accounting & Finance', 'Financial management and accounting', 4),
  ('Brand', 'Branding and design tools', 5),
  ('Development & Infrastructure', 'Technical development and hosting', 6),
  ('AI & Automation', 'AI-powered automation tools', 7),
  ('Marketing & Sales', 'Marketing and sales tools', 8),
  ('E-commerce Platforms', 'Online store platforms', 9),
  ('Growth', 'Business growth and scaling', 10),
  ('Partnership', 'Partnership opportunities', 11)
ON CONFLICT (name) DO NOTHING;

-- Consolidate duplicate category name
UPDATE affiliate_blocks 
SET category = 'Accounting & Finance' 
WHERE category = 'Finance & Accounting';