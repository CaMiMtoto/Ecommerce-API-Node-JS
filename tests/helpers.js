// tests/helpers.js

const request = require('supertest');
const app = require('../app');

// Function to get a valid JWT token
const getValidToken = async () => {
    // Register a new user for testing
    const user = {
        username: "testuser",
        email: "testuser@example.com",
        password: "password123"
    };

    // Register the user
    await request(app)
        .post('/api/auth/register')
        .send(user);

    // Log in to get the JWT token
    const response = await request(app)
        .post('/api/auth/login')
        .send({ email: user.email, password: user.password });

    return response.body.token; // Extract and return the JWT token
};

module.exports = { getValidToken };
