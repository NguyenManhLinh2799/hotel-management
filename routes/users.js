var express = require('express');
var router = express.Router();

// Register Page
router.get('/register', (req, res) => {
	res.render('pages/register', { layout: 'auth-layout' });
});

// Login Page
router.get('/login', (req, res) => {
	res.render('pages/login', { layout: 'auth-layout' });
});

module.exports = router;
