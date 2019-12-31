var mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
    roomID: { type: String },
    price: { type: Number },
    reserved: { type: Boolean } // 1: Reserved, 0: Ready to use
});

module.exports = mongoose.model('room', roomSchema, 'room');