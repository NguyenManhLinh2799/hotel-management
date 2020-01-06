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
router.get('/room-info', ensureAuthenticated, actionControllers.roomInfo);

module.exports = router;
