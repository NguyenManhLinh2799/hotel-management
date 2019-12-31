var mongoose = require('mongoose');

const staffSchema = mongoose.Schema({
    name: { type: String },
    phone: { type: String },
    email: { type: String },
    address: { type: String },
    password: { type: String },
    position: { type: String }
});

module.exports = mongoose.model('staff', staffSchema, 'staff');