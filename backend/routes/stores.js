const express = require('express');
const router = express.Router();
const pool = require('../db');

//GET all the stores
router.get('/', async (req, res) => {
  try {
    const { zipCode } = req.query;
    
    let query = 'SELECT * FROM stores';
    const params = [];
    
    if (zipCode) {
      query += ' WHERE zip_code = $1';
      params.push(zipCode);
    }
    
    query += ' ORDER BY name';
    
    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

//GET single store
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM stores WHERE store_id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Store not found' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;