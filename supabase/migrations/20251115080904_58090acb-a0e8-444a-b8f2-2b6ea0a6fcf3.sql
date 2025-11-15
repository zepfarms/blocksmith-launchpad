-- Add missing free blocks to blocks_pricing table
INSERT INTO blocks_pricing (block_name, is_free, pricing_type, price_cents, monthly_price_cents, description)
VALUES 
  ('Business Plan Generator', true, 'free', 0, 0, 'Generate a real downloaded PDF business plan for your business just by answering a few questions'),
  ('Social Media Handle Checker', true, 'free', 0, 0, 'Check availability of your business name across all major social platforms'),
  ('QR Code Generator', true, 'free', 0, 0, 'Generate customizable QR codes for websites URLs contact info WiFi and more with download options'),
  ('Professional Email Signature', true, 'free', 0, 0, 'Create professional HTML email signatures with custom branding social links and contact info for all email clients')
ON CONFLICT (block_name) DO UPDATE SET
  is_free = EXCLUDED.is_free,
  pricing_type = EXCLUDED.pricing_type,
  description = EXCLUDED.description;