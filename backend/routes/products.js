const express = require('express');
const router = express.Router();
const pool = require('../db');

//GET ALL PRODUCTS
router.get('/', async (req, res) => {
  try {
    const { searchTerm, category, storeId, minPrice, maxPrice, zipCode } = req.query;
    
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];
    let paramIndex = 1;
    
    if (searchTerm) {
      query += ` AND (name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      params.push(`%${searchTerm}%`);
      paramIndex++;
    }
    
    if (category) {
      query += ` AND category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }
    
    if (storeId) {
      query += ` AND store_id = $${paramIndex}`;
      params.push(storeId);
      paramIndex++;
    }
    
    if (minPrice) {
      query += ` AND current_price >= $${paramIndex}`;
      params.push(minPrice);
      paramIndex++;
    }
    
    if (maxPrice) {
      query += ` AND current_price <= $${paramIndex}`;
      params.push(maxPrice);
      paramIndex++;
    }
    
    query += ' ORDER BY name';
    
    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

//GET single product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM products WHERE product_id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

//GET products by thir category
router.get('/category/:categoryName', async (req, res) => {
  try {
    const { categoryName } = req.params;
    const result = await pool.query('SELECT * FROM products WHERE category = $1 ORDER BY name', [categoryName]);
    
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

//GET products by store
router.get('/store/:storeId', async (req, res) => {
  try {
    const { storeId } = req.params;
    const result = await pool.query('SELECT * FROM products WHERE store_id = $1 ORDER BY name', [storeId]);
    
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

//GET price history
router.get('/:id/price-history', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM price_history WHERE product_id = $1 ORDER BY time_stamp DESC',
      [id]
    );
    
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;