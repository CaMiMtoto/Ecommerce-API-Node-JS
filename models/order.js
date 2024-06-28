// models/order.js
const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
    productId: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
    quantity: {type: Number, required: true}
});

const OrderSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false}, // Optional for guest orders
    customerName: {type: String, required: true},
    customerEmail: {type: String, required: false},
    customerPhone: {type: String, required: true},
    shippingAddress: {type: String, required: true},
    items: [OrderItemSchema],
    total: {type: Number, required: true},
    status: {type: String, default: 'Processing'},
    createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Order', OrderSchema);
