var express = require('express');
var router = express.Router();
var actionControllers = require('../controllers/action-controllers');
const { ensureAuthenticated } = require('../config/auth');

// Dashboard
router.get('/', ensureAuthenticated, actionControllers.index);

// Rooms
router.get('/rooms', ensureAuthenticated, actionControllers.rooms);

// Filter
router.post('/rooms-filter', actionControllers.roomsFilter);

// Room info
router.get('/room-info/:id', ensureAuthenticated, actionControllers.roomInfo);

// Order
router.post('/order', actionControllers.order);

// New room
router.post('/new-room', actionControllers.newRoom);

// Delete room
router.get('/delete-room/:id', ensureAuthenticated, actionControllers.deleteRoom);

// Update room
router.post('/update-room/:id', actionControllers.updateRoom);

// Checkout
router.get('/checkout/:id', ensureAuthenticated, actionControllers.checkout);

module.exports = router;