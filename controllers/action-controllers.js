var Room = require('../models/room');

exports.index = (req, res) => {
	res.render('index', { layout: 'layout', user: req.user });
}