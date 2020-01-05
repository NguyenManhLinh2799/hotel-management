var mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
    roomID: { type: String },
    price: { type: Number },
    reserved: { type: Boolean, default: false }, // true: Reserved, false: Ready to use
    imgSrc: { type: String }
});

module.exports = mongoose.model('room', roomSchema, 'room');