var mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    roomID: { type: String },
    customerName: { type: String },
    customerID: { type: String },
    customerTel: { type: String },
    start: { type: Date },
    exp: { type: Date },
    totalCost: { type: Number }
});

module.exports = mongoose.model('order', orderSchema, 'order');