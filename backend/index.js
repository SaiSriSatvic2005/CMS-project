// 1. Import required packages
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

// 2. Setup Express App
const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies

// 3. Database connection pool
const dbPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT, // Use the port from .env
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// --- API ENDPOINTS ---

// GET /api/products: Fetch all products for the CMS view (not soft-deleted)
app.get('/api/products', async (req, res) => {
    try {
        const [rows] = await dbPool.query("SELECT * FROM Products WHERE is_deleted = FALSE ORDER BY created_at DESC");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
});

// GET /api/products/live: Fetch only published products
app.get('/api/products/live', async (req, res) => {
    try {
        const query = "SELECT product_id, product_name, product_desc FROM Products WHERE status = 'Published' AND is_deleted = FALSE;";
        const [rows] = await dbPool.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching live products', error });
    }
});

// POST /api/products: Add a new product
app.post('/api/products', async (req, res) => {
    const { product_name, product_desc, created_by, status } = req.body;
    try {
        const query = "INSERT INTO Products (product_name, product_desc, created_by, status) VALUES (?, ?, ?, ?);";
        await dbPool.query(query, [product_name, product_desc, created_by, status || 'Draft']);
        res.status(201).json({ message: 'Product added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding product', error });
    }
});

// PUT /api/products/:id: Edit a product
app.put('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    const { product_name, product_desc, status, updated_by } = req.body;
    try {
        const query = "UPDATE Products SET product_name = ?, product_desc = ?, status = ?, updated_by = ? WHERE product_id = ?;";
        await dbPool.query(query, [product_name, product_desc, status, updated_by, id]);
        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error });
    }
});

// DELETE /api/products/:id: Soft delete a product
app.delete('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    const { updated_by } = req.body; // Assuming the user's name is sent in the request body
    try {
        const query = "UPDATE Products SET is_deleted = TRUE, updated_by = ? WHERE product_id = ?;";
        await dbPool.query(query, [updated_by, id]);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error });
    }
});


// 4. Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});