// routes/order.js
const express = require('express');
const Order = require('../models/order');
const auth = require('../middlewares/auth');

const router = express.Router();

async function saveOrder(req, res) {
    try {
        const {items, total, userId} = req.body;
        const order = new Order({
            userId: userId || req.user?.userId, // Use authenticated user ID if available
            customerName: req.body.customerName,
            customerEmail: req.body.customerEmail,
            customerPhone: req.body.customerPhone,
            shippingAddress: req.body.shippingAddress,
            items,
            total
        });

        await order.save();
        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({message: 'Failed to place order', error: err.message});
    }
}

// Place an order as a guest
router.post('/guest', async (req, res) => {
    await saveOrder(req, res);
});
// Place an order
router.post('/', auth, async (req, res) => {
    await saveOrder(req, res);
});


// Get user's orders
router.get('/', auth, async (req, res) => {
    try {
        const orders = await Order.find({userId: req.user.userId}).populate('items.productId');
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({message: 'Failed to retrieve orders', error: err.message});
    }
});

// Get a specific order by ID
router.get('/:orderId', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId).populate('items.productId');
        if (!order) return res.status(404).json({message: 'Order not found'});
        if (order.userId.toString() !== req.user.userId.toString()) {
            return res.status(403).json({message: 'Not authorized to view this order'});
        }
        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({message: 'Failed to retrieve order', error: err.message});
    }
});

module.exports = router;
