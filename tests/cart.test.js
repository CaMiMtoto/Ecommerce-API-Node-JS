// tests/cart.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const Product = require('../models/product');
const Cart = require('../models/cart');
const cartRoutes = require('../routes/cart');
const auth = require('../middlewares/auth');
const { getValidToken } = require('./helpers'); // Import the helper function

const app = express();
app.use(express.json());
app.use(auth);
app.use('/api/cart', cartRoutes);
describe('Cart API', () => {
    let token;

    beforeAll(async () => {
        const dbURI = 'mongodb://localhost:27017/ecommerce-test';
        await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

        // Assume we have a function to get a valid JWT token
        token = await getValidToken();
    });

    afterEach(async () => {
        await Cart.deleteMany({});
        await Product.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should add an item to the cart', async () => {
        const product = new Product({
            name: "Test Product",
            description: "This is a test product.",
            price: 99.99,
            category: "Test Category",
            stock: 10,
            imageUrl: "https://example.com/images/test-product.jpg"
        });
        await product.save();

        const response = await request(app)
            .post('/api/cart/add')
            .set('Authorization', `Bearer ${token}`)
            .send({ productId: product._id, quantity: 2 });

        expect(response.status).toBe(201);
        expect(response.body.items).toHaveLength(1);
        expect(response.body.items[0].quantity).toBe(2);
    });

    // Add more tests for updating, removing items, etc.
});
