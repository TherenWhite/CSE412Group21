const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

//GET preferences from user
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM product_preferences WHERE user_id = $1',
      [req.user.id]
    );
    
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

//CREATE preference
router.post('/', auth, async (req, res) => {
  try {
    const { product_id, price_threshold, notify_if_on_sale } = req.body;
    
    const result = await pool.query(
      'INSERT INTO product_preferences (user_id, product_id, price_threshold, notify_if_on_sale) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, product_id, price_threshold, notify_if_on_sale]
    );
    
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

//UPDATE a preference
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { price_threshold, notify_if_on_sale } = req.body;
    
    //check if it belongs to user
    const prefCheck = await pool.query(
      'SELECT * FROM product_preferences WHERE pref_id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    
    if (prefCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Preference not found' });
    }
    //update it
    const result = await pool.query(
      'UPDATE product_preferences SET price_threshold = $1, notify_if_on_sale = $2 WHERE pref_id = $3 RETURNING *',
      [price_threshold, notify_if_on_sale, id]
    );
    
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

//DELETE a preference
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if preference belongs to user
    const prefCheck = await pool.query(
      'SELECT * FROM product_preferences WHERE pref_id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    if (prefCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Preference not found' });
    }
    //delete it
    await pool.query('DELETE FROM product_preferences WHERE pref_id = $1', [id]);
    
    res.json({ success: true, message: 'Preference removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;