// routes/cart.js
const express = require('express');
const Cart = require('../models/cart');
const Product = require('../models/product');
const auth = require('../middlewares/auth');

const router = express.Router();

// Get user's cart
router.get('/', auth, async (req, res) => {
    try {
        const cart = await Cart.findOne({userId: req.user.userId})
            .populate('items.productId');
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({message: 'Failed to retrieve cart', error: err.message});
    }
});

// Add item to cart
router.post('/add', auth, async (req, res) => {
    try {
        const {productId, quantity} = req.body;
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({message: 'Product not found'});

        let cart = await Cart.findOne({userId: req.user.userId});
        if (!cart) {
            cart = new Cart({userId: req.user.userId, items: []});
        }

        const existingItem = cart.items.find(item => item.productId.toString() === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({productId, quantity});
        }

        await cart.save();
        res.status(201).json(cart);
    } catch (err) {
        res.status(500).json({message: 'Failed to add item to cart', error: err.message});
    }
});

// Update item quantity
router.put('/update', auth, async (req, res) => {
    try {
        const {productId, quantity} = req.body;

        let cart = await Cart.findOne({userId: req.user.userId});
        if (!cart) return res.status(404).json({message: 'Cart not found'});

        const item = cart.items.find(item => item.productId.toString() === productId);
        if (!item) return res.status(404).json({message: 'Item not found in cart'});

        item.quantity = quantity;
        await cart.save();
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({message: 'Failed to update item in cart', error: err.message});
    }
});

// Remove item from cart
router.delete('/remove', auth, async (req, res) => {
    try {
        const {productId} = req.body;

        let cart = await Cart.findOne({userId: req.user.userId});
        if (!cart) return res.status(404).json({message: 'Cart not found'});

        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        await cart.save();
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({message: 'Failed to remove item from cart', error: err.message});
    }
});

module.exports = router;
