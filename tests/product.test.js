// tests/product.test.js

const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/product');
const productRoutes = require('../routes/products');

// Initialize the Express app and use the product routes
const app = express();
app.use(express.json());
app.use('/api/products', productRoutes);

// Connect to a test database
beforeAll(async () => {
    const dbURI = 'mongodb://localhost:27017/ecommerce-test'; // Use a separate database for testing
    await mongoose.connect(dbURI);
});

// Clean up the test database after each test
afterEach(async () => {
    await Product.deleteMany({});
});

// Disconnect from the test database after all tests are done
afterAll(async () => {
    await mongoose.connection.close();
});

// Test cases

describe('Product API', () => {

    it('should create a new product', async () => {
        const newProduct = {
            name: "Test Product",
            description: "This is a test product.",
            price: 99.99,
            category: "Test Category",
            stock: 10,
            imageUrl: "https://example.com/images/test-product.jpg"
        };

        const response = await request(app).post('/api/products').send(newProduct);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('_id');
        expect(response.body.name).toBe(newProduct.name);
    });

    it('should get all products', async () => {
        const response = await request(app).get('/api/products');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should get a product by ID', async () => {
        // First, create a new product to have an ID
        const newProduct = new Product({
            name: "Test Product",
            description: "This is a test product.",
            price: 99.99,
            category: "Test Category",
            stock: 10,
            imageUrl: "https://example.com/images/test-product.jpg"
        });
        const savedProduct = await newProduct.save();

        // Then, retrieve the product by ID
        const response = await request(app).get(`/api/products/${savedProduct._id}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id', savedProduct._id.toString());
    });

    it('should update a product by ID', async () => {
        // First, create a new product to update
        const newProduct = new Product({
            name: "Test Product",
            description: "This is a test product.",
            price: 99.99,
            category: "Test Category",
            stock: 10,
            imageUrl: "https://example.com/images/test-product.jpg"
        });
        const savedProduct = await newProduct.save();

        // Update the product
        const updatedData = {
            name: "Updated Product",
            price: 149.99
        };

        const response = await request(app).put(`/api/products/${savedProduct._id}`).send(updatedData);

        expect(response.status).toBe(200);
        expect(response.body.name).toBe(updatedData.name);
        expect(response.body.price).toBe(updatedData.price);
    });

    it('should delete a product by ID', async () => {
        // First, create a new product to delete
        const newProduct = new Product({
            name: "Test Product",
            description: "This is a test product.",
            price: 99.99,
            category: "Test Category",
            stock: 10,
            imageUrl: "https://example.com/images/test-product.jpg"
        });
        const savedProduct = await newProduct.save();

        // Delete the product
        const response = await request(app).delete(`/api/products/${savedProduct._id}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Product deleted');
    });

    it('should return 404 for a non-existent product', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();

        const response = await request(app).get(`/api/products/${nonExistentId}`);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Product not found');
    });

});
