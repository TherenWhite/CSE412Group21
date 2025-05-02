const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

//middleware
app.use(cors());
app.use(express.json());

//test
app.get('/', (req, res) => {
  res.send('API Running');
});

//ADD ROUTES LATER
app.use('/api/products', require('./routes/products'));
app.use('/api/stores', require('./routes/stores'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/shopping-lists', require('./routes/shopping-lists'));
app.use('/api/coupons', require('./routes/coupons'));
app.use('/api/preferences', require('./routes/preferences'));

//start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});