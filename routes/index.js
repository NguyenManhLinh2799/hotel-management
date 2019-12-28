var express = require('express');
var router = express.Router();

// Dashboard
router.get('/', (req, res) => {
	res.render('index', { layout: 'layout' });
});

module.exports = router;
