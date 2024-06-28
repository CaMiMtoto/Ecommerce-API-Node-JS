// routes/wishlist.js
const express = require('express');
const Wishlist = require('../models/wishlist');
const auth = require('../middlewares/auth');

const router = express.Router();

// Get user's wishlist
router.get('/', auth, async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({userId: req.user.userId}).populate('items');
        res.status(200).json(wishlist);
    } catch (err) {
        res.status(500).json({message: 'Failed to retrieve wishlist', error: err.message});
    }
});

// Add item to wishlist
router.post('/add', auth, async (req, res) => {
    try {
        const {productId} = req.body;

        let wishlist = await Wishlist.findOne({userId: req.user.userId});
        if (!wishlist) {
            wishlist = new Wishlist({userId: req.user.userId, items: []});
        }

        if (!wishlist.items.includes(productId)) {
            wishlist.items.push(productId);
            await wishlist.save();
        }

        res.status(201).json(wishlist);
    } catch (err) {
        res.status(500).json({message: 'Failed to add item to wishlist', error: err.message});
    }
});

// Remove item from wishlist
router.delete('/remove', auth, async (req, res) => {
    try {
        const {productId} = req.body;

        let wishlist = await Wishlist.findOne({userId: req.user.userId});
        if (!wishlist) return res.status(404).json({message: 'Wishlist not found'});

        wishlist.items = wishlist.items.filter(item => item.toString() !== productId);
        await wishlist.save();
        res.status(200).json(wishlist);
    } catch (err) {
        res.status(500).json({message: 'Failed to remove item from wishlist', error: err.message});
    }
});

module.exports = router;
