var express = require('express');
var router = express.Router();
var actionControllers = require('../controllers/action-controllers');
const { ensureAuthenticated } = require('../config/auth');

// Dashboard
router.get('/', ensureAuthenticated, actionControllers.index);

module.exports = router;
