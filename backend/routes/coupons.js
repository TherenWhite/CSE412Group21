const express = require('express');
const router = express.Router();
const pool = require('../db');

//GET product's coupons
router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const result = await pool.query(
      'SELECT * FROM coupons WHERE product_id = $1 ORDER BY expiration_date',
      [productId]
    );
    
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

//GET store's coupons
router.get('/store/:storeId', async (req, res) => {
  try {
    const { storeId } = req.params;
    const result = await pool.query(
      `SELECT c.* FROM coupons c
       JOIN products p ON c.product_id = p.product_id
       WHERE p.store_id = $1
       ORDER BY c.expiration_date`,
      [storeId]
    );
    
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;