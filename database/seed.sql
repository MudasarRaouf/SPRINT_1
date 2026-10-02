TRUNCATE assets, skus, variants, products, categories RESTART IDENTITY CASCADE;

INSERT INTO categories (name, slug) VALUES
('Men Clothing', 'men-clothing'),
('Women Clothing', 'women-clothing');

INSERT INTO categories (parent_id, name, slug)
VALUES
((SELECT id FROM categories WHERE slug='men-clothing'), 'T-Shirts', 'men-t-shirts'),
((SELECT id FROM categories WHERE slug='women-clothing'), 'Dresses', 'women-dresses');

INSERT INTO products (category_id, name, slug, description, status)
VALUES
((SELECT id FROM categories WHERE slug='men-t-shirts'),
 'Classic Cotton T-Shirt', 'classic-cotton-tshirt',
 'Comfortable cotton T-shirt for everyday wear.', 'published'),
((SELECT id FROM categories WHERE slug='men-clothing'),
 'Slim Fit Jeans', 'slim-fit-jeans',
 'Modern slim-fit jeans.', 'published'),
((SELECT id FROM categories WHERE slug='women-dresses'),
 'Summer Dress', 'summer-dress',
 'Lightweight dress for casual wear.', 'draft');

INSERT INTO variants (product_id, option_values)
SELECT id, '{"size":"M","color":"Black"}'::jsonb FROM products WHERE slug='classic-cotton-tshirt';

INSERT INTO variants (product_id, option_values)
SELECT id, '{"size":"L","color":"Black"}'::jsonb FROM products WHERE slug='classic-cotton-tshirt';

INSERT INTO variants (product_id, option_values)
SELECT id, '{"size":"32","color":"Blue"}'::jsonb FROM products WHERE slug='slim-fit-jeans';

INSERT INTO variants (product_id, option_values)
SELECT id, '{"size":"M","color":"Red"}'::jsonb FROM products WHERE slug='summer-dress';

INSERT INTO skus (variant_id, sku_code, price, stock_quantity, active)
SELECT id, 'TSH-BLK-M', 1499.00, 20, TRUE
FROM variants WHERE option_values='{"size":"M","color":"Black"}'::jsonb
  AND product_id=(SELECT id FROM products WHERE slug='classic-cotton-tshirt');

INSERT INTO skus (variant_id, sku_code, price, stock_quantity, active)
SELECT id, 'TSH-BLK-L', 1499.00, 0, FALSE
FROM variants WHERE option_values='{"size":"L","color":"Black"}'::jsonb
  AND product_id=(SELECT id FROM products WHERE slug='classic-cotton-tshirt');

INSERT INTO skus (variant_id, sku_code, price, stock_quantity, active)
SELECT id, 'JNS-BLU-32', 2999.00, 12, TRUE
FROM variants WHERE option_values='{"size":"32","color":"Blue"}'::jsonb
  AND product_id=(SELECT id FROM products WHERE slug='slim-fit-jeans');

INSERT INTO skus (variant_id, sku_code, price, stock_quantity, active)
SELECT id, 'DRS-RED-M', 3499.00, 5, TRUE
FROM variants WHERE option_values='{"size":"M","color":"Red"}'::jsonb
  AND product_id=(SELECT id FROM products WHERE slug='summer-dress');

-- Intentionally unavailable combination: no SKU is created for
-- Classic Cotton T-Shirt / XL / Green.
