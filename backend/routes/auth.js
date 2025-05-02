//grocery-price-tracker/backend/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const auth = require('../middleware/auth');

//register a user
router.post('/register', async (req, res) => {
  try {
    const { email, password, zip_code, budget } = req.body;
    
    //check if user exists
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    
    //for actual app we'd hash password:
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);
    
    //using plain text right now for passowrd
    const hashedPassword = password;
    
    //instert a user
    const newUser = await pool.query(
      'INSERT INTO users (email, password, zip_code, budget) VALUES ($1, $2, $3, $4) RETURNING *',
      [email, hashedPassword, zip_code, budget || 0]
    );
    
    //create JWT
    const token = jwt.sign(
      { id: newUser.rows[0].user_id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({
      success: true,
      data: {
        user: {
          user_id: newUser.rows[0].user_id,
          email: newUser.rows[0].email,
          zip_code: newUser.rows[0].zip_code,
          budget: newUser.rows[0].budget
        },
        token
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

//login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    //check for user
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    
    //in actual app we'd use hash comparison
    //bcrypt.compare(password, user.password)
    const isMatch = (password === user.password);
    
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    //create JWT
    const token = jwt.sign(
      { id: user.user_id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({
      success: true,
      data: {
        user: {
          user_id: user.user_id,
          email: user.email,
          zip_code: user.zip_code,
          budget: user.budget
        },
        token
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

//get current user
router.get('/me', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT user_id, email, zip_code, budget FROM users WHERE user_id = $1',
      [req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

//update a user
router.put('/profile', auth, async (req, res) => {
    try {
      const { email, zip_code, budget } = req.body;
      
      //update user
      const result = await pool.query(
        'UPDATE users SET email = $1, zip_code = $2, budget = $3 WHERE user_id = $4 RETURNING *',
        [email, zip_code, budget, req.user.id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      //remove the password
      const { password: _, ...userWithoutPassword } = result.rows[0];
      
      res.json({ success: true, data: userWithoutPassword });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

module.exports = router;