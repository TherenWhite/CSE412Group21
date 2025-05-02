const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

//get all user's shopping lists
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM shopping_lists WHERE user_id = $1 ORDER BY list_id',
      [req.user.id]
    );
    
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

//get single list
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    //check if it is user's
    const listCheck = await pool.query(
      'SELECT * FROM shopping_lists WHERE list_id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    
    if (listCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Shopping list not found' });
    }
    
    res.json({ success: true, data: listCheck.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

//create list
router.post('/', auth, async (req, res) => {
  try {
    const { list_name, total = 0, applied_coupons = null } = req.body;
    
    const result = await pool.query(
      'INSERT INTO shopping_lists (user_id, list_name, total, applied_coupons) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, list_name, total, applied_coupons]
    );
    
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

//update list
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { list_name, total, applied_coupons } = req.body;
    
    const listCheck = await pool.query(
      'SELECT * FROM shopping_lists WHERE list_id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    
    if (listCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Shopping list not found' });
    }
    
    //update it
    const result = await pool.query(
      'UPDATE shopping_lists SET list_name = $1, total = $2, applied_coupons = $3 WHERE list_id = $4 RETURNING *',
      [list_name, total, applied_coupons, id]
    );
    
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

//delete list
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const listCheck = await pool.query(
      'SELECT * FROM shopping_lists WHERE list_id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    
    if (listCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Shopping list not found' });
    }
    //delete it
    await pool.query('DELETE FROM shopping_lists WHERE list_id = $1', [id]);
    
    res.json({ success: true, message: 'Shopping list removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;