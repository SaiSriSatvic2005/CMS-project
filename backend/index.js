const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

// Connect to database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// API Routes

// GET /api/products - Fetch all products
app.get('/api/products', (req, res) => {
  const query = 'SELECT * FROM products ORDER BY created_at DESC';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json({ error: 'Failed to fetch products' });
    }
    res.json(results);
  });
});

// POST /api/products - Add new product
app.post('/api/products', (req, res) => {
  const { product_name, product_desc, created_by, updated_by } = req.body;
  const query = 'INSERT INTO products (product_name, product_desc, status, created_by, updated_by) VALUES (?, ?, ?, ?, ?)';
  const values = [product_name, product_desc, 'Draft', created_by, updated_by];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error adding product:', err);
      return res.status(500).json({ error: 'Failed to add product' });
    }
    res.status(201).json({ message: 'Product added successfully', product_id: result.insertId });
  });
});

// PUT /api/products/:id - Update product
app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const { product_name, product_desc, status, updated_by } = req.body;
  const query = 'UPDATE products SET product_name = ?, product_desc = ?, status = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP WHERE product_id = ?';
  const values = [product_name, product_desc, status, updated_by, id];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error updating product:', err);
      return res.status(500).json({ error: 'Failed to update product' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product updated successfully' });
  });
});

// DELETE /api/products/:id - Permanently delete product
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM products WHERE product_id = ?';
  const values = [id];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error deleting product:', err);
      return res.status(500).json({ error: 'Failed to delete product' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});