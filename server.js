// server.js
const express = require('express');
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');
const wishlistRoutes = require('./routes/wishlist');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Parse JSON bodies
const connectDB = require('./config/db');
// Connect to the database
connectDB().then(r => {
    console.log('Connected to the database');
});
// Use product routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
// Basic route
app.get('/', (req, res) => {
    res.send('Welcome to the E-commerce App!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
