const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('./db');
const { requireAdmin } = require('./auth');

const app = express();
app.use(express.json());

app.post('/api/v1/admin/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password are required' });

  const { rows } = await pool.query('SELECT * FROM admins WHERE email=$1', [email]);
  if (!rows[0] || !(await bcrypt.compare(password, rows[0].password_hash))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: rows[0].id, role: 'admin', email }, process.env.JWT_SECRET, { expiresIn: '2h' });
  res.json({ token });
});

app.post('/api/v1/admin/categories', requireAdmin, async (req, res) => {
  const { name, slug, parent_id = null } = req.body;
  if (!name || !slug) return res.status(400).json({ error: 'name and slug are required' });
  try {
    const { rows } = await pool.query(
      'INSERT INTO categories(name,slug,parent_id) VALUES($1,$2,$3) RETURNING *',
      [name, slug, parent_id]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: 'Duplicate category slug' });
    res.status(400).json({ error: 'Invalid category data' });
  }
});

app.get('/api/v1/admin/categories', requireAdmin, async (_req, res) => {
  const { rows } = await pool.query('SELECT * FROM categories ORDER BY id');
  res.json(rows);
});

app.post('/api/v1/admin/products', requireAdmin, async (req, res) => {
  const { name, slug, description = null, category_id, status = 'draft' } = req.body;
  if (!name || !slug || !category_id) return res.status(400).json({ error: 'name, slug and category_id are required' });
  try {
    const { rows } = await pool.query(
      'INSERT INTO products(name,slug,description,category_id,status) VALUES($1,$2,$3,$4,$5) RETURNING *',
      [name, slug, description, category_id, status]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: 'Duplicate product slug' });
    res.status(400).json({ error: 'Invalid product data' });
  }
});

app.patch('/api/v1/admin/products/:id', requireAdmin, async (req, res) => {
  const { name, description, status, category_id } = req.body;
  const { rows } = await pool.query(
    `UPDATE products SET
       name=COALESCE($1,name), description=COALESCE($2,description),
       status=COALESCE($3,status), category_id=COALESCE($4,category_id),
       updated_at=NOW()
     WHERE id=$5 RETURNING *`,
    [name, description, status, category_id, req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Product not found' });
  res.json(rows[0]);
});

app.get('/api/v1/admin/products', requireAdmin, async (_req, res) => {
  const { rows } = await pool.query('SELECT * FROM products ORDER BY id');
  res.json(rows);
});

app.post('/api/v1/admin/products/:id/skus', requireAdmin, async (req, res) => {
  const { variant_id, sku_code, price, stock_quantity = 0, active = true } = req.body;
  if (!variant_id || !sku_code || price === undefined) {
    return res.status(400).json({ error: 'variant_id, sku_code and price are required' });
  }
  if (stock_quantity < 0 || price < 0) return res.status(400).json({ error: 'price and stock cannot be negative' });
  try {
    const { rows } = await pool.query(
      'INSERT INTO skus(variant_id,sku_code,price,stock_quantity,active) VALUES($1,$2,$3,$4,$5) RETURNING *',
      [variant_id, sku_code, price, stock_quantity, active]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: 'Duplicate SKU code' });
    res.status(400).json({ error: 'Invalid SKU data' });
  }
});

app.patch('/api/v1/admin/skus/:id', requireAdmin, async (req, res) => {
  const { price, stock_quantity, active } = req.body;
  if (price !== undefined && price < 0) return res.status(400).json({ error: 'price cannot be negative' });
  if (stock_quantity !== undefined && stock_quantity < 0) return res.status(400).json({ error: 'stock cannot be negative' });
  const { rows } = await pool.query(
    `UPDATE skus SET price=COALESCE($1,price), stock_quantity=COALESCE($2,stock_quantity),
     active=COALESCE($3,active) WHERE id=$4 RETURNING *`,
    [price, stock_quantity, active, req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: 'SKU not found' });
  res.json(rows[0]);
});

module.exports = app;
